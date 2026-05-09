// function: dedupClaudeAiMcpServers
function dedupClaudeAiMcpServers(claudeAiServers, manualServers) {
  let manualSigs = /* @__PURE__ */ new Map;
  for (let [name3, config10] of Object.entries(manualServers)) {
    if (isMcpServerDisabled(name3))
      continue;
    let sig = getMcpServerSignature(config10);
    if (sig && !manualSigs.has(sig))
      manualSigs.set(sig, name3);
  }
  let servers = {}, suppressed = [];
  for (let [name3, config10] of Object.entries(claudeAiServers)) {
    let sig = getMcpServerSignature(config10), manualDup = sig !== null ? manualSigs.get(sig) : void 0;
    if (manualDup !== void 0) {
      logForDebugging(`Suppressing claude.ai connector "${name3}": duplicates manually-configured "${manualDup}"`), suppressed.push({ name: name3, duplicateOf: manualDup });
      continue;
    }
    servers[name3] = config10;
  }
  return { servers, suppressed };
}
