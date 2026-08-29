// function: isMcpServerAllowedByPolicy
function isMcpServerAllowedByPolicy(serverName, config10) {
  if (isMcpServerDenied(serverName, config10))
    return !1;
  let settings = getMcpAllowlistSettings();
  if (!settings.allowedMcpServers)
    return !0;
  if (settings.allowedMcpServers.length === 0)
    return !1;
  let hasCommandEntries = settings.allowedMcpServers.some(isMcpServerCommandEntry), hasUrlEntries = settings.allowedMcpServers.some(isMcpServerUrlEntry);
  if (config10) {
    let serverCommand = getServerCommandArray(config10), serverUrl = getServerUrl(config10);
    if (serverCommand)
      if (hasCommandEntries) {
        for (let entry of settings.allowedMcpServers)
          if (isMcpServerCommandEntry(entry) && commandArraysMatch(entry.serverCommand, serverCommand))
            return !0;
        return !1;
      } else {
        for (let entry of settings.allowedMcpServers)
          if (isMcpServerNameEntry(entry) && entry.serverName === serverName)
            return !0;
        return !1;
      }
    else if (serverUrl)
      if (hasUrlEntries) {
        for (let entry of settings.allowedMcpServers)
          if (isMcpServerUrlEntry(entry) && urlMatchesPattern(serverUrl, entry.serverUrl))
            return !0;
        return !1;
      } else {
        for (let entry of settings.allowedMcpServers)
          if (isMcpServerNameEntry(entry) && entry.serverName === serverName)
            return !0;
        return !1;
      }
    else {
      for (let entry of settings.allowedMcpServers)
        if (isMcpServerNameEntry(entry) && entry.serverName === serverName)
          return !0;
      return !1;
    }
  }
  for (let entry of settings.allowedMcpServers)
    if (isMcpServerNameEntry(entry) && entry.serverName === serverName)
      return !0;
  return !1;
}
