// function: getPreReadInstruction
function getPreReadInstruction() {
  return `
- If this is an existing file, you MUST use the ${FILE_READ_TOOL_NAME} tool first to read the file's contents. This tool will fail if you did not read the file first.`;
}
