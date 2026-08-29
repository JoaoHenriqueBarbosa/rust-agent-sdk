// function: callIdeRpc
async function callIdeRpc(toolName, args, client15) {
  return (await callMCPTool({
    client: client15,
    tool: toolName,
    args,
    signal: createAbortController().signal
  })).content;
}
