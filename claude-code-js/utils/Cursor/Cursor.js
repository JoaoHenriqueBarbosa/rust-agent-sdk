// class: Cursor
class Cursor {
  measuredText;
  selection;
  offset;
  constructor(measuredText, offset = 0, selection = 0) {
    this.measuredText = measuredText;
    this.selection = selection;
    this.offset = Math.max(0, Math.min(this.text.length, offset));
  }
  static fromText(text2, columns, offset = 0, selection = 0) {
    return new Cursor(new MeasuredText(text2, columns - 1), offset, selection);
  }
  getViewportStartLine(maxVisibleLines) {
    if (maxVisibleLines === void 0 || maxVisibleLines <= 0)
      return 0;
    let { line } = this.getPosition(), allLines = this.measuredText.getWrappedText();
    if (allLines.length <= maxVisibleLines)
      return 0;
    let half = Math.floor(maxVisibleLines / 2), startLine = Math.max(0, line - half), endLine = Math.min(allLines.length, startLine + maxVisibleLines);
    if (endLine - startLine < maxVisibleLines)
      startLine = Math.max(0, endLine - maxVisibleLines);
    return startLine;
  }
  getViewportCharOffset(maxVisibleLines) {
    let startLine = this.getViewportStartLine(maxVisibleLines);
    if (startLine === 0)
      return 0;
    return this.measuredText.getWrappedLines()[startLine]?.startOffset ?? 0;
  }
  getViewportCharEnd(maxVisibleLines) {
    let startLine = this.getViewportStartLine(maxVisibleLines), allLines = this.measuredText.getWrappedLines();
    if (maxVisibleLines === void 0 || maxVisibleLines <= 0)
      return this.text.length;
    let endLine = Math.min(allLines.length, startLine + maxVisibleLines);
    if (endLine >= allLines.length)
      return this.text.length;
    return allLines[endLine]?.startOffset ?? this.text.length;
  }
  render(cursorChar, mask, invert, ghostText, maxVisibleLines) {
    let { line, column } = this.getPosition(), allLines = this.measuredText.getWrappedText(), startLine = this.getViewportStartLine(maxVisibleLines), endLine = maxVisibleLines !== void 0 && maxVisibleLines > 0 ? Math.min(allLines.length, startLine + maxVisibleLines) : allLines.length;
    return allLines.slice(startLine, endLine).map((text2, i5) => {
      let currentLine = i5 + startLine, displayText = text2;
      if (mask) {
        let graphemes = Array.from(getGraphemeSegmenter().segment(text2));
        if (currentLine === allLines.length - 1) {
          let visibleCount = Math.min(6, graphemes.length), maskCount = graphemes.length - visibleCount, splitOffset = graphemes.length > visibleCount ? graphemes[maskCount].index : 0;
          displayText = mask.repeat(maskCount) + text2.slice(splitOffset);
        } else
          displayText = mask.repeat(graphemes.length);
      }
      if (line !== currentLine)
        return displayText.trimEnd();
      let beforeCursor = "", atCursor = cursorChar, afterCursor = "", currentWidth = 0, cursorFound = !1;
      for (let { segment } of getGraphemeSegmenter().segment(displayText)) {
        if (cursorFound) {
          afterCursor += segment;
          continue;
        }
        let nextWidth = currentWidth + stringWidth(segment);
        if (nextWidth > column)
          atCursor = segment, cursorFound = !0;
        else
          currentWidth = nextWidth, beforeCursor += segment;
      }
      let renderedCursor, ghostSuffix = "";
      if (ghostText && currentLine === allLines.length - 1 && this.isAtEnd() && ghostText.text.length > 0) {
        let firstGhostChar = firstGrapheme(ghostText.text) || ghostText.text[0];
        renderedCursor = cursorChar ? invert(firstGhostChar) : firstGhostChar;
        let ghostRest = ghostText.text.slice(firstGhostChar.length);
        if (ghostRest.length > 0)
          ghostSuffix = ghostText.dim(ghostRest);
      } else
        renderedCursor = cursorChar ? invert(atCursor) : atCursor;
      return beforeCursor + renderedCursor + ghostSuffix + afterCursor.trimEnd();
    }).join(`
`);
  }
  left() {
    if (this.offset === 0)
      return this;
    let chip = this.imageRefEndingAt(this.offset);
    if (chip)
      return new Cursor(this.measuredText, chip.start);
    let prevOffset = this.measuredText.prevOffset(this.offset);
    return new Cursor(this.measuredText, prevOffset);
  }
  right() {
    if (this.offset >= this.text.length)
      return this;
    let chip = this.imageRefStartingAt(this.offset);
    if (chip)
      return new Cursor(this.measuredText, chip.end);
    let nextOffset = this.measuredText.nextOffset(this.offset);
    return new Cursor(this.measuredText, Math.min(nextOffset, this.text.length));
  }
  imageRefEndingAt(offset) {
    let m4 = this.text.slice(0, offset).match(/\[Image #\d+\]$/);
    return m4 ? { start: offset - m4[0].length, end: offset } : null;
  }
  imageRefStartingAt(offset) {
    let m4 = this.text.slice(offset).match(/^\[Image #\d+\]/);
    return m4 ? { start: offset, end: offset + m4[0].length } : null;
  }
  snapOutOfImageRef(offset, toward) {
    let re = /\[Image #\d+\]/g, m4;
    while ((m4 = re.exec(this.text)) !== null) {
      let start = m4.index, end = start + m4[0].length;
      if (offset > start && offset < end)
        return toward === "start" ? start : end;
    }
    return offset;
  }
  up() {
    let { line, column } = this.getPosition();
    if (line === 0)
      return this;
    let prevLine = this.measuredText.getWrappedText()[line - 1];
    if (prevLine === void 0)
      return this;
    let prevLineDisplayWidth = stringWidth(prevLine);
    if (column > prevLineDisplayWidth) {
      let newOffset2 = this.getOffset({
        line: line - 1,
        column: prevLineDisplayWidth
      });
      return new Cursor(this.measuredText, newOffset2, 0);
    }
    let newOffset = this.getOffset({ line: line - 1, column });
    return new Cursor(this.measuredText, newOffset, 0);
  }
  down() {
    let { line, column } = this.getPosition();
    if (line >= this.measuredText.lineCount - 1)
      return this;
    let nextLine = this.measuredText.getWrappedText()[line + 1];
    if (nextLine === void 0)
      return this;
    let nextLineDisplayWidth = stringWidth(nextLine);
    if (column > nextLineDisplayWidth) {
      let newOffset2 = this.getOffset({
        line: line + 1,
        column: nextLineDisplayWidth
      });
      return new Cursor(this.measuredText, newOffset2, 0);
    }
    let newOffset = this.getOffset({
      line: line + 1,
      column
    });
    return new Cursor(this.measuredText, newOffset, 0);
  }
  startOfCurrentLine() {
    let { line } = this.getPosition();
    return new Cursor(this.measuredText, this.getOffset({
      line,
      column: 0
    }), 0);
  }
  startOfLine() {
    let { line, column } = this.getPosition();
    if (column === 0 && line > 0)
      return new Cursor(this.measuredText, this.getOffset({
        line: line - 1,
        column: 0
      }), 0);
    return this.startOfCurrentLine();
  }
  firstNonBlankInLine() {
    let { line } = this.getPosition(), match = (this.measuredText.getWrappedText()[line] || "").match(/^\s*\S/), column = match?.index ? match.index + match[0].length - 1 : 0, offset = this.getOffset({ line, column });
    return new Cursor(this.measuredText, offset, 0);
  }
  endOfLine() {
    let { line } = this.getPosition(), column = this.measuredText.getLineLength(line), offset = this.getOffset({ line, column });
    return new Cursor(this.measuredText, offset, 0);
  }
  findLogicalLineStart(fromOffset = this.offset) {
    let prevNewline = this.text.lastIndexOf(`
`, fromOffset - 1);
    return prevNewline === -1 ? 0 : prevNewline + 1;
  }
  findLogicalLineEnd(fromOffset = this.offset) {
    let nextNewline = this.text.indexOf(`
`, fromOffset);
    return nextNewline === -1 ? this.text.length : nextNewline;
  }
  getLogicalLineBounds() {
    return {
      start: this.findLogicalLineStart(),
      end: this.findLogicalLineEnd()
    };
  }
  createCursorWithColumn(lineStart, lineEnd, targetColumn) {
    let lineLength = lineEnd - lineStart, clampedColumn = Math.min(targetColumn, lineLength), rawOffset = lineStart + clampedColumn, offset = this.measuredText.snapToGraphemeBoundary(rawOffset);
    return new Cursor(this.measuredText, offset, 0);
  }
  endOfLogicalLine() {
    return new Cursor(this.measuredText, this.findLogicalLineEnd(), 0);
  }
  startOfLogicalLine() {
    return new Cursor(this.measuredText, this.findLogicalLineStart(), 0);
  }
  firstNonBlankInLogicalLine() {
    let { start, end } = this.getLogicalLineBounds(), match = this.text.slice(start, end).match(/\S/), offset = start + (match?.index ?? 0);
    return new Cursor(this.measuredText, offset, 0);
  }
  upLogicalLine() {
    let { start: currentStart } = this.getLogicalLineBounds();
    if (currentStart === 0)
      return new Cursor(this.measuredText, 0, 0);
    let currentColumn = this.offset - currentStart, prevLineEnd = currentStart - 1, prevLineStart = this.findLogicalLineStart(prevLineEnd);
    return this.createCursorWithColumn(prevLineStart, prevLineEnd, currentColumn);
  }
  downLogicalLine() {
    let { start: currentStart, end: currentEnd } = this.getLogicalLineBounds();
    if (currentEnd >= this.text.length)
      return new Cursor(this.measuredText, this.text.length, 0);
    let currentColumn = this.offset - currentStart, nextLineStart = currentEnd + 1, nextLineEnd = this.findLogicalLineEnd(nextLineStart);
    return this.createCursorWithColumn(nextLineStart, nextLineEnd, currentColumn);
  }
  nextWord() {
    if (this.isAtEnd())
      return this;
    let wordBoundaries = this.measuredText.getWordBoundaries();
    for (let boundary of wordBoundaries)
      if (boundary.isWordLike && boundary.start > this.offset)
        return new Cursor(this.measuredText, boundary.start);
    return new Cursor(this.measuredText, this.text.length);
  }
  endOfWord() {
    if (this.isAtEnd())
      return this;
    let wordBoundaries = this.measuredText.getWordBoundaries();
    for (let boundary of wordBoundaries) {
      if (!boundary.isWordLike)
        continue;
      if (this.offset >= boundary.start && this.offset < boundary.end - 1)
        return new Cursor(this.measuredText, boundary.end - 1);
      if (this.offset === boundary.end - 1) {
        for (let nextBoundary of wordBoundaries)
          if (nextBoundary.isWordLike && nextBoundary.start > this.offset)
            return new Cursor(this.measuredText, nextBoundary.end - 1);
        return this;
      }
    }
    for (let boundary of wordBoundaries)
      if (boundary.isWordLike && boundary.start > this.offset)
        return new Cursor(this.measuredText, boundary.end - 1);
    return this;
  }
  prevWord() {
    if (this.isAtStart())
      return this;
    let wordBoundaries = this.measuredText.getWordBoundaries(), prevWordStart = null;
    for (let boundary of wordBoundaries) {
      if (!boundary.isWordLike)
        continue;
      if (boundary.start < this.offset) {
        if (this.offset > boundary.start && this.offset <= boundary.end)
          return new Cursor(this.measuredText, boundary.start);
        prevWordStart = boundary.start;
      }
    }
    if (prevWordStart !== null)
      return new Cursor(this.measuredText, prevWordStart);
    return new Cursor(this.measuredText, 0);
  }
  nextVimWord() {
    if (this.isAtEnd())
      return this;
    let pos = this.offset, advance2 = (p4) => this.measuredText.nextOffset(p4), currentGrapheme = this.graphemeAt(pos);
    if (!currentGrapheme)
      return this;
    if (isVimWordChar(currentGrapheme))
      while (pos < this.text.length && isVimWordChar(this.graphemeAt(pos)))
        pos = advance2(pos);
    else if (isVimPunctuation(currentGrapheme))
      while (pos < this.text.length && isVimPunctuation(this.graphemeAt(pos)))
        pos = advance2(pos);
    while (pos < this.text.length && WHITESPACE_REGEX2.test(this.graphemeAt(pos)))
      pos = advance2(pos);
    return new Cursor(this.measuredText, pos);
  }
  endOfVimWord() {
    if (this.isAtEnd())
      return this;
    let text2 = this.text, pos = this.offset, advance2 = (p4) => this.measuredText.nextOffset(p4);
    if (this.graphemeAt(pos) === "")
      return this;
    pos = advance2(pos);
    while (pos < text2.length && WHITESPACE_REGEX2.test(this.graphemeAt(pos)))
      pos = advance2(pos);
    if (pos >= text2.length)
      return new Cursor(this.measuredText, text2.length);
    let charAtPos = this.graphemeAt(pos);
    if (isVimWordChar(charAtPos))
      while (pos < text2.length) {
        let nextPos = advance2(pos);
        if (nextPos >= text2.length || !isVimWordChar(this.graphemeAt(nextPos)))
          break;
        pos = nextPos;
      }
    else if (isVimPunctuation(charAtPos))
      while (pos < text2.length) {
        let nextPos = advance2(pos);
        if (nextPos >= text2.length || !isVimPunctuation(this.graphemeAt(nextPos)))
          break;
        pos = nextPos;
      }
    return new Cursor(this.measuredText, pos);
  }
  prevVimWord() {
    if (this.isAtStart())
      return this;
    let pos = this.offset, retreat = (p4) => this.measuredText.prevOffset(p4);
    pos = retreat(pos);
    while (pos > 0 && WHITESPACE_REGEX2.test(this.graphemeAt(pos)))
      pos = retreat(pos);
    if (pos === 0 && WHITESPACE_REGEX2.test(this.graphemeAt(0)))
      return new Cursor(this.measuredText, 0);
    let charAtPos = this.graphemeAt(pos);
    if (isVimWordChar(charAtPos))
      while (pos > 0) {
        let prevPos = retreat(pos);
        if (!isVimWordChar(this.graphemeAt(prevPos)))
          break;
        pos = prevPos;
      }
    else if (isVimPunctuation(charAtPos))
      while (pos > 0) {
        let prevPos = retreat(pos);
        if (!isVimPunctuation(this.graphemeAt(prevPos)))
          break;
        pos = prevPos;
      }
    return new Cursor(this.measuredText, pos);
  }
  nextWORD() {
    let nextCursor = this;
    while (!nextCursor.isOverWhitespace() && !nextCursor.isAtEnd())
      nextCursor = nextCursor.right();
    while (nextCursor.isOverWhitespace() && !nextCursor.isAtEnd())
      nextCursor = nextCursor.right();
    return nextCursor;
  }
  endOfWORD() {
    if (this.isAtEnd())
      return this;
    let cursor = this;
    if (!cursor.isOverWhitespace() && (cursor.right().isOverWhitespace() || cursor.right().isAtEnd()))
      return cursor = cursor.right(), cursor.endOfWORD();
    if (cursor.isOverWhitespace())
      cursor = cursor.nextWORD();
    while (!cursor.right().isOverWhitespace() && !cursor.isAtEnd())
      cursor = cursor.right();
    return cursor;
  }
  prevWORD() {
    let cursor = this;
    if (cursor.left().isOverWhitespace())
      cursor = cursor.left();
    while (cursor.isOverWhitespace() && !cursor.isAtStart())
      cursor = cursor.left();
    if (!cursor.isOverWhitespace())
      while (!cursor.left().isOverWhitespace() && !cursor.isAtStart())
        cursor = cursor.left();
    return cursor;
  }
  modifyText(end, insertString = "") {
    let startOffset = this.offset, endOffset = end.offset, newText = this.text.slice(0, startOffset) + insertString + this.text.slice(endOffset);
    return Cursor.fromText(newText, this.columns, startOffset + insertString.normalize("NFC").length);
  }
  insert(insertString) {
    return this.modifyText(this, insertString);
  }
  del() {
    if (this.isAtEnd())
      return this;
    return this.modifyText(this.right());
  }
  backspace() {
    if (this.isAtStart())
      return this;
    return this.left().modifyText(this);
  }
  deleteToLineStart() {
    if (this.offset > 0 && this.text[this.offset - 1] === `
`)
      return { cursor: this.left().modifyText(this), killed: `
` };
    let startCursor = this.startOfLine(), killed = this.text.slice(startCursor.offset, this.offset);
    return { cursor: startCursor.modifyText(this), killed };
  }
  deleteToLineEnd() {
    if (this.text[this.offset] === `
`)
      return { cursor: this.modifyText(this.right()), killed: `
` };
    let endCursor = this.endOfLine(), killed = this.text.slice(this.offset, endCursor.offset);
    return { cursor: this.modifyText(endCursor), killed };
  }
  deleteToLogicalLineEnd() {
    if (this.text[this.offset] === `
`)
      return this.modifyText(this.right());
    return this.modifyText(this.endOfLogicalLine());
  }
  deleteWordBefore() {
    if (this.isAtStart())
      return { cursor: this, killed: "" };
    let target = this.snapOutOfImageRef(this.prevWord().offset, "start"), prevWordCursor = new Cursor(this.measuredText, target), killed = this.text.slice(prevWordCursor.offset, this.offset);
    return { cursor: prevWordCursor.modifyText(this), killed };
  }
  deleteTokenBefore() {
    let chipAfter = this.imageRefStartingAt(this.offset);
    if (chipAfter) {
      let end = this.text[chipAfter.end] === " " ? chipAfter.end + 1 : chipAfter.end;
      return this.modifyText(new Cursor(this.measuredText, end));
    }
    if (this.isAtStart())
      return null;
    let charAfter = this.text[this.offset];
    if (charAfter !== void 0 && !/\s/.test(charAfter))
      return null;
    let pasteMatch = this.text.slice(0, this.offset).match(/(^|\s)\[(Pasted text #\d+(?: \+\d+ lines)?|Image #\d+|\.\.\.Truncated text #\d+ \+\d+ lines\.\.\.)\]$/);
    if (pasteMatch) {
      let matchStart = pasteMatch.index + pasteMatch[1].length;
      return new Cursor(this.measuredText, matchStart).modifyText(this);
    }
    return null;
  }
  deleteWordAfter() {
    if (this.isAtEnd())
      return this;
    let target = this.snapOutOfImageRef(this.nextWord().offset, "end");
    return this.modifyText(new Cursor(this.measuredText, target));
  }
  graphemeAt(pos) {
    if (pos >= this.text.length)
      return "";
    let nextOff = this.measuredText.nextOffset(pos);
    return this.text.slice(pos, nextOff);
  }
  isOverWhitespace() {
    let currentChar = this.text[this.offset] ?? "";
    return /\s/.test(currentChar);
  }
  equals(other2) {
    return this.offset === other2.offset && this.measuredText === other2.measuredText;
  }
  isAtStart() {
    return this.offset === 0;
  }
  isAtEnd() {
    return this.offset >= this.text.length;
  }
  startOfFirstLine() {
    return new Cursor(this.measuredText, 0, 0);
  }
  startOfLastLine() {
    let lastNewlineIndex = this.text.lastIndexOf(`
`);
    if (lastNewlineIndex === -1)
      return this.startOfLine();
    return new Cursor(this.measuredText, lastNewlineIndex + 1, 0);
  }
  goToLine(lineNumber) {
    let lines2 = this.text.split(`
`), targetLine = Math.min(Math.max(0, lineNumber - 1), lines2.length - 1), offset = 0;
    for (let i5 = 0;i5 < targetLine; i5++)
      offset += (lines2[i5]?.length ?? 0) + 1;
    return new Cursor(this.measuredText, offset, 0);
  }
  endOfFile() {
    return new Cursor(this.measuredText, this.text.length, 0);
  }
  get text() {
    return this.measuredText.text;
  }
  get columns() {
    return this.measuredText.columns + 1;
  }
  getPosition() {
    return this.measuredText.getPositionFromOffset(this.offset);
  }
  getOffset(position) {
    return this.measuredText.getOffsetFromPosition(position);
  }
  findCharacter(char, type, count4 = 1) {
    let text2 = this.text, forward = type === "f" || type === "t", till = type === "t" || type === "T", found = 0;
    if (forward) {
      let pos = this.measuredText.nextOffset(this.offset);
      while (pos < text2.length) {
        if (this.graphemeAt(pos) === char) {
          if (found++, found === count4)
            return till ? Math.max(this.offset, this.measuredText.prevOffset(pos)) : pos;
        }
        pos = this.measuredText.nextOffset(pos);
      }
    } else {
      if (this.offset === 0)
        return null;
      let pos = this.measuredText.prevOffset(this.offset);
      while (pos >= 0) {
        if (this.graphemeAt(pos) === char) {
          if (found++, found === count4)
            return till ? Math.min(this.offset, this.measuredText.nextOffset(pos)) : pos;
        }
        if (pos === 0)
          break;
        pos = this.measuredText.prevOffset(pos);
      }
    }
    return null;
  }
}
