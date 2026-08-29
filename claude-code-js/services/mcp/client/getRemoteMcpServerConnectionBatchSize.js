// function: getRemoteMcpServerConnectionBatchSize
function getRemoteMcpServerConnectionBatchSize() {
  return parseInt(process.env.MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 20;
}
