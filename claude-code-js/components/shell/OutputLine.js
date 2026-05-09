// Original: src/components/shell/OutputLine.tsx
function tryFormatJson(line) {
  try {
    let parsed = jsonParse(line), stringified = jsonStringify(parsed), normalizedOriginal = line.replace(/\\\//g, "/").replace(/\s+/g, ""), normalizedStringified = stringified.replace(/\s+/g, "");
    if (normalizedOriginal !== normalizedStringified)
      return line;
    return jsonStringify(parsed, null, 2);
  } catch {
    return line;
  }
}
function tryJsonFormatContent(content) {
  if (content.length > MAX_JSON_FORMAT_LENGTH)
    return content;
  return content.split(`
`).map(tryFormatJson).join(`
`);
}
function linkifyUrlsInText(content) {
  return content.replace(URL_IN_JSON, (url3) => createHyperlink(url3));
}
function OutputLine(t0) {
  let $3 = import_compiler_runtime24.c(11), {
    content,
    verbose,
    isError: isError3,
    isWarning,
    linkifyUrls
  } = t0, {
    columns
  } = useTerminalSize(), expandShellOutput = useExpandShellOutput(), inVirtualList = React16.useContext(InVirtualListContext), shouldShowFull = verbose || expandShellOutput, t1;
  if ($3[0] !== columns || $3[1] !== content || $3[2] !== inVirtualList || $3[3] !== linkifyUrls || $3[4] !== shouldShowFull) {
    bb0: {
      let formatted = tryJsonFormatContent(content);
      if (linkifyUrls)
        formatted = linkifyUrlsInText(formatted);
      if (shouldShowFull) {
        t1 = stripUnderlineAnsi(formatted);
        break bb0;
      }
      t1 = stripUnderlineAnsi(renderTruncatedContent(formatted, columns, inVirtualList));
    }
    $3[0] = columns, $3[1] = content, $3[2] = inVirtualList, $3[3] = linkifyUrls, $3[4] = shouldShowFull, $3[5] = t1;
  } else
    t1 = $3[5];
  let formattedContent = t1, color2 = isError3 ? "error" : isWarning ? "warning" : void 0, t2;
  if ($3[6] !== formattedContent)
    t2 = /* @__PURE__ */ jsx_dev_runtime27.jsxDEV(Ansi, {
      children: formattedContent
    }, void 0, !1, void 0, this), $3[6] = formattedContent, $3[7] = t2;
  else
    t2 = $3[7];
  let t3;
  if ($3[8] !== color2 || $3[9] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime27.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime27.jsxDEV(ThemedText, {
        color: color2,
        children: t2
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = color2, $3[9] = t2, $3[10] = t3;
  else
    t3 = $3[10];
  return t3;
}
function stripUnderlineAnsi(content) {
  return content.replace(/\u001b\[([0-9]+;)*4(;[0-9]+)*m|\u001b\[4(;[0-9]+)*m|\u001b\[([0-9]+;)*4m/g, "");
}
var import_compiler_runtime24, React16, jsx_dev_runtime27, MAX_JSON_FORMAT_LENGTH = 1e4, URL_IN_JSON;
var init_OutputLine = __esm(() => {
  init_useTerminalSize();
  init_ink2();
  init_hyperlink();
  init_slowOperations();
  init_terminal2();
  init_MessageResponse();
  init_messageActions();
  init_ExpandShellOutputContext();
  import_compiler_runtime24 = __toESM(require_react_compiler_runtime_development(), 1), React16 = __toESM(require_react_development(), 1), jsx_dev_runtime27 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  URL_IN_JSON = /https?:\/\/[^\s"'<>\\]+/g;
});
