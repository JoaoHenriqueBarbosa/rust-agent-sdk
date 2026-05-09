// function: createPluginFromPath
async function createPluginFromPath(pluginPath, source, enabled2, fallbackName, strict = !0) {
  let errors8 = [], manifestPath = join100(pluginPath, ".claude-plugin", "plugin.json"), manifest = await loadPluginManifest(manifestPath, fallbackName, source), plugin = {
    name: manifest.name,
    manifest,
    path: pluginPath,
    source,
    repository: source,
    enabled: enabled2
  }, [
    commandsDirExists,
    agentsDirExists,
    skillsDirExists,
    outputStylesDirExists
  ] = await Promise.all([
    !manifest.commands ? pathExists(join100(pluginPath, "commands")) : !1,
    !manifest.agents ? pathExists(join100(pluginPath, "agents")) : !1,
    !manifest.skills ? pathExists(join100(pluginPath, "skills")) : !1,
    !manifest.outputStyles ? pathExists(join100(pluginPath, "output-styles")) : !1
  ]), commandsPath = join100(pluginPath, "commands");
  if (commandsDirExists)
    plugin.commandsPath = commandsPath;
  if (manifest.commands) {
    let firstValue = Object.values(manifest.commands)[0];
    if (typeof manifest.commands === "object" && !Array.isArray(manifest.commands) && firstValue && typeof firstValue === "object" && (("source" in firstValue) || ("content" in firstValue))) {
      let commandsMetadata = {}, validPaths = [], entries2 = Object.entries(manifest.commands), checks4 = await Promise.all(entries2.map(async ([commandName, metadata]) => {
        if (!metadata || typeof metadata !== "object")
          return { commandName, metadata, kind: "skip" };
        if (metadata.source) {
          let fullPath = join100(pluginPath, metadata.source);
          return {
            commandName,
            metadata,
            kind: "source",
            fullPath,
            exists: await pathExists(fullPath)
          };
        }
        if (metadata.content)
          return { commandName, metadata, kind: "content" };
        return { commandName, metadata, kind: "skip" };
      }));
      for (let check3 of checks4) {
        if (check3.kind === "skip")
          continue;
        if (check3.kind === "content") {
          commandsMetadata[check3.commandName] = check3.metadata;
          continue;
        }
        if (check3.exists)
          validPaths.push(check3.fullPath), commandsMetadata[check3.commandName] = check3.metadata;
        else
          logForDebugging(`Command ${check3.commandName} path ${check3.metadata.source} specified in manifest but not found at ${check3.fullPath} for ${manifest.name}`, { level: "warn" }), logError2(Error(`Plugin component file not found: ${check3.fullPath} for ${manifest.name}`)), errors8.push({
            type: "path-not-found",
            source,
            plugin: manifest.name,
            path: check3.fullPath,
            component: "commands"
          });
      }
      if (validPaths.length > 0)
        plugin.commandsPaths = validPaths;
      if (Object.keys(commandsMetadata).length > 0)
        plugin.commandsMetadata = commandsMetadata;
    } else {
      let commandPaths = Array.isArray(manifest.commands) ? manifest.commands : [manifest.commands], checks4 = await Promise.all(commandPaths.map(async (cmdPath) => {
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
          logForDebugging(`Unexpected command format in manifest for ${manifest.name}`, { level: "error" });
          continue;
        }
        if (check3.exists)
          validPaths.push(check3.fullPath);
        else
          logForDebugging(`Command path ${check3.cmdPath} specified in manifest but not found at ${check3.fullPath} for ${manifest.name}`, { level: "warn" }), logError2(Error(`Plugin component file not found: ${check3.fullPath} for ${manifest.name}`)), errors8.push({
            type: "path-not-found",
            source,
            plugin: manifest.name,
            path: check3.fullPath,
            component: "commands"
          });
      }
      if (validPaths.length > 0)
        plugin.commandsPaths = validPaths;
    }
  }
  let agentsPath = join100(pluginPath, "agents");
  if (agentsDirExists)
    plugin.agentsPath = agentsPath;
  if (manifest.agents) {
    let agentPaths = Array.isArray(manifest.agents) ? manifest.agents : [manifest.agents], validPaths = await validatePluginPaths(agentPaths, pluginPath, manifest.name, source, "agents", "Agent", "specified in manifest but", errors8);
    if (validPaths.length > 0)
      plugin.agentsPaths = validPaths;
  }
  let skillsPath = join100(pluginPath, "skills");
  if (skillsDirExists)
    plugin.skillsPath = skillsPath;
  if (manifest.skills) {
    let skillPaths = Array.isArray(manifest.skills) ? manifest.skills : [manifest.skills], validPaths = await validatePluginPaths(skillPaths, pluginPath, manifest.name, source, "skills", "Skill", "specified in manifest but", errors8);
    if (validPaths.length > 0)
      plugin.skillsPaths = validPaths;
  }
  let outputStylesPath = join100(pluginPath, "output-styles");
  if (outputStylesDirExists)
    plugin.outputStylesPath = outputStylesPath;
  if (manifest.outputStyles) {
    let outputStylePaths = Array.isArray(manifest.outputStyles) ? manifest.outputStyles : [manifest.outputStyles], validPaths = await validatePluginPaths(outputStylePaths, pluginPath, manifest.name, source, "output-styles", "Output style", "specified in manifest but", errors8);
    if (validPaths.length > 0)
      plugin.outputStylesPaths = validPaths;
  }
  let mergedHooks, loadedHookPaths = /* @__PURE__ */ new Set, standardHooksPath = join100(pluginPath, "hooks", "hooks.json");
  if (await pathExists(standardHooksPath))
    try {
      mergedHooks = await loadPluginHooks2(standardHooksPath, manifest.name);
      try {
        loadedHookPaths.add(await realpath10(standardHooksPath));
      } catch {
        loadedHookPaths.add(standardHooksPath);
      }
      logForDebugging(`Loaded hooks from standard location for plugin ${manifest.name}: ${standardHooksPath}`);
    } catch (error44) {
      let errorMsg = errorMessage(error44);
      logForDebugging(`Failed to load hooks for ${manifest.name}: ${errorMsg}`, {
        level: "error"
      }), logError2(toError(error44)), errors8.push({
        type: "hook-load-failed",
        source,
        plugin: manifest.name,
        hookPath: standardHooksPath,
        reason: errorMsg
      });
    }
  if (manifest.hooks) {
    let manifestHooksArray = Array.isArray(manifest.hooks) ? manifest.hooks : [manifest.hooks];
    for (let hookSpec of manifestHooksArray)
      if (typeof hookSpec === "string") {
        let hookFilePath = join100(pluginPath, hookSpec);
        if (!await pathExists(hookFilePath)) {
          logForDebugging(`Hooks file ${hookSpec} specified in manifest but not found at ${hookFilePath} for ${manifest.name}`, { level: "error" }), logError2(Error(`Plugin component file not found: ${hookFilePath} for ${manifest.name}`)), errors8.push({
            type: "path-not-found",
            source,
            plugin: manifest.name,
            path: hookFilePath,
            component: "hooks"
          });
          continue;
        }
        let normalizedPath;
        try {
          normalizedPath = await realpath10(hookFilePath);
        } catch {
          normalizedPath = hookFilePath;
        }
        if (loadedHookPaths.has(normalizedPath)) {
          if (logForDebugging(`Skipping duplicate hooks file for plugin ${manifest.name}: ${hookSpec} (resolves to already-loaded file: ${normalizedPath})`), strict) {
            let errorMsg = `Duplicate hooks file detected: ${hookSpec} resolves to already-loaded file ${normalizedPath}. The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files.`;
            logError2(Error(errorMsg)), errors8.push({
              type: "hook-load-failed",
              source,
              plugin: manifest.name,
              hookPath: hookFilePath,
              reason: errorMsg
            });
          }
          continue;
        }
        try {
          let additionalHooks = await loadPluginHooks2(hookFilePath, manifest.name);
          try {
            mergedHooks = mergeHooksSettings(mergedHooks, additionalHooks), loadedHookPaths.add(normalizedPath), logForDebugging(`Loaded and merged hooks from manifest for plugin ${manifest.name}: ${hookSpec}`);
          } catch (mergeError) {
            let mergeErrorMsg = errorMessage(mergeError);
            logForDebugging(`Failed to merge hooks from ${hookSpec} for ${manifest.name}: ${mergeErrorMsg}`, { level: "error" }), logError2(toError(mergeError)), errors8.push({
              type: "hook-load-failed",
              source,
              plugin: manifest.name,
              hookPath: hookFilePath,
              reason: `Failed to merge: ${mergeErrorMsg}`
            });
          }
        } catch (error44) {
          let errorMsg = errorMessage(error44);
          logForDebugging(`Failed to load hooks from ${hookSpec} for ${manifest.name}: ${errorMsg}`, { level: "error" }), logError2(toError(error44)), errors8.push({
            type: "hook-load-failed",
            source,
            plugin: manifest.name,
            hookPath: hookFilePath,
            reason: errorMsg
          });
        }
      } else if (typeof hookSpec === "object")
        mergedHooks = mergeHooksSettings(mergedHooks, hookSpec);
  }
  if (mergedHooks)
    plugin.hooksConfig = mergedHooks;
  let pluginSettings = await loadPluginSettings(pluginPath, manifest);
  if (pluginSettings)
    plugin.settings = pluginSettings;
  return { plugin, errors: errors8 };
}
