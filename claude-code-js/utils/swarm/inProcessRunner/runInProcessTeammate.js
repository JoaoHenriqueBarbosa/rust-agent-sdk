// function: runInProcessTeammate
async function runInProcessTeammate(config10) {
  let {
    identity: identity17,
    taskId,
    prompt,
    description,
    agentDefinition,
    teammateContext,
    toolUseContext,
    abortController,
    model,
    systemPrompt,
    systemPromptMode,
    allowedTools,
    allowPermissionPrompts,
    invokingRequestId
  } = config10, { setAppState } = toolUseContext;
  logForDebugging(`[inProcessRunner] Starting agent loop for ${identity17.agentId}`);
  let agentContext = {
    agentId: identity17.agentId,
    parentSessionId: identity17.parentSessionId,
    agentName: identity17.agentName,
    teamName: identity17.teamName,
    agentColor: identity17.color,
    planModeRequired: identity17.planModeRequired,
    isTeamLead: !1,
    agentType: "teammate",
    invokingRequestId,
    invocationKind: "spawn",
    invocationEmitted: !1
  }, teammateSystemPrompt;
  if (systemPromptMode === "replace" && systemPrompt)
    teammateSystemPrompt = systemPrompt;
  else {
    let systemPromptParts = [
      ...await getSystemPrompt(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, void 0, toolUseContext.options.mcpClients),
      TEAMMATE_SYSTEM_PROMPT_ADDENDUM
    ];
    if (agentDefinition) {
      let customPrompt = agentDefinition.getSystemPrompt();
      if (customPrompt)
        systemPromptParts.push(`
# Custom Agent Instructions
${customPrompt}`);
      if (agentDefinition.memory)
        logEvent("tengu_agent_memory_loaded", {
          ...{},
          scope: agentDefinition.memory,
          source: "in-process-teammate"
        });
    }
    if (systemPromptMode === "append" && systemPrompt)
      systemPromptParts.push(systemPrompt);
    teammateSystemPrompt = systemPromptParts.join(`
`);
  }
  let resolvedAgentDefinition = {
    agentType: identity17.agentName,
    whenToUse: `In-process teammate: ${identity17.agentName}`,
    getSystemPrompt: () => teammateSystemPrompt,
    tools: agentDefinition?.tools ? [
      .../* @__PURE__ */ new Set([
        ...agentDefinition.tools,
        SEND_MESSAGE_TOOL_NAME,
        TEAM_CREATE_TOOL_NAME,
        TEAM_DELETE_TOOL_NAME,
        TASK_CREATE_TOOL_NAME,
        TASK_GET_TOOL_NAME,
        TASK_LIST_TOOL_NAME,
        TASK_UPDATE_TOOL_NAME
      ])
    ] : ["*"],
    source: "projectSettings",
    permissionMode: "default",
    ...agentDefinition?.model ? { model: agentDefinition.model } : {}
  }, allMessages = [], wrappedInitialPrompt = formatAsTeammateMessage("team-lead", prompt, void 0, description), currentPrompt = wrappedInitialPrompt, shouldExit = !1;
  await tryClaimNextTask(identity17.parentSessionId, identity17.agentName);
  try {
    updateTaskState2(taskId, (task) => ({
      ...task,
      messages: appendCappedMessage(task.messages, createUserMessage({ content: wrappedInitialPrompt }))
    }), setAppState);
    let teammateReplacementState = toolUseContext.contentReplacementState ? createContentReplacementState() : void 0;
    while (!abortController.signal.aborted && !shouldExit) {
      logForDebugging(`[inProcessRunner] ${identity17.agentId} processing prompt: ${currentPrompt.substring(0, 50)}...`);
      let currentWorkAbortController = createAbortController();
      updateTaskState2(taskId, (task) => ({ ...task, currentWorkAbortController }), setAppState);
      let userMessage = createUserMessage({ content: currentPrompt }), promptMessages = [userMessage], contextMessages = allMessages, tokenCount = tokenCountWithEstimation(allMessages);
      if (tokenCount > getAutoCompactThreshold(toolUseContext.options.mainLoopModel)) {
        logForDebugging(`[inProcessRunner] ${identity17.agentId} compacting history (${tokenCount} tokens)`);
        let isolatedContext = {
          ...toolUseContext,
          readFileState: cloneFileStateCache(toolUseContext.readFileState),
          onCompactProgress: void 0,
          setStreamMode: void 0
        }, compactedSummary = await compactConversation(allMessages, isolatedContext, {
          systemPrompt: asSystemPrompt([]),
          userContext: {},
          systemContext: {},
          toolUseContext: isolatedContext,
          forkContextMessages: []
        }, !0, void 0, !0);
        if (contextMessages = buildPostCompactMessages(compactedSummary), resetMicrocompactState(), teammateReplacementState)
          teammateReplacementState = createContentReplacementState();
        allMessages.length = 0, allMessages.push(...contextMessages), updateTaskState2(taskId, (task) => ({ ...task, messages: [...contextMessages, userMessage] }), setAppState);
      }
      let forkContextMessages = contextMessages.length > 0 ? [...contextMessages] : void 0;
      allMessages.push(userMessage);
      let tracker = createProgressTracker(), resolveActivity = createActivityDescriptionResolver(toolUseContext.options.tools), iterationMessages = [], currentTask = toolUseContext.getAppState().tasks[taskId], currentPermissionMode = currentTask && currentTask.type === "in_process_teammate" ? currentTask.permissionMode : "default", iterationAgentDefinition = {
        ...resolvedAgentDefinition,
        permissionMode: currentPermissionMode
      }, workWasAborted = !1;
      if (await runWithTeammateContext(teammateContext, async () => {
        return runWithAgentContext(agentContext, async () => {
          updateTaskState2(taskId, (task) => ({ ...task, status: "running", isIdle: !1 }), setAppState);
          for await (let message of runAgent({
            agentDefinition: iterationAgentDefinition,
            promptMessages,
            toolUseContext,
            canUseTool: createInProcessCanUseTool(identity17, currentWorkAbortController, (waitMs) => {
              updateTaskState2(taskId, (task) => ({
                ...task,
                totalPausedMs: (task.totalPausedMs ?? 0) + waitMs
              }), setAppState);
            }),
            isAsync: !0,
            canShowPermissionPrompts: allowPermissionPrompts ?? !0,
            forkContextMessages,
            querySource: "agent:custom",
            override: { abortController: currentWorkAbortController },
            model,
            preserveToolUseResults: !0,
            availableTools: toolUseContext.options.tools,
            allowedTools,
            contentReplacementState: teammateReplacementState
          })) {
            if (abortController.signal.aborted) {
              logForDebugging(`[inProcessRunner] ${identity17.agentId} lifecycle aborted`);
              break;
            }
            if (currentWorkAbortController.signal.aborted) {
              logForDebugging(`[inProcessRunner] ${identity17.agentId} current work aborted (Escape pressed)`), workWasAborted = !0;
              break;
            }
            iterationMessages.push(message), allMessages.push(message), updateProgressFromMessage(tracker, message, resolveActivity, toolUseContext.options.tools);
            let progress = getProgressUpdate(tracker);
            updateTaskState2(taskId, (task) => {
              let inProgressToolUseIDs = task.inProgressToolUseIDs;
              if (message.type === "assistant") {
                for (let block2 of message.message.content)
                  if (block2.type === "tool_use")
                    inProgressToolUseIDs = /* @__PURE__ */ new Set([
                      ...inProgressToolUseIDs ?? [],
                      block2.id
                    ]);
              } else if (message.type === "user") {
                let content = message.message.content;
                if (Array.isArray(content)) {
                  for (let block2 of content)
                    if (typeof block2 === "object" && "type" in block2 && block2.type === "tool_result") {
                      if (inProgressToolUseIDs)
                        inProgressToolUseIDs = new Set(inProgressToolUseIDs), inProgressToolUseIDs.delete(block2.tool_use_id);
                    }
                }
              }
              return {
                ...task,
                progress,
                messages: appendCappedMessage(task.messages, message),
                inProgressToolUseIDs
              };
            }, setAppState);
          }
          return { success: !0, messages: iterationMessages };
        });
      }), updateTaskState2(taskId, (task) => ({ ...task, currentWorkAbortController: void 0 }), setAppState), abortController.signal.aborted)
        break;
      if (workWasAborted) {
        logForDebugging(`[inProcessRunner] ${identity17.agentId} work interrupted, returning to idle`);
        let interruptMessage = createAssistantAPIErrorMessage({
          content: ERROR_MESSAGE_USER_ABORT
        });
        updateTaskState2(taskId, (task) => ({
          ...task,
          messages: appendCappedMessage(task.messages, interruptMessage)
        }), setAppState);
      }
      let prevTask = toolUseContext.getAppState().tasks[taskId], wasAlreadyIdle = prevTask?.type === "in_process_teammate" && prevTask.isIdle;
      if (updateTaskState2(taskId, (task) => {
        return task.onIdleCallbacks?.forEach((cb) => cb()), { ...task, isIdle: !0, onIdleCallbacks: [] };
      }, setAppState), !wasAlreadyIdle)
        await sendIdleNotification(identity17.agentName, identity17.color, identity17.teamName, {
          idleReason: workWasAborted ? "interrupted" : "available",
          summary: getLastPeerDmSummary(allMessages)
        });
      else
        logForDebugging(`[inProcessRunner] Skipping duplicate idle notification for ${identity17.agentName}`);
      logForDebugging(`[inProcessRunner] ${identity17.agentId} finished prompt, waiting for next`);
      let waitResult = await waitForNextPromptOrShutdown(identity17, abortController, taskId, toolUseContext.getAppState, setAppState, identity17.parentSessionId);
      switch (waitResult.type) {
        case "shutdown_request":
          logForDebugging(`[inProcessRunner] ${identity17.agentId} received shutdown request - passing to model`), currentPrompt = formatAsTeammateMessage(waitResult.request?.from || "team-lead", waitResult.originalMessage), appendTeammateMessage(taskId, createUserMessage({ content: currentPrompt }), setAppState);
          break;
        case "new_message":
          if (logForDebugging(`[inProcessRunner] ${identity17.agentId} received new message from ${waitResult.from}`), waitResult.from === "user")
            currentPrompt = waitResult.message;
          else
            currentPrompt = formatAsTeammateMessage(waitResult.from, waitResult.message, waitResult.color, waitResult.summary), appendTeammateMessage(taskId, createUserMessage({ content: currentPrompt }), setAppState);
          break;
        case "aborted":
          logForDebugging(`[inProcessRunner] ${identity17.agentId} aborted while waiting`), shouldExit = !0;
          break;
      }
    }
    let alreadyTerminal = !1, toolUseId;
    if (updateTaskState2(taskId, (task) => {
      if (task.status !== "running")
        return alreadyTerminal = !0, task;
      return toolUseId = task.toolUseId, task.onIdleCallbacks?.forEach((cb) => cb()), task.unregisterCleanup?.(), {
        ...task,
        status: "completed",
        notified: !0,
        endTime: Date.now(),
        messages: task.messages?.length ? [task.messages.at(-1)] : void 0,
        pendingUserMessages: [],
        inProgressToolUseIDs: void 0,
        abortController: void 0,
        unregisterCleanup: void 0,
        currentWorkAbortController: void 0,
        onIdleCallbacks: []
      };
    }, setAppState), evictTaskOutput(taskId), evictTerminalTask(taskId, setAppState), !alreadyTerminal)
      emitTaskTerminatedSdk(taskId, "completed", {
        toolUseId,
        summary: identity17.agentId
      });
    return unregisterAgent(identity17.agentId), { success: !0, messages: allMessages };
  } catch (error44) {
    let errorMessage2 = error44 instanceof Error ? error44.message : "Unknown error";
    logForDebugging(`[inProcessRunner] Agent ${identity17.agentId} failed: ${errorMessage2}`);
    let alreadyTerminal = !1, toolUseId;
    if (updateTaskState2(taskId, (task) => {
      if (task.status !== "running")
        return alreadyTerminal = !0, task;
      return toolUseId = task.toolUseId, task.onIdleCallbacks?.forEach((cb) => cb()), task.unregisterCleanup?.(), {
        ...task,
        status: "failed",
        notified: !0,
        error: errorMessage2,
        isIdle: !0,
        endTime: Date.now(),
        onIdleCallbacks: [],
        messages: task.messages?.length ? [task.messages.at(-1)] : void 0,
        pendingUserMessages: [],
        inProgressToolUseIDs: void 0,
        abortController: void 0,
        unregisterCleanup: void 0,
        currentWorkAbortController: void 0
      };
    }, setAppState), evictTaskOutput(taskId), evictTerminalTask(taskId, setAppState), !alreadyTerminal)
      emitTaskTerminatedSdk(taskId, "failed", {
        toolUseId,
        summary: identity17.agentId
      });
    return await sendIdleNotification(identity17.agentName, identity17.color, identity17.teamName, {
      idleReason: "failed",
      completedStatus: "failed",
      failureReason: errorMessage2
    }), unregisterAgent(identity17.agentId), {
      success: !1,
      error: errorMessage2,
      messages: allMessages
    };
  }
}
