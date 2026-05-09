// Original: src/components/StructuredDiff/Fallback.tsx
function StructuredDiffFallback(t0) {
  let $3 = import_compiler_runtime110.c(10), {
    patch,
    dim: dim2,
    width
  } = t0, [theme] = useTheme(), t1;
  if ($3[0] !== dim2 || $3[1] !== patch.lines || $3[2] !== patch.oldStart || $3[3] !== theme || $3[4] !== width)
    t1 = formatDiff(patch.lines, patch.oldStart, width, dim2, theme), $3[0] = dim2, $3[1] = patch.lines, $3[2] = patch.oldStart, $3[3] = theme, $3[4] = width, $3[5] = t1;
  else
    t1 = $3[5];
  let diff3 = t1, t2;
  if ($3[6] !== diff3)
    t2 = diff3.map(_temp46), $3[6] = diff3, $3[7] = t2;
  else
    t2 = $3[7];
  let t3;
  if ($3[8] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      flexGrow: 1,
      children: t2
    }, void 0, !1, void 0, this), $3[8] = t2, $3[9] = t3;
  else
    t3 = $3[9];
  return t3;
}
function _temp46(node, i5) {
  return /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedBox_default, {
    children: node
  }, i5, !1, void 0, this);
}
function transformLinesToObjects(lines2) {
  return lines2.map((code) => {
    if (code.startsWith("+"))
      return {
        code: code.slice(1),
        i: 0,
        type: "add",
        originalCode: code.slice(1)
      };
    if (code.startsWith("-"))
      return {
        code: code.slice(1),
        i: 0,
        type: "remove",
        originalCode: code.slice(1)
      };
    return {
      code: code.slice(1),
      i: 0,
      type: "nochange",
      originalCode: code.slice(1)
    };
  });
}
function processAdjacentLines(lineObjects) {
  let processedLines = [], i5 = 0;
  while (i5 < lineObjects.length) {
    let current = lineObjects[i5];
    if (!current) {
      i5++;
      continue;
    }
    if (current.type === "remove") {
      let removeLines = [current], j4 = i5 + 1;
      while (j4 < lineObjects.length && lineObjects[j4]?.type === "remove") {
        let line = lineObjects[j4];
        if (line)
          removeLines.push(line);
        j4++;
      }
      let addLines = [];
      while (j4 < lineObjects.length && lineObjects[j4]?.type === "add") {
        let line = lineObjects[j4];
        if (line)
          addLines.push(line);
        j4++;
      }
      if (removeLines.length > 0 && addLines.length > 0) {
        let pairCount = Math.min(removeLines.length, addLines.length);
        for (let k3 = 0;k3 < pairCount; k3++) {
          let removeLine = removeLines[k3], addLine = addLines[k3];
          if (removeLine && addLine)
            removeLine.wordDiff = !0, addLine.wordDiff = !0, removeLine.matchedLine = addLine, addLine.matchedLine = removeLine;
        }
        processedLines.push(...removeLines.filter(Boolean)), processedLines.push(...addLines.filter(Boolean)), i5 = j4;
      } else
        processedLines.push(current), i5++;
    } else
      processedLines.push(current), i5++;
  }
  return processedLines;
}
function calculateWordDiffs(oldText, newText) {
  return diffWordsWithSpace(oldText, newText, {
    ignoreCase: !1
  });
}
function generateWordDiffElements(item, width, maxWidth, dim2, overrideTheme) {
  let {
    type,
    i: i5,
    wordDiff: wordDiff2,
    matchedLine,
    originalCode
  } = item;
  if (!wordDiff2 || !matchedLine)
    return null;
  let removedLineText = type === "remove" ? originalCode : matchedLine.originalCode, addedLineText = type === "remove" ? matchedLine.originalCode : originalCode, wordDiffs = calculateWordDiffs(removedLineText, addedLineText), totalLength = removedLineText.length + addedLineText.length;
  if (wordDiffs.filter((part) => part.added || part.removed).reduce((sum, part) => sum + part.value.length, 0) / totalLength > CHANGE_THRESHOLD || dim2)
    return null;
  let diffPrefix = type === "add" ? "+" : "-", diffPrefixWidth = diffPrefix.length, availableContentWidth = Math.max(1, width - maxWidth - 1 - diffPrefixWidth), wrappedLines = [], currentLine = [], currentLineWidth = 0;
  if (wordDiffs.forEach((part, partIndex) => {
    let shouldShow = !1, partBgColor;
    if (type === "add") {
      if (part.added)
        shouldShow = !0, partBgColor = "diffAddedWord";
      else if (!part.removed)
        shouldShow = !0;
    } else if (type === "remove") {
      if (part.removed)
        shouldShow = !0, partBgColor = "diffRemovedWord";
      else if (!part.added)
        shouldShow = !0;
    }
    if (!shouldShow)
      return;
    wrapText2(part.value, availableContentWidth, "wrap").split(`
`).forEach((partLine, lineIdx) => {
      if (!partLine)
        return;
      if (lineIdx > 0 || currentLineWidth + stringWidth(partLine) > availableContentWidth) {
        if (currentLine.length > 0)
          wrappedLines.push({
            content: [...currentLine],
            contentWidth: currentLineWidth
          }), currentLine = [], currentLineWidth = 0;
      }
      currentLine.push(/* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedText, {
        backgroundColor: partBgColor,
        children: partLine
      }, `part-${partIndex}-${lineIdx}`, !1, void 0, this)), currentLineWidth += stringWidth(partLine);
    });
  }), currentLine.length > 0)
    wrappedLines.push({
      content: currentLine,
      contentWidth: currentLineWidth
    });
  return wrappedLines.map(({
    content,
    contentWidth
  }, lineIndex) => {
    let key2 = `${type}-${i5}-${lineIndex}`, lineBgColor = type === "add" ? dim2 ? "diffAddedDimmed" : "diffAdded" : dim2 ? "diffRemovedDimmed" : "diffRemoved", lineNum = lineIndex === 0 ? i5 : void 0, lineNumStr = (lineNum !== void 0 ? lineNum.toString().padStart(maxWidth) : " ".repeat(maxWidth)) + " ", usedWidth = lineNumStr.length + diffPrefixWidth + contentWidth, padding = Math.max(0, width - usedWidth);
    return /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(NoSelect, {
          fromLeftEdge: !0,
          children: /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedText, {
            color: overrideTheme ? "text" : void 0,
            backgroundColor: lineBgColor,
            dimColor: dim2,
            children: [
              lineNumStr,
              diffPrefix
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedText, {
          color: overrideTheme ? "text" : void 0,
          backgroundColor: lineBgColor,
          dimColor: dim2,
          children: [
            content,
            " ".repeat(padding)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, key2, !0, void 0, this);
  });
}
function formatDiff(lines2, startingLineNumber, width, dim2, overrideTheme) {
  let safeWidth = Math.max(1, Math.floor(width)), lineObjects = transformLinesToObjects(lines2), processedLines = processAdjacentLines(lineObjects), ls = numberDiffLines(processedLines, startingLineNumber), maxLineNumber = Math.max(...ls.map(({
    i: i5
  }) => i5), 0), maxWidth = Math.max(maxLineNumber.toString().length + 1, 0);
  return ls.flatMap((item) => {
    let {
      type,
      code,
      i: i5,
      wordDiff: wordDiff2,
      matchedLine
    } = item;
    if (wordDiff2 && matchedLine) {
      let wordDiffElements = generateWordDiffElements(item, safeWidth, maxWidth, dim2, overrideTheme);
      if (wordDiffElements !== null)
        return wordDiffElements;
    }
    let diffPrefixWidth = 2, availableContentWidth = Math.max(1, safeWidth - maxWidth - 1 - diffPrefixWidth);
    return wrapText2(code, availableContentWidth, "wrap").split(`
`).map((line, lineIndex) => {
      let key2 = `${type}-${i5}-${lineIndex}`, lineNum = lineIndex === 0 ? i5 : void 0, lineNumStr = (lineNum !== void 0 ? lineNum.toString().padStart(maxWidth) : " ".repeat(maxWidth)) + " ", sigil = type === "add" ? "+" : type === "remove" ? "-" : " ", contentWidth = lineNumStr.length + 1 + stringWidth(line), padding = Math.max(0, safeWidth - contentWidth), bgColor = type === "add" ? dim2 ? "diffAddedDimmed" : "diffAdded" : type === "remove" ? dim2 ? "diffRemovedDimmed" : "diffRemoved" : void 0;
      return /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(NoSelect, {
            fromLeftEdge: !0,
            children: /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedText, {
              color: overrideTheme ? "text" : void 0,
              backgroundColor: bgColor,
              dimColor: dim2 || type === "nochange",
              children: [
                lineNumStr,
                sigil
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime127.jsxDEV(ThemedText, {
            color: overrideTheme ? "text" : void 0,
            backgroundColor: bgColor,
            dimColor: dim2,
            children: [
              line,
              " ".repeat(padding)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, key2, !0, void 0, this);
    });
  });
}
function numberDiffLines(diff3, startLine) {
  let i5 = startLine, result = [], queue2 = [...diff3];
  while (queue2.length > 0) {
    let current = queue2.shift(), {
      code,
      type,
      originalCode,
      wordDiff: wordDiff2,
      matchedLine
    } = current, line = {
      code,
      type,
      i: i5,
      originalCode,
      wordDiff: wordDiff2,
      matchedLine
    };
    switch (type) {
      case "nochange":
        i5++, result.push(line);
        break;
      case "add":
        i5++, result.push(line);
        break;
      case "remove": {
        result.push(line);
        let numRemoved = 0;
        while (queue2[0]?.type === "remove") {
          i5++;
          let current2 = queue2.shift(), {
            code: code2,
            type: type2,
            originalCode: originalCode2,
            wordDiff: wordDiff3,
            matchedLine: matchedLine2
          } = current2, line2 = {
            code: code2,
            type: type2,
            i: i5,
            originalCode: originalCode2,
            wordDiff: wordDiff3,
            matchedLine: matchedLine2
          };
          result.push(line2), numRemoved++;
        }
        i5 -= numRemoved;
        break;
      }
    }
  }
  return result;
}
var import_compiler_runtime110, jsx_dev_runtime127, CHANGE_THRESHOLD = 0.4;
var init_Fallback2 = __esm(() => {
  init_lib();
  init_stringWidth();
  init_ink2();
  import_compiler_runtime110 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime127 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
