// function: getConnectionTimeoutMs
function getConnectionTimeoutMs() {
  return parseInt(process.env.MCP_TIMEOUT || "", 10) || 30000;
}
