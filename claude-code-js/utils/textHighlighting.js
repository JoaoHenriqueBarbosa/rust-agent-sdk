// Original: src/utils/textHighlighting.ts
function segmentTextByHighlights(text2, highlights) {
  if (highlights.length === 0)
    return [{ text: text2, start: 0 }];
  let sortedHighlights = [...highlights].sort((a2, b) => {
    if (a2.start !== b.start)
      return a2.start - b.start;
    return b.priority - a2.priority;
  }), resolvedHighlights = [], usedRanges = [];
  for (let highlight of sortedHighlights) {
    if (highlight.start === highlight.end)
      continue;
    if (!usedRanges.some((range) => highlight.start >= range.start && highlight.start < range.end || highlight.end > range.start && highlight.end <= range.end || highlight.start <= range.start && highlight.end >= range.end))
      resolvedHighlights.push(highlight), usedRanges.push({ start: highlight.start, end: highlight.end });
  }
  return new HighlightSegmenter(text2).segment(resolvedHighlights);
}

class HighlightSegmenter {
  text;
  tokens;
  visiblePos = 0;
  stringPos = 0;
  tokenIdx = 0;
  charIdx = 0;
  codes = [];
  constructor(text2) {
    this.text = text2;
    this.tokens = tokenize3(text2);
  }
  segment(highlights) {
    let segments = [];
    for (let highlight of highlights) {
      let before2 = this.segmentTo(highlight.start);
      if (before2)
        segments.push(before2);
      let highlighted = this.segmentTo(highlight.end);
      if (highlighted)
        highlighted.highlight = highlight, segments.push(highlighted);
    }
    let after2 = this.segmentTo(1 / 0);
    if (after2)
      segments.push(after2);
    return segments;
  }
  segmentTo(targetVisiblePos) {
    if (this.tokenIdx >= this.tokens.length || targetVisiblePos <= this.visiblePos)
      return null;
    let visibleStart = this.visiblePos;
    while (this.tokenIdx < this.tokens.length) {
      let token = this.tokens[this.tokenIdx];
      if (token.type !== "ansi")
        break;
      this.codes.push(token), this.stringPos += token.code.length, this.tokenIdx++;
    }
    let stringStart = this.stringPos, codesStart = [...this.codes];
    while (this.visiblePos < targetVisiblePos && this.tokenIdx < this.tokens.length) {
      let token = this.tokens[this.tokenIdx];
      if (token.type === "ansi")
        this.codes.push(token), this.stringPos += token.code.length, this.tokenIdx++;
      else {
        let charsNeeded = targetVisiblePos - this.visiblePos, charsAvailable = token.value.length - this.charIdx, charsToTake = Math.min(charsNeeded, charsAvailable);
        if (this.stringPos += charsToTake, this.visiblePos += charsToTake, this.charIdx += charsToTake, this.charIdx >= token.value.length)
          this.tokenIdx++, this.charIdx = 0;
      }
    }
    if (this.stringPos === stringStart)
      return null;
    let prefixCodes = reduceCodes(codesStart), suffixCodes = reduceCodes(this.codes);
    this.codes = suffixCodes;
    let prefix = ansiCodesToString(prefixCodes), suffix = ansiCodesToString(undoAnsiCodes(suffixCodes));
    return {
      text: prefix + this.text.substring(stringStart, this.stringPos) + suffix,
      start: visibleStart
    };
  }
}
function reduceCodes(codes) {
  return reduceAnsiCodes(codes).filter((c3) => c3.code !== c3.endCode);
}
var init_textHighlighting = __esm(() => {
  init_build();
});
