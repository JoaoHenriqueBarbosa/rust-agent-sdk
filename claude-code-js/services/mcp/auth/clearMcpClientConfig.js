// function: clearMcpClientConfig
function clearMcpClientConfig(serverName, serverConfig) {
  let storage = getSecureStorage(), existingData = storage.read();
  if (!existingData?.mcpOAuthClientConfig)
    return;
  let serverKey = getServerKey(serverName, serverConfig);
  if (existingData.mcpOAuthClientConfig[serverKey])
    delete existingData.mcpOAuthClientConfig[serverKey], storage.update(existingData);
}
