// Original: src/services/mcp/mcpStringUtils.ts
function mcpInfoFromString(toolString) {
  let parts = toolString.split("__"), [mcpPart, serverName, ...toolNameParts] = parts;
  if (mcpPart !== "mcp" || !serverName)
    return null;
  let toolName = toolNameParts.length > 0 ? toolNameParts.join("__") : void 0;
  return { serverName, toolName };
}
function getMcpPrefix(serverName) {
  return `mcp__${normalizeNameForMCP(serverName)}__`;
}
function buildMcpToolName(serverName, toolName) {
  return `${getMcpPrefix(serverName)}${normalizeNameForMCP(toolName)}`;
}
function getToolNameForPermissionCheck(tool) {
  return tool.mcpInfo ? buildMcpToolName(tool.mcpInfo.serverName, tool.mcpInfo.toolName) : tool.name;
}
function getMcpDisplayName(fullName, serverName) {
  let prefix = `mcp__${normalizeNameForMCP(serverName)}__`;
  return fullName.replace(prefix, "");
}
function extractMcpToolDisplayName(userFacingName) {
  let withoutSuffix = userFacingName.replace(/\s*\(MCP\)\s*$/, "");
  withoutSuffix = withoutSuffix.trim();
  let dashIndex = withoutSuffix.indexOf(" - ");
  if (dashIndex !== -1)
    return withoutSuffix.substring(dashIndex + 3).trim();
  return withoutSuffix;
}
var init_mcpStringUtils = () => {};
