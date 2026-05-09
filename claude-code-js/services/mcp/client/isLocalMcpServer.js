// function: isLocalMcpServer
function isLocalMcpServer(config10) {
  return !config10.type || config10.type === "stdio" || config10.type === "sdk";
}
