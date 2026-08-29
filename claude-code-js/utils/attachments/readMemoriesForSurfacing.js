// function: readMemoriesForSurfacing
async function readMemoriesForSurfacing(selected, signal) {
  return (await Promise.all(selected.map(async ({ path: filePath, mtimeMs }) => {
    try {
      let result = await readFileInRange(filePath, 0, MAX_MEMORY_LINES, MAX_MEMORY_BYTES, signal, { truncateOnByteLimit: !0 }), truncated = result.totalLines > MAX_MEMORY_LINES || result.truncatedByBytes, content = truncated ? result.content + `

> This memory file was truncated (${result.truncatedByBytes ? `${MAX_MEMORY_BYTES} byte limit` : `first ${MAX_MEMORY_LINES} lines`}). Use the ${FILE_READ_TOOL_NAME} tool to view the complete file at: ${filePath}` : result.content;
      return {
        path: filePath,
        content,
        mtimeMs,
        header: memoryHeader(filePath, mtimeMs),
        limit: truncated ? result.lineCount : void 0
      };
    } catch {
      return null;
    }
  }))).filter((r4) => r4 !== null);
}
