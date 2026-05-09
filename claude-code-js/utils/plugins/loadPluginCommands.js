// Original: src/utils/plugins/loadPluginCommands.ts
import { basename as basename27, dirname as dirname40, join as join93 } from "path";
function isSkillFile2(filePath) {
  return /^skill\.md$/i.test(basename27(filePath));
}
function getCommandNameFromFile(filePath, baseDir, pluginName) {
  if (isSkillFile2(filePath)) {
    let skillDirectory = dirname40(filePath), parentOfSkillDir = dirname40(skillDirectory), commandBaseName = basename27(skillDirectory), relativePath = parentOfSkillDir.startsWith(baseDir) ? parentOfSkillDir.slice(baseDir.length).replace(/^\//, "") : "", namespace = relativePath ? relativePath.split("/").join(":") : "";
    return namespace ? `${pluginName}:${namespace}:${commandBaseName}` : `${pluginName}:${commandBaseName}`;
  } else {
    let fileDirectory = dirname40(filePath), commandBaseName = basename27(filePath).replace(/\.md$/, ""), relativePath = fileDirectory.startsWith(baseDir) ? fileDirectory.slice(baseDir.length).replace(/^\//, "") : "", namespace = relativePath ? relativePath.split("/").join(":") : "";
    return namespace ? `${pluginName}:${namespace}:${commandBaseName}` : `${pluginName}:${commandBaseName}`;
  }
}
async function collectMarkdownFiles(dirPath, baseDir, loadedPaths) {
  let files2 = [], fs17 = getFsImplementation();
  return await walkPluginMarkdown(dirPath, async (fullPath) => {
    if (isDuplicatePath(fs17, fullPath, loadedPaths))
      return;
    let content = await fs17.readFile(fullPath, { encoding: "utf-8" }), { frontmatter, content: markdownContent } = parseFrontmatter(content, fullPath);
    files2.push({
      filePath: fullPath,
      baseDir,
      frontmatter,
      content: markdownContent
    });
  }, { stopAtSkillDir: !0, logLabel: "commands" }), files2;
}
function transformPluginSkillFiles(files2) {
  let filesByDir = /* @__PURE__ */ new Map;
  for (let file2 of files2) {
    let dir = dirname40(file2.filePath), dirFiles = filesByDir.get(dir) ?? [];
    dirFiles.push(file2), filesByDir.set(dir, dirFiles);
  }
  let result = [];
  for (let [dir, dirFiles] of filesByDir) {
    let skillFiles = dirFiles.filter((f) => isSkillFile2(f.filePath));
    if (skillFiles.length > 0) {
      let skillFile = skillFiles[0];
      if (skillFiles.length > 1)
        logForDebugging(`Multiple skill files found in ${dir}, using ${basename27(skillFile.filePath)}`);
      result.push(skillFile);
    } else
      result.push(...dirFiles);
  }
  return result;
}
async function loadCommandsFromDirectory(commandsPath, pluginName, sourceName, pluginManifest, pluginPath, config10 = { isSkillMode: !1 }, loadedPaths = /* @__PURE__ */ new Set) {
  let markdownFiles = await collectMarkdownFiles(commandsPath, commandsPath, loadedPaths), processedFiles = transformPluginSkillFiles(markdownFiles), commands7 = [];
  for (let file2 of processedFiles) {
    let commandName = getCommandNameFromFile(file2.filePath, file2.baseDir, pluginName), command12 = createPluginCommand(commandName, file2, sourceName, pluginManifest, pluginPath, isSkillFile2(file2.filePath), config10);
    if (command12)
      commands7.push(command12);
  }
  return commands7;
}
function createPluginCommand(commandName, file2, sourceName, pluginManifest, pluginPath, isSkill, config10 = { isSkillMode: !1 }) {
  try {
    let { frontmatter, content } = file2, validatedDescription = coerceDescriptionToString(frontmatter.description, commandName), description = validatedDescription ?? extractDescriptionFromMarkdown(content, isSkill ? "Plugin skill" : "Plugin command"), rawAllowedTools = frontmatter["allowed-tools"], substitutedAllowedTools = typeof rawAllowedTools === "string" ? substitutePluginVariables(rawAllowedTools, {
      path: pluginPath,
      source: sourceName
    }) : Array.isArray(rawAllowedTools) ? rawAllowedTools.map((tool) => typeof tool === "string" ? substitutePluginVariables(tool, {
      path: pluginPath,
      source: sourceName
    }) : tool) : rawAllowedTools, allowedTools = parseSlashCommandToolsFromFrontmatter(substitutedAllowedTools), argumentHint = frontmatter["argument-hint"], argumentNames = parseArgumentNames(frontmatter.arguments), whenToUse = frontmatter.when_to_use, version5 = frontmatter.version, displayName = frontmatter.name, model = frontmatter.model === "inherit" ? void 0 : frontmatter.model ? parseUserSpecifiedModel(frontmatter.model) : void 0, effortRaw = frontmatter.effort, effort = effortRaw !== void 0 ? parseEffortValue(effortRaw) : void 0;
    if (effortRaw !== void 0 && effort === void 0)
      logForDebugging(`Plugin command ${commandName} has invalid effort '${effortRaw}'. Valid options: ${EFFORT_LEVELS.join(", ")} or an integer`);
    let disableModelInvocation = parseBooleanFrontmatter(frontmatter["disable-model-invocation"]), userInvocableValue = frontmatter["user-invocable"], userInvocable = userInvocableValue === void 0 ? !0 : parseBooleanFrontmatter(userInvocableValue), shell = parseShellFrontmatter(frontmatter.shell, commandName);
    return {
      type: "prompt",
      name: commandName,
      description,
      hasUserSpecifiedDescription: validatedDescription !== null,
      allowedTools,
      argumentHint,
      argNames: argumentNames.length > 0 ? argumentNames : void 0,
      whenToUse,
      version: version5,
      model,
      effort,
      disableModelInvocation,
      userInvocable,
      contentLength: content.length,
      source: "plugin",
      loadedFrom: isSkill || config10.isSkillMode ? "plugin" : void 0,
      pluginInfo: {
        pluginManifest,
        repository: sourceName
      },
      isHidden: !userInvocable,
      progressMessage: isSkill || config10.isSkillMode ? "loading" : "running",
      userFacingName() {
        return displayName || commandName;
      },
      async getPromptForCommand(args, context6) {
        let finalContent = config10.isSkillMode ? `Base directory for this skill: ${dirname40(file2.filePath)}

${content}` : content;
        if (finalContent = substituteArguments(finalContent, args, !0, argumentNames), finalContent = substitutePluginVariables(finalContent, {
          path: pluginPath,
          source: sourceName
        }), pluginManifest.userConfig)
          finalContent = substituteUserConfigInContent(finalContent, loadPluginOptions(sourceName), pluginManifest.userConfig);
        if (config10.isSkillMode) {
          let rawSkillDir = dirname40(file2.filePath), skillDir = process.platform === "win32" ? rawSkillDir.replace(/\\/g, "/") : rawSkillDir;
          finalContent = finalContent.replace(/\$\{CLAUDE_SKILL_DIR\}/g, skillDir);
        }
        return finalContent = finalContent.replace(/\$\{CLAUDE_SESSION_ID\}/g, getSessionId()), finalContent = await executeShellCommandsInPrompt(finalContent, {
          ...context6,
          getAppState() {
            let appState = context6.getAppState();
            return {
              ...appState,
              toolPermissionContext: {
                ...appState.toolPermissionContext,
                alwaysAllowRules: {
                  ...appState.toolPermissionContext.alwaysAllowRules,
                  command: allowedTools
                }
              }
            };
          }
        }, `/${commandName}`, shell), [{ type: "text", text: finalContent }];
      }
    };
  } catch (error44) {
    return logForDebugging(`Failed to create command from ${file2.filePath}: ${error44}`, {
      level: "error"
    }), null;
  }
}
function clearPluginCommandCache() {
  getPluginCommands.cache?.clear?.();
}
async function loadSkillsFromDirectory(skillsPath, pluginName, sourceName, pluginManifest, pluginPath, loadedPaths) {
  let fs17 = getFsImplementation(), skills = [], directSkillPath = join93(skillsPath, "SKILL.md"), directSkillContent = null;
  try {
    directSkillContent = await fs17.readFile(directSkillPath, {
      encoding: "utf-8"
    });
  } catch (e) {
    if (!isENOENT(e))
      return logForDebugging(`Failed to load skill from ${directSkillPath}: ${e}`, {
        level: "error"
      }), skills;
  }
  if (directSkillContent !== null) {
    if (isDuplicatePath(fs17, directSkillPath, loadedPaths))
      return skills;
    try {
      let { frontmatter, content: markdownContent } = parseFrontmatter(directSkillContent, directSkillPath), skillName = `${pluginName}:${basename27(skillsPath)}`, file2 = {
        filePath: directSkillPath,
        baseDir: dirname40(directSkillPath),
        frontmatter,
        content: markdownContent
      }, skill = createPluginCommand(skillName, file2, sourceName, pluginManifest, pluginPath, !0, { isSkillMode: !0 });
      if (skill)
        skills.push(skill);
    } catch (error44) {
      logForDebugging(`Failed to load skill from ${directSkillPath}: ${error44}`, {
        level: "error"
      });
    }
    return skills;
  }
  let entries2;
  try {
    entries2 = await fs17.readdir(skillsPath);
  } catch (e) {
    if (!isENOENT(e))
      logForDebugging(`Failed to load skills from directory ${skillsPath}: ${e}`, { level: "error" });
    return skills;
  }
  return await Promise.all(entries2.map(async (entry) => {
    if (!entry.isDirectory() && !entry.isSymbolicLink())
      return;
    let skillDirPath = join93(skillsPath, entry.name), skillFilePath = join93(skillDirPath, "SKILL.md"), content;
    try {
      content = await fs17.readFile(skillFilePath, { encoding: "utf-8" });
    } catch (e) {
      if (!isENOENT(e))
        logForDebugging(`Failed to load skill from ${skillFilePath}: ${e}`, {
          level: "error"
        });
      return;
    }
    if (isDuplicatePath(fs17, skillFilePath, loadedPaths))
      return;
    try {
      let { frontmatter, content: markdownContent } = parseFrontmatter(content, skillFilePath), skillName = `${pluginName}:${entry.name}`, file2 = {
        filePath: skillFilePath,
        baseDir: dirname40(skillFilePath),
        frontmatter,
        content: markdownContent
      }, skill = createPluginCommand(skillName, file2, sourceName, pluginManifest, pluginPath, !0, { isSkillMode: !0 });
      if (skill)
        skills.push(skill);
    } catch (error44) {
      logForDebugging(`Failed to load skill from ${skillFilePath}: ${error44}`, { level: "error" });
    }
  })), skills;
}
function clearPluginSkillsCache() {
  getPluginSkills.cache?.clear?.();
}
var getPluginCommands, getPluginSkills;
var init_loadPluginCommands = __esm(() => {
  init_memoize();
  init_state();
  init_argumentSubstitution();
  init_debug();
  init_effort();
  init_envUtils();
  init_errors();
  init_frontmatterParser();
  init_fsOperations();
  init_markdownConfigLoader();
  init_model();
  init_promptShellExecution();
  init_pluginLoader();
  init_pluginOptionsStorage();
  init_walkPluginMarkdown();
  getPluginCommands = memoize_default(async () => {
    if (isBareMode() && getInlinePlugins().length === 0)
      return [];
    let { enabled: enabled2, errors: errors8 } = await loadAllPluginsCacheOnly();
    if (errors8.length > 0)
      logForDebugging(`Plugin loading errors: ${errors8.map((e) => getPluginErrorMessage(e)).join(", ")}`);
    let allCommands = (await Promise.all(enabled2.map(async (plugin) => {
      let loadedPaths = /* @__PURE__ */ new Set, pluginCommands = [];
      if (plugin.commandsPath)
        try {
          let commands7 = await loadCommandsFromDirectory(plugin.commandsPath, plugin.name, plugin.source, plugin.manifest, plugin.path, { isSkillMode: !1 }, loadedPaths);
          if (pluginCommands.push(...commands7), commands7.length > 0)
            logForDebugging(`Loaded ${commands7.length} commands from plugin ${plugin.name} default directory`);
        } catch (error44) {
          logForDebugging(`Failed to load commands from plugin ${plugin.name} default directory: ${error44}`, { level: "error" });
        }
      if (plugin.commandsPaths) {
        logForDebugging(`Plugin ${plugin.name} has commandsPaths: ${plugin.commandsPaths.join(", ")}`);
        let pathResults = await Promise.all(plugin.commandsPaths.map(async (commandPath) => {
          try {
            let fs17 = getFsImplementation(), stats = await fs17.stat(commandPath);
            if (logForDebugging(`Checking commandPath ${commandPath} - isDirectory: ${stats.isDirectory()}, isFile: ${stats.isFile()}`), stats.isDirectory()) {
              let commands7 = await loadCommandsFromDirectory(commandPath, plugin.name, plugin.source, plugin.manifest, plugin.path, { isSkillMode: !1 }, loadedPaths);
              if (commands7.length > 0)
                logForDebugging(`Loaded ${commands7.length} commands from plugin ${plugin.name} custom path: ${commandPath}`);
              else
                logForDebugging(`Warning: No commands found in plugin ${plugin.name} custom directory: ${commandPath}. Expected .md files or SKILL.md in subdirectories.`, { level: "warn" });
              return commands7;
            } else if (stats.isFile() && commandPath.endsWith(".md")) {
              if (isDuplicatePath(fs17, commandPath, loadedPaths))
                return [];
              let content = await fs17.readFile(commandPath, {
                encoding: "utf-8"
              }), { frontmatter, content: markdownContent } = parseFrontmatter(content, commandPath), commandName, metadataOverride;
              if (plugin.commandsMetadata) {
                for (let [name3, metadata] of Object.entries(plugin.commandsMetadata))
                  if (metadata.source) {
                    let fullMetadataPath = join93(plugin.path, metadata.source);
                    if (commandPath === fullMetadataPath) {
                      commandName = `${plugin.name}:${name3}`, metadataOverride = metadata;
                      break;
                    }
                  }
              }
              if (!commandName)
                commandName = `${plugin.name}:${basename27(commandPath).replace(/\.md$/, "")}`;
              let finalFrontmatter = metadataOverride ? {
                ...frontmatter,
                ...metadataOverride.description && {
                  description: metadataOverride.description
                },
                ...metadataOverride.argumentHint && {
                  "argument-hint": metadataOverride.argumentHint
                },
                ...metadataOverride.model && {
                  model: metadataOverride.model
                },
                ...metadataOverride.allowedTools && {
                  "allowed-tools": metadataOverride.allowedTools.join(",")
                }
              } : frontmatter, file2 = {
                filePath: commandPath,
                baseDir: dirname40(commandPath),
                frontmatter: finalFrontmatter,
                content: markdownContent
              }, command12 = createPluginCommand(commandName, file2, plugin.source, plugin.manifest, plugin.path, !1);
              if (command12)
                return logForDebugging(`Loaded command from plugin ${plugin.name} custom file: ${commandPath}${metadataOverride ? " (with metadata override)" : ""}`), [command12];
            }
            return [];
          } catch (error44) {
            return logForDebugging(`Failed to load commands from plugin ${plugin.name} custom path ${commandPath}: ${error44}`, { level: "error" }), [];
          }
        }));
        for (let commands7 of pathResults)
          pluginCommands.push(...commands7);
      }
      if (plugin.commandsMetadata) {
        for (let [name3, metadata] of Object.entries(plugin.commandsMetadata))
          if (metadata.content && !metadata.source)
            try {
              let { frontmatter, content: markdownContent } = parseFrontmatter(metadata.content, `<inline:${plugin.name}:${name3}>`), finalFrontmatter = {
                ...frontmatter,
                ...metadata.description && {
                  description: metadata.description
                },
                ...metadata.argumentHint && {
                  "argument-hint": metadata.argumentHint
                },
                ...metadata.model && {
                  model: metadata.model
                },
                ...metadata.allowedTools && {
                  "allowed-tools": metadata.allowedTools.join(",")
                }
              }, commandName = `${plugin.name}:${name3}`, file2 = {
                filePath: `<inline:${commandName}>`,
                baseDir: plugin.path,
                frontmatter: finalFrontmatter,
                content: markdownContent
              }, command12 = createPluginCommand(commandName, file2, plugin.source, plugin.manifest, plugin.path, !1);
              if (command12)
                pluginCommands.push(command12), logForDebugging(`Loaded inline content command from plugin ${plugin.name}: ${commandName}`);
            } catch (error44) {
              logForDebugging(`Failed to load inline content command ${name3} from plugin ${plugin.name}: ${error44}`, { level: "error" });
            }
      }
      return pluginCommands;
    }))).flat();
    return logForDebugging(`Total plugin commands loaded: ${allCommands.length}`), allCommands;
  });
  getPluginSkills = memoize_default(async () => {
    if (isBareMode() && getInlinePlugins().length === 0)
      return [];
    let { enabled: enabled2, errors: errors8 } = await loadAllPluginsCacheOnly();
    if (errors8.length > 0)
      logForDebugging(`Plugin loading errors: ${errors8.map((e) => getPluginErrorMessage(e)).join(", ")}`);
    logForDebugging(`getPluginSkills: Processing ${enabled2.length} enabled plugins`);
    let allSkills = (await Promise.all(enabled2.map(async (plugin) => {
      let loadedPaths = /* @__PURE__ */ new Set, pluginSkills = [];
      if (logForDebugging(`Checking plugin ${plugin.name}: skillsPath=${plugin.skillsPath ? "exists" : "none"}, skillsPaths=${plugin.skillsPaths ? plugin.skillsPaths.length : 0} paths`), plugin.skillsPath) {
        logForDebugging(`Attempting to load skills from plugin ${plugin.name} default skillsPath: ${plugin.skillsPath}`);
        try {
          let skills = await loadSkillsFromDirectory(plugin.skillsPath, plugin.name, plugin.source, plugin.manifest, plugin.path, loadedPaths);
          pluginSkills.push(...skills), logForDebugging(`Loaded ${skills.length} skills from plugin ${plugin.name} default directory`);
        } catch (error44) {
          logForDebugging(`Failed to load skills from plugin ${plugin.name} default directory: ${error44}`, { level: "error" });
        }
      }
      if (plugin.skillsPaths) {
        logForDebugging(`Attempting to load skills from plugin ${plugin.name} skillsPaths: ${plugin.skillsPaths.join(", ")}`);
        let pathResults = await Promise.all(plugin.skillsPaths.map(async (skillPath) => {
          try {
            logForDebugging(`Loading from skillPath: ${skillPath} for plugin ${plugin.name}`);
            let skills = await loadSkillsFromDirectory(skillPath, plugin.name, plugin.source, plugin.manifest, plugin.path, loadedPaths);
            return logForDebugging(`Loaded ${skills.length} skills from plugin ${plugin.name} custom path: ${skillPath}`), skills;
          } catch (error44) {
            return logForDebugging(`Failed to load skills from plugin ${plugin.name} custom path ${skillPath}: ${error44}`, { level: "error" }), [];
          }
        }));
        for (let skills of pathResults)
          pluginSkills.push(...skills);
      }
      return pluginSkills;
    }))).flat();
    return logForDebugging(`Total plugin skills loaded: ${allSkills.length}`), allSkills;
  });
});
