// function: runHeadlessStreaming
function runHeadlessStreaming(structuredIO, mcpClients, commands7, tools, initialMessages, canUseTool, sdkMcpConfigs, getAppState, setAppState, agents2, options2, turnInterruptionState) {
  let running = !1, runPhase, inputClosed = !1, shutdownPromptInjected = !1, heldBackResult = null, abortController, output = structuredIO.outbound, sigintHandler = () => {
    if (logForDiagnosticsNoPII("info", "shutdown_signal", { signal: "SIGINT" }), abortController && !abortController.signal.aborted)
      abortController.abort();
    gracefulShutdown(0);
  };
  process.on("SIGINT", sigintHandler), registerCleanup(async () => {
    let bg = {};
    for (let t2 of getRunningTasks(getAppState()))
      if (isBackgroundTask(t2))
        bg[t2.type] = (bg[t2.type] ?? 0) + 1;
    logForDiagnosticsNoPII("info", "run_state_at_shutdown", {
      run_active: running,
      run_phase: runPhase,
      worker_status: getSessionState(),
      internal_events_pending: structuredIO.internalEventsPending,
      bg_tasks: bg
    });
  }), setPermissionModeChangedListener((newMode) => {
    if (newMode === "default" || newMode === "acceptEdits" || newMode === "bypassPermissions" || newMode === "plan" || newMode === !1 || newMode === "dontAsk")
      output.enqueue({
        type: "system",
        subtype: "status",
        status: null,
        permissionMode: newMode,
        uuid: randomUUID48(),
        session_id: getSessionId()
      });
  });
  let suggestionState = {
    abortController: null,
    inflightPromise: null,
    lastEmitted: null,
    pendingSuggestion: null,
    pendingLastEmittedEntry: null
  }, unsubscribeAuthStatus;
  if (options2.enableAuthStatus)
    unsubscribeAuthStatus = AwsAuthStatusManager.getInstance().subscribe((status2) => {
      output.enqueue({
        type: "auth_status",
        isAuthenticating: status2.isAuthenticating,
        output: status2.output,
        error: status2.error,
        uuid: randomUUID48(),
        session_id: getSessionId()
      });
    });
  let rateLimitListener = (limits) => {
    let rateLimitInfo = toSDKRateLimitInfo(limits);
    if (rateLimitInfo)
      output.enqueue({
        type: "rate_limit_event",
        rate_limit_info: rateLimitInfo,
        uuid: randomUUID48(),
        session_id: getSessionId()
      });
  };
  statusListeners.add(rateLimitListener);
  let mutableMessages = initialMessages, readFileState = extractReadFilesFromMessages(initialMessages, cwd2(), READ_FILE_STATE_CACHE_SIZE), pendingSeeds = createFileStateCacheWithSizeLimit(READ_FILE_STATE_CACHE_SIZE), resumeInterruptedTurnEnv = process.env.CLAUDE_CODE_RESUME_INTERRUPTED_TURN;
  if (turnInterruptionState && turnInterruptionState.kind !== "none" && resumeInterruptedTurnEnv)
    logForDebugging(`[print.ts] Auto-resuming interrupted turn (kind: ${turnInterruptionState.kind})`), removeInterruptedMessage(mutableMessages, turnInterruptionState.message), enqueue({
      mode: "prompt",
      value: turnInterruptionState.message.message.content,
      uuid: randomUUID48()
    });
  let modelInfos = getModelOptions().map((option) => {
    let modelId = option.value === null ? "default" : option.value, resolvedModel = modelId === "default" ? getDefaultMainLoopModel() : parseUserSpecifiedModel(modelId), hasEffort = modelSupportsEffort(resolvedModel), hasAdaptiveThinking = modelSupportsAdaptiveThinking(resolvedModel), hasFastMode = isFastModeSupportedByModel(option.value), hasAutoMode = modelSupportsAutoMode(resolvedModel);
    return {
      value: modelId,
      displayName: option.label,
      description: option.description,
      ...hasEffort && {
        supportsEffort: !0,
        supportedEffortLevels: modelSupportsMaxEffort(resolvedModel) ? [...EFFORT_LEVELS] : EFFORT_LEVELS.filter((l3) => l3 !== "max")
      },
      ...hasAdaptiveThinking && { supportsAdaptiveThinking: !0 },
      ...hasFastMode && { supportsFastMode: !0 },
      ...hasAutoMode && { supportsAutoMode: !0 }
    };
  }), activeUserSpecifiedModel = options2.userSpecifiedModel;
  function injectModelSwitchBreadcrumbs(modelArg, resolvedModel) {
    let breadcrumbs = createModelSwitchBreadcrumbs(modelArg, modelDisplayString(resolvedModel));
    mutableMessages.push(...breadcrumbs);
    for (let crumb of breadcrumbs)
      if (typeof crumb.message.content === "string" && crumb.message.content.includes(`<${LOCAL_COMMAND_STDOUT_TAG}>`))
        output.enqueue({
          type: "user",
          message: crumb.message,
          session_id: getSessionId(),
          parent_tool_use_id: null,
          uuid: crumb.uuid,
          timestamp: crumb.timestamp,
          isReplay: !0
        });
  }
  let sdkClients = [], sdkTools = [], elicitationRegistered = /* @__PURE__ */ new Set;
  function registerElicitationHandlers(clients) {
    for (let connection7 of clients) {
      if (connection7.type !== "connected" || elicitationRegistered.has(connection7.name))
        continue;
      if (connection7.config.type === "sdk")
        continue;
      let serverName = connection7.name;
      try {
        connection7.client.setRequestHandler(ElicitRequestSchema, async (request2, extra) => {
          logMCPDebug(serverName, `Elicitation request received in print mode: ${jsonStringify(request2)}`);
          let mode = request2.params.mode === "url" ? "url" : "form";
          logEvent("tengu_mcp_elicitation_shown", {
            mode
          });
          let hookResponse = await runElicitationHooks(serverName, request2.params, extra.signal);
          if (hookResponse)
            return logMCPDebug(serverName, `Elicitation resolved by hook: ${jsonStringify(hookResponse)}`), logEvent("tengu_mcp_elicitation_response", {
              mode,
              action: hookResponse.action
            }), hookResponse;
          let url3 = "url" in request2.params ? request2.params.url : void 0, requestedSchema = "requestedSchema" in request2.params ? request2.params.requestedSchema : void 0, elicitationId = "elicitationId" in request2.params ? request2.params.elicitationId : void 0, rawResult = await structuredIO.handleElicitation(serverName, request2.params.message, requestedSchema, extra.signal, mode, url3, elicitationId), result = await runElicitationResultHooks(serverName, rawResult, extra.signal, mode, elicitationId);
          return logEvent("tengu_mcp_elicitation_response", {
            mode,
            action: result.action
          }), result;
        }), connection7.client.setNotificationHandler(ElicitationCompleteNotificationSchema, (notification) => {
          let { elicitationId } = notification.params;
          logMCPDebug(serverName, `Elicitation completion notification: ${elicitationId}`), executeNotificationHooks({
            message: `MCP server "${serverName}" confirmed elicitation ${elicitationId} complete`,
            notificationType: "elicitation_complete"
          }), output.enqueue({
            type: "system",
            subtype: "elicitation_complete",
            mcp_server_name: serverName,
            elicitation_id: elicitationId,
            uuid: randomUUID48(),
            session_id: getSessionId()
          });
        }), elicitationRegistered.add(serverName);
      } catch {}
    }
  }
  async function updateSdkMcp() {
    let currentServerNames = new Set(Object.keys(sdkMcpConfigs)), connectedServerNames = new Set(sdkClients.map((c3) => c3.name)), hasNewServers = Array.from(currentServerNames).some((name3) => !connectedServerNames.has(name3)), hasRemovedServers = Array.from(connectedServerNames).some((name3) => !currentServerNames.has(name3)), hasPendingSdkClients = sdkClients.some((c3) => c3.type === "pending"), hasFailedSdkClients = sdkClients.some((c3) => c3.type === "failed");
    if (hasNewServers || hasRemovedServers || hasPendingSdkClients || hasFailedSdkClients) {
      for (let client16 of sdkClients)
        if (!currentServerNames.has(client16.name)) {
          if (client16.type === "connected")
            await client16.cleanup();
        }
      let sdkSetup = await setupSdkMcpClients(sdkMcpConfigs, (serverName, message) => structuredIO.sendMcpMessage(serverName, message));
      sdkClients = sdkSetup.clients, sdkTools = sdkSetup.tools;
      let allSdkNames = uniq([...connectedServerNames, ...currentServerNames]);
      setAppState((prev) => ({
        ...prev,
        mcp: {
          ...prev.mcp,
          tools: [
            ...prev.mcp.tools.filter((t2) => !allSdkNames.some((name3) => t2.name.startsWith(getMcpPrefix(name3)))),
            ...sdkTools
          ]
        }
      })), setupVscodeSdkMcp(sdkClients);
    }
  }
  updateSdkMcp();
  let dynamicMcpState = {
    clients: [],
    tools: [],
    configs: {}
  }, buildAllTools = (appState) => {
    let assembledTools = assembleToolPool(appState.toolPermissionContext, appState.mcp.tools), allTools = uniqBy_default(mergeAndFilterTools([...tools, ...sdkTools, ...dynamicMcpState.tools], assembledTools, appState.toolPermissionContext.mode), "name");
    if (options2.permissionPromptToolName)
      allTools = allTools.filter((tool) => !toolMatchesName(tool, options2.permissionPromptToolName));
    let initJsonSchema = getInitJsonSchema();
    if (initJsonSchema && !options2.jsonSchema) {
      let syntheticOutputResult = createSyntheticOutputTool(initJsonSchema);
      if ("tool" in syntheticOutputResult)
        allTools = [...allTools, syntheticOutputResult.tool];
    }
    return allTools;
  }, mcpChangesPromise = Promise.resolve({
    response: {
      added: [],
      removed: [],
      errors: {}
    },
    sdkServersChanged: !1
  });
  function applyMcpServerChanges(servers) {
    let doWork = async () => {
      let oldSdkClientNames = new Set(sdkClients.map((c3) => c3.name)), result = await handleMcpSetServers(servers, { configs: sdkMcpConfigs, clients: sdkClients, tools: sdkTools }, dynamicMcpState, setAppState);
      for (let key3 of Object.keys(sdkMcpConfigs))
        delete sdkMcpConfigs[key3];
      if (Object.assign(sdkMcpConfigs, result.newSdkState.configs), sdkClients = result.newSdkState.clients, sdkTools = result.newSdkState.tools, dynamicMcpState = result.newDynamicState, result.sdkServersChanged) {
        let newSdkClientNames = new Set(sdkClients.map((c3) => c3.name)), allSdkNames = uniq([...oldSdkClientNames, ...newSdkClientNames]);
        setAppState((prev) => ({
          ...prev,
          mcp: {
            ...prev.mcp,
            tools: [
              ...prev.mcp.tools.filter((t2) => !allSdkNames.some((name3) => t2.name.startsWith(getMcpPrefix(name3)))),
              ...sdkTools
            ]
          }
        }));
      }
      return {
        response: result.response,
        sdkServersChanged: result.sdkServersChanged
      };
    };
    return mcpChangesPromise = mcpChangesPromise.then(doWork, doWork), mcpChangesPromise;
  }
  function buildMcpServerStatuses() {
    let currentAppState = getAppState(), currentMcpClients = currentAppState.mcp.clients, allMcpTools = uniqBy_default([...currentAppState.mcp.tools, ...dynamicMcpState.tools], "name"), existingNames = /* @__PURE__ */ new Set([
      ...currentMcpClients.map((c3) => c3.name),
      ...sdkClients.map((c3) => c3.name)
    ]);
    return [
      ...currentMcpClients,
      ...sdkClients,
      ...dynamicMcpState.clients.filter((c3) => !existingNames.has(c3.name))
    ].map((connection7) => {
      let config11;
      if (connection7.config.type === "sse" || connection7.config.type === "http")
        config11 = {
          type: connection7.config.type,
          url: connection7.config.url,
          headers: connection7.config.headers,
          oauth: connection7.config.oauth
        };
      else if (connection7.config.type === "claudeai-proxy")
        config11 = {
          type: "claudeai-proxy",
          url: connection7.config.url,
          id: connection7.config.id
        };
      else if (connection7.config.type === "stdio" || connection7.config.type === void 0)
        config11 = {
          type: "stdio",
          command: connection7.config.command,
          args: connection7.config.args
        };
      let serverTools = connection7.type === "connected" ? filterToolsByServer(allMcpTools, connection7.name).map((tool) => ({
        name: tool.mcpInfo?.toolName ?? tool.name,
        annotations: {
          readOnly: tool.isReadOnly({}) || void 0,
          destructive: tool.isDestructive?.({}) || void 0,
          openWorld: tool.isOpenWorld?.({}) || void 0
        }
      })) : void 0, capabilities;
      if (connection7.type === "connected" && connection7.capabilities.experimental) {
        let exp = { ...connection7.capabilities.experimental };
        if (exp["claude/channel"] && (!isChannelsEnabled() || !isChannelAllowlisted(connection7.config.pluginSource)))
          delete exp["claude/channel"];
        if (Object.keys(exp).length > 0)
          capabilities = { experimental: exp };
      }
      return {
        name: connection7.name,
        status: connection7.type,
        serverInfo: connection7.type === "connected" ? connection7.serverInfo : void 0,
        error: connection7.type === "failed" ? connection7.error : void 0,
        config: config11,
        scope: connection7.config.scope,
        tools: serverTools,
        capabilities
      };
    });
  }
  async function installPluginsAndApplyMcpInBackground() {
    try {
      if (await Promise.all([
        Promise.resolve(),
        withDiagnosticsTiming("headless_managed_settings_wait", () => waitForRemoteManagedSettingsToLoad())
      ]), await installPluginsForHeadless())
        await applyPluginMcpDiff();
    } catch (error44) {
      logError2(error44);
    }
  }
  let pluginInstallPromise = null;
  if (!isBareMode())
    if (isEnvTruthy(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL))
      pluginInstallPromise = installPluginsAndApplyMcpInBackground();
    else
      installPluginsAndApplyMcpInBackground();
  let idleTimeout = createIdleTimeoutManager(() => !running), currentCommands = commands7, currentAgents = agents2;
  async function refreshPluginState() {
    let { agentDefinitions: freshAgentDefs } = await refreshActivePlugins(setAppState);
    currentCommands = await getCommands(cwd2());
    let sdkAgents = currentAgents.filter((a2) => a2.source === "flagSettings");
    currentAgents = [...freshAgentDefs.allAgents, ...sdkAgents];
  }
  async function applyPluginMcpDiff() {
    let { servers: newConfigs } = await getAllMcpConfigs(), supportedConfigs = {};
    for (let [name3, config11] of Object.entries(newConfigs)) {
      let type = config11.type;
      if (type === void 0 || type === "stdio" || type === "sse" || type === "http" || type === "sdk")
        supportedConfigs[name3] = config11;
    }
    for (let [name3, config11] of Object.entries(sdkMcpConfigs))
      if (config11.type === "sdk" && !(name3 in supportedConfigs))
        supportedConfigs[name3] = config11;
    let { response: response7, sdkServersChanged } = await applyMcpServerChanges(supportedConfigs);
    if (sdkServersChanged)
      updateSdkMcp();
    logForDebugging(`Headless MCP refresh: added=${response7.added.length}, removed=${response7.removed.length}`);
  }
  let unsubscribeSkillChanges = skillChangeDetector.subscribe(() => {
    clearCommandsCache(), getCommands(cwd2()).then((newCommands) => {
      currentCommands = newCommands;
    });
  }), scheduleProactiveTick = () => {
    setTimeout(() => {
      if (!proactiveModule8?.isProactiveActive() || proactiveModule8.isProactivePaused() || inputClosed)
        return;
      let tickContent = `<${TICK_TAG}>${(/* @__PURE__ */ new Date()).toLocaleTimeString()}</${TICK_TAG}>`;
      enqueue({
        mode: "prompt",
        value: tickContent,
        uuid: randomUUID48(),
        priority: "later",
        isMeta: !0
      }), run();
    }, 0);
  };
  subscribeToCommandQueue(() => {
    if (abortController && getCommandsByMaxPriority("now").length > 0)
      abortController.abort("interrupt");
  });
  let run = async () => {
    if (running)
      return;
    if (running = !0, runPhase = void 0, notifySessionStateChanged("running"), idleTimeout.stop(), headlessProfilerCheckpoint("run_entry"), await updateSdkMcp(), headlessProfilerCheckpoint("after_updateSdkMcp"), pluginInstallPromise) {
      let timeoutMs = parseInt(process.env.CLAUDE_CODE_SYNC_PLUGIN_INSTALL_TIMEOUT_MS || "", 10);
      if (timeoutMs > 0) {
        let timeout2 = sleep3(timeoutMs).then(() => "timeout");
        if (await Promise.race([pluginInstallPromise, timeout2]) === "timeout")
          logError2(Error(`CLAUDE_CODE_SYNC_PLUGIN_INSTALL: plugin installation timed out after ${timeoutMs}ms`)), logEvent("tengu_sync_plugin_install_timeout", {
            timeout_ms: timeoutMs
          });
      } else
        await pluginInstallPromise;
      pluginInstallPromise = null, await refreshPluginState();
      let { setupPluginHookHotReload: setupPluginHookHotReload2 } = await Promise.resolve().then(() => (init_loadPluginHooks(), exports_loadPluginHooks));
      setupPluginHookHotReload2();
    }
    let isMainThread = (cmd) => cmd.agentId === void 0;
    try {
      let command19, waitingForAgents = !1, drainCommandQueue = async () => {
        while (command19 = dequeue(isMainThread)) {
          if (command19.mode !== "prompt" && command19.mode !== "orphaned-permission" && command19.mode !== "task-notification")
            throw Error("only prompt commands are supported in streaming mode");
          let batch = [command19];
          if (command19.mode === "prompt") {
            while (canBatchWith(command19, peek(isMainThread)))
              batch.push(dequeue(isMainThread));
            if (batch.length > 1)
              command19 = {
                ...command19,
                value: joinPromptValues(batch.map((c3) => c3.value)),
                uuid: batch.findLast((c3) => c3.uuid)?.uuid ?? command19.uuid
              };
          }
          let batchUuids = batch.map((c3) => c3.uuid).filter((u5) => u5 !== void 0);
          if (options2.replayUserMessages && batch.length > 1) {
            for (let c3 of batch)
              if (c3.uuid && c3.uuid !== command19.uuid)
                output.enqueue({
                  type: "user",
                  message: { role: "user", content: c3.value },
                  session_id: getSessionId(),
                  parent_tool_use_id: null,
                  uuid: c3.uuid,
                  isReplay: !0
                });
          }
          let appState = getAppState(), allMcpClients = [
            ...appState.mcp.clients,
            ...sdkClients,
            ...dynamicMcpState.clients
          ];
          registerElicitationHandlers(allMcpClients);
          for (let client16 of allMcpClients)
            reregisterChannelHandlerAfterReconnect(client16);
          let allTools = buildAllTools(appState);
          for (let uuid8 of batchUuids)
            notifyCommandLifecycle(uuid8, "started");
          if (command19.mode === "task-notification") {
            let notificationText = typeof command19.value === "string" ? command19.value : "", taskIdMatch = notificationText.match(/<task-id>([^<]+)<\/task-id>/), toolUseIdMatch = notificationText.match(/<tool-use-id>([^<]+)<\/tool-use-id>/), outputFileMatch = notificationText.match(/<output-file>([^<]+)<\/output-file>/), statusMatch = notificationText.match(/<status>([^<]+)<\/status>/), summaryMatch = notificationText.match(/<summary>([^<]+)<\/summary>/), isValidStatus = (s2) => s2 === "completed" || s2 === "failed" || s2 === "stopped" || s2 === "killed", rawStatus = statusMatch?.[1], status2 = isValidStatus(rawStatus) ? rawStatus === "killed" ? "stopped" : rawStatus : "completed", usageContent = notificationText.match(/<usage>([\s\S]*?)<\/usage>/)?.[1] ?? "", totalTokensMatch = usageContent.match(/<total_tokens>(\d+)<\/total_tokens>/), toolUsesMatch = usageContent.match(/<tool_uses>(\d+)<\/tool_uses>/), durationMsMatch = usageContent.match(/<duration_ms>(\d+)<\/duration_ms>/);
            if (statusMatch)
              output.enqueue({
                type: "system",
                subtype: "task_notification",
                task_id: taskIdMatch?.[1] ?? "",
                tool_use_id: toolUseIdMatch?.[1],
                status: status2,
                output_file: outputFileMatch?.[1] ?? "",
                summary: summaryMatch?.[1] ?? "",
                usage: totalTokensMatch && toolUsesMatch ? {
                  total_tokens: parseInt(totalTokensMatch[1], 10),
                  tool_uses: parseInt(toolUsesMatch[1], 10),
                  duration_ms: durationMsMatch ? parseInt(durationMsMatch[1], 10) : 0
                } : void 0,
                session_id: getSessionId(),
                uuid: randomUUID48()
              });
          }
          let input = command19.value;
          if (structuredIO instanceof RemoteIO && command19.mode === "prompt")
            logEvent("tengu_bridge_message_received", {
              is_repl: !1
            });
          if (suggestionState.abortController?.abort(), suggestionState.abortController = null, suggestionState.pendingSuggestion = null, suggestionState.pendingLastEmittedEntry = null, suggestionState.lastEmitted) {
            if (command19.mode === "prompt") {
              let inputText = typeof input === "string" ? input : input.find((b) => b.type === "text")?.text;
              if (typeof inputText === "string")
                logSuggestionOutcome(suggestionState.lastEmitted.text, inputText, suggestionState.lastEmitted.emittedAt, suggestionState.lastEmitted.promptId, suggestionState.lastEmitted.generationRequestId);
              suggestionState.lastEmitted = null;
            }
          }
          abortController = createAbortController();
          let turnStartTime = void 0;
          headlessProfilerCheckpoint("before_ask"), startQueryProfile();
          let cmd = command19;
          await runWithWorkload(cmd.workload ?? options2.workload, async () => {
            for await (let message of ask({
              commands: uniqBy_default([...currentCommands, ...appState.mcp.commands], "name"),
              prompt: input,
              promptUuid: cmd.uuid,
              isMeta: cmd.isMeta,
              cwd: cwd2(),
              tools: allTools,
              verbose: options2.verbose,
              mcpClients: allMcpClients,
              thinkingConfig: options2.thinkingConfig,
              maxTurns: options2.maxTurns,
              maxBudgetUsd: options2.maxBudgetUsd,
              taskBudget: options2.taskBudget,
              canUseTool,
              userSpecifiedModel: activeUserSpecifiedModel,
              fallbackModel: options2.fallbackModel,
              jsonSchema: getInitJsonSchema() ?? options2.jsonSchema,
              mutableMessages,
              getReadFileCache: () => pendingSeeds.size === 0 ? readFileState : mergeFileStateCaches(readFileState, pendingSeeds),
              setReadFileCache: (cache9) => {
                readFileState = cache9;
                for (let [path27, seed] of pendingSeeds.entries()) {
                  let existing = readFileState.get(path27);
                  if (!existing || seed.timestamp > existing.timestamp)
                    readFileState.set(path27, seed);
                }
                pendingSeeds.clear();
              },
              customSystemPrompt: options2.systemPrompt,
              appendSystemPrompt: options2.appendSystemPrompt,
              getAppState,
              setAppState,
              abortController,
              replayUserMessages: options2.replayUserMessages,
              includePartialMessages: options2.includePartialMessages,
              handleElicitation: (serverName, params, elicitSignal) => structuredIO.handleElicitation(serverName, params.message, void 0, elicitSignal, params.mode, params.url, "elicitationId" in params ? params.elicitationId : void 0),
              agents: currentAgents,
              orphanedPermission: cmd.orphanedPermission,
              setSDKStatus: (status2) => {
                output.enqueue({
                  type: "system",
                  subtype: "status",
                  status: status2,
                  session_id: getSessionId(),
                  uuid: randomUUID48()
                });
              }
            }))
              if (message.type === "result") {
                for (let event of drainSdkEvents())
                  output.enqueue(event);
                let currentState2 = getAppState();
                if (getRunningTasks(currentState2).some((t2) => (t2.type === "local_agent" || t2.type === "local_workflow") && isBackgroundTask(t2)))
                  heldBackResult = message;
                else
                  heldBackResult = null, output.enqueue(message);
              } else {
                for (let event of drainSdkEvents())
                  output.enqueue(event);
                output.enqueue(message);
              }
          });
          for (let uuid8 of batchUuids)
            notifyCommandLifecycle(uuid8, "completed");
          if (options2.promptSuggestions && !isEnvDefinedFalsy(process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION)) {
            suggestionState.abortController?.abort();
            let localAbort = new AbortController;
            suggestionState.abortController = localAbort;
            let cacheSafeParams = getLastCacheSafeParams();
            if (!cacheSafeParams)
              logSuggestionSuppressed("sdk_no_params", void 0, void 0, "sdk");
            else {
              let ref = { promise: null };
              ref.promise = (async () => {
                try {
                  let result = await tryGenerateSuggestion(localAbort, mutableMessages, getAppState, cacheSafeParams, "sdk");
                  if (!result || localAbort.signal.aborted)
                    return;
                  let suggestionMsg = {
                    type: "prompt_suggestion",
                    suggestion: result.suggestion,
                    uuid: randomUUID48(),
                    session_id: getSessionId()
                  }, lastEmittedEntry = {
                    text: result.suggestion,
                    emittedAt: Date.now(),
                    promptId: result.promptId,
                    generationRequestId: result.generationRequestId
                  };
                  if (heldBackResult)
                    suggestionState.pendingSuggestion = suggestionMsg, suggestionState.pendingLastEmittedEntry = {
                      text: lastEmittedEntry.text,
                      promptId: lastEmittedEntry.promptId,
                      generationRequestId: lastEmittedEntry.generationRequestId
                    };
                  else
                    suggestionState.lastEmitted = lastEmittedEntry, output.enqueue(suggestionMsg);
                } catch (error44) {
                  if (error44 instanceof Error && (error44.name === "AbortError" || error44.name === "APIUserAbortError")) {
                    logSuggestionSuppressed("aborted", void 0, void 0, "sdk");
                    return;
                  }
                  logError2(toError(error44));
                } finally {
                  if (suggestionState.inflightPromise === ref.promise)
                    suggestionState.inflightPromise = null;
                }
              })(), suggestionState.inflightPromise = ref.promise;
            }
          }
          logHeadlessProfilerTurn(), logQueryProfileReport(), headlessProfilerStartTurn();
        }
      };
      do {
        for (let event of drainSdkEvents())
          output.enqueue(event);
        runPhase = "draining_commands", await drainCommandQueue(), waitingForAgents = !1;
        {
          let state4 = getAppState(), hasRunningBg = getRunningTasks(state4).some((t2) => isBackgroundTask(t2) && t2.type !== "in_process_teammate"), hasMainThreadQueued = peek(isMainThread) !== void 0;
          if (hasRunningBg || hasMainThreadQueued) {
            if (waitingForAgents = !0, !hasMainThreadQueued)
              runPhase = "waiting_for_agents", await sleep3(100);
          }
        }
      } while (waitingForAgents);
      if (heldBackResult) {
        if (output.enqueue(heldBackResult), heldBackResult = null, suggestionState.pendingSuggestion) {
          if (output.enqueue(suggestionState.pendingSuggestion), suggestionState.pendingLastEmittedEntry)
            suggestionState.lastEmitted = {
              ...suggestionState.pendingLastEmittedEntry,
              emittedAt: Date.now()
            }, suggestionState.pendingLastEmittedEntry = null;
          suggestionState.pendingSuggestion = null;
        }
      }
    } catch (error44) {
      try {
        await structuredIO.write({
          type: "result",
          subtype: "error_during_execution",
          duration_ms: 0,
          duration_api_ms: 0,
          is_error: !0,
          num_turns: 0,
          stop_reason: null,
          session_id: getSessionId(),
          total_cost_usd: 0,
          usage: EMPTY_USAGE,
          modelUsage: {},
          permission_denials: [],
          uuid: randomUUID48(),
          errors: [
            errorMessage(error44),
            ...getInMemoryErrors().map((_) => _.error)
          ]
        });
      } catch {}
      suggestionState.abortController?.abort(), gracefulShutdownSync(1);
      return;
    } finally {
      if (runPhase = "finally_flush", await structuredIO.flushInternalEvents(), runPhase = "finally_post_flush", !isShuttingDown()) {
        notifySessionStateChanged("idle");
        for (let event of drainSdkEvents())
          output.enqueue(event);
      }
      running = !1, idleTimeout.start();
    }
    if (proactiveModule8?.isProactiveActive() && !proactiveModule8.isProactivePaused()) {
      if (peek(isMainThread) === void 0 && !inputClosed) {
        scheduleProactiveTick();
        return;
      }
    }
    if (peek(isMainThread) !== void 0) {
      run();
      return;
    }
    {
      let teamContext = getAppState().teamContext;
      if (teamContext && isTeamLead(teamContext))
        while (!0) {
          let refreshedState = getAppState();
          if (!(hasActiveInProcessTeammates(refreshedState) || refreshedState.teamContext && Object.keys(refreshedState.teamContext.teammates).length > 0)) {
            logForDebugging("[print.ts] No more active teammates, stopping poll");
            break;
          }
          let unread = await readUnreadMessages("team-lead", refreshedState.teamContext?.teamName);
          if (unread.length > 0) {
            logForDebugging(`[print.ts] Team-lead found ${unread.length} unread messages`), await markMessagesAsRead("team-lead", refreshedState.teamContext?.teamName);
            let teamName = refreshedState.teamContext?.teamName;
            for (let m4 of unread) {
              let shutdownApproval = isShutdownApproved(m4.text);
              if (shutdownApproval && teamName) {
                let teammateToRemove = shutdownApproval.from;
                logForDebugging(`[print.ts] Processing shutdown_approved from ${teammateToRemove}`);
                let teammateId = refreshedState.teamContext?.teammates ? Object.entries(refreshedState.teamContext.teammates).find(([, t2]) => t2.name === teammateToRemove)?.[0] : void 0;
                if (teammateId)
                  removeTeammateFromTeamFile(teamName, {
                    agentId: teammateId,
                    name: teammateToRemove
                  }), logForDebugging(`[print.ts] Removed ${teammateToRemove} from team file`), await unassignTeammateTasks(teamName, teammateId, teammateToRemove, "shutdown"), setAppState((prev) => {
                    if (!prev.teamContext?.teammates)
                      return prev;
                    if (!(teammateId in prev.teamContext.teammates))
                      return prev;
                    let { [teammateId]: _, ...remainingTeammates } = prev.teamContext.teammates;
                    return {
                      ...prev,
                      teamContext: {
                        ...prev.teamContext,
                        teammates: remainingTeammates
                      }
                    };
                  });
              }
            }
            let formatted = unread.map((m4) => `<${TEAMMATE_MESSAGE_TAG} teammate_id="${m4.from}"${m4.color ? ` color="${m4.color}"` : ""}>
${m4.text}
</${TEAMMATE_MESSAGE_TAG}>`).join(`

`);
            enqueue({
              mode: "prompt",
              value: formatted,
              uuid: randomUUID48()
            }), run();
            return;
          }
          if (inputClosed && !shutdownPromptInjected) {
            shutdownPromptInjected = !0, logForDebugging("[print.ts] Input closed with active teammates, injecting shutdown prompt"), enqueue({
              mode: "prompt",
              value: SHUTDOWN_TEAM_PROMPT,
              uuid: randomUUID48()
            }), run();
            return;
          }
          await sleep3(500);
        }
    }
    if (inputClosed)
      if (await (async () => {
        let currentAppState = getAppState();
        if (hasWorkingInProcessTeammates(currentAppState))
          await waitForTeammatesToBecomeIdle(setAppState, currentAppState);
        let refreshedAppState = getAppState(), refreshedTeamContext = refreshedAppState.teamContext;
        return refreshedTeamContext && Object.keys(refreshedTeamContext.teammates).length > 0 || hasActiveInProcessTeammates(refreshedAppState);
      })())
        enqueue({
          mode: "prompt",
          value: SHUTDOWN_TEAM_PROMPT,
          uuid: randomUUID48()
        }), run();
      else {
        if (suggestionState.inflightPromise)
          await Promise.race([suggestionState.inflightPromise, sleep3(5000)]);
        suggestionState.abortController?.abort(), suggestionState.abortController = null, await finalizePendingAsyncHooks(), unsubscribeSkillChanges(), unsubscribeAuthStatus?.(), statusListeners.delete(rateLimitListener), output.done();
      }
  }, cronScheduler = null, sendControlResponseSuccess = function(message, response7) {
    output.enqueue({
      type: "control_response",
      response: {
        subtype: "success",
        request_id: message.request_id,
        response: response7
      }
    });
  }, sendControlResponseError = function(message, errorMessage4) {
    output.enqueue({
      type: "control_response",
      response: {
        subtype: "error",
        request_id: message.request_id,
        error: errorMessage4
      }
    });
  }, handledOrphanedToolUseIds = /* @__PURE__ */ new Set;
  structuredIO.setUnexpectedResponseCallback(async (message) => {
    await handleOrphanedPermissionResponse({
      message,
      setAppState,
      handledToolUseIds: handledOrphanedToolUseIds,
      onEnqueued: () => {
        run();
      }
    });
  });
  let activeOAuthFlows = /* @__PURE__ */ new Map, oauthCallbackSubmitters = /* @__PURE__ */ new Map, oauthManualCallbackUsed = /* @__PURE__ */ new Set, oauthAuthPromises = /* @__PURE__ */ new Map, claudeOAuth = null;
  return (async () => {
    let initialized6 = !1;
    logForDiagnosticsNoPII("info", "cli_message_loop_started");
    for await (let message of structuredIO.structuredInput) {
      let eventId = "uuid" in message ? message.uuid : void 0;
      if (eventId && message.type !== "user" && message.type !== "control_response")
        notifyCommandLifecycle(eventId, "completed");
      if (message.type === "control_request") {
        if (message.request.subtype === "interrupt") {
          if (abortController)
            abortController.abort();
          suggestionState.abortController?.abort(), suggestionState.abortController = null, suggestionState.lastEmitted = null, suggestionState.pendingSuggestion = null, sendControlResponseSuccess(message);
        } else if (message.request.subtype === "end_session") {
          if (logForDebugging(`[print.ts] end_session received, reason=${message.request.reason ?? "unspecified"}`), abortController)
            abortController.abort();
          suggestionState.abortController?.abort(), suggestionState.abortController = null, suggestionState.lastEmitted = null, suggestionState.pendingSuggestion = null, sendControlResponseSuccess(message);
          break;
        } else if (message.request.subtype === "initialize") {
          if (message.request.sdkMcpServers && message.request.sdkMcpServers.length > 0)
            for (let serverName of message.request.sdkMcpServers)
              sdkMcpConfigs[serverName] = {
                type: "sdk",
                name: serverName
              };
          if (await handleInitializeRequest(message.request, message.request_id, initialized6, output, commands7, modelInfos, structuredIO, !!options2.enableAuthStatus, options2, agents2, getAppState), message.request.promptSuggestions)
            setAppState((prev) => {
              if (prev.promptSuggestionEnabled)
                return prev;
              return { ...prev, promptSuggestionEnabled: !0 };
            });
          if (message.request.agentProgressSummaries)
            setSdkAgentProgressSummariesEnabled(!0);
          if (initialized6 = !0, hasCommandsInQueue())
            run();
        } else if (message.request.subtype === "set_permission_mode") {
          let m4 = message.request;
          setAppState((prev) => ({
            ...prev,
            toolPermissionContext: handleSetPermissionMode(m4, message.request_id, prev.toolPermissionContext, output),
            isUltraplanMode: m4.ultraplan ?? prev.isUltraplanMode
          }));
        } else if (message.request.subtype === "set_model") {
          let requestedModel = message.request.model ?? "default", model = requestedModel === "default" ? getDefaultMainLoopModel() : requestedModel;
          activeUserSpecifiedModel = model, setMainLoopModelOverride(model), notifySessionMetadataChanged({ model }), injectModelSwitchBreadcrumbs(requestedModel, model), sendControlResponseSuccess(message);
        } else if (message.request.subtype === "set_max_thinking_tokens") {
          if (message.request.max_thinking_tokens === null)
            options2.thinkingConfig = void 0;
          else if (message.request.max_thinking_tokens === 0)
            options2.thinkingConfig = { type: "disabled" };
          else
            options2.thinkingConfig = {
              type: "enabled",
              budgetTokens: message.request.max_thinking_tokens
            };
          sendControlResponseSuccess(message);
        } else if (message.request.subtype === "mcp_status")
          sendControlResponseSuccess(message, {
            mcpServers: buildMcpServerStatuses()
          });
        else if (message.request.subtype === "get_context_usage")
          try {
            let appState = getAppState(), data = await collectContextData({
              messages: mutableMessages,
              getAppState,
              options: {
                mainLoopModel: getMainLoopModel(),
                tools: buildAllTools(appState),
                agentDefinitions: appState.agentDefinitions,
                customSystemPrompt: options2.systemPrompt,
                appendSystemPrompt: options2.appendSystemPrompt
              }
            });
            sendControlResponseSuccess(message, { ...data });
          } catch (error44) {
            sendControlResponseError(message, errorMessage(error44));
          }
        else if (message.request.subtype === "mcp_message") {
          let mcpRequest = message.request, sdkClient = sdkClients.find((client16) => client16.name === mcpRequest.server_name);
          if (sdkClient && sdkClient.type === "connected" && sdkClient.client?.transport?.onmessage)
            sdkClient.client.transport.onmessage(mcpRequest.message);
          sendControlResponseSuccess(message);
        } else if (message.request.subtype === "rewind_files") {
          let appState = getAppState(), result = await handleRewindFiles(message.request.user_message_id, appState, setAppState, message.request.dry_run ?? !1);
          if (result.canRewind || message.request.dry_run)
            sendControlResponseSuccess(message, result);
          else
            sendControlResponseError(message, result.error ?? "Unexpected error");
        } else if (message.request.subtype === "cancel_async_message") {
          let targetUuid = message.request.message_uuid, removed = dequeueAllMatching((cmd) => cmd.uuid === targetUuid);
          sendControlResponseSuccess(message, {
            cancelled: removed.length > 0
          });
        } else if (message.request.subtype === "seed_read_state") {
          try {
            let normalizedPath = expandPath(message.request.path), diskMtime = Math.floor((await stat45(normalizedPath)).mtimeMs);
            if (diskMtime <= message.request.mtime) {
              let raw = await readFile55(normalizedPath, "utf-8"), content = (raw.charCodeAt(0) === 65279 ? raw.slice(1) : raw).replaceAll(`\r
`, `
`);
              pendingSeeds.set(normalizedPath, {
                content,
                timestamp: diskMtime,
                offset: void 0,
                limit: void 0
              });
            }
          } catch {}
          sendControlResponseSuccess(message);
        } else if (message.request.subtype === "mcp_set_servers") {
          let { response: response7, sdkServersChanged } = await applyMcpServerChanges(message.request.servers);
          if (sendControlResponseSuccess(message, response7), sdkServersChanged)
            updateSdkMcp();
        } else if (message.request.subtype === "reload_plugins")
          try {
            let r4 = await refreshActivePlugins(setAppState), sdkAgents = currentAgents.filter((a2) => a2.source === "flagSettings");
            currentAgents = [...r4.agentDefinitions.allAgents, ...sdkAgents];
            let plugins = [], [cmdsR, mcpR, pluginsR] = await Promise.allSettled([
              getCommands(cwd2()),
              applyPluginMcpDiff(),
              loadAllPluginsCacheOnly()
            ]);
            if (cmdsR.status === "fulfilled")
              currentCommands = cmdsR.value;
            else
              logError2(cmdsR.reason);
            if (mcpR.status === "rejected")
              logError2(mcpR.reason);
            if (pluginsR.status === "fulfilled")
              plugins = pluginsR.value.enabled.map((p4) => ({
                name: p4.name,
                path: p4.path,
                source: p4.source
              }));
            else
              logError2(pluginsR.reason);
            sendControlResponseSuccess(message, {
              commands: currentCommands.filter((cmd) => cmd.userInvocable !== !1).map((cmd) => ({
                name: getCommandName(cmd),
                description: formatDescriptionWithSource(cmd),
                argumentHint: cmd.argumentHint || ""
              })),
              agents: currentAgents.map((a2) => ({
                name: a2.agentType,
                description: a2.whenToUse,
                model: a2.model === "inherit" ? void 0 : a2.model
              })),
              plugins,
              mcpServers: buildMcpServerStatuses(),
              error_count: r4.error_count
            });
          } catch (error44) {
            sendControlResponseError(message, errorMessage(error44));
          }
        else if (message.request.subtype === "mcp_reconnect") {
          let currentAppState = getAppState(), { serverName } = message.request;
          elicitationRegistered.delete(serverName);
          let config11 = getMcpConfigByName(serverName) ?? mcpClients.find((c3) => c3.name === serverName)?.config ?? sdkClients.find((c3) => c3.name === serverName)?.config ?? dynamicMcpState.clients.find((c3) => c3.name === serverName)?.config ?? currentAppState.mcp.clients.find((c3) => c3.name === serverName)?.config ?? null;
          if (!config11)
            sendControlResponseError(message, `Server not found: ${serverName}`);
          else {
            let result = await reconnectMcpServerImpl(serverName, config11), prefix = getMcpPrefix(serverName);
            if (setAppState((prev) => ({
              ...prev,
              mcp: {
                ...prev.mcp,
                clients: prev.mcp.clients.map((c3) => c3.name === serverName ? result.client : c3),
                tools: [
                  ...reject_default(prev.mcp.tools, (t2) => t2.name?.startsWith(prefix)),
                  ...result.tools
                ],
                commands: [
                  ...reject_default(prev.mcp.commands, (c3) => commandBelongsToServer(c3, serverName)),
                  ...result.commands
                ],
                resources: result.resources && result.resources.length > 0 ? { ...prev.mcp.resources, [serverName]: result.resources } : omit_default(prev.mcp.resources, serverName)
              }
            })), dynamicMcpState = {
              ...dynamicMcpState,
              clients: [
                ...dynamicMcpState.clients.filter((c3) => c3.name !== serverName),
                result.client
              ],
              tools: [
                ...dynamicMcpState.tools.filter((t2) => !t2.name?.startsWith(prefix)),
                ...result.tools
              ]
            }, result.client.type === "connected")
              registerElicitationHandlers([result.client]), reregisterChannelHandlerAfterReconnect(result.client), sendControlResponseSuccess(message);
            else {
              let errorMessage4 = result.client.type === "failed" ? result.client.error ?? "Connection failed" : `Server status: ${result.client.type}`;
              sendControlResponseError(message, errorMessage4);
            }
          }
        } else if (message.request.subtype === "mcp_toggle") {
          let currentAppState = getAppState(), { serverName, enabled: enabled2 } = message.request;
          elicitationRegistered.delete(serverName);
          let config11 = getMcpConfigByName(serverName) ?? mcpClients.find((c3) => c3.name === serverName)?.config ?? sdkClients.find((c3) => c3.name === serverName)?.config ?? dynamicMcpState.clients.find((c3) => c3.name === serverName)?.config ?? currentAppState.mcp.clients.find((c3) => c3.name === serverName)?.config ?? null;
          if (!config11)
            sendControlResponseError(message, `Server not found: ${serverName}`);
          else if (!enabled2) {
            setMcpServerEnabled(serverName, !1);
            let client16 = [
              ...mcpClients,
              ...sdkClients,
              ...dynamicMcpState.clients,
              ...currentAppState.mcp.clients
            ].find((c3) => c3.name === serverName);
            if (client16 && client16.type === "connected")
              await clearServerCache(serverName, config11);
            let prefix = getMcpPrefix(serverName);
            setAppState((prev) => ({
              ...prev,
              mcp: {
                ...prev.mcp,
                clients: prev.mcp.clients.map((c3) => c3.name === serverName ? { name: serverName, type: "disabled", config: config11 } : c3),
                tools: reject_default(prev.mcp.tools, (t2) => t2.name?.startsWith(prefix)),
                commands: reject_default(prev.mcp.commands, (c3) => commandBelongsToServer(c3, serverName)),
                resources: omit_default(prev.mcp.resources, serverName)
              }
            })), sendControlResponseSuccess(message);
          } else {
            setMcpServerEnabled(serverName, !0);
            let result = await reconnectMcpServerImpl(serverName, config11), prefix = getMcpPrefix(serverName);
            if (setAppState((prev) => ({
              ...prev,
              mcp: {
                ...prev.mcp,
                clients: prev.mcp.clients.map((c3) => c3.name === serverName ? result.client : c3),
                tools: [
                  ...reject_default(prev.mcp.tools, (t2) => t2.name?.startsWith(prefix)),
                  ...result.tools
                ],
                commands: [
                  ...reject_default(prev.mcp.commands, (c3) => commandBelongsToServer(c3, serverName)),
                  ...result.commands
                ],
                resources: result.resources && result.resources.length > 0 ? { ...prev.mcp.resources, [serverName]: result.resources } : omit_default(prev.mcp.resources, serverName)
              }
            })), result.client.type === "connected")
              registerElicitationHandlers([result.client]), reregisterChannelHandlerAfterReconnect(result.client), sendControlResponseSuccess(message);
            else {
              let errorMessage4 = result.client.type === "failed" ? result.client.error ?? "Connection failed" : `Server status: ${result.client.type}`;
              sendControlResponseError(message, errorMessage4);
            }
          }
        } else if (message.request.subtype === "channel_enable") {
          let currentAppState = getAppState();
          handleChannelEnable(message.request_id, message.request.serverName, [
            ...currentAppState.mcp.clients,
            ...sdkClients,
            ...dynamicMcpState.clients
          ], output);
        } else if (message.request.subtype === "mcp_authenticate") {
          let { serverName } = message.request, currentAppState = getAppState(), config11 = getMcpConfigByName(serverName) ?? mcpClients.find((c3) => c3.name === serverName)?.config ?? currentAppState.mcp.clients.find((c3) => c3.name === serverName)?.config ?? null;
          if (!config11)
            sendControlResponseError(message, `Server not found: ${serverName}`);
          else if (config11.type !== "sse" && config11.type !== "http")
            sendControlResponseError(message, `Server type "${config11.type}" does not support OAuth authentication`);
          else
            try {
              activeOAuthFlows.get(serverName)?.abort();
              let controller = new AbortController;
              activeOAuthFlows.set(serverName, controller);
              let resolveAuthUrl, authUrlPromise = new Promise((resolve47) => {
                resolveAuthUrl = resolve47;
              }), oauthPromise = performMCPOAuthFlow(serverName, config11, (url3) => resolveAuthUrl(url3), controller.signal, {
                skipBrowserOpen: !0,
                onWaitingForCallback: (submit) => {
                  oauthCallbackSubmitters.set(serverName, submit);
                }
              }), authUrl = await Promise.race([
                authUrlPromise,
                oauthPromise.then(() => null)
              ]);
              if (authUrl)
                sendControlResponseSuccess(message, {
                  authUrl,
                  requiresUserAction: !0
                });
              else
                sendControlResponseSuccess(message, {
                  requiresUserAction: !1
                });
              oauthAuthPromises.set(serverName, oauthPromise);
              let fullFlowPromise = oauthPromise.then(async () => {
                if (isMcpServerDisabled(serverName))
                  return;
                if (oauthManualCallbackUsed.has(serverName))
                  return;
                let result = await reconnectMcpServerImpl(serverName, config11), prefix = getMcpPrefix(serverName);
                setAppState((prev) => ({
                  ...prev,
                  mcp: {
                    ...prev.mcp,
                    clients: prev.mcp.clients.map((c3) => c3.name === serverName ? result.client : c3),
                    tools: [
                      ...reject_default(prev.mcp.tools, (t2) => t2.name?.startsWith(prefix)),
                      ...result.tools
                    ],
                    commands: [
                      ...reject_default(prev.mcp.commands, (c3) => commandBelongsToServer(c3, serverName)),
                      ...result.commands
                    ],
                    resources: result.resources && result.resources.length > 0 ? {
                      ...prev.mcp.resources,
                      [serverName]: result.resources
                    } : omit_default(prev.mcp.resources, serverName)
                  }
                })), dynamicMcpState = {
                  ...dynamicMcpState,
                  clients: [
                    ...dynamicMcpState.clients.filter((c3) => c3.name !== serverName),
                    result.client
                  ],
                  tools: [
                    ...dynamicMcpState.tools.filter((t2) => !t2.name?.startsWith(prefix)),
                    ...result.tools
                  ]
                };
              }).catch((error44) => {
                logForDebugging(`MCP OAuth failed for ${serverName}: ${error44}`, { level: "error" });
              }).finally(() => {
                if (activeOAuthFlows.get(serverName) === controller)
                  activeOAuthFlows.delete(serverName), oauthCallbackSubmitters.delete(serverName), oauthManualCallbackUsed.delete(serverName), oauthAuthPromises.delete(serverName);
              });
            } catch (error44) {
              sendControlResponseError(message, errorMessage(error44));
            }
        } else if (message.request.subtype === "mcp_oauth_callback_url") {
          let { serverName, callbackUrl } = message.request, submit = oauthCallbackSubmitters.get(serverName);
          if (submit) {
            let hasCodeOrError = !1;
            try {
              let parsed = new URL(callbackUrl);
              hasCodeOrError = parsed.searchParams.has("code") || parsed.searchParams.has("error");
            } catch {}
            if (!hasCodeOrError)
              sendControlResponseError(message, "Invalid callback URL: missing authorization code. Please paste the full redirect URL including the code parameter.");
            else {
              oauthManualCallbackUsed.add(serverName), submit(callbackUrl);
              let authPromise = oauthAuthPromises.get(serverName);
              if (authPromise)
                try {
                  await authPromise, sendControlResponseSuccess(message);
                } catch (error44) {
                  sendControlResponseError(message, error44 instanceof Error ? error44.message : "OAuth authentication failed");
                }
              else
                sendControlResponseSuccess(message);
            }
          } else
            sendControlResponseError(message, `No active OAuth flow for server: ${serverName}`);
        } else if (message.request.subtype === "claude_authenticate") {
          let { loginWithClaudeAi } = message.request;
          claudeOAuth?.service.cleanup(), logEvent("tengu_oauth_flow_start", {
            loginWithClaudeAi: loginWithClaudeAi ?? !0
          });
          let service = new OAuthService, urlResolver, urlPromise = new Promise((resolve47) => {
            urlResolver = resolve47;
          }), flow = service.startOAuthFlow(async (manualUrl, automaticUrl) => {
            urlResolver({ manualUrl, automaticUrl });
          }, {
            loginWithClaudeAi: loginWithClaudeAi ?? !0,
            skipBrowserOpen: !0
          }).then(async (tokens) => {
            await installOAuthTokens(tokens), logEvent("tengu_oauth_success", {
              loginWithClaudeAi: loginWithClaudeAi ?? !0
            });
          }).finally(() => {
            if (service.cleanup(), claudeOAuth?.service === service)
              claudeOAuth = null;
          });
          claudeOAuth = { service, flow }, flow.catch((err2) => logForDebugging(`claude_authenticate flow ended: ${err2}`, {
            level: "info"
          }));
          try {
            let { manualUrl, automaticUrl } = await Promise.race([
              urlPromise,
              flow.then(() => {
                throw Error("OAuth flow completed without producing auth URLs");
              })
            ]);
            sendControlResponseSuccess(message, {
              manualUrl,
              automaticUrl
            });
          } catch (error44) {
            sendControlResponseError(message, errorMessage(error44));
          }
        } else if (message.request.subtype === "claude_oauth_callback" || message.request.subtype === "claude_oauth_wait_for_completion")
          if (!claudeOAuth)
            sendControlResponseError(message, "No active claude_authenticate flow");
          else {
            if (message.request.subtype === "claude_oauth_callback")
              claudeOAuth.service.handleManualAuthCodeInput({
                authorizationCode: message.request.authorizationCode,
                state: message.request.state
              });
            let { flow } = claudeOAuth;
            flow.then(() => {
              let accountInfo = getAccountInformation();
              sendControlResponseSuccess(message, {
                account: {
                  email: accountInfo?.email,
                  organization: accountInfo?.organization,
                  subscriptionType: accountInfo?.subscription,
                  tokenSource: accountInfo?.tokenSource,
                  apiKeySource: accountInfo?.apiKeySource,
                  apiProvider: getAPIProvider()
                }
              });
            }, (error44) => sendControlResponseError(message, errorMessage(error44)));
          }
        else if (message.request.subtype === "mcp_clear_auth") {
          let { serverName } = message.request, currentAppState = getAppState(), config11 = getMcpConfigByName(serverName) ?? mcpClients.find((c3) => c3.name === serverName)?.config ?? currentAppState.mcp.clients.find((c3) => c3.name === serverName)?.config ?? null;
          if (!config11)
            sendControlResponseError(message, `Server not found: ${serverName}`);
          else if (config11.type !== "sse" && config11.type !== "http")
            sendControlResponseError(message, `Cannot clear auth for server type "${config11.type}"`);
          else {
            await revokeServerTokens(serverName, config11);
            let result = await reconnectMcpServerImpl(serverName, config11), prefix = getMcpPrefix(serverName);
            setAppState((prev) => ({
              ...prev,
              mcp: {
                ...prev.mcp,
                clients: prev.mcp.clients.map((c3) => c3.name === serverName ? result.client : c3),
                tools: [
                  ...reject_default(prev.mcp.tools, (t2) => t2.name?.startsWith(prefix)),
                  ...result.tools
                ],
                commands: [
                  ...reject_default(prev.mcp.commands, (c3) => commandBelongsToServer(c3, serverName)),
                  ...result.commands
                ],
                resources: result.resources && result.resources.length > 0 ? {
                  ...prev.mcp.resources,
                  [serverName]: result.resources
                } : omit_default(prev.mcp.resources, serverName)
              }
            })), sendControlResponseSuccess(message, {});
          }
        } else if (message.request.subtype === "apply_flag_settings") {
          let prevModel = getMainLoopModel(), existing = getFlagSettingsInline() ?? {}, incoming = message.request.settings, merged = { ...existing, ...incoming };
          for (let key3 of Object.keys(merged))
            if (merged[key3] === null)
              delete merged[key3];
          if (setFlagSettingsInline(merged), settingsChangeDetector.notifyChange("flagSettings"), "model" in incoming)
            if (incoming.model != null)
              setMainLoopModelOverride(String(incoming.model));
            else
              setMainLoopModelOverride(void 0);
          let newModel = getMainLoopModel();
          if (newModel !== prevModel) {
            activeUserSpecifiedModel = newModel;
            let modelArg = incoming.model ? String(incoming.model) : "default";
            notifySessionMetadataChanged({ model: newModel }), injectModelSwitchBreadcrumbs(modelArg, newModel);
          }
          sendControlResponseSuccess(message);
        } else if (message.request.subtype === "get_settings") {
          let currentAppState = getAppState(), model = getMainLoopModel(), effort = modelSupportsEffort(model) ? resolveAppliedEffort(model, currentAppState.effortValue) : void 0;
          sendControlResponseSuccess(message, {
            ...getSettingsWithSources(),
            applied: {
              model,
              effort: typeof effort === "string" ? effort : null
            }
          });
        } else if (message.request.subtype === "stop_task") {
          let { task_id: taskId } = message.request;
          try {
            await stopTask(taskId, {
              getAppState,
              setAppState
            }), sendControlResponseSuccess(message, {});
          } catch (error44) {
            sendControlResponseError(message, errorMessage(error44));
          }
        } else if (message.request.subtype === "generate_session_title") {
          let { description, persist } = message.request, titleSignal = (abortController && !abortController.signal.aborted ? abortController : createAbortController()).signal;
          (async () => {
            try {
              let title = await generateSessionTitle(description, titleSignal);
              if (title && persist)
                try {
                  saveAiGeneratedTitle(getSessionId(), title);
                } catch (e) {
                  logError2(e);
                }
              sendControlResponseSuccess(message, { title });
            } catch (e) {
              sendControlResponseError(message, errorMessage(e));
            }
          })();
        } else if (message.request.subtype === "side_question") {
          let { question } = message.request;
          (async () => {
            try {
              let saved = getLastCacheSafeParams(), cacheSafeParams = saved ? {
                ...saved,
                toolUseContext: {
                  ...saved.toolUseContext,
                  abortController: createAbortController()
                }
              } : await buildSideQuestionFallbackParams({
                tools: buildAllTools(getAppState()),
                commands: currentCommands,
                mcpClients: [
                  ...getAppState().mcp.clients,
                  ...sdkClients,
                  ...dynamicMcpState.clients
                ],
                messages: mutableMessages,
                readFileState,
                getAppState,
                setAppState,
                customSystemPrompt: options2.systemPrompt,
                appendSystemPrompt: options2.appendSystemPrompt,
                thinkingConfig: options2.thinkingConfig,
                agents: currentAgents
              }), result = await runSideQuestion({
                question,
                cacheSafeParams
              });
              sendControlResponseSuccess(message, { response: result.response });
            } catch (e) {
              sendControlResponseError(message, errorMessage(e));
            }
          })();
        } else if (message.request.subtype === "set_proactive") {
          if (message.request.enabled) {
            if (!proactiveModule8.isProactiveActive())
              proactiveModule8.activateProactive("command"), scheduleProactiveTick();
          } else
            proactiveModule8.deactivateProactive();
          sendControlResponseSuccess(message);
        } else if (message.request.subtype === "remote_control")
          sendControlResponseError(message, "Remote Control is not available in this build");
        else
          sendControlResponseError(message, `Unsupported control request subtype: ${message.request.subtype}`);
        continue;
      } else if (message.type === "control_response") {
        if (options2.replayUserMessages)
          output.enqueue(message);
        continue;
      } else if (message.type === "keep_alive")
        continue;
      else if (message.type === "update_environment_variables")
        continue;
      else if (message.type === "assistant" || message.type === "system") {
        let internalMsgs = toInternalMessages([message]);
        if (mutableMessages.push(...internalMsgs), message.type === "assistant" && options2.replayUserMessages)
          output.enqueue(message);
        continue;
      }
      if (message.type !== "user")
        continue;
      if (initialized6 = !0, message.uuid) {
        let sessionId = getSessionId(), existsInSession = await doesMessageExistInSession(sessionId, message.uuid);
        if (existsInSession || receivedMessageUuids.has(message.uuid)) {
          if (logForDebugging(`Skipping duplicate user message: ${message.uuid}`), options2.replayUserMessages)
            logForDebugging(`Sending acknowledgment for duplicate user message: ${message.uuid}`), output.enqueue({
              type: "user",
              message: message.message,
              session_id: sessionId,
              parent_tool_use_id: null,
              uuid: message.uuid,
              timestamp: message.timestamp,
              isReplay: !0
            });
          if (existsInSession)
            notifyCommandLifecycle(message.uuid, "completed");
          continue;
        }
        trackReceivedMessageUuid(message.uuid);
      }
      enqueue({
        mode: "prompt",
        value: await resolveAndPrepend(message, message.message.content),
        uuid: message.uuid,
        priority: message.priority
      }), run();
    }
    if (inputClosed = !0, cronScheduler?.stop(), !running) {
      if (suggestionState.inflightPromise)
        await Promise.race([suggestionState.inflightPromise, sleep3(5000)]);
      suggestionState.abortController?.abort(), suggestionState.abortController = null, await finalizePendingAsyncHooks(), unsubscribeSkillChanges(), unsubscribeAuthStatus?.(), statusListeners.delete(rateLimitListener), output.done();
    }
  })(), output;
}
