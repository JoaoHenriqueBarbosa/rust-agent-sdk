// var: require_foldFlowLines
var require_foldFlowLines = __commonJS((exports) => {
  function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth: lineWidth2 = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth2 || lineWidth2 < 0)
      return text;
    if (lineWidth2 < minContentWidth)
      minContentWidth = 0;
    let endStep = Math.max(1 + minContentWidth, 1 + lineWidth2 - indent.length);
    if (text.length <= endStep)
      return text;
    let folds = [], escapedFolds = {}, end = lineWidth2 - indent.length;
    if (typeof indentAtStart === "number")
      if (indentAtStart > lineWidth2 - Math.max(2, minContentWidth))
        folds.push(0);
      else
        end = lineWidth2 - indentAtStart;
    let split = void 0, prev = void 0, overflow = !1, i4 = -1, escStart = -1, escEnd = -1;
    if (mode === "block") {
      if (i4 = consumeMoreIndentedLines(text, i4, indent.length), i4 !== -1)
        end = i4 + endStep;
    }
    for (let ch;ch = text[i4 += 1]; ) {
      if (mode === "quoted" && ch === "\\") {
        switch (escStart = i4, text[i4 + 1]) {
          case "x":
            i4 += 3;
            break;
          case "u":
            i4 += 5;
            break;
          case "U":
            i4 += 9;
            break;
          default:
            i4 += 1;
        }
        escEnd = i4;
      }
      if (ch === `
`) {
        if (mode === "block")
          i4 = consumeMoreIndentedLines(text, i4, indent.length);
        end = i4 + indent.length + endStep, split = void 0;
      } else {
        if (ch === " " && prev && prev !== " " && prev !== `
` && prev !== "\t") {
          let next = text[i4 + 1];
          if (next && next !== " " && next !== `
` && next !== "\t")
            split = i4;
        }
        if (i4 >= end)
          if (split)
            folds.push(split), end = split + endStep, split = void 0;
          else if (mode === "quoted") {
            while (prev === " " || prev === "\t")
              prev = ch, ch = text[i4 += 1], overflow = !0;
            let j4 = i4 > escEnd + 1 ? i4 - 2 : escStart - 1;
            if (escapedFolds[j4])
              return text;
            folds.push(j4), escapedFolds[j4] = !0, end = j4 + endStep, split = void 0;
          } else
            overflow = !0;
      }
      prev = ch;
    }
    if (overflow && onOverflow)
      onOverflow();
    if (folds.length === 0)
      return text;
    if (onFold)
      onFold();
    let res = text.slice(0, folds[0]);
    for (let i5 = 0;i5 < folds.length; ++i5) {
      let fold = folds[i5], end2 = folds[i5 + 1] || text.length;
      if (fold === 0)
        res = `
${indent}${text.slice(0, end2)}`;
      else {
        if (mode === "quoted" && escapedFolds[fold])
          res += `${text[fold]}\\`;
        res += `
${indent}${text.slice(fold + 1, end2)}`;
      }
    }
    return res;
  }
  function consumeMoreIndentedLines(text, i4, indent) {
    let end = i4, start = i4 + 1, ch = text[start];
    while (ch === " " || ch === "\t")
      if (i4 < start + indent)
        ch = text[++i4];
      else {
        do
          ch = text[++i4];
        while (ch && ch !== `
`);
        end = i4, start = i4 + 1, ch = text[start];
      }
    return end;
  }
  exports.FOLD_BLOCK = "block";
  exports.FOLD_FLOW = "flow";
  exports.FOLD_QUOTED = "quoted";
  exports.foldFlowLines = foldFlowLines;
});
