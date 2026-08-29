// function: tryMetadataDiscovery
async function tryMetadataDiscovery(url3, protocolVersion, fetchFn = fetch) {
  return await fetchWithCorsRetry(url3, {
    "MCP-Protocol-Version": protocolVersion
  }, fetchFn);
}
