// function: classifyMcpToolForCollapse
function classifyMcpToolForCollapse(_serverName, toolName) {
  let normalized = normalize10(toolName);
  return {
    isSearch: SEARCH_TOOLS.has(normalized),
    isRead: READ_TOOLS.has(normalized)
  };
}
