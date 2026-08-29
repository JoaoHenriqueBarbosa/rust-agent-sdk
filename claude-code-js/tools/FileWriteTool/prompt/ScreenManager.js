// class: ScreenManager
class ScreenManager {
  rl;
  height = 0;
  extraLinesUnderPrompt = 0;
  cursorPos;
  constructor(rl) {
    this.rl = rl, this.rl = rl, this.cursorPos = rl.getCursorPos();
  }
  write(content) {
    this.rl.output.unmute(), this.rl.output.write(content), this.rl.output.mute();
  }
  render(content, bottomContent = "") {
    let promptLine = lastLine(content), rawPromptLine = import_strip_ansi5.default(promptLine), prompt = rawPromptLine;
    if (this.rl.line.length > 0)
      prompt = prompt.slice(0, -this.rl.line.length);
    this.rl.setPrompt(prompt), this.cursorPos = this.rl.getCursorPos();
    let width = readlineWidth();
    if (content = breakLines(content, width), bottomContent = breakLines(bottomContent, width), rawPromptLine.length % width === 0)
      content += `
`;
    let output = content + (bottomContent ? `
` + bottomContent : ""), bottomContentHeight = Math.floor(rawPromptLine.length / width) - this.cursorPos.rows + (bottomContent ? height(bottomContent) : 0);
    if (bottomContentHeight > 0)
      output += import_ansi_escapes.default.cursorUp(bottomContentHeight);
    output += import_ansi_escapes.default.cursorTo(this.cursorPos.cols), this.write(cursorDown2(this.extraLinesUnderPrompt) + import_ansi_escapes.default.eraseLines(this.height) + output), this.extraLinesUnderPrompt = bottomContentHeight, this.height = height(output);
  }
  checkCursorPos() {
    let cursorPos = this.rl.getCursorPos();
    if (cursorPos.cols !== this.cursorPos.cols)
      this.write(import_ansi_escapes.default.cursorTo(cursorPos.cols)), this.cursorPos = cursorPos;
  }
  done({ clearContent }) {
    this.rl.setPrompt("");
    let output = cursorDown2(this.extraLinesUnderPrompt);
    output += clearContent ? import_ansi_escapes.default.eraseLines(this.height) : `
`, output += import_ansi_escapes.default.cursorShow, this.write(output), this.rl.close();
  }
}
