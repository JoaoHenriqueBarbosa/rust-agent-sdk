// function: hasMcpDiscoveryButNoToken
function hasMcpDiscoveryButNoToken(serverName, serverConfig) {
  if (isXaaEnabled() && serverConfig.oauth?.xaa)
    return !1;
  let serverKey = getServerKey(serverName, serverConfig), entry = getSecureStorage().read()?.mcpOAuth?.[serverKey];
  return entry !== void 0 && !entry.accessToken && !entry.refreshToken;
}
