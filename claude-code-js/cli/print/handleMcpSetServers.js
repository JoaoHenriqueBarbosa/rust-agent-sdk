// function: handleMcpSetServers
async function handleMcpSetServers(servers, sdkState, dynamicState, setAppState) {
  let { allowed: allowedServers, blocked } = filterMcpServersByPolicy(servers), policyErrors = {};
  for (let name3 of blocked)
    policyErrors[name3] = "Blocked by enterprise policy (allowedMcpServers/deniedMcpServers)";
  let sdkServers = {}, processServers = {};
  for (let [name3, config11] of Object.entries(allowedServers))
    if (config11.type === "sdk")
      sdkServers[name3] = config11;
    else
      processServers[name3] = config11;
  let currentSdkNames = new Set(Object.keys(sdkState.configs)), newSdkNames = new Set(Object.keys(sdkServers)), sdkAdded = [], sdkRemoved = [], newSdkConfigs = { ...sdkState.configs }, newSdkClients = [...sdkState.clients], newSdkTools = [...sdkState.tools];
  for (let name3 of currentSdkNames)
    if (!newSdkNames.has(name3)) {
      let client16 = newSdkClients.find((c3) => c3.name === name3);
      if (client16 && client16.type === "connected")
        await client16.cleanup();
      newSdkClients = newSdkClients.filter((c3) => c3.name !== name3);
      let prefix = `mcp__${name3}__`;
      newSdkTools = newSdkTools.filter((t2) => !t2.name.startsWith(prefix)), delete newSdkConfigs[name3], sdkRemoved.push(name3);
    }
  for (let [name3, config11] of Object.entries(sdkServers))
    if (!currentSdkNames.has(name3)) {
      newSdkConfigs[name3] = config11;
      let pendingClient = {
        type: "pending",
        name: name3,
        config: { ...config11, scope: "dynamic" }
      };
      newSdkClients = [...newSdkClients, pendingClient], sdkAdded.push(name3);
    }
  let processResult = await reconcileMcpServers(processServers, dynamicState, setAppState);
  return {
    response: {
      added: [...sdkAdded, ...processResult.response.added],
      removed: [...sdkRemoved, ...processResult.response.removed],
      errors: { ...policyErrors, ...processResult.response.errors }
    },
    newSdkState: {
      configs: newSdkConfigs,
      clients: newSdkClients,
      tools: newSdkTools
    },
    newDynamicState: processResult.newState,
    sdkServersChanged: sdkAdded.length > 0 || sdkRemoved.length > 0
  };
}
