// Original: src/utils/stringUtils.ts
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function plural(n2, word, pluralWord = word + "s") {
  return n2 === 1 ? word : pluralWord;
}
function firstLineOf(s) {
  let nl = s.indexOf(`
`);
  return nl === -1 ? s : s.slice(0, nl);
}
function countCharInString(str, char, start = 0) {
  let count3 = 0, i2 = str.indexOf(char, start);
  while (i2 !== -1)
    count3++, i2 = str.indexOf(char, i2 + 1);
  return count3;
}
function normalizeFullWidthDigits(input) {
  return input.replace(/[\uFF10-\uFF19]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248));
}
function normalizeFullWidthSpace(input) {
  return input.replace(/\u3000/g, " ");
}
function safeJoinLines(lines, delimiter = ",", maxSize = MAX_STRING_LENGTH) {
  let result = "";
  for (let line of lines) {
    let delimiterToAdd = result ? delimiter : "", fullAddition = delimiterToAdd + line;
    if (result.length + fullAddition.length <= maxSize)
      result += fullAddition;
    else {
      let remainingSpace = maxSize - result.length - delimiterToAdd.length - 14;
      if (remainingSpace > 0)
        result += delimiterToAdd + line.slice(0, remainingSpace) + "...[truncated]";
      else
        result += "...[truncated]";
      return result;
    }
  }
  return result;
}

class EndTruncatingAccumulator {
  maxSize;
  content = "";
  isTruncated = !1;
  totalBytesReceived = 0;
  constructor(maxSize = MAX_STRING_LENGTH) {
    this.maxSize = maxSize;
  }
  append(data) {
    let str = typeof data === "string" ? data : data.toString();
    if (this.totalBytesReceived += str.length, this.isTruncated && this.content.length >= this.maxSize)
      return;
    if (this.content.length + str.length > this.maxSize) {
      let remainingSpace = this.maxSize - this.content.length;
      if (remainingSpace > 0)
        this.content += str.slice(0, remainingSpace);
      this.isTruncated = !0;
    } else
      this.content += str;
  }
  toString() {
    if (!this.isTruncated)
      return this.content;
    let truncatedBytes = this.totalBytesReceived - this.maxSize, truncatedKB = Math.round(truncatedBytes / 1024);
    return this.content + `
... [output truncated - ${truncatedKB}KB removed]`;
  }
  clear() {
    this.content = "", this.isTruncated = !1, this.totalBytesReceived = 0;
  }
  get length() {
    return this.content.length;
  }
  get truncated() {
    return this.isTruncated;
  }
  get totalBytes() {
    return this.totalBytesReceived;
  }
}
function truncateToLines(text, maxLines) {
  let lines = text.split(`
`);
  if (lines.length <= maxLines)
    return text;
  return lines.slice(0, maxLines).join(`
`) + "\u2026";
}
var MAX_STRING_LENGTH = 33554432;
