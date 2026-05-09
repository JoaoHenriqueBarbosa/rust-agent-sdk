// function: fetchAuthServerMetadata
async function fetchAuthServerMetadata(serverName, serverUrl, configuredMetadataUrl, fetchFn, resourceMetadataUrl) {
  if (configuredMetadataUrl) {
    if (!configuredMetadataUrl.startsWith("https://"))
      throw Error(`authServerMetadataUrl must use https:// (got: ${configuredMetadataUrl})`);
    let response7 = await (fetchFn ?? createAuthFetch())(configuredMetadataUrl, {
      headers: { Accept: "application/json" }
    });
    if (response7.ok)
      return OAuthMetadataSchema.parse(await response7.json());
    throw Error(`HTTP ${response7.status} fetching configured auth server metadata from ${configuredMetadataUrl}`);
  }
  try {
    let { authorizationServerMetadata } = await discoverOAuthServerInfo(serverUrl, {
      ...fetchFn && { fetchFn },
      ...resourceMetadataUrl && { resourceMetadataUrl }
    });
    if (authorizationServerMetadata)
      return authorizationServerMetadata;
  } catch (err2) {
    logMCPDebug(serverName, `RFC 9728 discovery failed, falling back: ${errorMessage(err2)}`);
  }
  let url3 = new URL(serverUrl);
  if (url3.pathname === "/")
    return;
  return discoverAuthorizationServerMetadata(url3, {
    ...fetchFn && { fetchFn }
  });
}
