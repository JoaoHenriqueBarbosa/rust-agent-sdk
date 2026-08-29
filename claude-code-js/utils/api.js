// Original: src/utils/api.ts
import { createHash as createHash20 } from "crypto";
function filterSwarmFieldsFromSchema(toolName, schema5) {
  let fieldsToRemove = SWARM_FIELDS_BY_TOOL[toolName];
  if (!fieldsToRemove || fieldsToRemove.length === 0)
    return schema5;
  let filtered = { ...schema5 }, props = filtered.properties;
  if (props && typeof props === "object") {
    let filteredProps = { ...props };
    for (let field of fieldsToRemove)
      delete filteredProps[field];
    filtered.properties = filteredProps;
  }
  return filtered;
}
async function toolToAPISchema(tool, options2) {
  let cacheKey = "inputJSONSchema" in tool && tool.inputJSONSchema ? `${tool.name}:${jsonStringify(tool.inputJSONSchema)}` : tool.name, cache7 = getToolSchemaCache(), base2 = cache7.get(cacheKey);
  if (!base2) {
    let input_schema = "inputJSONSchema" in tool && tool.inputJSONSchema ? tool.inputJSONSchema : zodToJsonSchema3(tool.inputSchema);
    if (!isAgentSwarmsEnabled())
      input_schema = filterSwarmFieldsFromSchema(tool.name, input_schema);
    if (base2 = {
      name: tool.name,
      description: await tool.prompt({
        getToolPermissionContext: options2.getToolPermissionContext,
        tools: options2.tools,
        agents: options2.agents,
        allowedAgentTypes: options2.allowedAgentTypes
      }),
      input_schema
    }, getAPIProvider() === "firstParty" && isFirstPartyAnthropicBaseUrl() && isEnvTruthy(process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING))
      base2.eager_input_streaming = !0;
    cache7.set(cacheKey, base2);
  }
  let schema5 = {
    name: base2.name,
    description: base2.description,
    input_schema: base2.input_schema,
    ...base2.strict && { strict: !0 },
    ...base2.eager_input_streaming && { eager_input_streaming: !0 }
  };
  if (options2.deferLoading)
    schema5.defer_loading = !0;
  if (options2.cacheControl)
    schema5.cache_control = options2.cacheControl;
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)) {
    let allowed = /* @__PURE__ */ new Set([
      "name",
      "description",
      "input_schema",
      "cache_control"
    ]), stripped = Object.keys(schema5).filter((k3) => !allowed.has(k3));
    if (stripped.length > 0)
      return logStripOnce(stripped), {
        name: schema5.name,
        description: schema5.description,
        input_schema: schema5.input_schema,
        ...schema5.cache_control && { cache_control: schema5.cache_control }
      };
  }
  return schema5;
}
function logStripOnce(stripped) {
  if (loggedStrip)
    return;
  loggedStrip = !0, logForDebugging(`[betas] Stripped from tool schemas: [${stripped.join(", ")}] (CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1)`);
}
function logAPIPrefix(systemPrompt) {
  let [firstSyspromptBlock] = splitSysPromptPrefix(systemPrompt), firstSystemPrompt = firstSyspromptBlock?.text;
  logEvent("tengu_sysprompt_block", {
    snippet: firstSystemPrompt?.slice(0, 20),
    length: firstSystemPrompt?.length ?? 0,
    hash: firstSystemPrompt ? createHash20("sha256").update(firstSystemPrompt).digest("hex") : ""
  });
}
function splitSysPromptPrefix(systemPrompt, options2) {
  let useGlobalCacheFeature = shouldUseGlobalCacheScope();
  if (useGlobalCacheFeature && options2?.skipGlobalCacheForSystemPrompt) {
    logEvent("tengu_sysprompt_using_tool_based_cache", {
      promptBlockCount: systemPrompt.length
    });
    let attributionHeader2, systemPromptPrefix2, rest2 = [];
    for (let prompt of systemPrompt) {
      if (!prompt)
        continue;
      if (prompt === SYSTEM_PROMPT_DYNAMIC_BOUNDARY)
        continue;
      if (prompt.startsWith("x-anthropic-billing-header"))
        attributionHeader2 = prompt;
      else if (CLI_SYSPROMPT_PREFIXES.has(prompt))
        systemPromptPrefix2 = prompt;
      else
        rest2.push(prompt);
    }
    let result2 = [];
    if (attributionHeader2)
      result2.push({ text: attributionHeader2, cacheScope: null });
    if (systemPromptPrefix2)
      result2.push({ text: systemPromptPrefix2, cacheScope: "org" });
    let restJoined2 = rest2.join(`

`);
    if (restJoined2)
      result2.push({ text: restJoined2, cacheScope: "org" });
    return result2;
  }
  if (useGlobalCacheFeature) {
    let boundaryIndex = systemPrompt.findIndex((s2) => s2 === SYSTEM_PROMPT_DYNAMIC_BOUNDARY);
    if (boundaryIndex !== -1) {
      let attributionHeader2, systemPromptPrefix2, staticBlocks = [], dynamicBlocks = [];
      for (let i5 = 0;i5 < systemPrompt.length; i5++) {
        let block2 = systemPrompt[i5];
        if (!block2 || block2 === SYSTEM_PROMPT_DYNAMIC_BOUNDARY)
          continue;
        if (block2.startsWith("x-anthropic-billing-header"))
          attributionHeader2 = block2;
        else if (CLI_SYSPROMPT_PREFIXES.has(block2))
          systemPromptPrefix2 = block2;
        else if (i5 < boundaryIndex)
          staticBlocks.push(block2);
        else
          dynamicBlocks.push(block2);
      }
      let result2 = [];
      if (attributionHeader2)
        result2.push({ text: attributionHeader2, cacheScope: null });
      if (systemPromptPrefix2)
        result2.push({ text: systemPromptPrefix2, cacheScope: null });
      let staticJoined = staticBlocks.join(`

`);
      if (staticJoined)
        result2.push({ text: staticJoined, cacheScope: "global" });
      let dynamicJoined = dynamicBlocks.join(`

`);
      if (dynamicJoined)
        result2.push({ text: dynamicJoined, cacheScope: null });
      return logEvent("tengu_sysprompt_boundary_found", {
        blockCount: result2.length,
        staticBlockLength: staticJoined.length,
        dynamicBlockLength: dynamicJoined.length
      }), result2;
    } else
      logEvent("tengu_sysprompt_missing_boundary_marker", {
        promptBlockCount: systemPrompt.length
      });
  }
  let attributionHeader, systemPromptPrefix, rest = [];
  for (let block2 of systemPrompt) {
    if (!block2)
      continue;
    if (block2.startsWith("x-anthropic-billing-header"))
      attributionHeader = block2;
    else if (CLI_SYSPROMPT_PREFIXES.has(block2))
      systemPromptPrefix = block2;
    else
      rest.push(block2);
  }
  let result = [];
  if (attributionHeader)
    result.push({ text: attributionHeader, cacheScope: null });
  if (systemPromptPrefix)
    result.push({ text: systemPromptPrefix, cacheScope: "org" });
  let restJoined = rest.join(`

`);
  if (restJoined)
    result.push({ text: restJoined, cacheScope: "org" });
  return result;
}
function appendSystemContext(systemPrompt, context7) {
  return [
    ...systemPrompt,
    Object.entries(context7).map(([key3, value]) => `${key3}: ${value}`).join(`
`)
  ].filter(Boolean);
}
function prependUserContext(messages, context7) {
  if (Object.entries(context7).length === 0)
    return messages;
  return [
    createUserMessage({
      content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(context7).map(([key3, value]) => `# ${key3}
${value}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
      isMeta: !0
    }),
    ...messages
  ];
}
async function logContextMetrics(mcpConfigs, toolPermissionContext) {
  if (isAnalyticsDisabled())
    return;
  let [{ tools: mcpTools }, tools, userContext, systemContext] = await Promise.all([
    prefetchAllMcpResources(mcpConfigs),
    getTools(toolPermissionContext),
    getUserContext(),
    getSystemContext()
  ]), gitStatusSize = systemContext.gitStatus?.length ?? 0, claudeMdSize = userContext.claudeMd?.length ?? 0, totalContextSize = gitStatusSize + claudeMdSize, currentDir = getCwd(), ignorePatternsByRoot = getFileReadIgnorePatterns(toolPermissionContext), normalizedIgnorePatterns = normalizePatternsToPath(ignorePatternsByRoot, currentDir), fileCount = await countFilesRoundedRg(currentDir, AbortSignal.timeout(1000), normalizedIgnorePatterns), mcpToolsCount = 0, mcpServersCount = 0, mcpToolsTokens = 0, nonMcpToolsCount = 0, nonMcpToolsTokens = 0, nonMcpTools = tools.filter((tool) => !tool.isMcp);
  mcpToolsCount = mcpTools.length, nonMcpToolsCount = nonMcpTools.length;
  let serverNames = /* @__PURE__ */ new Set;
  for (let tool of mcpTools) {
    let parts = tool.name.split("__");
    if (parts.length >= 3 && parts[1])
      serverNames.add(parts[1]);
  }
  mcpServersCount = serverNames.size;
  for (let tool of mcpTools) {
    let schema5 = "inputJSONSchema" in tool && tool.inputJSONSchema ? tool.inputJSONSchema : zodToJsonSchema3(tool.inputSchema);
    mcpToolsTokens += roughTokenCountEstimation(jsonStringify(schema5));
  }
  for (let tool of nonMcpTools) {
    let schema5 = "inputJSONSchema" in tool && tool.inputJSONSchema ? tool.inputJSONSchema : zodToJsonSchema3(tool.inputSchema);
    nonMcpToolsTokens += roughTokenCountEstimation(jsonStringify(schema5));
  }
  logEvent("tengu_context_size", {
    git_status_size: gitStatusSize,
    claude_md_size: claudeMdSize,
    total_context_size: totalContextSize,
    project_file_count_rounded: fileCount,
    mcp_tools_count: mcpToolsCount,
    mcp_servers_count: mcpServersCount,
    mcp_tools_tokens: mcpToolsTokens,
    non_mcp_tools_count: nonMcpToolsCount,
    non_mcp_tools_tokens: nonMcpToolsTokens
  });
}
function normalizeToolInput(tool, input, agentId) {
  switch (tool.name) {
    case EXIT_PLAN_MODE_V2_TOOL_NAME: {
      let plan2 = getPlan(agentId), planFilePath = getPlanFilePath(agentId);
      return persistFileSnapshotIfRemote(), plan2 !== null ? { ...input, plan: plan2, planFilePath } : input;
    }
    case BashTool.name: {
      let parsed = BashTool.inputSchema.parse(input), { command: command19, timeout, description } = parsed, cwd2 = getCwd(), normalizedCommand = command19.replace(`cd ${cwd2} && `, "");
      if (getPlatform() === "windows")
        normalizedCommand = normalizedCommand.replace(`cd ${windowsPathToPosixPath(cwd2)} && `, "");
      if (normalizedCommand = normalizedCommand.replace(/\\\\;/g, "\\;"), /^echo\s+["']?[^|&;><]*["']?$/i.test(normalizedCommand.trim()))
        logEvent("tengu_bash_tool_simple_echo", {});
      let run_in_background = "run_in_background" in parsed ? parsed.run_in_background : void 0;
      return {
        command: normalizedCommand,
        description,
        ...timeout !== void 0 && { timeout },
        ...description !== void 0 && { description },
        ...run_in_background !== void 0 && { run_in_background },
        ..."dangerouslyDisableSandbox" in parsed && parsed.dangerouslyDisableSandbox !== void 0 && {
          dangerouslyDisableSandbox: parsed.dangerouslyDisableSandbox
        }
      };
    }
    case FileEditTool.name: {
      let parsedInput = FileEditTool.inputSchema.parse(input), { file_path, edits } = normalizeFileEditInput({
        file_path: parsedInput.file_path,
        edits: [
          {
            old_string: parsedInput.old_string,
            new_string: parsedInput.new_string,
            replace_all: parsedInput.replace_all
          }
        ]
      });
      return {
        replace_all: edits[0].replace_all,
        file_path,
        old_string: edits[0].old_string,
        new_string: edits[0].new_string
      };
    }
    case FileWriteTool.name: {
      let parsedInput = FileWriteTool.inputSchema.parse(input), isMarkdown = /\.(md|mdx)$/i.test(parsedInput.file_path);
      return {
        file_path: parsedInput.file_path,
        content: isMarkdown ? parsedInput.content : stripTrailingWhitespace(parsedInput.content)
      };
    }
    case TASK_OUTPUT_TOOL_NAME: {
      let legacyInput = input, taskId = legacyInput.task_id ?? legacyInput.agentId ?? legacyInput.bash_id, timeout = legacyInput.timeout ?? (typeof legacyInput.wait_up_to === "number" ? legacyInput.wait_up_to * 1000 : void 0);
      return {
        task_id: taskId ?? "",
        block: legacyInput.block ?? !0,
        timeout: timeout ?? 30000
      };
    }
    default:
      return input;
  }
}
function normalizeToolInputForAPI(tool, input) {
  switch (tool.name) {
    case EXIT_PLAN_MODE_V2_TOOL_NAME: {
      if (input && typeof input === "object" && (("plan" in input) || ("planFilePath" in input))) {
        let { plan: plan2, planFilePath, ...rest } = input;
        return rest;
      }
      return input;
    }
    case FileEditTool.name: {
      if (input && typeof input === "object" && "edits" in input) {
        let { old_string, new_string, replace_all, ...rest } = input;
        return rest;
      }
      return input;
    }
    default:
      return input;
  }
}
var SWARM_FIELDS_BY_TOOL, loggedStrip = !1;
var init_api4 = __esm(() => {
  init_prompts4();
  init_context2();
  init_client20();
  init_BashTool();
  init_FileEditTool();
  init_utils13();
  init_FileWriteTool();
  init_tools2();
  init_system();
  init_tokenEstimation();
  init_constants3();
  init_agentSwarmsEnabled();
  init_betas2();
  init_cwd2();
  init_debug();
  init_envUtils();
  init_messages3();
  init_providers();
  init_filesystem();
  init_plans();
  init_platform();
  init_ripgrep();
  init_slowOperations();
  init_toolSchemaCache();
  init_windowsPaths();
  init_zodToJsonSchema2();
  SWARM_FIELDS_BY_TOOL = {
    [EXIT_PLAN_MODE_V2_TOOL_NAME]: ["launchSwarm", "teammateCount"],
    [AGENT_TOOL_NAME]: ["name", "team_name", "mode"]
  };
});
