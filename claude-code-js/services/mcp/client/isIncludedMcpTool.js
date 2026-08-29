// function: isIncludedMcpTool
function isIncludedMcpTool(tool) {
  return !tool.name.startsWith("mcp__ide__") || ALLOWED_IDE_TOOLS.includes(tool.name);
}
