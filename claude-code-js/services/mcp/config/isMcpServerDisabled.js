// function: isMcpServerDisabled
function isMcpServerDisabled(name3) {
  let projectConfig = getCurrentProjectConfig();
  if (isDefaultDisabledBuiltin(name3))
    return !(projectConfig.enabledMcpServers || []).includes(name3);
  return (projectConfig.disabledMcpServers || []).includes(name3);
}
