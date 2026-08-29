// function: getMcpConfigByName
function getMcpConfigByName(name3) {
  let { servers: enterpriseServers } = getMcpConfigsByScope("enterprise");
  if (isRestrictedToPluginOnly("mcp"))
    return enterpriseServers[name3] ?? null;
  let { servers: userServers } = getMcpConfigsByScope("user"), { servers: projectServers } = getMcpConfigsByScope("project"), { servers: localServers } = getMcpConfigsByScope("local");
  if (enterpriseServers[name3])
    return enterpriseServers[name3];
  if (localServers[name3])
    return localServers[name3];
  if (projectServers[name3])
    return projectServers[name3];
  if (userServers[name3])
    return userServers[name3];
  return null;
}
