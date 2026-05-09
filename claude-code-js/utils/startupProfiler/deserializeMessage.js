// function: deserializeMessage
function deserializeMessage(line) {
  return JSONRPCMessageSchema.parse(JSON.parse(line));
}
