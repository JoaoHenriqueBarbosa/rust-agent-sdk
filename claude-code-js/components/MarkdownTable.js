// Original: src/components/MarkdownTable.tsx
function wrapText4(text2, width, options2) {
  if (width <= 0)
    return [text2];
  let trimmedText = text2.trimEnd(), lines2 = wrapAnsi2(trimmedText, width, {
    hard: options2?.hard ?? !1,
    trim: !1,
    wordWrap: !0
  }).split(`
`).filter((line) => line.length > 0);
  return lines2.length > 0 ? lines2 : [""];
}
function MarkdownTable({
  token,
  highlight,
  forceWidth
}) {
  let [theme] = useTheme(), {
    columns: actualTerminalWidth
  } = useTerminalSize(), terminalWidth = forceWidth ?? actualTerminalWidth;
  function formatCell(tokens) {
    return tokens?.map((_) => formatToken(_, theme, 0, null, null, highlight)).join("") ?? "";
  }
  function getPlainText(tokens_0) {
    return stripAnsi(formatCell(tokens_0));
  }
  function getMinWidth(tokens_1) {
    let words = getPlainText(tokens_1).split(/\s+/).filter((w2) => w2.length > 0);
    if (words.length === 0)
      return MIN_COLUMN_WIDTH;
    return Math.max(...words.map((w_0) => stringWidth(w_0)), MIN_COLUMN_WIDTH);
  }
  function getIdealWidth(tokens_2) {
    return Math.max(stringWidth(getPlainText(tokens_2)), MIN_COLUMN_WIDTH);
  }
  let minWidths = token.header.map((header, colIndex) => {
    let maxMinWidth = getMinWidth(header.tokens);
    for (let row of token.rows)
      maxMinWidth = Math.max(maxMinWidth, getMinWidth(row[colIndex]?.tokens));
    return maxMinWidth;
  }), idealWidths = token.header.map((header_0, colIndex_0) => {
    let maxIdeal = getIdealWidth(header_0.tokens);
    for (let row_0 of token.rows)
      maxIdeal = Math.max(maxIdeal, getIdealWidth(row_0[colIndex_0]?.tokens));
    return maxIdeal;
  }), numCols = token.header.length, borderOverhead = 1 + numCols * 3, availableWidth = Math.max(terminalWidth - borderOverhead - SAFETY_MARGIN, numCols * MIN_COLUMN_WIDTH), totalMin = minWidths.reduce((sum, w_1) => sum + w_1, 0), totalIdeal = idealWidths.reduce((sum_0, w_2) => sum_0 + w_2, 0), needsHardWrap = !1, columnWidths;
  if (totalIdeal <= availableWidth)
    columnWidths = idealWidths;
  else if (totalMin <= availableWidth) {
    let extraSpace = availableWidth - totalMin, overflows = idealWidths.map((ideal, i5) => ideal - minWidths[i5]), totalOverflow = overflows.reduce((sum_1, o5) => sum_1 + o5, 0);
    columnWidths = minWidths.map((min, i_0) => {
      if (totalOverflow === 0)
        return min;
      let extra = Math.floor(overflows[i_0] / totalOverflow * extraSpace);
      return min + extra;
    });
  } else {
    needsHardWrap = !0;
    let scaleFactor = availableWidth / totalMin;
    columnWidths = minWidths.map((w_3) => Math.max(Math.floor(w_3 * scaleFactor), MIN_COLUMN_WIDTH));
  }
  function calculateMaxRowLines() {
    let maxLines = 1;
    for (let i_1 = 0;i_1 < token.header.length; i_1++) {
      let content = formatCell(token.header[i_1].tokens), wrapped = wrapText4(content, columnWidths[i_1], {
        hard: needsHardWrap
      });
      maxLines = Math.max(maxLines, wrapped.length);
    }
    for (let row_1 of token.rows)
      for (let i_2 = 0;i_2 < row_1.length; i_2++) {
        let content_0 = formatCell(row_1[i_2]?.tokens), wrapped_0 = wrapText4(content_0, columnWidths[i_2], {
          hard: needsHardWrap
        });
        maxLines = Math.max(maxLines, wrapped_0.length);
      }
    return maxLines;
  }
  let useVerticalFormat = calculateMaxRowLines() > MAX_ROW_LINES;
  function renderRowLines(cells, isHeader) {
    let cellLines = cells.map((cell, colIndex_1) => {
      let formattedText = formatCell(cell.tokens), width = columnWidths[colIndex_1];
      return wrapText4(formattedText, width, {
        hard: needsHardWrap
      });
    }), maxLines_0 = Math.max(...cellLines.map((lines2) => lines2.length), 1), verticalOffsets = cellLines.map((lines_0) => Math.floor((maxLines_0 - lines_0.length) / 2)), result = [];
    for (let lineIdx = 0;lineIdx < maxLines_0; lineIdx++) {
      let line = "\u2502";
      for (let colIndex_2 = 0;colIndex_2 < cells.length; colIndex_2++) {
        let lines_1 = cellLines[colIndex_2], offset = verticalOffsets[colIndex_2], contentLineIdx = lineIdx - offset, lineText = contentLineIdx >= 0 && contentLineIdx < lines_1.length ? lines_1[contentLineIdx] : "", width_0 = columnWidths[colIndex_2], align = isHeader ? "center" : token.align?.[colIndex_2] ?? "left";
        line += " " + padAligned(lineText, stringWidth(lineText), width_0, align) + " \u2502";
      }
      result.push(line);
    }
    return result;
  }
  function renderBorderLine(type) {
    let [left, mid, cross, right] = {
      top: ["\u250C", "\u2500", "\u252C", "\u2510"],
      middle: ["\u251C", "\u2500", "\u253C", "\u2524"],
      bottom: ["\u2514", "\u2500", "\u2534", "\u2518"]
    }[type], line_0 = left;
    return columnWidths.forEach((width_1, colIndex_3) => {
      line_0 += mid.repeat(width_1 + 2), line_0 += colIndex_3 < columnWidths.length - 1 ? cross : right;
    }), line_0;
  }
  function renderVerticalFormat() {
    let lines_2 = [], headers = token.header.map((h4) => getPlainText(h4.tokens)), separatorWidth = Math.min(terminalWidth - 1, 40), separator = "\u2500".repeat(separatorWidth), wrapIndent = "  ";
    return token.rows.forEach((row_2, rowIndex) => {
      if (rowIndex > 0)
        lines_2.push(separator);
      row_2.forEach((cell_0, colIndex_4) => {
        let label = headers[colIndex_4] || `Column ${colIndex_4 + 1}`, value = formatCell(cell_0.tokens).trimEnd().replace(/\n+/g, " ").replace(/\s+/g, " ").trim(), firstLineWidth = terminalWidth - stringWidth(label) - 3, subsequentLineWidth = terminalWidth - 2 - 1, firstPassLines = wrapText4(value, Math.max(firstLineWidth, 10)), firstLine = firstPassLines[0] || "", wrappedValue;
        if (firstPassLines.length <= 1 || subsequentLineWidth <= firstLineWidth)
          wrappedValue = firstPassLines;
        else {
          let remainingText = firstPassLines.slice(1).map((l3) => l3.trim()).join(" "), rewrapped = wrapText4(remainingText, subsequentLineWidth);
          wrappedValue = [firstLine, ...rewrapped];
        }
        lines_2.push(`${ANSI_BOLD_START}${label}:${ANSI_BOLD_END} ${wrappedValue[0] || ""}`);
        for (let i_3 = 1;i_3 < wrappedValue.length; i_3++) {
          let line_1 = wrappedValue[i_3];
          if (!line_1.trim())
            continue;
          lines_2.push(`  ${line_1}`);
        }
      });
    }), lines_2.join(`
`);
  }
  if (useVerticalFormat)
    return /* @__PURE__ */ jsx_dev_runtime43.jsxDEV(Ansi, {
      children: renderVerticalFormat()
    }, void 0, !1, void 0, this);
  let tableLines = [];
  if (tableLines.push(renderBorderLine("top")), tableLines.push(...renderRowLines(token.header, !0)), tableLines.push(renderBorderLine("middle")), token.rows.forEach((row_3, rowIndex_0) => {
    if (tableLines.push(...renderRowLines(row_3, !1)), rowIndex_0 < token.rows.length - 1)
      tableLines.push(renderBorderLine("middle"));
  }), tableLines.push(renderBorderLine("bottom")), Math.max(...tableLines.map((line_2) => stringWidth(stripAnsi(line_2)))) > terminalWidth - SAFETY_MARGIN)
    return /* @__PURE__ */ jsx_dev_runtime43.jsxDEV(Ansi, {
      children: renderVerticalFormat()
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime43.jsxDEV(Ansi, {
    children: tableLines.join(`
`)
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime43, SAFETY_MARGIN = 4, MIN_COLUMN_WIDTH = 3, MAX_ROW_LINES = 4, ANSI_BOLD_START = "\x1B[1m", ANSI_BOLD_END = "\x1B[22m";
var init_MarkdownTable = __esm(() => {
  init_strip_ansi();
  init_useTerminalSize();
  init_stringWidth();
  init_wrapAnsi();
  init_ink2();
  init_markdown();
  jsx_dev_runtime43 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
