// Original: src/tools/AgentTool/loadAgentsDir.ts
var exports_loadAgentsDir = {};
__export(exports_loadAgentsDir, {
  parseAgentsFromJson: () => parseAgentsFromJson,
  parseAgentFromMarkdown: () => parseAgentFromMarkdown,
  parseAgentFromJson: () => parseAgentFromJson,
  isPluginAgent: () => isPluginAgent,
  isCustomAgent: () => isCustomAgent,
  isBuiltInAgent: () => isBuiltInAgent,
  hasRequiredMcpServers: () => hasRequiredMcpServers,
  getAgentDefinitionsWithOverrides: () => getAgentDefinitionsWithOverrides,
  getActiveAgentsFromList: () => getActiveAgentsFromList,
  filterAgentsByMcpRequirements: () => filterAgentsByMcpRequirements,
  clearAgentDefinitionsCache: () => clearAgentDefinitionsCache
});
import { basename as basename10 } from "path";
function isBuiltInAgent(agent) {
  return agent.source === "built-in";
}
function isCustomAgent(agent) {
  return agent.source !== "built-in" && agent.source !== "plugin";
}
function isPluginAgent(agent) {
  return agent.source === "plugin";
}
function getActiveAgentsFromList(allAgents) {
  let builtInAgents = allAgents.filter((a2) => a2.source === "built-in"), pluginAgents = allAgents.filter((a2) => a2.source === "plugin"), userAgents = allAgents.filter((a2) => a2.source === "userSettings"), projectAgents = allAgents.filter((a2) => a2.source === "projectSettings"), managedAgents = allAgents.filter((a2) => a2.source === "policySettings"), flagAgents = allAgents.filter((a2) => a2.source === "flagSettings"), agentGroups = [
    builtInAgents,
    pluginAgents,
    userAgents,
    projectAgents,
    flagAgents,
    managedAgents
  ], agentMap = /* @__PURE__ */ new Map;
  for (let agents of agentGroups)
    for (let agent of agents)
      agentMap.set(agent.agentType, agent);
  return Array.from(agentMap.values());
}
function hasRequiredMcpServers(agent, availableServers) {
  if (!agent.requiredMcpServers || agent.requiredMcpServers.length === 0)
    return !0;
  return agent.requiredMcpServers.every((pattern) => availableServers.some((server) => server.toLowerCase().includes(pattern.toLowerCase())));
}
function filterAgentsByMcpRequirements(agents, availableServers) {
  return agents.filter((agent) => hasRequiredMcpServers(agent, availableServers));
}
function clearAgentDefinitionsCache() {
  getAgentDefinitionsWithOverrides.cache.clear?.(), clearPluginAgentCache();
}
function getParseError(frontmatter) {
  let { name: agentType, description } = frontmatter;
  if (!agentType || typeof agentType !== "string")
    return 'Missing required "name" field in frontmatter';
  if (!description || typeof description !== "string")
    return 'Missing required "description" field in frontmatter';
  return "Unknown parsing error";
}
function parseHooksFromFrontmatter(frontmatter, agentType) {
  if (!frontmatter.hooks)
    return;
  let result = HooksSchema().safeParse(frontmatter.hooks);
  if (!result.success) {
    logForDebugging(`Invalid hooks in agent '${agentType}': ${result.error.message}`);
    return;
  }
  return result.data;
}
function parseAgentFromJson(name3, definition, source = "flagSettings") {
  try {
    let parsed = AgentJsonSchema().parse(definition), tools = parseAgentToolsFromFrontmatter(parsed.tools);
    if (isAutoMemoryEnabled() && parsed.memory && tools !== void 0) {
      let toolSet = new Set(tools);
      for (let tool of [
        FILE_WRITE_TOOL_NAME,
        FILE_EDIT_TOOL_NAME,
        FILE_READ_TOOL_NAME
      ])
        if (!toolSet.has(tool))
          tools = [...tools, tool];
    }
    let disallowedTools = parsed.disallowedTools !== void 0 ? parseAgentToolsFromFrontmatter(parsed.disallowedTools) : void 0, systemPrompt = parsed.prompt;
    return {
      agentType: name3,
      whenToUse: parsed.description,
      ...tools !== void 0 ? { tools } : {},
      ...disallowedTools !== void 0 ? { disallowedTools } : {},
      getSystemPrompt: () => {
        if (isAutoMemoryEnabled() && parsed.memory)
          return systemPrompt + `

` + loadAgentMemoryPrompt(name3, parsed.memory);
        return systemPrompt;
      },
      source,
      ...parsed.model ? { model: parsed.model } : {},
      ...parsed.effort !== void 0 ? { effort: parsed.effort } : {},
      ...parsed.permissionMode ? { permissionMode: parsed.permissionMode } : {},
      ...parsed.mcpServers && parsed.mcpServers.length > 0 ? { mcpServers: parsed.mcpServers } : {},
      ...parsed.hooks ? { hooks: parsed.hooks } : {},
      ...parsed.maxTurns !== void 0 ? { maxTurns: parsed.maxTurns } : {},
      ...parsed.skills && parsed.skills.length > 0 ? { skills: parsed.skills } : {},
      ...parsed.initialPrompt ? { initialPrompt: parsed.initialPrompt } : {},
      ...parsed.background ? { background: parsed.background } : {},
      ...parsed.memory ? { memory: parsed.memory } : {},
      ...parsed.isolation ? { isolation: parsed.isolation } : {}
    };
  } catch (error44) {
    let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
    return logForDebugging(`Error parsing agent '${name3}' from JSON: ${errorMessage2}`), logError2(error44), null;
  }
}
function parseAgentsFromJson(agentsJson, source = "flagSettings") {
  try {
    let parsed = AgentsJsonSchema().parse(agentsJson);
    return Object.entries(parsed).map(([name3, def]) => parseAgentFromJson(name3, def, source)).filter((agent) => agent !== null);
  } catch (error44) {
    let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
    return logForDebugging(`Error parsing agents from JSON: ${errorMessage2}`), logError2(error44), [];
  }
}
function parseAgentFromMarkdown(filePath, baseDir, frontmatter, content, source) {
  try {
    let { name: agentType, description: whenToUse } = frontmatter;
    if (!agentType || typeof agentType !== "string")
      return null;
    if (!whenToUse || typeof whenToUse !== "string")
      return logForDebugging(`Agent file ${filePath} is missing required 'description' in frontmatter`), null;
    whenToUse = whenToUse.replace(/\\n/g, `
`);
    let { color: color2, model: modelRaw } = frontmatter, model;
    if (typeof modelRaw === "string" && modelRaw.trim().length > 0) {
      let trimmed = modelRaw.trim();
      model = trimmed.toLowerCase() === "inherit" ? "inherit" : trimmed;
    }
    let backgroundRaw = frontmatter.background;
    if (backgroundRaw !== void 0 && backgroundRaw !== "true" && backgroundRaw !== "false" && backgroundRaw !== !0 && backgroundRaw !== !1)
      logForDebugging(`Agent file ${filePath} has invalid background value '${backgroundRaw}'. Must be 'true', 'false', or omitted.`);
    let background = backgroundRaw === "true" || backgroundRaw === !0 ? !0 : void 0, VALID_MEMORY_SCOPES2 = ["user", "project", "local"], memoryRaw = frontmatter.memory, memory;
    if (memoryRaw !== void 0)
      if (VALID_MEMORY_SCOPES2.includes(memoryRaw))
        memory = memoryRaw;
      else
        logForDebugging(`Agent file ${filePath} has invalid memory value '${memoryRaw}'. Valid options: ${VALID_MEMORY_SCOPES2.join(", ")}`);
    let VALID_ISOLATION_MODES = ["worktree"], isolationRaw = frontmatter.isolation, isolation;
    if (isolationRaw !== void 0)
      if (VALID_ISOLATION_MODES.includes(isolationRaw))
        isolation = isolationRaw;
      else
        logForDebugging(`Agent file ${filePath} has invalid isolation value '${isolationRaw}'. Valid options: ${VALID_ISOLATION_MODES.join(", ")}`);
    let effortRaw = frontmatter.effort, parsedEffort = effortRaw !== void 0 ? parseEffortValue(effortRaw) : void 0;
    if (effortRaw !== void 0 && parsedEffort === void 0)
      logForDebugging(`Agent file ${filePath} has invalid effort '${effortRaw}'. Valid options: ${EFFORT_LEVELS.join(", ")} or an integer`);
    let permissionModeRaw = frontmatter.permissionMode, isValidPermissionMode = permissionModeRaw && PERMISSION_MODES.includes(permissionModeRaw);
    if (permissionModeRaw && !isValidPermissionMode) {
      let errorMsg = `Agent file ${filePath} has invalid permissionMode '${permissionModeRaw}'. Valid options: ${PERMISSION_MODES.join(", ")}`;
      logForDebugging(errorMsg);
    }
    let maxTurnsRaw = frontmatter.maxTurns, maxTurns = parsePositiveIntFromFrontmatter(maxTurnsRaw);
    if (maxTurnsRaw !== void 0 && maxTurns === void 0)
      logForDebugging(`Agent file ${filePath} has invalid maxTurns '${maxTurnsRaw}'. Must be a positive integer.`);
    let filename = basename10(filePath, ".md"), tools = parseAgentToolsFromFrontmatter(frontmatter.tools);
    if (isAutoMemoryEnabled() && memory && tools !== void 0) {
      let toolSet = new Set(tools);
      for (let tool of [
        FILE_WRITE_TOOL_NAME,
        FILE_EDIT_TOOL_NAME,
        FILE_READ_TOOL_NAME
      ])
        if (!toolSet.has(tool))
          tools = [...tools, tool];
    }
    let disallowedToolsRaw = frontmatter.disallowedTools, disallowedTools = disallowedToolsRaw !== void 0 ? parseAgentToolsFromFrontmatter(disallowedToolsRaw) : void 0, skills = parseSlashCommandToolsFromFrontmatter(frontmatter.skills), initialPromptRaw = frontmatter.initialPrompt, initialPrompt = typeof initialPromptRaw === "string" && initialPromptRaw.trim() ? initialPromptRaw : void 0, mcpServersRaw = frontmatter.mcpServers, mcpServers;
    if (Array.isArray(mcpServersRaw))
      mcpServers = mcpServersRaw.map((item) => {
        let result = AgentMcpServerSpecSchema().safeParse(item);
        if (result.success)
          return result.data;
        return logForDebugging(`Agent file ${filePath} has invalid mcpServers item: ${jsonStringify(item)}. Error: ${result.error.message}`), null;
      }).filter((item) => item !== null);
    let hooks = parseHooksFromFrontmatter(frontmatter, agentType), systemPrompt = content.trim();
    return {
      baseDir,
      agentType,
      whenToUse,
      ...tools !== void 0 ? { tools } : {},
      ...disallowedTools !== void 0 ? { disallowedTools } : {},
      ...skills !== void 0 ? { skills } : {},
      ...initialPrompt !== void 0 ? { initialPrompt } : {},
      ...mcpServers !== void 0 && mcpServers.length > 0 ? { mcpServers } : {},
      ...hooks !== void 0 ? { hooks } : {},
      getSystemPrompt: () => {
        if (isAutoMemoryEnabled() && memory) {
          let memoryPrompt = loadAgentMemoryPrompt(agentType, memory);
          return systemPrompt + `

` + memoryPrompt;
        }
        return systemPrompt;
      },
      source,
      filename,
      ...color2 && typeof color2 === "string" && AGENT_COLORS.includes(color2) ? { color: color2 } : {},
      ...model !== void 0 ? { model } : {},
      ...parsedEffort !== void 0 ? { effort: parsedEffort } : {},
      ...isValidPermissionMode ? { permissionMode: permissionModeRaw } : {},
      ...maxTurns !== void 0 ? { maxTurns } : {},
      ...background ? { background } : {},
      ...memory ? { memory } : {},
      ...isolation ? { isolation } : {}
    };
  } catch (error44) {
    let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
    return logForDebugging(`Error parsing agent from ${filePath}: ${errorMessage2}`), logError2(error44), null;
  }
}
var AgentMcpServerSpecSchema, AgentJsonSchema, AgentsJsonSchema, getAgentDefinitionsWithOverrides;
var init_loadAgentsDir = __esm(() => {
  init_memoize();
  init_v4();
  init_paths();
  init_types2();
  init_debug();
  init_effort();
  init_envUtils();
  init_frontmatterParser();
  init_log3();
  init_markdownConfigLoader();
  init_PermissionMode();
  init_loadPluginAgents();
  init_types3();
  init_slowOperations();
  init_prompt2();
  init_prompt4();
  init_agentColorManager();
  init_agentMemory();
  init_agentMemorySnapshot();
  init_builtInAgents();
  AgentMcpServerSpecSchema = lazySchema(() => exports_external.union([
    exports_external.string(),
    exports_external.record(exports_external.string(), McpServerConfigSchema())
  ])), AgentJsonSchema = lazySchema(() => exports_external.object({
    description: exports_external.string().min(1, "Description cannot be empty"),
    tools: exports_external.array(exports_external.string()).optional(),
    disallowedTools: exports_external.array(exports_external.string()).optional(),
    prompt: exports_external.string().min(1, "Prompt cannot be empty"),
    model: exports_external.string().trim().min(1, "Model cannot be empty").transform((m4) => m4.toLowerCase() === "inherit" ? "inherit" : m4).optional(),
    effort: exports_external.union([exports_external.enum(EFFORT_LEVELS), exports_external.number().int()]).optional(),
    permissionMode: exports_external.enum(PERMISSION_MODES).optional(),
    mcpServers: exports_external.array(AgentMcpServerSpecSchema()).optional(),
    hooks: HooksSchema().optional(),
    maxTurns: exports_external.number().int().positive().optional(),
    skills: exports_external.array(exports_external.string()).optional(),
    initialPrompt: exports_external.string().optional(),
    memory: exports_external.enum(["user", "project", "local"]).optional(),
    background: exports_external.boolean().optional(),
    isolation: exports_external.enum(["worktree"]).optional()
  })), AgentsJsonSchema = lazySchema(() => exports_external.record(exports_external.string(), AgentJsonSchema()));
  getAgentDefinitionsWithOverrides = memoize_default(async (cwd2) => {
    if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
      let builtInAgents = getBuiltInAgents();
      return {
        activeAgents: builtInAgents,
        allAgents: builtInAgents
      };
    }
    try {
      let markdownFiles = await loadMarkdownFilesForSubdir("agents", cwd2), failedFiles = [], customAgents = markdownFiles.map(({ filePath, baseDir, frontmatter, content, source }) => {
        let agent = parseAgentFromMarkdown(filePath, baseDir, frontmatter, content, source);
        if (!agent) {
          if (!frontmatter.name)
            return null;
          let errorMsg = getParseError(frontmatter);
          return failedFiles.push({ path: filePath, error: errorMsg }), logForDebugging(`Failed to parse agent from ${filePath}: ${errorMsg}`), logEvent("tengu_agent_parse_error", {
            error: errorMsg,
            location: source
          }), null;
        }
        return agent;
      }).filter((agent) => agent !== null), pluginAgents = await loadPluginAgents(), allAgentsList = [
        ...getBuiltInAgents(),
        ...pluginAgents,
        ...customAgents
      ], activeAgents = getActiveAgentsFromList(allAgentsList);
      for (let agent of activeAgents)
        if (agent.color)
          setAgentColor(agent.agentType, agent.color);
      return {
        activeAgents,
        allAgents: allAgentsList,
        failedFiles: failedFiles.length > 0 ? failedFiles : void 0
      };
    } catch (error44) {
      let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
      logForDebugging(`Error loading agent definitions: ${errorMessage2}`), logError2(error44);
      let builtInAgents = getBuiltInAgents();
      return {
        activeAgents: builtInAgents,
        allAgents: builtInAgents,
        failedFiles: [{ path: "unknown", error: errorMessage2 }]
      };
    }
  });
});
