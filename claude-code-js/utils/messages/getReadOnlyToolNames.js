// function: getReadOnlyToolNames
function getReadOnlyToolNames() {
  let tools = hasEmbeddedSearchTools() ? [FILE_READ_TOOL_NAME, "`find`", "`grep`"] : [FILE_READ_TOOL_NAME, GLOB_TOOL_NAME, GREP_TOOL_NAME], { allowedTools } = getCurrentProjectConfig();
  return (allowedTools && allowedTools.length > 0 && !hasEmbeddedSearchTools() ? tools.filter((t2) => allowedTools.includes(t2)) : tools).join(", ");
}
