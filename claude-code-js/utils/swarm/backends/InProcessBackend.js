// Original: src/utils/swarm/backends/InProcessBackend.ts
class InProcessBackend {
  type = "in-process";
  context = null;
  setContext(context6) {
    this.context = context6;
  }
  async isAvailable() {
    return !0;
  }
  async spawn(config10) {
    if (!this.context)
      return logForDebugging(`[InProcessBackend] spawn() called without context for ${config10.name}`), {
        success: !1,
        agentId: `${config10.name}@${config10.teamName}`,
        error: "InProcessBackend not initialized. Call setContext() before spawn()."
      };
    logForDebugging(`[InProcessBackend] spawn() called for ${config10.name}`);
    let result = await spawnInProcessTeammate({
      name: config10.name,
      teamName: config10.teamName,
      prompt: config10.prompt,
      color: config10.color,
      planModeRequired: config10.planModeRequired ?? !1
    }, this.context);
    if (result.success && result.taskId && result.teammateContext && result.abortController)
      startInProcessTeammate({
        identity: {
          agentId: result.agentId,
          agentName: config10.name,
          teamName: config10.teamName,
          color: config10.color,
          planModeRequired: config10.planModeRequired ?? !1,
          parentSessionId: result.teammateContext.parentSessionId
        },
        taskId: result.taskId,
        prompt: config10.prompt,
        teammateContext: result.teammateContext,
        toolUseContext: { ...this.context, messages: [] },
        abortController: result.abortController,
        model: config10.model,
        systemPrompt: config10.systemPrompt,
        systemPromptMode: config10.systemPromptMode,
        allowedTools: config10.permissions,
        allowPermissionPrompts: config10.allowPermissionPrompts
      }), logForDebugging(`[InProcessBackend] Started agent execution for ${result.agentId}`);
    return {
      success: result.success,
      agentId: result.agentId,
      taskId: result.taskId,
      abortController: result.abortController,
      error: result.error
    };
  }
  async sendMessage(agentId, message) {
    logForDebugging(`[InProcessBackend] sendMessage() to ${agentId}: ${message.text.substring(0, 50)}...`);
    let parsed = parseAgentId(agentId);
    if (!parsed)
      throw logForDebugging(`[InProcessBackend] Invalid agentId format: ${agentId}`), Error(`Invalid agentId format: ${agentId}. Expected format: agentName@teamName`);
    let { agentName, teamName } = parsed;
    await writeToMailbox(agentName, {
      text: message.text,
      from: message.from,
      color: message.color,
      timestamp: message.timestamp ?? (/* @__PURE__ */ new Date()).toISOString()
    }, teamName), logForDebugging(`[InProcessBackend] sendMessage() completed for ${agentId}`);
  }
  async terminate(agentId, reason) {
    if (logForDebugging(`[InProcessBackend] terminate() called for ${agentId}: ${reason}`), !this.context)
      return logForDebugging(`[InProcessBackend] terminate() failed: no context set for ${agentId}`), !1;
    let state3 = this.context.getAppState(), task = findTeammateTaskByAgentId(agentId, state3.tasks);
    if (!task)
      return logForDebugging(`[InProcessBackend] terminate() failed: task not found for ${agentId}`), !1;
    if (task.shutdownRequested)
      return logForDebugging(`[InProcessBackend] terminate(): shutdown already requested for ${agentId}`), !0;
    let requestId = `shutdown-${agentId}-${Date.now()}`, shutdownRequest = createShutdownRequestMessage({
      requestId,
      from: "team-lead",
      reason
    }), teammateAgentName = task.identity.agentName;
    return await writeToMailbox(teammateAgentName, {
      from: "team-lead",
      text: jsonStringify(shutdownRequest),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, task.identity.teamName), requestTeammateShutdown(task.id, this.context.setAppState), logForDebugging(`[InProcessBackend] terminate() sent shutdown request to ${agentId}`), !0;
  }
  async kill(agentId) {
    if (logForDebugging(`[InProcessBackend] kill() called for ${agentId}`), !this.context)
      return logForDebugging(`[InProcessBackend] kill() failed: no context set for ${agentId}`), !1;
    let state3 = this.context.getAppState(), task = findTeammateTaskByAgentId(agentId, state3.tasks);
    if (!task)
      return logForDebugging(`[InProcessBackend] kill() failed: task not found for ${agentId}`), !1;
    let killed = killInProcessTeammate(task.id, this.context.setAppState);
    return logForDebugging(`[InProcessBackend] kill() ${killed ? "succeeded" : "failed"} for ${agentId}`), killed;
  }
  async isActive(agentId) {
    if (logForDebugging(`[InProcessBackend] isActive() called for ${agentId}`), !this.context)
      return logForDebugging(`[InProcessBackend] isActive() failed: no context set for ${agentId}`), !1;
    let state3 = this.context.getAppState(), task = findTeammateTaskByAgentId(agentId, state3.tasks);
    if (!task)
      return logForDebugging(`[InProcessBackend] isActive(): task not found for ${agentId}`), !1;
    let isRunning = task.status === "running", isAborted2 = task.abortController?.signal.aborted ?? !0, active = isRunning && !isAborted2;
    return logForDebugging(`[InProcessBackend] isActive() for ${agentId}: ${active} (running=${isRunning}, aborted=${isAborted2})`), active;
  }
}
function createInProcessBackend() {
  return new InProcessBackend;
}
var init_InProcessBackend = __esm(() => {
  init_InProcessTeammateTask();
  init_debug();
  init_slowOperations();
  init_teammateMailbox();
  init_inProcessRunner();
  init_spawnInProcess();
});
