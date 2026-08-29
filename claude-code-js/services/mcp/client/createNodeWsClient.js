// function: createNodeWsClient
async function createNodeWsClient(url3, options2) {
  return new (await import("ws")).default(url3, ["mcp"], options2);
}
