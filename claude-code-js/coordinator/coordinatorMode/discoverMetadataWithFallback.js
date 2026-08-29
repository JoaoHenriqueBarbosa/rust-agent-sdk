// function: discoverMetadataWithFallback
async function discoverMetadataWithFallback(serverUrl, wellKnownType, fetchFn, opts) {
  let issuer = new URL(serverUrl), protocolVersion = opts?.protocolVersion ?? LATEST_PROTOCOL_VERSION, url3;
  if (opts?.metadataUrl)
    url3 = new URL(opts.metadataUrl);
  else {
    let wellKnownPath = buildWellKnownPath(wellKnownType, issuer.pathname);
    url3 = new URL(wellKnownPath, opts?.metadataServerUrl ?? issuer), url3.search = issuer.search;
  }
  let response7 = await tryMetadataDiscovery(url3, protocolVersion, fetchFn);
  if (!opts?.metadataUrl && shouldAttemptFallback(response7, issuer.pathname)) {
    let rootUrl = new URL(`/.well-known/${wellKnownType}`, issuer);
    response7 = await tryMetadataDiscovery(rootUrl, protocolVersion, fetchFn);
  }
  return response7;
}
