// Original: src/tools/AgentTool/runAgent.ts
import { randomUUID as randomUUID10 } from "crypto";
async function initializeAgentMcpServers(agentDefinition, parentClients) {
  if (!agentDefinition.mcpServers?.length)
    return {
      clients: parentClients,
      tools: [],
      cleanup: async () => {}
    };
  let agentIsAdminTrusted = isSourceAdminTrusted(agentDefinition.source);
  if (isRestrictedToPluginOnly("mcp") && !agentIsAdminTrusted)
    return logForDebugging(`[Agent: ${agentDefinition.agentType}] Skipping MCP servers: strictPluginOnlyCustomization locks MCP to plugin-only (agent source: ${agentDefinition.source})`), {
      clients: parentClients,
      tools: [],
      cleanup: async () => {}
    };
  let agentClients = [], newlyCreatedClients = [], agentTools = [];
  for (let spec of agentDefinition.mcpServers) {
    let config10 = null, name3, isNewlyCreated = !1;
    if (typeof spec === "string") {
      if (name3 = spec, config10 = getMcpConfigByName(spec), !config10) {
        logForDebugging(`[Agent: ${agentDefinition.agentType}] MCP server not found: ${spec}`, { level: "warn" });
        continue;
      }
    } else {
      let entries = Object.entries(spec);
      if (entries.length !== 1) {
        logForDebugging(`[Agent: ${agentDefinition.agentType}] Invalid MCP server spec: expected exactly one key`, { level: "warn" });
        continue;
      }
      let [serverName, serverConfig] = entries[0];
      name3 = serverName, config10 = {
        ...serverConfig,
        scope: "dynamic"
      }, isNewlyCreated = !0;
    }
    let client15 = await connectToServer(name3, config10);
    if (agentClients.push(client15), isNewlyCreated)
      newlyCreatedClients.push(client15);
    if (client15.type === "connected") {
      let tools = await fetchToolsForClient(client15);
      agentTools.push(...tools), logForDebugging(`[Agent: ${agentDefinition.agentType}] Connected to MCP server '${name3}' with ${tools.length} tools`);
    } else
      logForDebugging(`[Agent: ${agentDefinition.agentType}] Failed to connect to MCP server '${name3}': ${client15.type}`, { level: "warn" });
  }
  let cleanup = async () => {
    for (let client15 of newlyCreatedClients)
      if (client15.type === "connected")
        try {
          await client15.cleanup();
        } catch (error44) {
          logForDebugging(`[Agent: ${agentDefinition.agentType}] Error cleaning up MCP server '${client15.name}': ${error44}`, { level: "warn" });
        }
  };
  return {
    clients: [...parentClients, ...agentClients],
    tools: agentTools,
    cleanup
  };
}
function isRecordableMessage(msg) {
  return msg.type === "assistant" || msg.type === "user" || msg.type === "progress" || msg.type === "system" && "subtype" in msg && msg.subtype === "compact_boundary";
}
async function* runAgent({
  agentDefinition,
  promptMessages,
  toolUseContext,
  canUseTool,
  isAsync: isAsync2,
  canShowPermissionPrompts,
  forkContextMessages,
  querySource,
  override,
  model,
  maxTurns,
  preserveToolUseResults,
  availableTools,
  allowedTools,
  onCacheSafeParams,
  contentReplacementState,
  useExactTools,
  worktreePath,
  description,
  transcriptSubdir,
  onQueryProgress
}) {
  let appState = toolUseContext.getAppState(), permissionMode = appState.toolPermissionContext.mode, rootSetAppState = toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState, resolvedAgentModel = getAgentModel(agentDefinition.model, toolUseContext.options.mainLoopModel, model, permissionMode), agentId = override?.agentId ? override.agentId : createAgentId();
  if (transcriptSubdir)
    setAgentTranscriptSubdir(agentId, transcriptSubdir);
  if (isPerfettoTracingEnabled()) {
    let parentId = toolUseContext.agentId ?? getSessionId();
    registerAgent(agentId, agentDefinition.agentType, parentId);
  }
  let initialMessages = [...forkContextMessages ? filterIncompleteToolCalls(forkContextMessages) : [], ...promptMessages], agentReadFileState = forkContextMessages !== void 0 ? cloneFileStateCache(toolUseContext.readFileState) : createFileStateCacheWithSizeLimit(READ_FILE_STATE_CACHE_SIZE), [baseUserContext, baseSystemContext] = await Promise.all([
    override?.userContext ?? getUserContext(),
    override?.systemContext ?? getSystemContext()
  ]), shouldOmitClaudeMd = agentDefinition.omitClaudeMd && !override?.userContext, { claudeMd: _omittedClaudeMd, ...userContextNoClaudeMd } = baseUserContext, resolvedUserContext = shouldOmitClaudeMd ? userContextNoClaudeMd : baseUserContext, { gitStatus: _omittedGitStatus, ...systemContextNoGit } = baseSystemContext, resolvedSystemContext = agentDefinition.agentType === "Explore" || agentDefinition.agentType === "Plan" ? systemContextNoGit : baseSystemContext, agentPermissionMode = agentDefinition.permissionMode, agentGetAppState = () => {
    let state3 = toolUseContext.getAppState(), toolPermissionContext = state3.toolPermissionContext;
    if (agentPermissionMode && state3.toolPermissionContext.mode !== "bypassPermissions" && state3.toolPermissionContext.mode !== "acceptEdits")
      toolPermissionContext = {
        ...toolPermissionContext,
        mode: agentPermissionMode
      };
    let shouldAvoidPrompts = canShowPermissionPrompts !== void 0 ? !canShowPermissionPrompts : agentPermissionMode === "bubble" ? !1 : isAsync2;
    if (shouldAvoidPrompts)
      toolPermissionContext = {
        ...toolPermissionContext,
        shouldAvoidPermissionPrompts: !0
      };
    if (isAsync2 && !shouldAvoidPrompts)
      toolPermissionContext = {
        ...toolPermissionContext,
        awaitAutomatedChecksBeforeDialog: !0
      };
    if (allowedTools !== void 0)
      toolPermissionContext = {
        ...toolPermissionContext,
        alwaysAllowRules: {
          cliArg: state3.toolPermissionContext.alwaysAllowRules.cliArg,
          session: [...allowedTools]
        }
      };
    let effortValue = agentDefinition.effort !== void 0 ? agentDefinition.effort : state3.effortValue;
    if (toolPermissionContext === state3.toolPermissionContext && effortValue === state3.effortValue)
      return state3;
    return {
      ...state3,
      toolPermissionContext,
      effortValue
    };
  }, resolvedTools = useExactTools ? availableTools : resolveAgentTools(agentDefinition, availableTools, isAsync2).resolvedTools, additionalWorkingDirectories = Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()), agentSystemPrompt = override?.systemPrompt ? override.systemPrompt : asSystemPrompt(await getAgentSystemPrompt(agentDefinition, toolUseContext, resolvedAgentModel, additionalWorkingDirectories, resolvedTools)), agentAbortController = override?.abortController ? override.abortController : isAsync2 ? new AbortController : toolUseContext.abortController, additionalContexts = [];
  for await (let hookResult of executeSubagentStartHooks(agentId, agentDefinition.agentType, agentAbortController.signal))
    if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0)
      additionalContexts.push(...hookResult.additionalContexts);
  if (additionalContexts.length > 0) {
    let contextMessage = createAttachmentMessage({
      type: "hook_additional_context",
      content: additionalContexts,
      hookName: "SubagentStart",
      toolUseID: randomUUID10(),
      hookEvent: "SubagentStart"
    });
    initialMessages.push(contextMessage);
  }
  let hooksAllowedForThisAgent = !isRestrictedToPluginOnly("hooks") || isSourceAdminTrusted(agentDefinition.source);
  if (agentDefinition.hooks && hooksAllowedForThisAgent)
    registerFrontmatterHooks(rootSetAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, !0);
  let skillsToPreload = agentDefinition.skills ?? [];
  if (skillsToPreload.length > 0) {
    let allSkills = await getSkillToolCommands(getProjectRoot()), validSkills = [];
    for (let skillName of skillsToPreload) {
      let resolvedName = resolveSkillName(skillName, allSkills, agentDefinition);
      if (!resolvedName) {
        logForDebugging(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' specified in frontmatter was not found`, { level: "warn" });
        continue;
      }
      let skill = getCommand(resolvedName, allSkills);
      if (skill.type !== "prompt") {
        logForDebugging(`[Agent: ${agentDefinition.agentType}] Warning: Skill '${skillName}' is not a prompt-based skill`, { level: "warn" });
        continue;
      }
      validSkills.push({ skillName, skill });
    }
    let { formatSkillLoadingMetadata: formatSkillLoadingMetadata2 } = await Promise.resolve().then(() => (init_processSlashCommand(), exports_processSlashCommand)), loaded = await Promise.all(validSkills.map(async ({ skillName, skill }) => ({
      skillName,
      skill,
      content: await skill.getPromptForCommand("", toolUseContext)
    })));
    for (let { skillName, skill, content } of loaded) {
      logForDebugging(`[Agent: ${agentDefinition.agentType}] Preloaded skill '${skillName}'`);
      let metadata = formatSkillLoadingMetadata2(skillName, skill.progressMessage);
      initialMessages.push(createUserMessage({
        content: [{ type: "text", text: metadata }, ...content],
        isMeta: !0
      }));
    }
  }
  let {
    clients: mergedMcpClients,
    tools: agentMcpTools,
    cleanup: mcpCleanup
  } = await initializeAgentMcpServers(agentDefinition, toolUseContext.options.mcpClients), allTools = agentMcpTools.length > 0 ? uniqBy_default([...resolvedTools, ...agentMcpTools], "name") : resolvedTools, agentOptions = {
    isNonInteractiveSession: useExactTools ? toolUseContext.options.isNonInteractiveSession : isAsync2 ? !0 : toolUseContext.options.isNonInteractiveSession ?? !1,
    appendSystemPrompt: toolUseContext.options.appendSystemPrompt,
    tools: allTools,
    commands: [],
    debug: toolUseContext.options.debug,
    verbose: toolUseContext.options.verbose,
    mainLoopModel: resolvedAgentModel,
    thinkingConfig: useExactTools ? toolUseContext.options.thinkingConfig : { type: "disabled" },
    mcpClients: mergedMcpClients,
    mcpResources: toolUseContext.options.mcpResources,
    agentDefinitions: toolUseContext.options.agentDefinitions,
    ...useExactTools && { querySource }
  }, agentToolUseContext = createSubagentContext(toolUseContext, {
    options: agentOptions,
    agentId,
    agentType: agentDefinition.agentType,
    messages: initialMessages,
    readFileState: agentReadFileState,
    abortController: agentAbortController,
    getAppState: agentGetAppState,
    shareSetAppState: !isAsync2,
    shareSetResponseLength: !0,
    criticalSystemReminder_EXPERIMENTAL: agentDefinition.criticalSystemReminder_EXPERIMENTAL,
    contentReplacementState
  });
  if (preserveToolUseResults)
    agentToolUseContext.preserveToolUseResults = !0;
  if (onCacheSafeParams)
    onCacheSafeParams({
      systemPrompt: agentSystemPrompt,
      userContext: resolvedUserContext,
      systemContext: resolvedSystemContext,
      toolUseContext: agentToolUseContext,
      forkContextMessages: initialMessages
    });
  recordSidechainTranscript(initialMessages, agentId).catch((_err) => logForDebugging(`Failed to record sidechain transcript: ${_err}`)), writeAgentMetadata(agentId, {
    agentType: agentDefinition.agentType,
    ...worktreePath && { worktreePath },
    ...description && { description }
  }).catch((_err) => logForDebugging(`Failed to write agent metadata: ${_err}`));
  let lastRecordedUuid = initialMessages.at(-1)?.uuid ?? null;
  try {
    for await (let message of query({
      messages: initialMessages,
      systemPrompt: agentSystemPrompt,
      userContext: resolvedUserContext,
      systemContext: resolvedSystemContext,
      canUseTool,
      toolUseContext: agentToolUseContext,
      querySource,
      maxTurns: maxTurns ?? agentDefinition.maxTurns
    })) {
      if (onQueryProgress?.(), message.type === "stream_event" && message.event.type === "message_start" && message.ttftMs != null) {
        toolUseContext.pushApiMetricsEntry?.(message.ttftMs);
        continue;
      }
      if (message.type === "attachment") {
        if (message.attachment.type === "max_turns_reached") {
          logForDebugging(`[Agent
: $
{
  agentDefinition.agentType
}
] Reached max turns limit ($
{
  message.attachment.maxTurns
}
)`);
          break;
        }
        yield message;
        continue;
      }
      if (isRecordableMessage(message)) {
        if (await recordSidechainTranscript([message], agentId, lastRecordedUuid).catch((err2) => logForDebugging(`Failed to record sidechain transcript: ${err2}`)), message.type !== "progress")
          lastRecordedUuid = message.uuid;
        yield message;
      }
    }
    if (agentAbortController.signal.aborted)
      throw new AbortError;
    if (isBuiltInAgent(agentDefinition) && agentDefinition.callback)
      agentDefinition.callback();
  } finally {
    if (await mcpCleanup(), agentDefinition.hooks)
      clearSessionHooks(rootSetAppState, agentId);
    agentToolUseContext.readFileState.clear(), initialMessages.length = 0, unregisterAgent(agentId), clearAgentTranscriptSubdir(agentId), rootSetAppState((prev) => {
      if (!(agentId in prev.todos))
        return prev;
      let { [agentId]: _removed, ...todos } = prev.todos;
      return { ...prev, todos };
    }), killShellTasksForAgent(agentId, toolUseContext.getAppState, rootSetAppState);
  }
}
function filterIncompleteToolCalls(messages) {
  let toolUseIdsWithResults = /* @__PURE__ */ new Set;
  for (let message of messages)
    if (message?.type === "user") {
      let content = message.message.content;
      if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "tool_result" && block2.tool_use_id)
            toolUseIdsWithResults.add(block2.tool_use_id);
      }
    }
  return messages.filter((message) => {
    if (message?.type === "assistant") {
      let content = message.message.content;
      if (Array.isArray(content))
        return !content.some((block2) => block2.type === "tool_use" && block2.id && !toolUseIdsWithResults.has(block2.id));
    }
    return !0;
  });
}
async function getAgentSystemPrompt(agentDefinition, toolUseContext, resolvedAgentModel, additionalWorkingDirectories, resolvedTools) {
  let enabledToolNames = new Set(resolvedTools.map((t2) => t2.name));
  try {
    let prompts = [agentDefinition.getSystemPrompt({ toolUseContext })];
    return await enhanceSystemPromptWithEnvDetails(prompts, resolvedAgentModel, additionalWorkingDirectories, enabledToolNames);
  } catch (_error) {
    return enhanceSystemPromptWithEnvDetails([DEFAULT_AGENT_PROMPT], resolvedAgentModel, additionalWorkingDirectories, enabledToolNames);
  }
}
function resolveSkillName(skillName, allSkills, agentDefinition) {
  if (hasCommand(skillName, allSkills))
    return skillName;
  let pluginPrefix = agentDefinition.agentType.split(":")[0];
  if (pluginPrefix) {
    let qualifiedName = `${pluginPrefix}:${skillName}`;
    if (hasCommand(qualifiedName, allSkills))
      return qualifiedName;
  }
  let suffix = `:${skillName}`, match = allSkills.find((cmd) => cmd.name.endsWith(suffix));
  if (match)
    return match.name;
  return null;
}
var init_runAgent = __esm(() => {
  init_uniqBy();
  init_debug();
  init_state();
  init_commands5();
  init_prompts4();
  init_context2();
  init_query();
  init_client20();
  init_config8();
  init_killShellTasks();
  init_attachments2();
  init_errors();
  init_fileStateCache();
  init_forkedAgent();
  init_registerFrontmatterHooks();
  init_sessionHooks();
  init_hooks5();
  init_messages3();
  init_agent();
  init_sessionStorage();
  init_pluginOnlyPolicy();
  init_perfettoTracing();
  init_uuid();
  init_agentToolUtils();
  init_loadAgentsDir();
});
