// function: getProxyFetchOptions
function getProxyFetchOptions(opts) {
  let base2 = keepAliveDisabled ? { keepalive: !1 } : {};
  if (opts?.forAnthropicAPI) {
    let unixSocket = process.env.ANTHROPIC_UNIX_SOCKET;
    if (unixSocket && typeof Bun < "u")
      return { ...base2, unix: unixSocket };
  }
  let proxyUrl = getProxyUrl();
  if (proxyUrl) {
    if (typeof Bun < "u")
      return { ...base2, proxy: proxyUrl, ...getTLSFetchOptions() };
    return { ...base2, dispatcher: getProxyAgent(proxyUrl) };
  }
  return { ...base2, ...getTLSFetchOptions() };
}
