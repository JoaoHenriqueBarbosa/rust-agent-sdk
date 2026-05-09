// class: QueryEngine
class QueryEngine {
  config;
  mutableMessages;
  abortController;
  permissionDenials;
  totalUsage;
  hasHandledOrphanedPermission = !1;
  readFileState;
  discoveredSkillNames = /* @__PURE__ */ new Set;
  loadedNestedMemoryPaths = /* @__PURE__ */ new Set;
  constructor(config11) {
    this.config = config11, this.mutableMessages = config11.initialMessages ?? [], this.abortController = config11.abortController ?? createAbortController(), this.permissionDenials = [], this.readFileState = config11.readFileCache, this.totalUsage = EMPTY_USAGE;
  }
  async* submitMessage(prompt, options2) {
    let {
      cwd: cwd2,
      commands: commands7,
      tools,
      mcpClients,
      verbose = !1,
      thinkingConfig,
      maxTurns,
      maxBudgetUsd,
      taskBudget,
      canUseTool,
      customSystemPrompt,
      appendSystemPrompt,
      userSpecifiedModel,
      fallbackModel,
      jsonSchema,
      getAppState,
      setAppState,
      replayUserMessages = !1,
      includePartialMessages = !1,
      agents: agents2 = [],
      setSDKStatus,
      orphanedPermission
    } = this.config;
    this.discoveredSkillNames.clear(), setCwd(cwd2);
    let persistSession = !isSessionPersistenceDisabled(), startTime = Date.now(), wrappedCanUseTool = async (tool, input, toolUseContext, assistantMessage, toolUseID, forceDecision) => {
      let result2 = await canUseTool(tool, input, toolUseContext, assistantMessage, toolUseID, forceDecision);
      if (result2.behavior !== "allow")
        this.permissionDenials.push({
          tool_name: sdkCompatToolName(tool.name),
          tool_use_id: toolUseID,
          tool_input: input
        });
      return result2;
    }, initialAppState = getAppState(), initialMainLoopModel = userSpecifiedModel ? parseUserSpecifiedModel(userSpecifiedModel) : getMainLoopModel(), initialThinkingConfig = thinkingConfig ? thinkingConfig : shouldEnableThinkingByDefault() !== !1 ? { type: "adaptive" } : { type: "disabled" };
    headlessProfilerCheckpoint("before_getSystemPrompt");
    let customPrompt = typeof customSystemPrompt === "string" ? customSystemPrompt : void 0, {
      defaultSystemPrompt,
      userContext: baseUserContext,
      systemContext
    } = await fetchSystemPromptParts({
      tools,
      mainLoopModel: initialMainLoopModel,
      additionalWorkingDirectories: Array.from(initialAppState.toolPermissionContext.additionalWorkingDirectories.keys()),
      mcpClients,
      customSystemPrompt: customPrompt
    });
    headlessProfilerCheckpoint("after_getSystemPrompt");
    let userContext = {
      ...baseUserContext,
      ...getCoordinatorUserContext2(mcpClients, isScratchpadEnabled() ? getScratchpadDir() : void 0)
    }, memoryMechanicsPrompt = customPrompt !== void 0 && hasAutoMemPathOverride() ? await loadMemoryPrompt() : null, systemPrompt = asSystemPrompt([
      ...customPrompt !== void 0 ? [customPrompt] : defaultSystemPrompt,
      ...memoryMechanicsPrompt ? [memoryMechanicsPrompt] : [],
      ...appendSystemPrompt ? [appendSystemPrompt] : []
    ]), hasStructuredOutputTool = tools.some((t2) => toolMatchesName(t2, SYNTHETIC_OUTPUT_TOOL_NAME));
    if (jsonSchema && hasStructuredOutputTool)
      registerStructuredOutputEnforcement(setAppState, getSessionId());
    let processUserInputContext = {
      messages: this.mutableMessages,
      setMessages: (fn) => {
        this.mutableMessages = fn(this.mutableMessages);
      },
      onChangeAPIKey: () => {},
      handleElicitation: this.config.handleElicitation,
      options: {
        commands: commands7,
        debug: !1,
        tools,
        verbose,
        mainLoopModel: initialMainLoopModel,
        thinkingConfig: initialThinkingConfig,
        mcpClients,
        mcpResources: {},
        ideInstallationStatus: null,
        isNonInteractiveSession: !0,
        customSystemPrompt,
        appendSystemPrompt,
        agentDefinitions: { activeAgents: agents2, allAgents: [] },
        theme: resolveThemeSetting(getGlobalConfig().theme),
        maxBudgetUsd
      },
      getAppState,
      setAppState,
      abortController: this.abortController,
      readFileState: this.readFileState,
      nestedMemoryAttachmentTriggers: /* @__PURE__ */ new Set,
      loadedNestedMemoryPaths: this.loadedNestedMemoryPaths,
      dynamicSkillDirTriggers: /* @__PURE__ */ new Set,
      discoveredSkillNames: this.discoveredSkillNames,
      setInProgressToolUseIDs: () => {},
      setResponseLength: () => {},
      updateFileHistoryState: (updater) => {
        setAppState((prev) => {
          let updated = updater(prev.fileHistory);
          if (updated === prev.fileHistory)
            return prev;
          return { ...prev, fileHistory: updated };
        });
      },
      updateAttributionState: (updater) => {
        setAppState((prev) => {
          let updated = updater(prev.attribution);
          if (updated === prev.attribution)
            return prev;
          return { ...prev, attribution: updated };
        });
      },
      setSDKStatus
    };
    if (orphanedPermission && !this.hasHandledOrphanedPermission) {
      this.hasHandledOrphanedPermission = !0;
      for await (let message of handleOrphanedPermission(orphanedPermission, tools, this.mutableMessages, processUserInputContext))
        yield message;
    }
    let {
      messages: messagesFromUserInput,
      shouldQuery,
      allowedTools,
      model: modelFromUserInput,
      resultText
    } = await processUserInput({
      input: prompt,
      mode: "prompt",
      setToolJSX: () => {},
      context: {
        ...processUserInputContext,
        messages: this.mutableMessages
      },
      messages: this.mutableMessages,
      uuid: options2?.uuid,
      isMeta: options2?.isMeta,
      querySource: "sdk"
    });
    this.mutableMessages.push(...messagesFromUserInput);
    let messages = [...this.mutableMessages];
    if (persistSession && messagesFromUserInput.length > 0) {
      let transcriptPromise = recordTranscript(messages);
      if (isBareMode())
        ;
      else if (await transcriptPromise, isEnvTruthy(process.env.CLAUDE_CODE_EAGER_FLUSH) || isEnvTruthy(process.env.CLAUDE_CODE_IS_COWORK))
        await flushSessionStorage();
    }
    let replayableMessages = messagesFromUserInput.filter((msg) => msg.type === "user" && !msg.isMeta && !msg.toolUseResult && messageSelector().selectableUserMessagesFilter(msg) || msg.type === "system" && msg.subtype === "compact_boundary"), messagesToAck = replayUserMessages ? replayableMessages : [];
    setAppState((prev) => ({
      ...prev,
      toolPermissionContext: {
        ...prev.toolPermissionContext,
        alwaysAllowRules: {
          ...prev.toolPermissionContext.alwaysAllowRules,
          command: allowedTools
        }
      }
    }));
    let mainLoopModel = modelFromUserInput ?? initialMainLoopModel;
    processUserInputContext = {
      messages,
      setMessages: () => {},
      onChangeAPIKey: () => {},
      handleElicitation: this.config.handleElicitation,
      options: {
        commands: commands7,
        debug: !1,
        tools,
        verbose,
        mainLoopModel,
        thinkingConfig: initialThinkingConfig,
        mcpClients,
        mcpResources: {},
        ideInstallationStatus: null,
        isNonInteractiveSession: !0,
        customSystemPrompt,
        appendSystemPrompt,
        theme: resolveThemeSetting(getGlobalConfig().theme),
        agentDefinitions: { activeAgents: agents2, allAgents: [] },
        maxBudgetUsd
      },
      getAppState,
      setAppState,
      abortController: this.abortController,
      readFileState: this.readFileState,
      nestedMemoryAttachmentTriggers: /* @__PURE__ */ new Set,
      loadedNestedMemoryPaths: this.loadedNestedMemoryPaths,
      dynamicSkillDirTriggers: /* @__PURE__ */ new Set,
      discoveredSkillNames: this.discoveredSkillNames,
      setInProgressToolUseIDs: () => {},
      setResponseLength: () => {},
      updateFileHistoryState: processUserInputContext.updateFileHistoryState,
      updateAttributionState: processUserInputContext.updateAttributionState,
      setSDKStatus
    }, headlessProfilerCheckpoint("before_skills_plugins");
    let [skills2, { enabled: enabledPlugins }] = await Promise.all([
      getSlashCommandToolSkills(getCwd()),
      loadAllPluginsCacheOnly()
    ]);
    if (headlessProfilerCheckpoint("after_skills_plugins"), yield buildSystemInitMessage({
      tools,
      mcpClients,
      model: mainLoopModel,
      permissionMode: initialAppState.toolPermissionContext.mode,
      commands: commands7,
      agents: agents2,
      skills: skills2,
      plugins: enabledPlugins,
      fastMode: initialAppState.fastMode
    }), headlessProfilerCheckpoint("system_message_yielded"), !shouldQuery) {
      for (let msg of messagesFromUserInput) {
        if (msg.type === "user" && typeof msg.message.content === "string" && (msg.message.content.includes(`<${LOCAL_COMMAND_STDOUT_TAG}>`) || msg.message.content.includes(`<${LOCAL_COMMAND_STDERR_TAG}>`) || msg.isCompactSummary))
          yield {
            type: "user",
            message: {
              ...msg.message,
              content: stripAnsi(msg.message.content)
            },
            session_id: getSessionId(),
            parent_tool_use_id: null,
            uuid: msg.uuid,
            timestamp: msg.timestamp,
            isReplay: !msg.isCompactSummary,
            isSynthetic: msg.isMeta || msg.isVisibleInTranscriptOnly
          };
        if (msg.type === "system" && msg.subtype === "local_command" && typeof msg.content === "string" && (msg.content.includes(`<${LOCAL_COMMAND_STDOUT_TAG}>`) || msg.content.includes(`<${LOCAL_COMMAND_STDERR_TAG}>`)))
          yield localCommandOutputToSDKAssistantMessage(msg.content, msg.uuid);
        if (msg.type === "system" && msg.subtype === "compact_boundary")
          yield {
            type: "system",
            subtype: "compact_boundary",
            session_id: getSessionId(),
            uuid: msg.uuid,
            compact_metadata: toSDKCompactMetadata(msg.compactMetadata)
          };
      }
      if (persistSession) {
        if (await recordTranscript(messages), isEnvTruthy(process.env.CLAUDE_CODE_EAGER_FLUSH) || isEnvTruthy(process.env.CLAUDE_CODE_IS_COWORK))
          await flushSessionStorage();
      }
      yield {
        type: "result",
        subtype: "success",
        is_error: !1,
        duration_ms: Date.now() - startTime,
        duration_api_ms: getTotalAPIDuration(),
        num_turns: messages.length - 1,
        result: resultText ?? "",
        stop_reason: null,
        session_id: getSessionId(),
        total_cost_usd: getTotalCostUSD(),
        usage: this.totalUsage,
        modelUsage: getModelUsage(),
        permission_denials: this.permissionDenials,
        fast_mode_state: getFastModeState(mainLoopModel, initialAppState.fastMode),
        uuid: randomUUID46()
      };
      return;
    }
    if (fileHistoryEnabled() && persistSession)
      messagesFromUserInput.filter(messageSelector().selectableUserMessagesFilter).forEach((message) => {
        fileHistoryMakeSnapshot((updater) => {
          setAppState((prev) => ({
            ...prev,
            fileHistory: updater(prev.fileHistory)
          }));
        }, message.uuid);
      });
    let currentMessageUsage = EMPTY_USAGE, turnCount = 1, hasAcknowledgedInitialMessages = !1, structuredOutputFromTool, lastStopReason = null, errorLogWatermark = getInMemoryErrors().at(-1), initialStructuredOutputCalls = jsonSchema ? countToolCalls(this.mutableMessages, SYNTHETIC_OUTPUT_TOOL_NAME) : 0;
    for await (let message of query({
      messages,
      systemPrompt,
      userContext,
      systemContext,
      canUseTool: wrappedCanUseTool,
      toolUseContext: processUserInputContext,
      fallbackModel,
      querySource: "sdk",
      maxTurns,
      taskBudget
    })) {
      if (message.type === "assistant" || message.type === "user" || message.type === "system" && message.subtype === "compact_boundary") {
        if (persistSession && message.type === "system" && message.subtype === "compact_boundary") {
          let tailUuid = message.compactMetadata?.preservedSegment?.tailUuid;
          if (tailUuid) {
            let tailIdx = this.mutableMessages.findLastIndex((m4) => m4.uuid === tailUuid);
            if (tailIdx !== -1)
              await recordTranscript(this.mutableMessages.slice(0, tailIdx + 1));
          }
        }
        if (messages.push(message), persistSession)
          if (message.type === "assistant")
            recordTranscript(messages);
          else
            await recordTranscript(messages);
        if (!hasAcknowledgedInitialMessages && messagesToAck.length > 0) {
          hasAcknowledgedInitialMessages = !0;
          for (let msgToAck of messagesToAck)
            if (msgToAck.type === "user")
              yield {
                type: "user",
                message: msgToAck.message,
                session_id: getSessionId(),
                parent_tool_use_id: null,
                uuid: msgToAck.uuid,
                timestamp: msgToAck.timestamp,
                isReplay: !0
              };
        }
      }
      if (message.type === "user")
        turnCount++;
      switch (message.type) {
        case "tombstone":
          break;
        case "assistant":
          if (message.message.stop_reason != null)
            lastStopReason = message.message.stop_reason;
          this.mutableMessages.push(message), yield* normalizeMessage(message);
          break;
        case "progress":
          if (this.mutableMessages.push(message), persistSession)
            messages.push(message), recordTranscript(messages);
          yield* normalizeMessage(message);
          break;
        case "user":
          this.mutableMessages.push(message), yield* normalizeMessage(message);
          break;
        case "stream_event":
          if (message.event.type === "message_start")
            currentMessageUsage = EMPTY_USAGE, currentMessageUsage = updateUsage(currentMessageUsage, message.event.message.usage);
          if (message.event.type === "message_delta") {
            if (currentMessageUsage = updateUsage(currentMessageUsage, message.event.usage), message.event.delta.stop_reason != null)
              lastStopReason = message.event.delta.stop_reason;
          }
          if (message.event.type === "message_stop")
            this.totalUsage = accumulateUsage(this.totalUsage, currentMessageUsage);
          if (includePartialMessages)
            yield {
              type: "stream_event",
              event: message.event,
              session_id: getSessionId(),
              parent_tool_use_id: null,
              uuid: randomUUID46()
            };
          break;
        case "attachment":
          if (this.mutableMessages.push(message), persistSession)
            messages.push(message), recordTranscript(messages);
          if (message.attachment.type === "structured_output")
            structuredOutputFromTool = message.attachment.data;
          else if (message.attachment.type === "max_turns_reached") {
            if (persistSession) {
              if (isEnvTruthy(process.env.CLAUDE_CODE_EAGER_FLUSH) || isEnvTruthy(process.env.CLAUDE_CODE_IS_COWORK))
                await flushSessionStorage();
            }
            yield {
              type: "result",
              subtype: "error_max_turns",
              duration_ms: Date.now() - startTime,
              duration_api_ms: getTotalAPIDuration(),
              is_error: !0,
              num_turns: message.attachment.turnCount,
              stop_reason: lastStopReason,
              session_id: getSessionId(),
              total_cost_usd: getTotalCostUSD(),
              usage: this.totalUsage,
              modelUsage: getModelUsage(),
              permission_denials: this.permissionDenials,
              fast_mode_state: getFastModeState(mainLoopModel, initialAppState.fastMode),
              uuid: randomUUID46(),
              errors: [
                `Reached maximum number of turns (${message.attachment.maxTurns})`
              ]
            };
            return;
          } else if (replayUserMessages && message.attachment.type === "queued_command")
            yield {
              type: "user",
              message: {
                role: "user",
                content: message.attachment.prompt
              },
              session_id: getSessionId(),
              parent_tool_use_id: null,
              uuid: message.attachment.source_uuid || message.uuid,
              timestamp: message.timestamp,
              isReplay: !0
            };
          break;
        case "stream_request_start":
          break;
        case "system": {
          let snipResult = this.config.snipReplay?.(message, this.mutableMessages);
          if (snipResult !== void 0) {
            if (snipResult.executed)
              this.mutableMessages.length = 0, this.mutableMessages.push(...snipResult.messages);
            break;
          }
          if (this.mutableMessages.push(message), message.subtype === "compact_boundary" && message.compactMetadata) {
            let mutableBoundaryIdx = this.mutableMessages.length - 1;
            if (mutableBoundaryIdx > 0)
              this.mutableMessages.splice(0, mutableBoundaryIdx);
            let localBoundaryIdx = messages.length - 1;
            if (localBoundaryIdx > 0)
              messages.splice(0, localBoundaryIdx);
            yield {
              type: "system",
              subtype: "compact_boundary",
              session_id: getSessionId(),
              uuid: message.uuid,
              compact_metadata: toSDKCompactMetadata(message.compactMetadata)
            };
          }
          if (message.subtype === "api_error")
            yield {
              type: "system",
              subtype: "api_retry",
              attempt: message.retryAttempt,
              max_retries: message.maxRetries,
              retry_delay_ms: message.retryInMs,
              error_status: message.error.status ?? null,
              error: categorizeRetryableAPIError(message.error),
              session_id: getSessionId(),
              uuid: message.uuid
            };
          break;
        }
        case "tool_use_summary":
          yield {
            type: "tool_use_summary",
            summary: message.summary,
            preceding_tool_use_ids: message.precedingToolUseIds,
            session_id: getSessionId(),
            uuid: message.uuid
          };
          break;
      }
      if (maxBudgetUsd !== void 0 && getTotalCostUSD() >= maxBudgetUsd) {
        if (persistSession) {
          if (isEnvTruthy(process.env.CLAUDE_CODE_EAGER_FLUSH) || isEnvTruthy(process.env.CLAUDE_CODE_IS_COWORK))
            await flushSessionStorage();
        }
        yield {
          type: "result",
          subtype: "error_max_budget_usd",
          duration_ms: Date.now() - startTime,
          duration_api_ms: getTotalAPIDuration(),
          is_error: !0,
          num_turns: turnCount,
          stop_reason: lastStopReason,
          session_id: getSessionId(),
          total_cost_usd: getTotalCostUSD(),
          usage: this.totalUsage,
          modelUsage: getModelUsage(),
          permission_denials: this.permissionDenials,
          fast_mode_state: getFastModeState(mainLoopModel, initialAppState.fastMode),
          uuid: randomUUID46(),
          errors: [`Reached maximum budget ($${maxBudgetUsd})`]
        };
        return;
      }
      if (message.type === "user" && jsonSchema) {
        let callsThisQuery = countToolCalls(this.mutableMessages, SYNTHETIC_OUTPUT_TOOL_NAME) - initialStructuredOutputCalls, maxRetries = parseInt(process.env.MAX_STRUCTURED_OUTPUT_RETRIES || "5", 10);
        if (callsThisQuery >= maxRetries) {
          if (persistSession) {
            if (isEnvTruthy(process.env.CLAUDE_CODE_EAGER_FLUSH) || isEnvTruthy(process.env.CLAUDE_CODE_IS_COWORK))
              await flushSessionStorage();
          }
          yield {
            type: "result",
            subtype: "error_max_structured_output_retries",
            duration_ms: Date.now() - startTime,
            duration_api_ms: getTotalAPIDuration(),
            is_error: !0,
            num_turns: turnCount,
            stop_reason: lastStopReason,
            session_id: getSessionId(),
            total_cost_usd: getTotalCostUSD(),
            usage: this.totalUsage,
            modelUsage: getModelUsage(),
            permission_denials: this.permissionDenials,
            fast_mode_state: getFastModeState(mainLoopModel, initialAppState.fastMode),
            uuid: randomUUID46(),
            errors: [
              `Failed to provide valid structured output after ${maxRetries} attempts`
            ]
          };
          return;
        }
      }
    }
    let result = messages.findLast((m4) => m4.type === "assistant" || m4.type === "user"), edeResultType = result?.type ?? "undefined", edeLastContentType = result?.type === "assistant" ? last_default(result.message.content)?.type ?? "none" : "n/a";
    if (persistSession) {
      if (isEnvTruthy(process.env.CLAUDE_CODE_EAGER_FLUSH) || isEnvTruthy(process.env.CLAUDE_CODE_IS_COWORK))
        await flushSessionStorage();
    }
    if (!isResultSuccessful(result, lastStopReason)) {
      yield {
        type: "result",
        subtype: "error_during_execution",
        duration_ms: Date.now() - startTime,
        duration_api_ms: getTotalAPIDuration(),
        is_error: !0,
        num_turns: turnCount,
        stop_reason: lastStopReason,
        session_id: getSessionId(),
        total_cost_usd: getTotalCostUSD(),
        usage: this.totalUsage,
        modelUsage: getModelUsage(),
        permission_denials: this.permissionDenials,
        fast_mode_state: getFastModeState(mainLoopModel, initialAppState.fastMode),
        uuid: randomUUID46(),
        errors: (() => {
          let all4 = getInMemoryErrors(), start = errorLogWatermark ? all4.lastIndexOf(errorLogWatermark) + 1 : 0;
          return [
            `[ede_diagnostic] result_type=${edeResultType} last_content_type=${edeLastContentType} stop_reason=${lastStopReason}`,
            ...all4.slice(start).map((_) => _.error)
          ];
        })()
      };
      return;
    }
    let textResult = "", isApiError = !1;
    if (result.type === "assistant") {
      let lastContent = last_default(result.message.content);
      if (lastContent?.type === "text" && !SYNTHETIC_MESSAGES.has(lastContent.text))
        textResult = lastContent.text;
      isApiError = Boolean(result.isApiErrorMessage);
    }
    yield {
      type: "result",
      subtype: "success",
      is_error: isApiError,
      duration_ms: Date.now() - startTime,
      duration_api_ms: getTotalAPIDuration(),
      num_turns: turnCount,
      result: textResult,
      stop_reason: lastStopReason,
      session_id: getSessionId(),
      total_cost_usd: getTotalCostUSD(),
      usage: this.totalUsage,
      modelUsage: getModelUsage(),
      permission_denials: this.permissionDenials,
      structured_output: structuredOutputFromTool,
      fast_mode_state: getFastModeState(mainLoopModel, initialAppState.fastMode),
      uuid: randomUUID46()
    };
  }
  interrupt() {
    this.abortController.abort();
  }
  getMessages() {
    return this.mutableMessages;
  }
  getReadFileState() {
    return this.readFileState;
  }
  getSessionId() {
    return getSessionId();
  }
  setModel(model) {
    this.config.userSpecifiedModel = model;
  }
}
