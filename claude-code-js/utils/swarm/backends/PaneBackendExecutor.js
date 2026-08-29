// Original: src/utils/swarm/backends/PaneBackendExecutor.ts
class PaneBackendExecutor {
  type;
  backend;
  context = null;
  spawnedTeammates;
  cleanupRegistered = !1;
  constructor(backend) {
    this.backend = backend, this.type = backend.type, this.spawnedTeammates = /* @__PURE__ */ new Map;
  }
  setContext(context6) {
    this.context = context6;
  }
  async isAvailable() {
    return this.backend.isAvailable();
  }
  async spawn(config10) {
    let agentId = formatAgentId(config10.name, config10.teamName);
    if (!this.context)
      return logForDebugging(`[PaneBackendExecutor] spawn() called without context for ${config10.name}`), {
        success: !1,
        agentId,
        error: "PaneBackendExecutor not initialized. Call setContext() before spawn()."
      };
    try {
      let teammateColor = config10.color ?? assignTeammateColor(agentId), { paneId, isFirstTeammate } = await this.backend.createTeammatePaneInSwarmView(config10.name, teammateColor), insideTmux = await isInsideTmux();
      if (isFirstTeammate && insideTmux)
        await this.backend.enablePaneBorderStatus();
      let binaryPath = getTeammateCommand(), teammateArgs = [
        `--agent-id ${quote([agentId])}`,
        `--agent-name ${quote([config10.name])}`,
        `--team-name ${quote([config10.teamName])}`,
        `--agent-color ${quote([teammateColor])}`,
        `--parent-session-id ${quote([config10.parentSessionId || getSessionId()])}`,
        config10.planModeRequired ? "--plan-mode-required" : ""
      ].filter(Boolean).join(" "), appState = this.context.getAppState(), inheritedFlags = buildInheritedCliFlags({
        planModeRequired: config10.planModeRequired,
        permissionMode: appState.toolPermissionContext.mode
      });
      if (config10.model)
        inheritedFlags = inheritedFlags.split(" ").filter((flag, i5, arr) => flag !== "--model" && arr[i5 - 1] !== "--model").join(" "), inheritedFlags = inheritedFlags ? `${inheritedFlags} --model ${quote([config10.model])}` : `--model ${quote([config10.model])}`;
      let flagsStr = inheritedFlags ? ` ${inheritedFlags}` : "", workingDir = config10.cwd, envStr = buildInheritedEnvVars(), spawnCommand = `cd ${quote([workingDir])} && env ${envStr} ${quote([binaryPath])} ${teammateArgs}${flagsStr}`;
      if (await this.backend.sendCommandToPane(paneId, spawnCommand, !insideTmux), this.spawnedTeammates.set(agentId, { paneId, insideTmux }), !this.cleanupRegistered)
        this.cleanupRegistered = !0, registerCleanup(async () => {
          for (let [id, info] of this.spawnedTeammates)
            logForDebugging(`[PaneBackendExecutor] Cleanup: killing pane for ${id}`), await this.backend.killPane(info.paneId, !info.insideTmux);
          this.spawnedTeammates.clear();
        });
      return await writeToMailbox(config10.name, {
        from: "team-lead",
        text: config10.prompt,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }, config10.teamName), logForDebugging(`[PaneBackendExecutor] Spawned teammate ${agentId} in pane ${paneId}`), {
        success: !0,
        agentId,
        paneId
      };
    } catch (error44) {
      let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
      return logForDebugging(`[PaneBackendExecutor] Failed to spawn ${agentId}: ${errorMessage2}`), {
        success: !1,
        agentId,
        error: errorMessage2
      };
    }
  }
  async sendMessage(agentId, message) {
    logForDebugging(`[PaneBackendExecutor] sendMessage() to ${agentId}: ${message.text.substring(0, 50)}...`);
    let parsed = parseAgentId(agentId);
    if (!parsed)
      throw Error(`Invalid agentId format: ${agentId}. Expected format: agentName@teamName`);
    let { agentName, teamName } = parsed;
    await writeToMailbox(agentName, {
      text: message.text,
      from: message.from,
      color: message.color,
      timestamp: message.timestamp ?? (/* @__PURE__ */ new Date()).toISOString()
    }, teamName), logForDebugging(`[PaneBackendExecutor] sendMessage() completed for ${agentId}`);
  }
  async terminate(agentId, reason) {
    logForDebugging(`[PaneBackendExecutor] terminate() called for ${agentId}: ${reason}`);
    let parsed = parseAgentId(agentId);
    if (!parsed)
      return logForDebugging("[PaneBackendExecutor] terminate() failed: invalid agentId format"), !1;
    let { agentName, teamName } = parsed, shutdownRequest = {
      type: "shutdown_request",
      requestId: `shutdown-${agentId}-${Date.now()}`,
      from: "team-lead",
      reason
    };
    return await writeToMailbox(agentName, {
      from: "team-lead",
      text: jsonStringify(shutdownRequest),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, teamName), logForDebugging(`[PaneBackendExecutor] terminate() sent shutdown request to ${agentId}`), !0;
  }
  async kill(agentId) {
    logForDebugging(`[PaneBackendExecutor] kill() called for ${agentId}`);
    let teammateInfo = this.spawnedTeammates.get(agentId);
    if (!teammateInfo)
      return logForDebugging(`[PaneBackendExecutor] kill() failed: teammate ${agentId} not found in spawned map`), !1;
    let { paneId, insideTmux } = teammateInfo, killed = await this.backend.killPane(paneId, !insideTmux);
    if (killed)
      this.spawnedTeammates.delete(agentId), logForDebugging(`[PaneBackendExecutor] kill() succeeded for ${agentId}`);
    else
      logForDebugging(`[PaneBackendExecutor] kill() failed for ${agentId}`);
    return killed;
  }
  async isActive(agentId) {
    if (logForDebugging(`[PaneBackendExecutor] isActive() called for ${agentId}`), !this.spawnedTeammates.get(agentId))
      return logForDebugging(`[PaneBackendExecutor] isActive(): teammate ${agentId} not found`), !1;
    return !0;
  }
}
function createPaneBackendExecutor(backend) {
  return new PaneBackendExecutor(backend);
}
var init_PaneBackendExecutor = __esm(() => {
  init_state();
  init_shellQuote();
  init_cleanupRegistry();
  init_debug();
  init_slowOperations();
  init_teammateMailbox();
  init_spawnUtils();
  init_teammateLayoutManager();
  init_detection();
});
