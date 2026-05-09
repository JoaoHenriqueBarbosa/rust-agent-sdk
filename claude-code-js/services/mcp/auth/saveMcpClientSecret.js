// function: saveMcpClientSecret
function saveMcpClientSecret(serverName, serverConfig, clientSecret) {
  let storage = getSecureStorage(), existingData = storage.read() || {}, serverKey = getServerKey(serverName, serverConfig);
  storage.update({
    ...existingData,
    mcpOAuthClientConfig: {
      ...existingData.mcpOAuthClientConfig,
      [serverKey]: { clientSecret }
    }
  });
}
