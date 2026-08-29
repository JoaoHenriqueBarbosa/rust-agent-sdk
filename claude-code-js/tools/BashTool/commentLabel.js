// Original: src/tools/BashTool/commentLabel.ts
function extractBashCommentLabel(command12) {
  let nl = command12.indexOf(`
`), firstLine = (nl === -1 ? command12 : command12.slice(0, nl)).trim();
  if (!firstLine.startsWith("#") || firstLine.startsWith("#!"))
    return;
  return firstLine.replace(/^#+\s*/, "") || void 0;
}
