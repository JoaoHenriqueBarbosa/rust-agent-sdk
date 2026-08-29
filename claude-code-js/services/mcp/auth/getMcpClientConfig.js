// function: getMcpClientConfig
function getMcpClientConfig(serverName, serverConfig) {
  let data = getSecureStorage().read(), serverKey = getServerKey(serverName, serverConfig);
  return data?.mcpOAuthClientConfig?.[serverKey];
}
