// Original: src/tools/LSPTool/symbolContext.ts
function getSymbolAtPosition(filePath, line, character) {
  try {
    let fs17 = getFsImplementation(), absolutePath = expandPath(filePath), { buffer, bytesRead } = fs17.readSync(absolutePath, {
      length: MAX_READ_BYTES
    }), lines2 = buffer.toString("utf-8", 0, bytesRead).split(`
`);
    if (line < 0 || line >= lines2.length)
      return null;
    if (bytesRead === MAX_READ_BYTES && line === lines2.length - 1)
      return null;
    let lineContent = lines2[line];
    if (!lineContent || character < 0 || character >= lineContent.length)
      return null;
    let symbolPattern = /[\w$'!]+|[+\-*/%&|^~<>=]+/g, match;
    while ((match = symbolPattern.exec(lineContent)) !== null) {
      let start = match.index, end = start + match[0].length;
      if (character >= start && character < end) {
        let symbol2 = match[0];
        return truncate(symbol2, 30);
      }
    }
    return null;
  } catch (error44) {
    if (error44 instanceof Error)
      logForDebugging(`Symbol extraction failed for ${filePath}:${line}:${character}: ${error44.message}`, { level: "warn" });
    return null;
  }
}
var MAX_READ_BYTES = 65536;
var init_symbolContext = __esm(() => {
  init_debug();
  init_format();
  init_fsOperations();
  init_path2();
});
