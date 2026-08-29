// function: reconcileMcpServers
async function reconcileMcpServers(desiredConfigs, currentState2, setAppState) {
  let currentNames = new Set(Object.keys(currentState2.configs)), desiredNames = new Set(Object.keys(desiredConfigs)), toRemove = [...currentNames].filter((n6) => !desiredNames.has(n6)), toAdd = [...desiredNames].filter((n6) => !currentNames.has(n6)), toReplace = [...currentNames].filter((n6) => desiredNames.has(n6)).filter((name3) => {
    let currentConfig = currentState2.configs[name3], desiredConfigRaw = desiredConfigs[name3];
    if (!currentConfig || !desiredConfigRaw)
      return !0;
    let desiredConfig = toScopedConfig(desiredConfigRaw);
    return !areMcpConfigsEqual(currentConfig, desiredConfig);
  }), removed = [], added = [], errors8 = {}, newClients = [...currentState2.clients], newTools = [...currentState2.tools];
  for (let name3 of [...toRemove, ...toReplace]) {
    let client16 = newClients.find((c3) => c3.name === name3), config11 = currentState2.configs[name3];
    if (client16 && config11) {
      if (client16.type === "connected")
        try {
          await client16.cleanup();
        } catch (e) {
          logError2(e);
        }
      await clearServerCache(name3, config11);
    }
    let prefix = `mcp__${name3}__`;
    if (newTools = newTools.filter((t2) => !t2.name.startsWith(prefix)), newClients = newClients.filter((c3) => c3.name !== name3), toRemove.includes(name3))
      removed.push(name3);
  }
  for (let name3 of [...toAdd, ...toReplace]) {
    let config11 = desiredConfigs[name3];
    if (!config11)
      continue;
    let scopedConfig = toScopedConfig(config11);
    if (config11.type === "sdk") {
      added.push(name3);
      continue;
    }
    try {
      let client16 = await connectToServer(name3, scopedConfig);
      if (newClients.push(client16), client16.type === "connected") {
        let serverTools = await fetchToolsForClient(client16);
        newTools.push(...serverTools);
      } else if (client16.type === "failed")
        errors8[name3] = client16.error || "Connection failed";
      added.push(name3);
    } catch (e) {
      let err2 = toError(e);
      errors8[name3] = err2.message, logError2(err2);
    }
  }
  let newConfigs = {};
  for (let name3 of desiredNames) {
    let config11 = desiredConfigs[name3];
    if (config11)
      newConfigs[name3] = toScopedConfig(config11);
  }
  let newState = {
    clients: newClients,
    tools: newTools,
    configs: newConfigs
  };
  return setAppState((prev) => {
    let allDynamicServerNames = /* @__PURE__ */ new Set([
      ...Object.keys(currentState2.configs),
      ...Object.keys(newConfigs)
    ]), nonDynamicTools = prev.mcp.tools.filter((t2) => {
      for (let serverName of allDynamicServerNames)
        if (t2.name.startsWith(`mcp__${serverName}__`))
          return !1;
      return !0;
    }), nonDynamicClients = prev.mcp.clients.filter((c3) => {
      return !allDynamicServerNames.has(c3.name);
    });
    return {
      ...prev,
      mcp: {
        ...prev.mcp,
        tools: [...nonDynamicTools, ...newTools],
        clients: [...nonDynamicClients, ...newClients]
      }
    };
  }), {
    response: { added, removed, errors: errors8 },
    newState
  };
}
