// Original: src/utils/plugins/loadPluginAgents.ts
import { basename as basename9 } from "path";
async function loadAgentsFromDirectory(agentsPath, pluginName, sourceName, pluginPath, pluginManifest, loadedPaths) {
  let agents = [];
  return await walkPluginMarkdown(agentsPath, async (fullPath, namespace) => {
    let agent = await loadAgentFromFile(fullPath, pluginName, namespace, sourceName, pluginPath, pluginManifest, loadedPaths);
    if (agent)
      agents.push(agent);
  }, { logLabel: "agents" }), agents;
}
async function loadAgentFromFile(filePath, pluginName, namespace, sourceName, pluginPath, pluginManifest, loadedPaths) {
  let fs15 = getFsImplementation();
  if (isDuplicatePath(fs15, filePath, loadedPaths))
    return null;
  try {
    let content = await fs15.readFile(filePath, { encoding: "utf-8" }), { frontmatter, content: markdownContent } = parseFrontmatter(content, filePath), baseAgentName = frontmatter.name || basename9(filePath).replace(/\.md$/, ""), agentType = [pluginName, ...namespace, baseAgentName].join(":"), whenToUse = coerceDescriptionToString(frontmatter.description, agentType) ?? coerceDescriptionToString(frontmatter["when-to-use"], agentType) ?? `Agent from ${pluginName} plugin`, tools = parseAgentToolsFromFrontmatter(frontmatter.tools), skills = parseSlashCommandToolsFromFrontmatter(frontmatter.skills), color2 = frontmatter.color, modelRaw = frontmatter.model, model;
    if (typeof modelRaw === "string" && modelRaw.trim().length > 0) {
      let trimmed = modelRaw.trim();
      model = trimmed.toLowerCase() === "inherit" ? "inherit" : trimmed;
    }
    let backgroundRaw = frontmatter.background, background = backgroundRaw === "true" || backgroundRaw === !0 ? !0 : void 0, systemPrompt = substitutePluginVariables(markdownContent.trim(), {
      path: pluginPath,
      source: sourceName
    });
    if (pluginManifest.userConfig)
      systemPrompt = substituteUserConfigInContent(systemPrompt, loadPluginOptions(sourceName), pluginManifest.userConfig);
    let memoryRaw = frontmatter.memory, memory;
    if (memoryRaw !== void 0)
      if (VALID_MEMORY_SCOPES.includes(memoryRaw))
        memory = memoryRaw;
      else
        logForDebugging(`Plugin agent file ${filePath} has invalid memory value '${memoryRaw}'. Valid options: ${VALID_MEMORY_SCOPES.join(", ")}`);
    let isolation = frontmatter.isolation === "worktree" ? "worktree" : void 0, effortRaw = frontmatter.effort, effort = effortRaw !== void 0 ? parseEffortValue(effortRaw) : void 0;
    if (effortRaw !== void 0 && effort === void 0)
      logForDebugging(`Plugin agent file ${filePath} has invalid effort '${effortRaw}'. Valid options: ${EFFORT_LEVELS.join(", ")} or an integer`);
    for (let field of ["permissionMode", "hooks", "mcpServers"])
      if (frontmatter[field] !== void 0)
        logForDebugging(`Plugin agent file ${filePath} sets ${field}, which is ignored for plugin agents. Use .claude/agents/ for this level of control.`, { level: "warn" });
    let maxTurnsRaw = frontmatter.maxTurns, maxTurns = parsePositiveIntFromFrontmatter(maxTurnsRaw);
    if (maxTurnsRaw !== void 0 && maxTurns === void 0)
      logForDebugging(`Plugin agent file ${filePath} has invalid maxTurns '${maxTurnsRaw}'. Must be a positive integer.`);
    let disallowedTools = frontmatter.disallowedTools !== void 0 ? parseAgentToolsFromFrontmatter(frontmatter.disallowedTools) : void 0;
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
    return {
      agentType,
      whenToUse,
      tools,
      ...disallowedTools !== void 0 ? { disallowedTools } : {},
      ...skills !== void 0 ? { skills } : {},
      getSystemPrompt: () => {
        if (isAutoMemoryEnabled() && memory) {
          let memoryPrompt = loadAgentMemoryPrompt(agentType, memory);
          return systemPrompt + `

` + memoryPrompt;
        }
        return systemPrompt;
      },
      source: "plugin",
      color: color2,
      model,
      filename: baseAgentName,
      plugin: sourceName,
      ...background ? { background } : {},
      ...memory ? { memory } : {},
      ...isolation ? { isolation } : {},
      ...effort !== void 0 ? { effort } : {},
      ...maxTurns !== void 0 ? { maxTurns } : {}
    };
  } catch (error44) {
    return logForDebugging(`Failed to load agent from ${filePath}: ${error44}`, {
      level: "error"
    }), null;
  }
}
function clearPluginAgentCache() {
  loadPluginAgents.cache?.clear?.();
}
var VALID_MEMORY_SCOPES, loadPluginAgents;
var init_loadPluginAgents = __esm(() => {
  init_memoize();
  init_paths();
  init_agentMemory();
  init_prompt2();
  init_prompt4();
  init_debug();
  init_effort();
  init_frontmatterParser();
  init_fsOperations();
  init_markdownConfigLoader();
  init_pluginLoader();
  init_pluginOptionsStorage();
  init_walkPluginMarkdown();
  VALID_MEMORY_SCOPES = ["user", "project", "local"];
  loadPluginAgents = memoize_default(async () => {
    let { enabled: enabled2, errors: errors8 } = await loadAllPluginsCacheOnly();
    if (errors8.length > 0)
      logForDebugging(`Plugin loading errors: ${errors8.map((e) => getPluginErrorMessage(e)).join(", ")}`);
    let allAgents = (await Promise.all(enabled2.map(async (plugin) => {
      let loadedPaths = /* @__PURE__ */ new Set, pluginAgents = [];
      if (plugin.agentsPath)
        try {
          let agents = await loadAgentsFromDirectory(plugin.agentsPath, plugin.name, plugin.source, plugin.path, plugin.manifest, loadedPaths);
          if (pluginAgents.push(...agents), agents.length > 0)
            logForDebugging(`Loaded ${agents.length} agents from plugin ${plugin.name} default directory`);
        } catch (error44) {
          logForDebugging(`Failed to load agents from plugin ${plugin.name} default directory: ${error44}`, { level: "error" });
        }
      if (plugin.agentsPaths) {
        let pathResults = await Promise.all(plugin.agentsPaths.map(async (agentPath) => {
          try {
            let stats = await getFsImplementation().stat(agentPath);
            if (stats.isDirectory()) {
              let agents = await loadAgentsFromDirectory(agentPath, plugin.name, plugin.source, plugin.path, plugin.manifest, loadedPaths);
              if (agents.length > 0)
                logForDebugging(`Loaded ${agents.length} agents from plugin ${plugin.name} custom path: ${agentPath}`);
              return agents;
            } else if (stats.isFile() && agentPath.endsWith(".md")) {
              let agent = await loadAgentFromFile(agentPath, plugin.name, [], plugin.source, plugin.path, plugin.manifest, loadedPaths);
              if (agent)
                return logForDebugging(`Loaded agent from plugin ${plugin.name} custom file: ${agentPath}`), [agent];
            }
            return [];
          } catch (error44) {
            return logForDebugging(`Failed to load agents from plugin ${plugin.name} custom path ${agentPath}: ${error44}`, { level: "error" }), [];
          }
        }));
        for (let agents of pathResults)
          pluginAgents.push(...agents);
      }
      return pluginAgents;
    }))).flat();
    return logForDebugging(`Total plugin agents loaded: ${allAgents.length}`), allAgents;
  });
});
