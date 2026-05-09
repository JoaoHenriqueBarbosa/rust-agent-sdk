// Original: src/utils/markdown.ts
function configureMarked() {
  if (markedConfigured)
    return;
  markedConfigured = !0, marked.use({
    tokenizer: {
      del() {
        return;
      }
    }
  });
}
function applyMarkdown(content, theme, highlight = null) {
  return configureMarked(), marked.lexer(stripPromptXMLTags(content)).map((_) => formatToken(_, theme, 0, null, null, highlight)).join("").trim();
}
function formatToken(token, theme, listDepth = 0, orderedListNumber = null, parent2 = null, highlight = null) {
  switch (token.type) {
    case "blockquote": {
      let inner = (token.tokens ?? []).map((_) => formatToken(_, theme, 0, null, null, highlight)).join(""), bar = source_default.dim(BLOCKQUOTE_BAR);
      return inner.split(EOL3).map((line) => stripAnsi(line).trim() ? `${bar} ${source_default.italic(line)}` : line).join(EOL3);
    }
    case "code": {
      if (!highlight)
        return token.text + EOL3;
      let language = "plaintext";
      if (token.lang)
        if (highlight.supportsLanguage(token.lang))
          language = token.lang;
        else
          logForDebugging(`Language not supported while highlighting code, falling back to plaintext: ${token.lang}`);
      return highlight.highlight(token.text, { language }) + EOL3;
    }
    case "codespan":
      return color("permission", theme)(token.text);
    case "em":
      return source_default.italic((token.tokens ?? []).map((_) => formatToken(_, theme, 0, null, parent2, highlight)).join(""));
    case "strong":
      return source_default.bold((token.tokens ?? []).map((_) => formatToken(_, theme, 0, null, parent2, highlight)).join(""));
    case "heading":
      switch (token.depth) {
        case 1:
          return source_default.bold.italic.underline((token.tokens ?? []).map((_) => formatToken(_, theme, 0, null, null, highlight)).join("")) + EOL3 + EOL3;
        case 2:
          return source_default.bold((token.tokens ?? []).map((_) => formatToken(_, theme, 0, null, null, highlight)).join("")) + EOL3 + EOL3;
        default:
          return source_default.bold((token.tokens ?? []).map((_) => formatToken(_, theme, 0, null, null, highlight)).join("")) + EOL3 + EOL3;
      }
    case "hr":
      return "---";
    case "image":
      return token.href;
    case "link": {
      if (token.href.startsWith("mailto:"))
        return token.href.replace(/^mailto:/, "");
      let linkText = (token.tokens ?? []).map((_) => formatToken(_, theme, 0, null, token, highlight)).join(""), plainLinkText = stripAnsi(linkText);
      if (plainLinkText && plainLinkText !== token.href)
        return createHyperlink(token.href, linkText);
      return createHyperlink(token.href);
    }
    case "list":
      return token.items.map((_, index) => formatToken(_, theme, listDepth, token.ordered ? token.start + index : null, token, highlight)).join("");
    case "list_item":
      return (token.tokens ?? []).map((_) => `${"  ".repeat(listDepth)}${formatToken(_, theme, listDepth + 1, orderedListNumber, token, highlight)}`).join("");
    case "paragraph":
      return (token.tokens ?? []).map((_) => formatToken(_, theme, 0, null, null, highlight)).join("") + EOL3;
    case "space":
      return EOL3;
    case "br":
      return EOL3;
    case "text":
      if (parent2?.type === "link")
        return token.text;
      if (parent2?.type === "list_item")
        return `${orderedListNumber === null ? "-" : getListNumber(listDepth, orderedListNumber) + "."} ${token.tokens ? token.tokens.map((_) => formatToken(_, theme, listDepth, orderedListNumber, token, highlight)).join("") : linkifyIssueReferences(token.text)}${EOL3}`;
      return linkifyIssueReferences(token.text);
    case "table": {
      let getDisplayText = function(tokens) {
        return stripAnsi(tokens?.map((_) => formatToken(_, theme, 0, null, null, highlight)).join("") ?? "");
      }, tableToken = token, columnWidths = tableToken.header.map((header, index) => {
        let maxWidth = stringWidth(getDisplayText(header.tokens));
        for (let row of tableToken.rows) {
          let cellLength = stringWidth(getDisplayText(row[index]?.tokens));
          maxWidth = Math.max(maxWidth, cellLength);
        }
        return Math.max(maxWidth, 3);
      }), tableOutput = "| ";
      return tableToken.header.forEach((header, index) => {
        let content = header.tokens?.map((_) => formatToken(_, theme, 0, null, null, highlight)).join("") ?? "", displayText = getDisplayText(header.tokens), width = columnWidths[index], align = tableToken.align?.[index];
        tableOutput += padAligned(content, stringWidth(displayText), width, align) + " | ";
      }), tableOutput = tableOutput.trimEnd() + EOL3, tableOutput += "|", columnWidths.forEach((width) => {
        let separator = "-".repeat(width + 2);
        tableOutput += separator + "|";
      }), tableOutput += EOL3, tableToken.rows.forEach((row) => {
        tableOutput += "| ", row.forEach((cell, index) => {
          let content = cell.tokens?.map((_) => formatToken(_, theme, 0, null, null, highlight)).join("") ?? "", displayText = getDisplayText(cell.tokens), width = columnWidths[index], align = tableToken.align?.[index];
          tableOutput += padAligned(content, stringWidth(displayText), width, align) + " | ";
        }), tableOutput = tableOutput.trimEnd() + EOL3;
      }), tableOutput + EOL3;
    }
    case "escape":
      return token.text;
    case "def":
    case "del":
    case "html":
      return "";
  }
  return "";
}
function linkifyIssueReferences(text2) {
  if (!supportsHyperlinks())
    return text2;
  return text2.replace(ISSUE_REF_PATTERN, (_match, prefix, repo, num) => prefix + createHyperlink(`https://github.com/${repo}/issues/${num}`, `${repo}#${num}`));
}
function numberToLetter(n5) {
  let result = "";
  while (n5 > 0)
    n5--, result = String.fromCharCode(97 + n5 % 26) + result, n5 = Math.floor(n5 / 26);
  return result;
}
function numberToRoman(n5) {
  let result = "";
  for (let [value, numeral] of ROMAN_VALUES)
    while (n5 >= value)
      result += numeral, n5 -= value;
  return result;
}
function getListNumber(listDepth, orderedListNumber) {
  switch (listDepth) {
    case 0:
    case 1:
      return orderedListNumber.toString();
    case 2:
      return numberToLetter(orderedListNumber);
    case 3:
      return numberToRoman(orderedListNumber);
    default:
      return orderedListNumber.toString();
  }
}
function padAligned(content, displayWidth, targetWidth, align) {
  let padding = Math.max(0, targetWidth - displayWidth);
  if (align === "center") {
    let leftPad = Math.floor(padding / 2);
    return " ".repeat(leftPad) + content + " ".repeat(padding - leftPad);
  }
  if (align === "right")
    return " ".repeat(padding) + content;
  return content + " ".repeat(padding);
}
var EOL3 = `
`, markedConfigured = !1, ISSUE_REF_PATTERN, ROMAN_VALUES;
var init_markdown = __esm(() => {
  init_source();
  init_marked_esm();
  init_strip_ansi();
  init_color();
  init_figures2();
  init_stringWidth();
  init_supports_hyperlinks();
  init_debug();
  init_hyperlink();
  init_messages3();
  ISSUE_REF_PATTERN = /(^|[^\w./-])([A-Za-z0-9][\w-]*\/[A-Za-z0-9][\w.-]*)#(\d+)\b/g;
  ROMAN_VALUES = [
    [1000, "m"],
    [900, "cm"],
    [500, "d"],
    [400, "cd"],
    [100, "c"],
    [90, "xc"],
    [50, "l"],
    [40, "xl"],
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"]
  ];
});
