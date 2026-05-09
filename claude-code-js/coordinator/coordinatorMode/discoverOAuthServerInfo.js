// function: discoverOAuthServerInfo
async function discoverOAuthServerInfo(serverUrl, opts) {
  let resourceMetadata, authorizationServerUrl;
  try {
    if (resourceMetadata = await discoverOAuthProtectedResourceMetadata(serverUrl, { resourceMetadataUrl: opts?.resourceMetadataUrl }, opts?.fetchFn), resourceMetadata.authorization_servers && resourceMetadata.authorization_servers.length > 0)
      authorizationServerUrl = resourceMetadata.authorization_servers[0];
  } catch {}
  if (!authorizationServerUrl)
    authorizationServerUrl = String(new URL("/", serverUrl));
  let authorizationServerMetadata = await discoverAuthorizationServerMetadata(authorizationServerUrl, { fetchFn: opts?.fetchFn });
  return {
    authorizationServerUrl,
    authorizationServerMetadata,
    resourceMetadata
  };
}
