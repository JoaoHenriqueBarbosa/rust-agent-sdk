// class: WrappedLine
class WrappedLine {
  text;
  startOffset;
  isPrecededByNewline;
  endsWithNewline;
  constructor(text2, startOffset, isPrecededByNewline, endsWithNewline = !1) {
    this.text = text2;
    this.startOffset = startOffset;
    this.isPrecededByNewline = isPrecededByNewline;
    this.endsWithNewline = endsWithNewline;
  }
  equals(other2) {
    return this.text === other2.text && this.startOffset === other2.startOffset;
  }
  get length() {
    return this.text.length + (this.endsWithNewline ? 1 : 0);
  }
}
