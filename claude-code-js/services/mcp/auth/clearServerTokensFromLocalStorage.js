// function: clearServerTokensFromLocalStorage
function clearServerTokensFromLocalStorage(serverName, serverConfig) {
  let storage = getSecureStorage(), existingData = storage.read();
  if (!existingData?.mcpOAuth)
    return;
  let serverKey = getServerKey(serverName, serverConfig);
  if (existingData.mcpOAuth[serverKey])
    delete existingData.mcpOAuth[serverKey], storage.update(existingData), logMCPDebug(serverName, "Cleared stored tokens");
}
