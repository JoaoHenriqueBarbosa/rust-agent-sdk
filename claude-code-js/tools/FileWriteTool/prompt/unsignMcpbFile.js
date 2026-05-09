// function: unsignMcpbFile
function unsignMcpbFile(mcpbPath) {
  let fileContent = readFileSync14(mcpbPath), { originalContent } = extractSignatureBlock(fileContent);
  writeFileSync4(mcpbPath, originalContent);
}
