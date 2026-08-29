// function: isSafeHeredoc
function isSafeHeredoc(command12) {
  if (!HEREDOC_IN_SUBSTITUTION.test(command12))
    return !1;
  let heredocPattern = /\$\(cat[ \t]*<<(-?)[ \t]*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g, match, safeHeredocs = [];
  while ((match = heredocPattern.exec(command12)) !== null) {
    let delimiter2 = match[2] || match[3];
    if (delimiter2)
      safeHeredocs.push({
        start: match.index,
        operatorEnd: match.index + match[0].length,
        delimiter: delimiter2,
        isDash: match[1] === "-"
      });
  }
  if (safeHeredocs.length === 0)
    return !1;
  let verified = [];
  for (let { start, operatorEnd, delimiter: delimiter2, isDash } of safeHeredocs) {
    let afterOperator = command12.slice(operatorEnd), openLineEnd = afterOperator.indexOf(`
`);
    if (openLineEnd === -1)
      return !1;
    let openLineTail = afterOperator.slice(0, openLineEnd);
    if (!/^[ \t]*$/.test(openLineTail))
      return !1;
    let bodyStart = operatorEnd + openLineEnd + 1, bodyLines = command12.slice(bodyStart).split(`
`), closingLineIdx = -1, closeParenLineIdx = -1, closeParenColIdx = -1;
    for (let i5 = 0;i5 < bodyLines.length; i5++) {
      let rawLine = bodyLines[i5], line = isDash ? rawLine.replace(/^\t*/, "") : rawLine;
      if (line === delimiter2) {
        closingLineIdx = i5;
        let nextLine = bodyLines[i5 + 1];
        if (nextLine === void 0)
          return !1;
        let parenMatch = nextLine.match(/^([ \t]*)\)/);
        if (!parenMatch)
          return !1;
        closeParenLineIdx = i5 + 1, closeParenColIdx = parenMatch[1].length;
        break;
      }
      if (line.startsWith(delimiter2)) {
        let afterDelim = line.slice(delimiter2.length), parenMatch = afterDelim.match(/^([ \t]*)\)/);
        if (parenMatch) {
          closingLineIdx = i5, closeParenLineIdx = i5, closeParenColIdx = (isDash ? rawLine.match(/^\t*/)?.[0] ?? "" : "").length + delimiter2.length + parenMatch[1].length;
          break;
        }
        if (/^[)}`|&;(<>]/.test(afterDelim))
          return !1;
      }
    }
    if (closingLineIdx === -1)
      return !1;
    let endPos = bodyStart;
    for (let i5 = 0;i5 < closeParenLineIdx; i5++)
      endPos += bodyLines[i5].length + 1;
    endPos += closeParenColIdx + 1, verified.push({ start, end: endPos });
  }
