// function: addScopeToServers
function addScopeToServers(servers, scope) {
  if (!servers)
    return {};
  let scopedServers = {};
  for (let [name3, config10] of Object.entries(servers))
    scopedServers[name3] = { ...config10, scope };
  return scopedServers;
}
