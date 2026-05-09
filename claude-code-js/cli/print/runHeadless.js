// function: runHeadless
async function runHeadless(inputPrompt, getAppState, setAppState, commands7, tools, sdkMcpConfigs, agents2, options2) {
  if (settingsChangeDetector.subscribe((source) => {
    if (applySettingsChange(source, setAppState), isFastModeEnabled())
      setAppState((prev) => {
        let s2 = prev.settings, fastMode = s2.fastMode === !0 && !s2.fastModePerSessionOptIn;
        return { ...prev, fastMode };
      });
  }), proactiveModule8 && !proactiveModule8.isProactiveActive() && isEnvTruthy(process.env.CLAUDE_CODE_PROACTIVE))
    proactiveModule8.activateProactive("command");
  if (typeof Bun < "u")
    setInterval(Bun.gc, 1000).unref();
  if (headlessProfilerStartTurn(), headlessProfilerCheckpoint("runHeadless_entry"), await isQualifiedForGrove())
    await checkGroveForNonInteractive();
  if (headlessProfilerCheckpoint("after_grove_check"), options2.resumeSessionAt && !options2.resume) {
    process.stderr.write(`Error: --resume-session-at requires --resume
`), gracefulShutdownSync(1);
    return;
  }
  if (options2.rewindFiles && !options2.resume) {
    process.stderr.write(`Error: --rewind-files requires --resume
`), gracefulShutdownSync(1);
    return;
  }
  if (options2.rewindFiles && inputPrompt) {
    process.stderr.write(`Error: --rewind-files is a standalone operation and cannot be used with a prompt
`), gracefulShutdownSync(1);
    return;
  }
  let structuredIO = getStructuredIO(inputPrompt, options2);
  if (options2.outputFormat === "stream-json")
    installStreamJsonStdoutGuard();
  let sandboxUnavailableReason = SandboxManager2.getSandboxUnavailableReason();
  if (sandboxUnavailableReason) {
    if (SandboxManager2.isSandboxRequired()) {
      process.stderr.write(`
Error: sandbox required but unavailable: ${sandboxUnavailableReason}
` + `  sandbox.failIfUnavailable is set \u2014 refusing to start without a working sandbox.

`), gracefulShutdownSync(1);
      return;
    }
    process.stderr.write(`
\u26A0 Sandbox disabled: ${sandboxUnavailableReason}
  Commands will run WITHOUT sandboxing. Network and filesystem restrictions will NOT be enforced.

`);
  } else if (SandboxManager2.isSandboxingEnabled())
    try {
      await SandboxManager2.initialize(structuredIO.createSandboxAskCallback());
    } catch (err2) {
      process.stderr.write(`
\u274C Sandbox Error: ${errorMessage(err2)}
`), gracefulShutdownSync(1, "other");
      return;
    }
  if (options2.outputFormat === "stream-json" && options2.verbose)
    registerHookEventHandler((event) => {
      let message = (() => {
        switch (event.type) {
          case "started":
            return {
              type: "system",
              subtype: "hook_started",
              hook_id: event.hookId,
              hook_name: event.hookName,
              hook_event: event.hookEvent,
              uuid: randomUUID48(),
              session_id: getSessionId()
            };
          case "progress":
            return {
              type: "system",
              subtype: "hook_progress",
              hook_id: event.hookId,
              hook_name: event.hookName,
              hook_event: event.hookEvent,
              stdout: event.stdout,
              stderr: event.stderr,
              output: event.output,
              uuid: randomUUID48(),
              session_id: getSessionId()
            };
          case "response":
            return {
              type: "system",
              subtype: "hook_response",
              hook_id: event.hookId,
              hook_name: event.hookName,
              hook_event: event.hookEvent,
              output: event.output,
              stdout: event.stdout,
              stderr: event.stderr,
              exit_code: event.exitCode,
              outcome: event.outcome,
              uuid: randomUUID48(),
              session_id: getSessionId()
            };
        }
      })();
      structuredIO.write(message);
    });
  if (options2.setupTrigger)
    await processSetupHooks(options2.setupTrigger);
  headlessProfilerCheckpoint("before_loadInitialMessages");
  let appState = getAppState(), {
    messages: initialMessages,
    turnInterruptionState,
    agentSetting: resumedAgentSetting
  } = await loadInitialMessages(setAppState, {
    continue: options2.continue,
    teleport: options2.teleport,
    resume: options2.resume,
    resumeSessionAt: options2.resumeSessionAt,
    forkSession: options2.forkSession,
    outputFormat: options2.outputFormat,
    sessionStartHooksPromise: options2.sessionStartHooksPromise,
    restoredWorkerState: structuredIO.restoredWorkerState
  }), hookInitialUserMessage = takeInitialUserMessage();
  if (hookInitialUserMessage)
    structuredIO.prependUserMessage(hookInitialUserMessage);
  if (!options2.agent && !getMainThreadAgentType() && resumedAgentSetting) {
    let { agentDefinition: restoredAgent } = restoreAgentFromSession(resumedAgentSetting, void 0, { activeAgents: agents2, allAgents: agents2 });
    if (restoredAgent) {
      if (setAppState((prev) => ({ ...prev, agent: restoredAgent.agentType })), !options2.systemPrompt && !isBuiltInAgent(restoredAgent)) {
        let agentSystemPrompt = restoredAgent.getSystemPrompt();
        if (agentSystemPrompt)
          options2.systemPrompt = agentSystemPrompt;
      }
      saveAgentSetting(restoredAgent.agentType);
    }
  }
  if (initialMessages.length === 0 && process.exitCode !== void 0)
    return;
  if (options2.rewindFiles) {
    let targetMessage = initialMessages.find((m4) => m4.uuid === options2.rewindFiles);
    if (!targetMessage || targetMessage.type !== "user") {
      process.stderr.write(`Error: --rewind-files requires a user message UUID, but ${options2.rewindFiles} is not a user message in this session
`), gracefulShutdownSync(1);
      return;
    }
    let currentAppState = getAppState(), result = await handleRewindFiles(options2.rewindFiles, currentAppState, setAppState, !1);
    if (!result.canRewind) {
      process.stderr.write(`Error: ${result.error || "Unexpected error"}
`), gracefulShutdownSync(1);
      return;
    }
    process.stdout.write(`Files rewound to state at message ${options2.rewindFiles}
`), gracefulShutdownSync(0);
    return;
  }
  let hasValidResumeSessionId = typeof options2.resume === "string" && (Boolean(validateUuid2(options2.resume)) || options2.resume.endsWith(".jsonl")), isUsingSdkUrl = Boolean(options2.sdkUrl);
  if (!inputPrompt && !hasValidResumeSessionId && !isUsingSdkUrl) {
    process.stderr.write(`Error: Input must be provided either through stdin or as a prompt argument when using --print
`), gracefulShutdownSync(1);
    return;
  }
  if (options2.outputFormat === "stream-json" && !options2.verbose) {
    process.stderr.write(`Error: When using --print, --output-format=stream-json requires --verbose
`), gracefulShutdownSync(1);
    return;
  }
  let allowedMcpTools = filterToolsByDenyRules(appState.mcp.tools, appState.toolPermissionContext), filteredTools = [...tools, ...allowedMcpTools], effectivePermissionPromptToolName = options2.sdkUrl ? "stdio" : options2.permissionPromptToolName, canUseTool = getCanUseToolFn(effectivePermissionPromptToolName, structuredIO, () => getAppState().mcp.tools, (details) => {
    notifySessionStateChanged("requires_action", details);
  });
  if (options2.permissionPromptToolName)
    filteredTools = filteredTools.filter((tool) => !toolMatchesName(tool, options2.permissionPromptToolName));
  registerProcessOutputErrorHandlers(), headlessProfilerCheckpoint("after_loadInitialMessages"), await ensureModelStringsInitialized(), headlessProfilerCheckpoint("after_modelStrings");
  let needsFullArray = options2.outputFormat === "json" && options2.verbose, messages = [], lastMessage, transformToStreamlined = null;
  headlessProfilerCheckpoint("before_runHeadlessStreaming");
  for await (let message of runHeadlessStreaming(structuredIO, appState.mcp.clients, [...commands7, ...appState.mcp.commands], filteredTools, initialMessages, canUseTool, sdkMcpConfigs, getAppState, setAppState, agents2, options2, turnInterruptionState)) {
    if (transformToStreamlined) {
      let transformed = transformToStreamlined(message);
      if (transformed)
        await structuredIO.write(transformed);
    } else if (options2.outputFormat === "stream-json" && options2.verbose)
      await structuredIO.write(message);
    if (message.type !== "control_response" && message.type !== "control_request" && message.type !== "control_cancel_request" && !(message.type === "system" && (message.subtype === "session_state_changed" || message.subtype === "task_notification" || message.subtype === "task_started" || message.subtype === "task_progress" || message.subtype === "post_turn_summary")) && message.type !== "stream_event" && message.type !== "keep_alive" && message.type !== "streamlined_text" && message.type !== "streamlined_tool_use_summary" && message.type !== "prompt_suggestion") {
      if (needsFullArray)
        messages.push(message);
      lastMessage = message;
    }
  }
  switch (options2.outputFormat) {
    case "json":
      if (!lastMessage || lastMessage.type !== "result")
        throw Error("No messages returned");
      if (options2.verbose) {
        writeToStdout(jsonStringify(messages) + `
`);
        break;
      }
      writeToStdout(jsonStringify(lastMessage) + `
`);
      break;
    case "stream-json":
      break;
    default:
      if (!lastMessage || lastMessage.type !== "result")
        throw Error("No messages returned");
      switch (lastMessage.subtype) {
        case "success":
          writeToStdout(lastMessage.result.endsWith(`
`) ? lastMessage.result : lastMessage.result + `
`);
          break;
        case "error_during_execution":
          writeToStdout("Execution error");
          break;
        case "error_max_turns":
          writeToStdout(`Error: Reached max turns (${options2.maxTurns})`);
          break;
        case "error_max_budget_usd":
          writeToStdout(`Error: Exceeded USD budget (${options2.maxBudgetUsd})`);
          break;
        case "error_max_structured_output_retries":
          writeToStdout("Error: Failed to provide valid structured output after maximum retries");
      }
  }
  logHeadlessProfilerTurn(), gracefulShutdownSync(lastMessage?.type === "result" && lastMessage?.is_error ? 1 : 0);
}
