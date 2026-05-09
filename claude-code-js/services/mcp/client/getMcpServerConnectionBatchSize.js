// function: getMcpServerConnectionBatchSize
function getMcpServerConnectionBatchSize() {
  return parseInt(process.env.MCP_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 3;
}
