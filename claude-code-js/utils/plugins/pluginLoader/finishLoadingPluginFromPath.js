// function: finishLoadingPluginFromPath
async function finishLoadingPluginFromPath(entry, pluginId, enabled2, errorsOut, pluginPath) {
  let errors8 = [], manifestPath = join100(pluginPath, ".claude-plugin", "plugin.json"), hasManifest = await pathExists(manifestPath), { plugin, errors: pluginErrors } = await createPluginFromPath(pluginPath, pluginId, enabled2, entry.name, entry.strict ?? !0);
  if (errors8.push(...pluginErrors), typeof entry.source === "object" && "sha" in entry.source && entry.source.sha)
    plugin.sha = entry.source.sha;
  if (!hasManifest) {
    if (plugin.manifest = {
      ...entry,
      id: void 0,
      source: void 0,
      strict: void 0
    }, plugin.name = plugin.manifest.name, entry.commands) {
      let firstValue = Object.values(entry.commands)[0];
      if (typeof entry.commands === "object" && !Array.isArray(entry.commands) && firstValue && typeof firstValue === "object" && (("source" in firstValue) || ("content" in firstValue))) {
        let commandsMetadata = {}, validPaths = [], entries2 = Object.entries(entry.commands), checks4 = await Promise.all(entries2.map(async ([commandName, metadata]) => {
          if (!metadata || typeof metadata !== "object" || !metadata.source)
            return { commandName, metadata, skip: !0 };
          let fullPath = join100(pluginPath, metadata.source);
          return {
            commandName,
            metadata,
            skip: !1,
            fullPath,
            exists: await pathExists(fullPath)
          };
        }));
        for (let check3 of checks4) {
          if (check3.skip)
            continue;
          if (check3.exists)
            validPaths.push(check3.fullPath), commandsMetadata[check3.commandName] = check3.metadata;
          else
            logForDebugging(`Command ${check3.commandName} path ${check3.metadata.source} from marketplace entry not found at ${check3.fullPath} for ${entry.name}`, { level: "warn" }), logError2(Error(`Plugin component file not found: ${check3.fullPath} for ${entry.name}`)), errors8.push({
              type: "path-not-found",
              source: pluginId,
              plugin: entry.name,
              path: check3.fullPath,
              component: "commands"
            });
        }
        if (validPaths.length > 0)
          plugin.commandsPaths = validPaths, plugin.commandsMetadata = commandsMetadata;
      } else {
        let commandPaths = Array.isArray(entry.commands) ? entry.commands : [entry.commands], checks4 = await Promise.all(commandPaths.map(async (cmdPath) => {
          if (typeof cmdPath !== "string")
            return { cmdPath, kind: "invalid" };
          let fullPath = join100(pluginPath, cmdPath);
          return {
            cmdPath,
            kind: "path",
            fullPath,
            exists: await pathExists(fullPath)
          };
        })), validPaths = [];
        for (let check3 of checks4) {
          if (check3.kind === "invalid") {
            logForDebugging(`Unexpected command format in marketplace entry for ${entry.name}`, { level: "error" });
            continue;
          }
          if (check3.exists)
            validPaths.push(check3.fullPath);
          else
            logForDebugging(`Command path ${check3.cmdPath} from marketplace entry not found at ${check3.fullPath} for ${entry.name}`, { level: "warn" }), logError2(Error(`Plugin component file not found: ${check3.fullPath} for ${entry.name}`)), errors8.push({
              type: "path-not-found",
              source: pluginId,
              plugin: entry.name,
              path: check3.fullPath,
              component: "commands"
            });
        }
        if (validPaths.length > 0)
          plugin.commandsPaths = validPaths;
      }
    }
    if (entry.agents) {
      let agentPaths = Array.isArray(entry.agents) ? entry.agents : [entry.agents], validPaths = await validatePluginPaths(agentPaths, pluginPath, entry.name, pluginId, "agents", "Agent", "from marketplace entry", errors8);
      if (validPaths.length > 0)
        plugin.agentsPaths = validPaths;
    }
    if (entry.skills) {
      logForDebugging(`Processing ${Array.isArray(entry.skills) ? entry.skills.length : 1} skill paths for plugin ${entry.name}`);
      let skillPaths = Array.isArray(entry.skills) ? entry.skills : [entry.skills], checks4 = await Promise.all(skillPaths.map(async (skillPath) => {
        let fullPath = join100(pluginPath, skillPath);
        return { skillPath, fullPath, exists: await pathExists(fullPath) };
      })), validPaths = [];
      for (let { skillPath, fullPath, exists } of checks4)
        if (logForDebugging(`Checking skill path: ${skillPath} -> ${fullPath} (exists: ${exists})`), exists)
          validPaths.push(fullPath);
        else
          logForDebugging(`Skill path ${skillPath} from marketplace entry not found at ${fullPath} for ${entry.name}`, { level: "warn" }), logError2(Error(`Plugin component file not found: ${fullPath} for ${entry.name}`)), errors8.push({
            type: "path-not-found",
            source: pluginId,
            plugin: entry.name,
            path: fullPath,
            component: "skills"
          });
      if (logForDebugging(`Found ${validPaths.length} valid skill paths for plugin ${entry.name}, setting skillsPaths`), validPaths.length > 0)
        plugin.skillsPaths = validPaths;
    } else
      logForDebugging(`Plugin ${entry.name} has no entry.skills defined`);
    if (entry.outputStyles) {
      let outputStylePaths = Array.isArray(entry.outputStyles) ? entry.outputStyles : [entry.outputStyles], validPaths = await validatePluginPaths(outputStylePaths, pluginPath, entry.name, pluginId, "output-styles", "Output style", "from marketplace entry", errors8);
      if (validPaths.length > 0)
        plugin.outputStylesPaths = validPaths;
    }
    if (entry.hooks)
      plugin.hooksConfig = entry.hooks;
  } else if (!entry.strict && hasManifest && (entry.commands || entry.agents || entry.skills || entry.hooks || entry.outputStyles)) {
    let error44 = Error(`Plugin ${entry.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`);
    return logForDebugging(`Plugin ${entry.name} has both plugin.json and marketplace manifest entries for commands/agents/skills/hooks/outputStyles. This is a conflict.`, { level: "error" }), logError2(error44), errorsOut.push({
      type: "generic-error",
      source: pluginId,
      error: `Plugin ${entry.name} has conflicting manifests: both plugin.json and marketplace entry specify components. Set strict: true in marketplace entry or remove component specs from one location.`
    }), null;
  } else if (hasManifest) {
    if (entry.commands) {
      let firstValue = Object.values(entry.commands)[0];
      if (typeof entry.commands === "object" && !Array.isArray(entry.commands) && firstValue && typeof firstValue === "object" && (("source" in firstValue) || ("content" in firstValue))) {
        let commandsMetadata = {
          ...plugin.commandsMetadata || {}
        }, validPaths = [], entries2 = Object.entries(entry.commands), checks4 = await Promise.all(entries2.map(async ([commandName, metadata]) => {
          if (!metadata || typeof metadata !== "object" || !metadata.source)
            return { commandName, metadata, skip: !0 };
          let fullPath = join100(pluginPath, metadata.source);
          return {
            commandName,
            metadata,
            skip: !1,
            fullPath,
            exists: await pathExists(fullPath)
          };
        }));
        for (let check3 of checks4) {
          if (check3.skip)
            continue;
          if (check3.exists)
            validPaths.push(check3.fullPath), commandsMetadata[check3.commandName] = check3.metadata;
          else
            logForDebugging(`Command ${check3.commandName} path ${check3.metadata.source} from marketplace entry not found at ${check3.fullPath} for ${entry.name}`, { level: "warn" }), logError2(Error(`Plugin component file not found: ${check3.fullPath} for ${entry.name}`)), errors8.push({
              type: "path-not-found",
              source: pluginId,
              plugin: entry.name,
              path: check3.fullPath,
              component: "commands"
            });
        }
        if (validPaths.length > 0)
          plugin.commandsPaths = [
            ...plugin.commandsPaths || [],
            ...validPaths
          ], plugin.commandsMetadata = commandsMetadata;
      } else {
        let commandPaths = Array.isArray(entry.commands) ? entry.commands : [entry.commands], checks4 = await Promise.all(commandPaths.map(async (cmdPath) => {
          if (typeof cmdPath !== "string")
            return { cmdPath, kind: "invalid" };
          let fullPath = join100(pluginPath, cmdPath);
          return {
            cmdPath,
            kind: "path",
            fullPath,
            exists: await pathExists(fullPath)
          };
        })), validPaths = [];
        for (let check3 of checks4) {
          if (check3.kind === "invalid") {
            logForDebugging(`Unexpected command format in marketplace entry for ${entry.name}`, { level: "error" });
            continue;
          }
          if (check3.exists)
            validPaths.push(check3.fullPath);
          else
            logForDebugging(`Command path ${check3.cmdPath} from marketplace entry not found at ${check3.fullPath} for ${entry.name}`, { level: "warn" }), logError2(Error(`Plugin component file not found: ${check3.fullPath} for ${entry.name}`)), errors8.push({
              type: "path-not-found",
              source: pluginId,
              plugin: entry.name,
              path: check3.fullPath,
              component: "commands"
            });
        }
        if (validPaths.length > 0)
          plugin.commandsPaths = [
            ...plugin.commandsPaths || [],
            ...validPaths
          ];
      }
    }
    if (entry.agents) {
      let agentPaths = Array.isArray(entry.agents) ? entry.agents : [entry.agents], validPaths = await validatePluginPaths(agentPaths, pluginPath, entry.name, pluginId, "agents", "Agent", "from marketplace entry", errors8);
      if (validPaths.length > 0)
        plugin.agentsPaths = [...plugin.agentsPaths || [], ...validPaths];
    }
    if (entry.skills) {
      let skillPaths = Array.isArray(entry.skills) ? entry.skills : [entry.skills], validPaths = await validatePluginPaths(skillPaths, pluginPath, entry.name, pluginId, "skills", "Skill", "from marketplace entry", errors8);
      if (validPaths.length > 0)
        plugin.skillsPaths = [...plugin.skillsPaths || [], ...validPaths];
    }
    if (entry.outputStyles) {
      let outputStylePaths = Array.isArray(entry.outputStyles) ? entry.outputStyles : [entry.outputStyles], validPaths = await validatePluginPaths(outputStylePaths, pluginPath, entry.name, pluginId, "output-styles", "Output style", "from marketplace entry", errors8);
      if (validPaths.length > 0)
        plugin.outputStylesPaths = [
          ...plugin.outputStylesPaths || [],
          ...validPaths
        ];
    }
    if (entry.hooks)
      plugin.hooksConfig = {
        ...plugin.hooksConfig || {},
        ...entry.hooks
      };
  }
  return errorsOut.push(...errors8), plugin;
}
