// function: readMcpbIgnorePatterns
function readMcpbIgnorePatterns(baseDir) {
  let mcpbIgnorePath = join36(baseDir, ".mcpbignore");
  if (!existsSync8(mcpbIgnorePath))
    return [];
  try {
    return readFileSync13(mcpbIgnorePath, "utf-8").split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#"));
  } catch (error44) {
    return console.warn(`Warning: Could not read .mcpbignore file: ${error44 instanceof Error ? error44.message : "Unknown error"}`), [];
  }
}
