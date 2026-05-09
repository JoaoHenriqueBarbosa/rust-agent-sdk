// Original: src/utils/bash/heredoc.ts
import { randomBytes as randomBytes4 } from "crypto";
function generatePlaceholderSalt() {
  return randomBytes4(8).toString("hex");
}
function extractHeredocs(command12, options2) {
  let heredocs = /* @__PURE__ */ new Map;
  if (!command12.includes("<<"))
    return { processedCommand: command12, heredocs };
  if (/\$['"]/.test(command12))
    return { processedCommand: command12, heredocs };
  let firstHeredocPos = command12.indexOf("<<");
  if (firstHeredocPos > 0 && command12.slice(0, firstHeredocPos).includes("`"))
    return { processedCommand: command12, heredocs };
  if (firstHeredocPos > 0) {
    let beforeHeredoc = command12.slice(0, firstHeredocPos), openArith = (beforeHeredoc.match(/\(\(/g) || []).length, closeArith = (beforeHeredoc.match(/\)\)/g) || []).length;
    if (openArith > closeArith)
      return { processedCommand: command12, heredocs };
  }
  let heredocStartPattern = new RegExp(HEREDOC_START_PATTERN.source, "g"), heredocMatches = [], skippedHeredocRanges = [], match, scanPos = 0, scanInSingleQuote = !1, scanInDoubleQuote = !1, scanInComment = !1, scanDqEscapeNext = !1, scanPendingBackslashes = 0, advanceScan = (target) => {
    for (let i5 = scanPos;i5 < target; i5++) {
      let ch2 = command12[i5];
      if (ch2 === `
`)
        scanInComment = !1;
      if (scanInSingleQuote) {
        if (ch2 === "'")
          scanInSingleQuote = !1;
        continue;
      }
      if (scanInDoubleQuote) {
        if (scanDqEscapeNext) {
          scanDqEscapeNext = !1;
          continue;
        }
        if (ch2 === "\\") {
          scanDqEscapeNext = !0;
          continue;
        }
        if (ch2 === '"')
          scanInDoubleQuote = !1;
        continue;
      }
      if (ch2 === "\\") {
        scanPendingBackslashes++;
        continue;
      }
      let escaped = scanPendingBackslashes % 2 === 1;
      if (scanPendingBackslashes = 0, escaped)
        continue;
      if (ch2 === "'")
        scanInSingleQuote = !0;
      else if (ch2 === '"')
        scanInDoubleQuote = !0;
      else if (!scanInComment && ch2 === "#")
        scanInComment = !0;
    }
    scanPos = target;
  };
  while ((match = heredocStartPattern.exec(command12)) !== null) {
    let startIndex = match.index;
    if (advanceScan(startIndex), scanInSingleQuote || scanInDoubleQuote)
      continue;
    if (scanInComment)
      continue;
    if (scanPendingBackslashes % 2 === 1)
      continue;
    let insideSkipped = !1;
    for (let skipped of skippedHeredocRanges)
      if (startIndex > skipped.contentStartIndex && startIndex < skipped.contentEndIndex) {
        insideSkipped = !0;
        break;
      }
    if (insideSkipped)
      continue;
    let fullMatch = match[0], isDash = match[1] === "-", delimiter2 = match[3] || match[4], operatorEndIndex = startIndex + fullMatch.length, quoteChar = match[2];
    if (quoteChar && command12[operatorEndIndex - 1] !== quoteChar)
      continue;
    let isEscapedDelimiter = fullMatch.includes("\\"), isQuotedOrEscaped = !!quoteChar || isEscapedDelimiter;
    if (operatorEndIndex < command12.length) {
      let nextChar = command12[operatorEndIndex];
      if (!/^[ \t\n|&;()<>]$/.test(nextChar))
        continue;
    }
    let firstNewlineOffset = -1;
    {
      let inSingleQuote = !1, inDoubleQuote = !1;
      for (let k3 = operatorEndIndex;k3 < command12.length; k3++) {
        let ch2 = command12[k3];
        if (inSingleQuote) {
          if (ch2 === "'")
            inSingleQuote = !1;
          continue;
        }
        if (inDoubleQuote) {
          if (ch2 === "\\") {
            k3++;
            continue;
          }
          if (ch2 === '"')
            inDoubleQuote = !1;
          continue;
        }
        if (ch2 === `
`) {
          firstNewlineOffset = k3 - operatorEndIndex;
          break;
        }
        let backslashCount = 0;
        for (let j4 = k3 - 1;j4 >= operatorEndIndex && command12[j4] === "\\"; j4--)
          backslashCount++;
        if (backslashCount % 2 === 1)
          continue;
        if (ch2 === "'")
          inSingleQuote = !0;
        else if (ch2 === '"')
          inDoubleQuote = !0;
      }
    }
    if (firstNewlineOffset === -1)
      continue;
    let sameLineContent = command12.slice(operatorEndIndex, operatorEndIndex + firstNewlineOffset), trailingBackslashes = 0;
    for (let j4 = sameLineContent.length - 1;j4 >= 0; j4--)
      if (sameLineContent[j4] === "\\")
        trailingBackslashes++;
      else
        break;
    if (trailingBackslashes % 2 === 1)
      continue;
    let contentStartIndex = operatorEndIndex + firstNewlineOffset, contentLines = command12.slice(contentStartIndex + 1).split(`
`), closingLineIndex = -1;
    for (let i5 = 0;i5 < contentLines.length; i5++) {
      let line = contentLines[i5];
      if (isDash) {
        if (line.replace(/^\t*/, "") === delimiter2) {
          closingLineIndex = i5;
          break;
        }
      } else if (line === delimiter2) {
        closingLineIndex = i5;
        break;
      }
      let eofCheckLine = isDash ? line.replace(/^\t*/, "") : line;
      if (eofCheckLine.length > delimiter2.length && eofCheckLine.startsWith(delimiter2)) {
        let charAfterDelimiter = eofCheckLine[delimiter2.length];
        if (/^[)}`|&;(<>]$/.test(charAfterDelimiter)) {
          closingLineIndex = -1;
          break;
        }
      }
    }
    if (options2?.quotedOnly && !isQuotedOrEscaped) {
      let skipContentEndIndex;
      if (closingLineIndex === -1)
        skipContentEndIndex = command12.length;
      else {
        let skipContentLength = contentLines.slice(0, closingLineIndex + 1).join(`
`).length;
        skipContentEndIndex = contentStartIndex + 1 + skipContentLength;
      }
      skippedHeredocRanges.push({
        contentStartIndex,
        contentEndIndex: skipContentEndIndex
      });
      continue;
    }
    if (closingLineIndex === -1)
      continue;
    let contentLength = contentLines.slice(0, closingLineIndex + 1).join(`
`).length, contentEndIndex = contentStartIndex + 1 + contentLength, overlapsSkipped = !1;
    for (let skipped of skippedHeredocRanges)
      if (contentStartIndex < skipped.contentEndIndex && skipped.contentStartIndex < contentEndIndex) {
        overlapsSkipped = !0;
        break;
      }
    if (overlapsSkipped)
      continue;
    let operatorText = command12.slice(startIndex, operatorEndIndex), contentText = command12.slice(contentStartIndex, contentEndIndex), fullText = operatorText + contentText;
    heredocMatches.push({
      fullText,
      delimiter: delimiter2,
      operatorStartIndex: startIndex,
      operatorEndIndex,
      contentStartIndex,
      contentEndIndex
    });
  }
  if (heredocMatches.length === 0)
    return { processedCommand: command12, heredocs };
  let topLevelHeredocs = heredocMatches.filter((candidate, _i, all3) => {
    for (let other2 of all3) {
      if (candidate === other2)
        continue;
      if (candidate.operatorStartIndex > other2.contentStartIndex && candidate.operatorStartIndex < other2.contentEndIndex)
        return !1;
    }
    return !0;
  });
  if (topLevelHeredocs.length === 0)
    return { processedCommand: command12, heredocs };
  if (new Set(topLevelHeredocs.map((h4) => h4.contentStartIndex)).size < topLevelHeredocs.length)
    return { processedCommand: command12, heredocs };
  topLevelHeredocs.sort((a2, b) => b.contentEndIndex - a2.contentEndIndex);
  let salt = generatePlaceholderSalt(), processedCommand = command12;
  return topLevelHeredocs.forEach((info, index) => {
    let placeholderIndex = topLevelHeredocs.length - 1 - index, placeholder = `${HEREDOC_PLACEHOLDER_PREFIX}${placeholderIndex}_${salt}${HEREDOC_PLACEHOLDER_SUFFIX}`;
    heredocs.set(placeholder, info), processedCommand = processedCommand.slice(0, info.operatorStartIndex) + placeholder + processedCommand.slice(info.operatorEndIndex, info.contentStartIndex) + processedCommand.slice(info.contentEndIndex);
  }), { processedCommand, heredocs };
}
function restoreHeredocsInString(text2, heredocs) {
  let result = text2;
  for (let [placeholder, info] of heredocs)
    result = result.replaceAll(placeholder, info.fullText);
  return result;
}
function restoreHeredocs(parts, heredocs) {
  if (heredocs.size === 0)
    return parts;
  return parts.map((part) => restoreHeredocsInString(part, heredocs));
}
var HEREDOC_PLACEHOLDER_PREFIX = "__HEREDOC_", HEREDOC_PLACEHOLDER_SUFFIX = "__", HEREDOC_START_PATTERN;
var init_heredoc = __esm(() => {
  HEREDOC_START_PATTERN = /(?<!<)<<(?!<)(-)?[ \t]*(?:(['"])(\\?\w+)\2|\\?(\w+))/;
});
