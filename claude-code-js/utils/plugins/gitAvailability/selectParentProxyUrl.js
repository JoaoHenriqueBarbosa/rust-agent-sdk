// function: selectParentProxyUrl
function selectParentProxyUrl(resolved, opts) {
  if (opts.isHttps)
    return resolved.httpsUrl ?? resolved.httpUrl;
  return resolved.httpUrl;
}
