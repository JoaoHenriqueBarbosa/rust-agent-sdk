// function: isMcpServerDenied
function isMcpServerDenied(serverName, config10) {
  let settings = getMcpDenylistSettings();
  if (!settings.deniedMcpServers)
    return !1;
  for (let entry of settings.deniedMcpServers)
    if (isMcpServerNameEntry(entry) && entry.serverName === serverName)
      return !0;
  if (config10) {
    let serverCommand = getServerCommandArray(config10);
    if (serverCommand) {
      for (let entry of settings.deniedMcpServers)
        if (isMcpServerCommandEntry(entry) && commandArraysMatch(entry.serverCommand, serverCommand))
          return !0;
    }
    let serverUrl = getServerUrl(config10);
    if (serverUrl) {
      for (let entry of settings.deniedMcpServers)
        if (isMcpServerUrlEntry(entry) && urlMatchesPattern(serverUrl, entry.serverUrl))
          return !0;
    }
  }
  return !1;
}
