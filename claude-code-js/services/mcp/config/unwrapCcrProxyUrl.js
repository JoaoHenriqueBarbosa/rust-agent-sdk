// function: unwrapCcrProxyUrl
function unwrapCcrProxyUrl(url3) {
  if (!CCR_PROXY_PATH_MARKERS.some((m4) => url3.includes(m4)))
    return url3;
  try {
    return new URL(url3).searchParams.get("mcp_url") || url3;
  } catch {
    return url3;
  }
}
