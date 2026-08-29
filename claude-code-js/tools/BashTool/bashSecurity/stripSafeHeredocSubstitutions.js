// function: stripSafeHeredocSubstitutions
function stripSafeHeredocSubstitutions(command12) {
  if (!HEREDOC_IN_SUBSTITUTION.test(command12))
    return null;
  let heredocPattern = /\$\(cat[ \t]*<<(-?)[ \t]*(?:'+([A-Za-z_]\w*)'+|\\([A-Za-z_]\w*))/g, result = command12, found = !1, match, ranges = [];
  while ((match = heredocPattern.exec(command12)) !== null) {
    if (match.index > 0 && command12[match.index - 1] === "\\")
      continue;
    let delimiter2 = match[2] || match[3];
    if (!delimiter2)
      continue;
    let isDash = match[1] === "-", operatorEnd = match.index + match[0].length, afterOperator = command12.slice(operatorEnd), openLineEnd = afterOperator.indexOf(`
`);
    if (openLineEnd === -1)
      continue;
    if (!/^[ \t]*$/.test(afterOperator.slice(0, openLineEnd)))
      continue;
    let bodyStart = operatorEnd + openLineEnd + 1, bodyLines = command12.slice(bodyStart).split(`
`);
    for (let i5 = 0;i5 < bodyLines.length; i5++) {
      let rawLine = bodyLines[i5], line = isDash ? rawLine.replace(/^\t*/, "") : rawLine;
      if (line.startsWith(delimiter2)) {
        let after = line.slice(delimiter2.length), closePos = -1;
        if (/^[ \t]*\)/.test(after)) {
          let lineStart = bodyStart + bodyLines.slice(0, i5).join(`
`).length + (i5 > 0 ? 1 : 0);
          closePos = command12.indexOf(")", lineStart);
        } else if (after === "") {
          let nextLine = bodyLines[i5 + 1];
          if (nextLine !== void 0 && /^[ \t]*\)/.test(nextLine)) {
            let nextLineStart = bodyStart + bodyLines.slice(0, i5 + 1).join(`
`).length + 1;
            closePos = command12.indexOf(")", nextLineStart);
          }
        }
        if (closePos !== -1)
          ranges.push({ start: match.index, end: closePos + 1 }), found = !0;
        break;
      }
    }
  }
  if (!found)
    return null;
  for (let i5 = ranges.length - 1;i5 >= 0; i5--) {
    let r4 = ranges[i5];
    result = result.slice(0, r4.start) + result.slice(r4.end);
  }
  return result;
}
