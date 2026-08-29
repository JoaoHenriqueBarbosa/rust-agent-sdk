// Original: src/utils/terminal.ts
function wrapText3(text2, wrapWidth) {
  let lines2 = text2.split(`
`), wrappedLines = [];
  for (let line of lines2) {
    let visibleWidth = stringWidth(line);
    if (visibleWidth <= wrapWidth)
      wrappedLines.push(line.trimEnd());
    else {
      let position = 0;
      while (position < visibleWidth) {
        let chunk = sliceAnsi(line, position, position + wrapWidth);
        wrappedLines.push(chunk.trimEnd()), position += wrapWidth;
      }
    }
  }
  let remainingLines = wrappedLines.length - MAX_LINES_TO_SHOW;
  if (remainingLines === 1)
    return {
      aboveTheFold: wrappedLines.slice(0, MAX_LINES_TO_SHOW + 1).join(`
`).trimEnd(),
      remainingLines: 0
    };
  return {
    aboveTheFold: wrappedLines.slice(0, MAX_LINES_TO_SHOW).join(`
`).trimEnd(),
    remainingLines: Math.max(0, remainingLines)
  };
}
function renderTruncatedContent(content, terminalWidth, suppressExpandHint = !1) {
  let trimmedContent = content.trimEnd();
  if (!trimmedContent)
    return "";
  let wrapWidth = Math.max(terminalWidth - PADDING_TO_PREVENT_OVERFLOW, 10), maxChars = MAX_LINES_TO_SHOW * wrapWidth * 4, preTruncated = trimmedContent.length > maxChars, contentForWrapping = preTruncated ? trimmedContent.slice(0, maxChars) : trimmedContent, { aboveTheFold, remainingLines } = wrapText3(contentForWrapping, wrapWidth), estimatedRemaining = preTruncated ? Math.max(remainingLines, Math.ceil(trimmedContent.length / wrapWidth) - MAX_LINES_TO_SHOW) : remainingLines;
  return [
    aboveTheFold,
    estimatedRemaining > 0 ? source_default.dim(`\u2026 +${estimatedRemaining} lines${suppressExpandHint ? "" : ` ${ctrlOToExpand()}`}`) : ""
  ].filter(Boolean).join(`
`);
}
function isOutputLineTruncated(content) {
  let pos = 0;
  for (let i5 = 0;i5 <= MAX_LINES_TO_SHOW; i5++) {
    if (pos = content.indexOf(`
`, pos), pos === -1)
      return !1;
    pos++;
  }
  return pos < content.length;
}
var MAX_LINES_TO_SHOW = 3, PADDING_TO_PREVENT_OVERFLOW = 10;
var init_terminal2 = __esm(() => {
  init_source();
  init_CtrlOToExpand();
  init_stringWidth();
  init_sliceAnsi();
});
