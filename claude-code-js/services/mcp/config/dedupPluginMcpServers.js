// function: dedupPluginMcpServers
function dedupPluginMcpServers(pluginServers, manualServers) {
  let manualSigs = /* @__PURE__ */ new Map;
  for (let [name3, config10] of Object.entries(manualServers)) {
    let sig = getMcpServerSignature(config10);
    if (sig && !manualSigs.has(sig))
      manualSigs.set(sig, name3);
  }
  let servers = {}, suppressed = [], seenPluginSigs = /* @__PURE__ */ new Map;
  for (let [name3, config10] of Object.entries(pluginServers)) {
    let sig = getMcpServerSignature(config10);
    if (sig === null) {
      servers[name3] = config10;
      continue;
    }
    let manualDup = manualSigs.get(sig);
    if (manualDup !== void 0) {
      logForDebugging(`Suppressing plugin MCP server "${name3}": duplicates manually-configured "${manualDup}"`), suppressed.push({ name: name3, duplicateOf: manualDup });
      continue;
    }
    let pluginDup = seenPluginSigs.get(sig);
    if (pluginDup !== void 0) {
      logForDebugging(`Suppressing plugin MCP server "${name3}": duplicates earlier plugin server "${pluginDup}"`), suppressed.push({ name: name3, duplicateOf: pluginDup });
      continue;
    }
    seenPluginSigs.set(sig, name3), servers[name3] = config10;
  }
  return { servers, suppressed };
}
