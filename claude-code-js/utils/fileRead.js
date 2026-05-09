// Original: src/utils/fileRead.ts
function detectEncodingForResolvedPath(resolvedPath) {
  let { buffer, bytesRead } = getFsImplementation().readSync(resolvedPath, {
    length: 4096
  });
  if (bytesRead === 0)
    return "utf8";
  if (bytesRead >= 2) {
    if (buffer[0] === 255 && buffer[1] === 254)
      return "utf16le";
  }
  if (bytesRead >= 3 && buffer[0] === 239 && buffer[1] === 187 && buffer[2] === 191)
    return "utf8";
  return "utf8";
}
function detectLineEndingsForString(content) {
  let crlfCount = 0, lfCount = 0;
  for (let i2 = 0;i2 < content.length; i2++)
    if (content[i2] === `
`)
      if (i2 > 0 && content[i2 - 1] === "\r")
        crlfCount++;
      else
        lfCount++;
  return crlfCount > lfCount ? "CRLF" : "LF";
}
function readFileSyncWithMetadata(filePath) {
  let fs2 = getFsImplementation(), { resolvedPath, isSymlink } = safeResolvePath(fs2, filePath);
  if (isSymlink)
    logForDebugging(`Reading through symlink: ${filePath} -> ${resolvedPath}`);
  let encoding = detectEncodingForResolvedPath(resolvedPath), raw = fs2.readFileSync(resolvedPath, { encoding }), lineEndings = detectLineEndingsForString(raw.slice(0, 4096));
  return {
    content: raw.replaceAll(`\r
`, `
`),
    encoding,
    lineEndings
  };
}
function readFileSync4(filePath) {
  return readFileSyncWithMetadata(filePath).content;
}
var init_fileRead = __esm(() => {
  init_debug();
  init_fsOperations();
});
