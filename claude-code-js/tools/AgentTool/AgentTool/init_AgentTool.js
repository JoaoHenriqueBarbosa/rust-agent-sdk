// var: init_AgentTool
var init_AgentTool = __esm(() => {
  init_Tool();
  init_promptCategory();
  init_v4();
  init_state();
  init_prompts4();
  init_coordinatorMode();
  init_agentSummary();
  init_dumpPrompts();
  init_LocalAgentTask();
  init_RemoteAgentTask();
  init_tools2();
  init_ids();
  init_agentContext();
  init_agentSwarmsEnabled();
  init_cwd2();
  init_debug();
  init_envUtils();
  init_errors();
  init_messages3();
  init_agent();
  init_PermissionMode();
  init_permissions2();
  init_sdkEventQueue();
  init_sessionStorage();
  init_systemPrompt();
  init_diskOutput();
  init_teammate();
  init_teammateContext();
  init_teleport();
  init_tokens();
  init_uuid();
  init_worktree();
  init_UI6();
  init_prompt2();
  init_spawnMultiAgent();
  init_agentColorManager();
  init_agentToolUtils();
  init_generalPurposeAgent();
  init_constants3();
  init_forkSubagent();
  init_loadAgentsDir();
  init_prompt18();
  init_runAgent();
  init_UI4();
  jsx_dev_runtime152 = __toESM(require_react_jsx_dev_runtime_development(), 1), isBackgroundTasksDisabled2 = isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS);
  baseInputSchema = lazySchema(() => exports_external.object({
    description: exports_external.string().describe("A short (3-5 word) description of the task"),
    prompt: exports_external.string().describe("The task for the agent to perform"),
    subagent_type: exports_external.string().optional().describe("The type of specialized agent to use for this task"),
    model: exports_external.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent."),
    run_in_background: exports_external.boolean().optional().describe("Set to true to run this agent in the background. You will be notified when it completes.")
  })), fullInputSchema2 = lazySchema(() => {
    let multiAgentInputSchema = exports_external.object({
      name: exports_external.string().optional().describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
      team_name: exports_external.string().optional().describe("Team name for spawning. Uses current team context if omitted."),
      mode: permissionModeSchema().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).')
    });
    return baseInputSchema().merge(multiAgentInputSchema).extend({
      isolation: exports_external.enum(["worktree"]).optional().describe('Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo.'),
      cwd: exports_external.string().optional().describe('Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".')
    });
  }), inputSchema8 = lazySchema(() => {
    let schema5 = fullInputSchema2().omit({
      cwd: !0
    });
    return isBackgroundTasksDisabled2 || isForkSubagentEnabled() ? schema5.omit({
      run_in_background: !0
    }) : schema5;
  }), outputSchema30 = lazySchema(() => {
    let syncOutputSchema = agentToolResultSchema().extend({
      status: exports_external.literal("completed"),
      prompt: exports_external.string()
    }), asyncOutputSchema = exports_external.object({
      status: exports_external.literal("async_launched"),
      agentId: exports_external.string().describe("The ID of the async agent"),
      description: exports_external.string().describe("The description of the task"),
      prompt: exports_external.string().describe("The prompt for the agent"),
      outputFile: exports_external.string().describe("Path to the output file for checking agent progress"),
      canReadOutputFile: exports_external.boolean().optional().describe("Whether the calling agent has Read/Bash tools to check progress")
    });
    return exports_external.union([syncOutputSchema, asyncOutputSchema]);
  }), AgentTool = buildTool({
    async prompt({
      agents,
      tools,
      getToolPermissionContext,
      allowedAgentTypes
    }) {
      let toolPermissionContext = await getToolPermissionContext(), mcpServersWithTools = [];
      for (let tool of tools)
        if (tool.name?.startsWith("mcp__")) {
          let serverName = tool.name.split("__")[1];
          if (serverName && !mcpServersWithTools.includes(serverName))
            mcpServersWithTools.push(serverName);
        }
      let agentsWithMcpRequirementsMet = filterAgentsByMcpRequirements(agents, mcpServersWithTools), filteredAgents = filterDeniedAgents(agentsWithMcpRequirementsMet, toolPermissionContext, AGENT_TOOL_NAME);
      return await getPrompt9(filteredAgents, !1, allowedAgentTypes);
    },
    name: AGENT_TOOL_NAME,
    searchHint: "delegate work to a subagent",
    aliases: [LEGACY_AGENT_TOOL_NAME],
    maxResultSizeChars: 1e5,
    async description() {
      return "Launch a new agent";
    },
    get inputSchema() {
      return inputSchema8();
    },
    get outputSchema() {
      return outputSchema30();
    },
    async call({
      prompt,
      subagent_type,
      description,
      model: modelParam,
      run_in_background,
      name: name3,
      team_name,
      mode: spawnMode,
      isolation,
      cwd: cwd2
    }, toolUseContext, canUseTool, assistantMessage, onProgress) {
      let startTime = Date.now(), model = isCoordinatorMode() ? void 0 : modelParam, appState = toolUseContext.getAppState(), permissionMode = appState.toolPermissionContext.mode, rootSetAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState;
      if (team_name && !isAgentSwarmsEnabled())
        throw Error("Agent Teams is not yet available on your plan.");
      let teamName = resolveTeamName({
        team_name
      }, appState);
      if (isTeammate() && teamName && name3)
        throw Error("Teammates cannot spawn other teammates \u2014 the team roster is flat. To spawn a subagent instead, omit the `name` parameter.");
      if (isInProcessTeammate() && teamName && run_in_background === !0)
        throw Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.");
      if (teamName && name3) {
        let agentDef = subagent_type ? toolUseContext.options.agentDefinitions.activeAgents.find((a2) => a2.agentType === subagent_type) : void 0;
        if (agentDef?.color)
          setAgentColor(subagent_type, agentDef.color);
        let result = await spawnTeammate({
          name: name3,
          prompt,
          description,
          team_name: teamName,
          use_splitpane: !0,
          plan_mode_required: spawnMode === "plan",
          model: model ?? agentDef?.model,
          agent_type: subagent_type,
          invokingRequestId: assistantMessage?.requestId
        }, toolUseContext);
        return {
          data: {
            status: "teammate_spawned",
            prompt,
            ...result.data
          }
        };
      }
      let effectiveType = subagent_type ?? (isForkSubagentEnabled() ? void 0 : GENERAL_PURPOSE_AGENT.agentType), isForkPath = effectiveType === void 0, selectedAgent;
      if (isForkPath) {
        if (toolUseContext.options.querySource === `agent:builtin:${FORK_AGENT.agentType}` || isInForkChild(toolUseContext.messages))
          throw Error("Fork is not available inside a forked worker. Complete your task directly using your tools.");
        selectedAgent = FORK_AGENT;
      } else {
        let allAgents = toolUseContext.options.agentDefinitions.activeAgents, {
          allowedAgentTypes
        } = toolUseContext.options.agentDefinitions, agents = filterDeniedAgents(allowedAgentTypes ? allAgents.filter((a2) => allowedAgentTypes.includes(a2.agentType)) : allAgents, appState.toolPermissionContext, AGENT_TOOL_NAME), found = agents.find((agent) => agent.agentType === effectiveType);
        if (!found) {
          if (allAgents.find((agent) => agent.agentType === effectiveType)) {
            let denyRule = getDenyRuleForAgent(appState.toolPermissionContext, AGENT_TOOL_NAME, effectiveType);
            throw Error(`Agent type '${effectiveType}' has been denied by permission rule '${AGENT_TOOL_NAME}(${effectiveType})' from ${denyRule?.source ?? "settings"}.`);
          }
          throw Error(`Agent type '${effectiveType}' not found. Available agents: ${agents.map((a2) => a2.agentType).join(", ")}`);
        }
        selectedAgent = found;
      }
      if (isInProcessTeammate() && teamName && selectedAgent.background === !0)
        throw Error(`In-process teammates cannot spawn background agents. Agent '${selectedAgent.agentType}' has background: true in its definition.`);
      let requiredMcpServers = selectedAgent.requiredMcpServers;
      if (requiredMcpServers?.length) {
        let hasPendingRequiredServers = appState.mcp.clients.some((c3) => c3.type === "pending" && requiredMcpServers.some((pattern) => c3.name.toLowerCase().includes(pattern.toLowerCase()))), currentAppState = appState;
        if (hasPendingRequiredServers) {
          let deadline = Date.now() + 30000;
          while (Date.now() < deadline) {
            if (await sleep3(500), currentAppState = toolUseContext.getAppState(), currentAppState.mcp.clients.some((c3) => c3.type === "failed" && requiredMcpServers.some((pattern) => c3.name.toLowerCase().includes(pattern.toLowerCase()))))
              break;
            if (!currentAppState.mcp.clients.some((c3) => c3.type === "pending" && requiredMcpServers.some((pattern) => c3.name.toLowerCase().includes(pattern.toLowerCase()))))
              break;
          }
        }
        let serversWithTools = [];
        for (let tool of currentAppState.mcp.tools)
          if (tool.name?.startsWith("mcp__")) {
            let serverName = tool.name.split("__")[1];
            if (serverName && !serversWithTools.includes(serverName))
              serversWithTools.push(serverName);
          }
        if (!hasRequiredMcpServers(selectedAgent, serversWithTools)) {
          let missing = requiredMcpServers.filter((pattern) => !serversWithTools.some((server) => server.toLowerCase().includes(pattern.toLowerCase())));
          throw Error(`Agent '${selectedAgent.agentType}' requires MCP servers matching: ${missing.join(", ")}. MCP servers with tools: ${serversWithTools.length > 0 ? serversWithTools.join(", ") : "none"}. Use /mcp to configure and authenticate the required MCP servers.`);
        }
      }
      if (selectedAgent.color)
        setAgentColor(selectedAgent.agentType, selectedAgent.color);
      let resolvedAgentModel = getAgentModel(selectedAgent.model, toolUseContext.options.mainLoopModel, isForkPath ? void 0 : model, permissionMode);
      logEvent("tengu_agent_tool_selected", {
        agent_type: selectedAgent.agentType,
        model: resolvedAgentModel,
        source: selectedAgent.source,
        color: selectedAgent.color,
        is_built_in_agent: isBuiltInAgent(selectedAgent),
        is_resume: !1,
        is_async: (run_in_background === !0 || selectedAgent.background === !0) && !isBackgroundTasksDisabled2,
        is_fork: isForkPath
      });
      let effectiveIsolation = isolation ?? selectedAgent.isolation, enhancedSystemPrompt, forkParentSystemPrompt, promptMessages;
      if (isForkPath) {
        if (toolUseContext.renderedSystemPrompt)
          forkParentSystemPrompt = toolUseContext.renderedSystemPrompt;
        else {
          let mainThreadAgentDefinition = appState.agent ? appState.agentDefinitions.activeAgents.find((a2) => a2.agentType === appState.agent) : void 0, additionalWorkingDirectories = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()), defaultSystemPrompt = await getSystemPrompt(toolUseContext.options.tools, toolUseContext.options.mainLoopModel, additionalWorkingDirectories, toolUseContext.options.mcpClients);
          forkParentSystemPrompt = buildEffectiveSystemPrompt({
            mainThreadAgentDefinition,
            toolUseContext,
            customSystemPrompt: toolUseContext.options.customSystemPrompt,
            defaultSystemPrompt,
            appendSystemPrompt: toolUseContext.options.appendSystemPrompt
          });
        }
        promptMessages = buildForkedMessages(prompt, assistantMessage);
      } else {
        try {
          let additionalWorkingDirectories = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()), agentPrompt = selectedAgent.getSystemPrompt({
            toolUseContext
          });
          if (selectedAgent.memory)
            logEvent("tengu_agent_memory_loaded", {
              ...!1,
              scope: selectedAgent.memory,
              source: "subagent"
            });
          enhancedSystemPrompt = await enhanceSystemPromptWithEnvDetails([agentPrompt], resolvedAgentModel, additionalWorkingDirectories);
        } catch (error44) {
          logForDebugging(`Failed to get system prompt for agent ${selectedAgent.agentType}: ${errorMessage(error44)}`);
        }
        promptMessages = [createUserMessage({
          content: prompt
        })];
      }
      let metadata = {
        prompt,
        resolvedAgentModel,
        isBuiltInAgent: isBuiltInAgent(selectedAgent),
        startTime,
        agentType: selectedAgent.agentType,
        isAsync: (run_in_background === !0 || selectedAgent.background === !0) && !isBackgroundTasksDisabled2
      }, isCoordinator = !1, forceAsync = isForkSubagentEnabled(), assistantForceAsync = !1, shouldRunAsync = (run_in_background === !0 || selectedAgent.background === !0 || isCoordinator || forceAsync || assistantForceAsync || (proactiveModule2?.isProactiveActive() ?? !1)) && !isBackgroundTasksDisabled2, workerPermissionContext = {
        ...appState.toolPermissionContext,
        mode: selectedAgent.permissionMode ?? "acceptEdits"
      }, workerTools = assembleToolPool(workerPermissionContext, appState.mcp.tools), earlyAgentId = createAgentId(), worktreeInfo = null;
      if (effectiveIsolation === "worktree") {
        let slug = `agent-${earlyAgentId.slice(0, 8)}`;
        worktreeInfo = await createAgentWorktree(slug);
      }
      if (isForkPath && worktreeInfo)
        promptMessages.push(createUserMessage({
          content: buildWorktreeNotice(getCwd(), worktreeInfo.worktreePath)
        }));
      let runAgentParams = {
        agentDefinition: selectedAgent,
        promptMessages,
        toolUseContext,
        canUseTool,
        isAsync: shouldRunAsync,
        querySource: toolUseContext.options.querySource ?? getQuerySourceForAgent(selectedAgent.agentType, isBuiltInAgent(selectedAgent)),
        model: isForkPath ? void 0 : model,
        override: isForkPath ? {
          systemPrompt: forkParentSystemPrompt
        } : enhancedSystemPrompt && !worktreeInfo && !cwd2 ? {
          systemPrompt: asSystemPrompt(enhancedSystemPrompt)
        } : void 0,
        availableTools: isForkPath ? toolUseContext.options.tools : workerTools,
        forkContextMessages: isForkPath ? toolUseContext.messages : void 0,
        ...isForkPath && {
          useExactTools: !0
        },
        worktreePath: worktreeInfo?.worktreePath,
        description
      }, cwdOverridePath = cwd2 ?? worktreeInfo?.worktreePath, wrapWithCwd = (fn) => cwdOverridePath ? runWithCwdOverride(cwdOverridePath, fn) : fn(), cleanupWorktreeIfNeeded = async () => {
        if (!worktreeInfo)
          return {};
        let {
          worktreePath,
          worktreeBranch,
          headCommit,
          gitRoot,
          hookBased
        } = worktreeInfo;
        if (worktreeInfo = null, hookBased)
          return logForDebugging(`Hook-based agent worktree kept at: ${worktreePath}`), {
            worktreePath
          };
        if (headCommit) {
          if (!await hasWorktreeChanges(worktreePath, headCommit))
            return await removeAgentWorktree(worktreePath, worktreeBranch, gitRoot), writeAgentMetadata(asAgentId(earlyAgentId), {
              agentType: selectedAgent.agentType,
              description
            }).catch((_err) => logForDebugging(`Failed to clear worktree metadata: ${_err}`)), {};
        }
        return logForDebugging(`Agent worktree has changes, keeping: ${worktreePath}`), {
          worktreePath,
          worktreeBranch
        };
      };
      if (shouldRunAsync) {
        let asyncAgentId = earlyAgentId, agentBackgroundTask = registerAsyncAgent({
          agentId: asyncAgentId,
          description,
          prompt,
          selectedAgent,
          setAppState: rootSetAppState,
          toolUseId: toolUseContext.toolUseId
        });
        if (name3)
          rootSetAppState((prev) => {
            let next2 = new Map(prev.agentNameRegistry);
            return next2.set(name3, asAgentId(asyncAgentId)), {
              ...prev,
              agentNameRegistry: next2
            };
          });
        let asyncAgentContext = {
          agentId: asyncAgentId,
          parentSessionId: getParentSessionId2(),
          agentType: "subagent",
          subagentName: selectedAgent.agentType,
          isBuiltIn: isBuiltInAgent(selectedAgent),
          invokingRequestId: assistantMessage?.requestId,
          invocationKind: "spawn",
          invocationEmitted: !1
        };
        runWithAgentContext(asyncAgentContext, () => wrapWithCwd(() => runAsyncAgentLifecycle({
          taskId: agentBackgroundTask.agentId,
          abortController: agentBackgroundTask.abortController,
          makeStream: (onCacheSafeParams) => runAgent({
            ...runAgentParams,
            override: {
              ...runAgentParams.override,
              agentId: asAgentId(agentBackgroundTask.agentId),
              abortController: agentBackgroundTask.abortController
            },
            onCacheSafeParams
          }),
          metadata,
          description,
          toolUseContext,
          rootSetAppState,
          agentIdForCleanup: asyncAgentId,
          enableSummarization: isCoordinator || isForkSubagentEnabled() || getSdkAgentProgressSummariesEnabled(),
          getWorktreeResult: cleanupWorktreeIfNeeded
        })));
        let canReadOutputFile = toolUseContext.options.tools.some((t2) => toolMatchesName(t2, FILE_READ_TOOL_NAME) || toolMatchesName(t2, BASH_TOOL_NAME));
        return {
          data: {
            isAsync: !0,
            status: "async_launched",
            agentId: agentBackgroundTask.agentId,
            description,
            prompt,
            outputFile: getTaskOutputPath(agentBackgroundTask.agentId),
            canReadOutputFile
          }
        };
      } else {
        let syncAgentId = asAgentId(earlyAgentId), syncAgentContext = {
          agentId: syncAgentId,
          parentSessionId: getParentSessionId2(),
          agentType: "subagent",
          subagentName: selectedAgent.agentType,
          isBuiltIn: isBuiltInAgent(selectedAgent),
          invokingRequestId: assistantMessage?.requestId,
          invocationKind: "spawn",
          invocationEmitted: !1
        };
        return runWithAgentContext(syncAgentContext, () => wrapWithCwd(async () => {
          let agentMessages = [], agentStartTime = Date.now(), syncTracker = createProgressTracker(), syncResolveActivity = createActivityDescriptionResolver(toolUseContext.options.tools);
          if (promptMessages.length > 0) {
            let normalizedFirstMessage = normalizeMessages(promptMessages).find((m4) => m4.type === "user");
            if (normalizedFirstMessage && normalizedFirstMessage.type === "user" && onProgress)
              onProgress({
                toolUseID: `agent_${assistantMessage.message.id}`,
                data: {
                  message: normalizedFirstMessage,
                  type: "agent_progress",
                  prompt,
                  agentId: syncAgentId
                }
              });
          }
          let foregroundTaskId, backgroundPromise, cancelAutoBackground;
          if (!isBackgroundTasksDisabled2) {
            let registration = registerAgentForeground({
              agentId: syncAgentId,
              description,
              prompt,
              selectedAgent,
              setAppState: rootSetAppState,
              toolUseId: toolUseContext.toolUseId,
              autoBackgroundMs: getAutoBackgroundMs() || void 0
            });
            foregroundTaskId = registration.taskId, backgroundPromise = registration.backgroundSignal.then(() => ({
              type: "background"
            })), cancelAutoBackground = registration.cancelAutoBackground;
          }
          let backgroundHintShown = !1, wasBackgrounded = !1, stopForegroundSummarization, summaryTaskId = foregroundTaskId, agentIterator = runAgent({
            ...runAgentParams,
            override: {
              ...runAgentParams.override,
              agentId: syncAgentId
            },
            onCacheSafeParams: summaryTaskId && getSdkAgentProgressSummariesEnabled() ? (params) => {
              let {
                stop
              } = startAgentSummarization(summaryTaskId, syncAgentId, params, rootSetAppState);
              stopForegroundSummarization = stop;
            } : void 0
          })[Symbol.asyncIterator](), syncAgentError, wasAborted = !1, worktreeResult = {};
          try {
            while (!0) {
              let elapsed = Date.now() - agentStartTime;
              if (!isBackgroundTasksDisabled2 && !backgroundHintShown && elapsed >= PROGRESS_THRESHOLD_MS2 && toolUseContext.setToolJSX)
                backgroundHintShown = !0, toolUseContext.setToolJSX({
                  jsx: /* @__PURE__ */ jsx_dev_runtime152.jsxDEV(BackgroundHint, {}, void 0, !1, void 0, this),
                  shouldHidePromptInput: !1,
                  shouldContinueAnimation: !0,
                  showSpinner: !0
                });
              let nextMessagePromise = agentIterator.next(), raceResult = backgroundPromise ? await Promise.race([nextMessagePromise.then((r4) => ({
                type: "message",
                result: r4
              })), backgroundPromise]) : {
                type: "message",
                result: await nextMessagePromise
              };
              if (raceResult.type === "background" && foregroundTaskId) {
                let task = toolUseContext.getAppState().tasks[foregroundTaskId];
                if (isLocalAgentTask(task) && task.isBackgrounded) {
                  let backgroundedTaskId = foregroundTaskId;
                  wasBackgrounded = !0, stopForegroundSummarization?.(), runWithAgentContext(syncAgentContext, async () => {
                    let stopBackgroundedSummarization;
                    try {
                      await Promise.race([agentIterator.return(void 0).catch(() => {}), sleep3(1000)]);
                      let tracker = createProgressTracker(), resolveActivity2 = createActivityDescriptionResolver(toolUseContext.options.tools);
                      for (let existingMsg of agentMessages)
                        updateProgressFromMessage(tracker, existingMsg, resolveActivity2, toolUseContext.options.tools);
                      for await (let msg of runAgent({
                        ...runAgentParams,
                        isAsync: !0,
                        override: {
                          ...runAgentParams.override,
                          agentId: asAgentId(backgroundedTaskId),
                          abortController: task.abortController
                        },
                        onCacheSafeParams: getSdkAgentProgressSummariesEnabled() ? (params) => {
                          let {
                            stop
                          } = startAgentSummarization(backgroundedTaskId, asAgentId(backgroundedTaskId), params, rootSetAppState);
                          stopBackgroundedSummarization = stop;
                        } : void 0
                      })) {
                        agentMessages.push(msg), updateProgressFromMessage(tracker, msg, resolveActivity2, toolUseContext.options.tools), updateAgentProgress(backgroundedTaskId, getProgressUpdate(tracker), rootSetAppState);
                        let lastToolName = getLastToolUseName(msg);
                        if (lastToolName)
                          emitTaskProgress2(tracker, backgroundedTaskId, toolUseContext.toolUseId, description, startTime, lastToolName);
                      }
                      let agentResult2 = finalizeAgentTool(agentMessages, backgroundedTaskId, metadata);
                      completeAgentTask(agentResult2, rootSetAppState);
                      let finalMessage = extractTextContent(agentResult2.content, `
`), worktreeResult2 = await cleanupWorktreeIfNeeded();
                      enqueueAgentNotification({
                        taskId: backgroundedTaskId,
                        description,
                        status: "completed",
                        setAppState: rootSetAppState,
                        finalMessage,
                        usage: {
                          totalTokens: getTokenCountFromTracker(tracker),
                          toolUses: agentResult2.totalToolUseCount,
                          durationMs: agentResult2.totalDurationMs
                        },
                        toolUseId: toolUseContext.toolUseId,
                        ...worktreeResult2
                      });
                    } catch (error44) {
                      if (error44 instanceof AbortError) {
                        killAsyncAgent(backgroundedTaskId, rootSetAppState), logEvent("tengu_agent_tool_terminated", {
                          agent_type: metadata.agentType,
                          model: metadata.resolvedAgentModel,
                          duration_ms: Date.now() - metadata.startTime,
                          is_async: !0,
                          is_built_in_agent: metadata.isBuiltInAgent,
                          reason: "user_cancel_background"
                        });
                        let worktreeResult3 = await cleanupWorktreeIfNeeded(), partialResult = extractPartialResult(agentMessages);
                        enqueueAgentNotification({
                          taskId: backgroundedTaskId,
                          description,
                          status: "killed",
                          setAppState: rootSetAppState,
                          toolUseId: toolUseContext.toolUseId,
                          finalMessage: partialResult,
                          ...worktreeResult3
                        });
                        return;
                      }
                      let errMsg = errorMessage(error44);
                      failAgentTask(backgroundedTaskId, errMsg, rootSetAppState);
                      let worktreeResult2 = await cleanupWorktreeIfNeeded();
                      enqueueAgentNotification({
                        taskId: backgroundedTaskId,
                        description,
                        status: "failed",
                        error: errMsg,
                        setAppState: rootSetAppState,
                        toolUseId: toolUseContext.toolUseId,
                        ...worktreeResult2
                      });
                    } finally {
                      stopBackgroundedSummarization?.(), clearInvokedSkillsForAgent(syncAgentId), clearDumpState(syncAgentId);
                    }
                  });
                  let canReadOutputFile = toolUseContext.options.tools.some((t2) => toolMatchesName(t2, FILE_READ_TOOL_NAME) || toolMatchesName(t2, BASH_TOOL_NAME));
                  return {
                    data: {
                      isAsync: !0,
                      status: "async_launched",
                      agentId: backgroundedTaskId,
                      description,
                      prompt,
                      outputFile: getTaskOutputPath(backgroundedTaskId),
                      canReadOutputFile
                    }
                  };
                }
              }
              if (raceResult.type !== "message")
                continue;
              let {
                result
              } = raceResult;
              if (result.done)
                break;
              let message = result.value;
              if (agentMessages.push(message), updateProgressFromMessage(syncTracker, message, syncResolveActivity, toolUseContext.options.tools), foregroundTaskId) {
                let lastToolName = getLastToolUseName(message);
                if (lastToolName) {
                  if (emitTaskProgress2(syncTracker, foregroundTaskId, toolUseContext.toolUseId, description, agentStartTime, lastToolName), getSdkAgentProgressSummariesEnabled())
                    updateAgentProgress(foregroundTaskId, getProgressUpdate(syncTracker), rootSetAppState);
                }
              }
              if (message.type === "progress" && (message.data.type === "bash_progress" || message.data.type === "powershell_progress") && onProgress)
                onProgress({
                  toolUseID: message.toolUseID,
                  data: message.data
                });
              if (message.type !== "assistant" && message.type !== "user")
                continue;
              if (message.type === "assistant") {
                let contentLength = getAssistantMessageContentLength(message);
                if (contentLength > 0)
                  toolUseContext.setResponseLength((len) => len + contentLength);
              }
              let normalizedNew = normalizeMessages([message]);
              for (let m4 of normalizedNew)
                for (let content of m4.message.content) {
                  if (content.type !== "tool_use" && content.type !== "tool_result")
                    continue;
                  if (onProgress)
                    onProgress({
                      toolUseID: `agent_${assistantMessage.message.id}`,
                      data: {
                        message: m4,
                        type: "agent_progress",
                        prompt: "",
                        agentId: syncAgentId
                      }
                    });
                }
            }
          } catch (error44) {
            if (error44 instanceof AbortError)
              throw wasAborted = !0, logEvent("tengu_agent_tool_terminated", {
                agent_type: metadata.agentType,
                model: metadata.resolvedAgentModel,
                duration_ms: Date.now() - metadata.startTime,
                is_async: !1,
                is_built_in_agent: metadata.isBuiltInAgent,
                reason: "user_cancel_sync"
              }), error44;
            logForDebugging(`Sync agent error: ${errorMessage(error44)}`, {
              level: "error"
            }), syncAgentError = toError(error44);
          } finally {
            if (toolUseContext.setToolJSX)
              toolUseContext.setToolJSX(null);
            if (stopForegroundSummarization?.(), foregroundTaskId) {
              if (unregisterAgentForeground(foregroundTaskId, rootSetAppState), !wasBackgrounded) {
                let progress = getProgressUpdate(syncTracker);
                enqueueSdkEvent({
                  type: "system",
                  subtype: "task_notification",
                  task_id: foregroundTaskId,
                  tool_use_id: toolUseContext.toolUseId,
                  status: syncAgentError ? "failed" : wasAborted ? "stopped" : "completed",
                  output_file: "",
                  summary: description,
                  usage: {
                    total_tokens: progress.tokenCount,
                    tool_uses: progress.toolUseCount,
                    duration_ms: Date.now() - agentStartTime
                  }
                });
              }
            }
            if (clearInvokedSkillsForAgent(syncAgentId), !wasBackgrounded)
              clearDumpState(syncAgentId);
            if (cancelAutoBackground?.(), !wasBackgrounded)
              worktreeResult = await cleanupWorktreeIfNeeded();
          }
          let lastMessage = agentMessages.findLast((_) => _.type !== "system" && _.type !== "progress");
          if (lastMessage && isSyntheticMessage(lastMessage))
            throw logEvent("tengu_agent_tool_terminated", {
              agent_type: metadata.agentType,
              model: metadata.resolvedAgentModel,
              duration_ms: Date.now() - metadata.startTime,
              is_async: !1,
              is_built_in_agent: metadata.isBuiltInAgent,
              reason: "user_cancel_sync"
            }), new AbortError;
          if (syncAgentError) {
            if (!agentMessages.some((msg) => msg.type === "assistant"))
              throw syncAgentError;
            logForDebugging(`Sync agent recovering from error with ${agentMessages.length} messages`);
          }
          let agentResult = finalizeAgentTool(agentMessages, syncAgentId, metadata);
          return {
            data: {
              status: "completed",
              prompt,
              ...agentResult,
              ...worktreeResult
            }
          };
        }));
      }
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      let i5 = input, tags = [i5.subagent_type, i5.mode ? `mode=${i5.mode}` : void 0].filter((t2) => t2 !== void 0);
      return `${tags.length > 0 ? `(${tags.join(", ")}): ` : ": "}${i5.prompt}`;
    },
    isConcurrencySafe() {
      return !0;
    },
    userFacingName: userFacingName2,
    userFacingNameBackgroundColor,
    getActivityDescription(input) {
      return input?.description ?? "Running task";
    },
    async checkPermissions(input, context6) {
      let appState = context6.getAppState();
      return {
        behavior: "allow",
        updatedInput: input
      };
    },
    mapToolResultToToolResultBlockParam(data, toolUseID) {
      let internalData = data;
      if (typeof internalData === "object" && internalData !== null && "status" in internalData && internalData.status === "teammate_spawned") {
        let spawnData = internalData;
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: [{
            type: "text",
            text: `Spawned successfully.
agent_id: ${spawnData.teammate_id}
name: ${spawnData.name}
team_name: ${spawnData.team_name}
The agent is now running and will receive instructions via mailbox.`
          }]
        };
      }
      if ("status" in internalData && internalData.status === "remote_launched") {
        let r4 = internalData;
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: [{
            type: "text",
            text: `Remote agent launched in CCR.
taskId: ${r4.taskId}
session_url: ${r4.sessionUrl}
output_file: ${r4.outputFile}
The agent is running remotely. You will be notified automatically when it completes.
Briefly tell the user what you launched and end your response.`
          }]
        };
      }
      if (data.status === "async_launched") {
        let prefix = `Async agent launched successfully.
agentId: ${data.agentId} (internal ID - do not mention to user. Use SendMessage with to: '${data.agentId}' to continue this agent.)
The agent is working in the background. You will be notified automatically when it completes.`, instructions = data.canReadOutputFile ? `Do not duplicate this agent's work \u2014 avoid working with the same files or topics it is using. Work on non-overlapping tasks, or briefly tell the user what you launched and end your response.
output_file: ${data.outputFile}
If asked, you can check progress before completion by using ${FILE_READ_TOOL_NAME} or ${BASH_TOOL_NAME} tail on the output file.` : "Briefly tell the user what you launched and end your response. Do not generate any other text \u2014 agent results will arrive in a subsequent message.", text2 = `${prefix}
${instructions}`;
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: [{
            type: "text",
            text: text2
          }]
        };
      }
      if (data.status === "completed") {
        let worktreeData = data, worktreeInfoText = worktreeData.worktreePath ? `
worktreePath: ${worktreeData.worktreePath}
worktreeBranch: ${worktreeData.worktreeBranch}` : "", contentOrMarker = data.content.length > 0 ? data.content : [{
          type: "text",
          text: "(Subagent completed but returned no output.)"
        }];
        if (data.agentType && ONE_SHOT_BUILTIN_AGENT_TYPES.has(data.agentType) && !worktreeInfoText)
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: contentOrMarker
          };
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: [...contentOrMarker, {
            type: "text",
            text: `agentId: ${data.agentId} (use SendMessage with to: '${data.agentId}' to continue this agent)${worktreeInfoText}
<usage>total_tokens: ${data.totalTokens}
tool_uses: ${data.totalToolUseCount}
duration_ms: ${data.totalDurationMs}</usage>`
          }]
        };
      }
      throw Error(`Unexpected agent tool result status: ${data.status}`);
    },
    renderToolResultMessage: renderToolResultMessage4,
    renderToolUseMessage: renderToolUseMessage5,
    renderToolUseTag,
    renderToolUseProgressMessage: renderToolUseProgressMessage3,
    renderToolUseRejectedMessage,
    renderToolUseErrorMessage,
    renderGroupedToolUse: renderGroupedAgentToolUse
  });
});
