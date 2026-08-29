// function: discoverAuthorizationServerMetadata
async function discoverAuthorizationServerMetadata(authorizationServerUrl, { fetchFn = fetch, protocolVersion = LATEST_PROTOCOL_VERSION } = {}) {
  let headers = {
    "MCP-Protocol-Version": protocolVersion,
    Accept: "application/json"
  }, urlsToTry = buildDiscoveryUrls(authorizationServerUrl);
  for (let { url: endpointUrl, type } of urlsToTry) {
    let response7 = await fetchWithCorsRetry(endpointUrl, headers, fetchFn);
    if (!response7)
      continue;
    if (!response7.ok) {
      if (await response7.body?.cancel(), response7.status >= 400 && response7.status < 500)
        continue;
      throw Error(`HTTP ${response7.status} trying to load ${type === "oauth" ? "OAuth" : "OpenID provider"} metadata from ${endpointUrl}`);
    }
    if (type === "oauth")
      return OAuthMetadataSchema.parse(await response7.json());
    else
      return OpenIdProviderDiscoveryMetadataSchema.parse(await response7.json());
  }
  return;
}
