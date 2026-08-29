// function: groupServersByScope
function groupServersByScope(serverList) {
  let groups = /* @__PURE__ */ new Map;
  for (let server of serverList) {
    let scope = server.scope;
    if (!groups.has(scope))
      groups.set(scope, []);
    groups.get(scope).push(server);
  }
  for (let [, groupServers] of groups)
    groupServers.sort((a2, b) => a2.name.localeCompare(b.name));
  return groups;
}
