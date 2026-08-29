// function: discoverOAuthProtectedResourceMetadata
async function discoverOAuthProtectedResourceMetadata(serverUrl, opts, fetchFn = fetch) {
  let response7 = await discoverMetadataWithFallback(serverUrl, "oauth-protected-resource", fetchFn, {
    protocolVersion: opts?.protocolVersion,
    metadataUrl: opts?.resourceMetadataUrl
  });
  if (!response7 || response7.status === 404)
    throw await response7?.body?.cancel(), Error("Resource server does not implement OAuth 2.0 Protected Resource Metadata.");
  if (!response7.ok)
    throw await response7.body?.cancel(), Error(`HTTP ${response7.status} trying to load well-known OAuth protected resource metadata.`);
  return OAuthProtectedResourceMetadataSchema.parse(await response7.json());
}
