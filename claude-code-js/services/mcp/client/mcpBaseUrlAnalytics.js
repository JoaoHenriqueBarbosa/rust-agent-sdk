// function: mcpBaseUrlAnalytics
function mcpBaseUrlAnalytics(serverRef) {
  let url3 = getLoggingSafeMcpBaseUrl(serverRef);
  return url3 ? {
    mcpServerBaseUrl: url3
  } : {};
}
