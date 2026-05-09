// function: getMcpToolTimeoutMs
function getMcpToolTimeoutMs() {
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || DEFAULT_MCP_TOOL_TIMEOUT_MS;
}
