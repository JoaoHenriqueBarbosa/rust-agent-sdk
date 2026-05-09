// class: MeasuredText
class MeasuredText {
  columns;
  _wrappedLines;
  text;
  navigationCache;
  graphemeBoundaries;
  constructor(text2, columns) {
    this.columns = columns;
    this.text = text2.normalize("NFC"), this.navigationCache = /* @__PURE__ */ new Map;
  }
  get wrappedLines() {
    if (!this._wrappedLines)
      this._wrappedLines = this.measureWrappedText();
    return this._wrappedLines;
  }
  getGraphemeBoundaries() {
    if (!this.graphemeBoundaries) {
      this.graphemeBoundaries = [];
      for (let { index } of getGraphemeSegmenter().segment(this.text))
        this.graphemeBoundaries.push(index);
      this.graphemeBoundaries.push(this.text.length);
    }
    return this.graphemeBoundaries;
  }
  wordBoundariesCache;
  getWordBoundaries() {
    if (!this.wordBoundariesCache) {
      this.wordBoundariesCache = [];
      for (let segment of getWordSegmenter().segment(this.text))
        this.wordBoundariesCache.push({
          start: segment.index,
          end: segment.index + segment.segment.length,
          isWordLike: segment.isWordLike ?? !1
        });
    }
    return this.wordBoundariesCache;
  }
  binarySearchBoundary(boundaries, target, findNext) {
    let left = 0, right = boundaries.length - 1, result = findNext ? this.text.length : 0;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2), boundary = boundaries[mid];
      if (boundary === void 0)
        break;
      if (findNext)
        if (boundary > target)
          result = boundary, right = mid - 1;
        else
          left = mid + 1;
      else if (boundary < target)
        result = boundary, left = mid + 1;
      else
        right = mid - 1;
    }
    return result;
  }
  stringIndexToDisplayWidth(text2, index) {
    if (index <= 0)
      return 0;
    if (index >= text2.length)
      return stringWidth(text2);
    return stringWidth(text2.substring(0, index));
  }
  displayWidthToStringIndex(text2, targetWidth) {
    if (targetWidth <= 0)
      return 0;
    if (!text2)
      return 0;
    if (text2 === this.text)
      return this.offsetAtDisplayWidth(targetWidth);
    let currentWidth = 0, currentOffset = 0;
    for (let { segment, index } of getGraphemeSegmenter().segment(text2)) {
      let segmentWidth = stringWidth(segment);
      if (currentWidth + segmentWidth > targetWidth)
        break;
      currentWidth += segmentWidth, currentOffset = index + segment.length;
    }
    return currentOffset;
  }
  offsetAtDisplayWidth(targetWidth) {
    if (targetWidth <= 0)
      return 0;
    let currentWidth = 0, boundaries = this.getGraphemeBoundaries();
    for (let i5 = 0;i5 < boundaries.length - 1; i5++) {
      let start = boundaries[i5], end = boundaries[i5 + 1];
      if (start === void 0 || end === void 0)
        continue;
      let segment = this.text.substring(start, end), segmentWidth = stringWidth(segment);
      if (currentWidth + segmentWidth > targetWidth)
        return start;
      currentWidth += segmentWidth;
    }
    return this.text.length;
  }
  measureWrappedText() {
    let wrappedText = wrapAnsi2(this.text, this.columns, {
      hard: !0,
      trim: !1
    }), wrappedLines = [], searchOffset = 0, lastNewLinePos = -1, lines2 = wrappedText.split(`
`);
    for (let i5 = 0;i5 < lines2.length; i5++) {
      let text2 = lines2[i5], isPrecededByNewline = (startOffset) => i5 === 0 || startOffset > 0 && this.text[startOffset - 1] === `
`;
      if (text2.length === 0)
        if (lastNewLinePos = this.text.indexOf(`
`, lastNewLinePos + 1), lastNewLinePos !== -1) {
          let startOffset = lastNewLinePos, endsWithNewline = !0;
          wrappedLines.push(new WrappedLine(text2, startOffset, isPrecededByNewline(startOffset), !0));
        } else {
          let startOffset = this.text.length;
          wrappedLines.push(new WrappedLine(text2, startOffset, isPrecededByNewline(startOffset), !1));
        }
      else {
        let startOffset = this.text.indexOf(text2, searchOffset);
        if (startOffset === -1)
          throw Error("Failed to find wrapped line in text");
        searchOffset = startOffset + text2.length;
        let potentialNewlinePos = startOffset + text2.length, endsWithNewline = potentialNewlinePos < this.text.length && this.text[potentialNewlinePos] === `
`;
        if (endsWithNewline)
          lastNewLinePos = potentialNewlinePos;
        wrappedLines.push(new WrappedLine(text2, startOffset, isPrecededByNewline(startOffset), endsWithNewline));
      }
    }
    return wrappedLines;
  }
  getWrappedText() {
    return this.wrappedLines.map((line) => line.isPrecededByNewline ? line.text : line.text.trimStart());
  }
  getWrappedLines() {
    return this.wrappedLines;
  }
  getLine(line) {
    let lines2 = this.wrappedLines;
    return lines2[Math.max(0, Math.min(line, lines2.length - 1))];
  }
  getOffsetFromPosition(position) {
    let wrappedLine = this.getLine(position.line);
    if (wrappedLine.text.length === 0 && wrappedLine.endsWithNewline)
      return wrappedLine.startOffset;
    let leadingWhitespace = wrappedLine.isPrecededByNewline ? 0 : wrappedLine.text.length - wrappedLine.text.trimStart().length, displayColumnWithLeading = position.column + leadingWhitespace, stringIndex = this.displayWidthToStringIndex(wrappedLine.text, displayColumnWithLeading), offset = wrappedLine.startOffset + stringIndex, lineEnd = wrappedLine.startOffset + wrappedLine.text.length, maxOffset = lineEnd, lineDisplayWidth = stringWidth(wrappedLine.text);
    if (wrappedLine.endsWithNewline && position.column > lineDisplayWidth)
      maxOffset = lineEnd + 1;
    return Math.min(offset, maxOffset);
  }
  getLineLength(line) {
    let wrappedLine = this.getLine(line);
    return stringWidth(wrappedLine.text);
  }
  getPositionFromOffset(offset) {
    let lines2 = this.wrappedLines;
    for (let line2 = 0;line2 < lines2.length; line2++) {
      let currentLine = lines2[line2], nextLine = lines2[line2 + 1];
      if (offset >= currentLine.startOffset && (!nextLine || offset < nextLine.startOffset)) {
        let stringPosInLine = offset - currentLine.startOffset, displayColumn;
        if (currentLine.isPrecededByNewline)
          displayColumn = this.stringIndexToDisplayWidth(currentLine.text, stringPosInLine);
        else {
          let leadingWhitespace = currentLine.text.length - currentLine.text.trimStart().length;
          if (stringPosInLine < leadingWhitespace)
            displayColumn = 0;
          else {
            let trimmedText = currentLine.text.trimStart(), posInTrimmed = stringPosInLine - leadingWhitespace;
            displayColumn = this.stringIndexToDisplayWidth(trimmedText, posInTrimmed);
          }
        }
        return {
          line: line2,
          column: Math.max(0, displayColumn)
        };
      }
    }
    let line = lines2.length - 1, lastLine2 = this.wrappedLines[line];
    return {
      line,
      column: stringWidth(lastLine2.text)
    };
  }
  get lineCount() {
    return this.wrappedLines.length;
  }
  withCache(key3, compute) {
    let cached3 = this.navigationCache.get(key3);
    if (cached3 !== void 0)
      return cached3;
    let result = compute();
    return this.navigationCache.set(key3, result), result;
  }
  nextOffset(offset) {
    return this.withCache(`next:${offset}`, () => {
      let boundaries = this.getGraphemeBoundaries();
      return this.binarySearchBoundary(boundaries, offset, !0);
    });
  }
  prevOffset(offset) {
    if (offset <= 0)
      return 0;
    return this.withCache(`prev:${offset}`, () => {
      let boundaries = this.getGraphemeBoundaries();
      return this.binarySearchBoundary(boundaries, offset, !1);
    });
  }
  snapToGraphemeBoundary(offset) {
    if (offset <= 0)
      return 0;
    if (offset >= this.text.length)
      return this.text.length;
    let boundaries = this.getGraphemeBoundaries(), lo = 0, hi = boundaries.length - 1;
    while (lo < hi) {
      let mid = lo + hi + 1 >> 1;
      if (boundaries[mid] <= offset)
        lo = mid;
      else
        hi = mid - 1;
    }
    return boundaries[lo];
  }
}
