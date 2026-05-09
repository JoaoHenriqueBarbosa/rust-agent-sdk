// Original: src/skills/loadSkillsDir.ts
import { realpath as realpath9 } from "fs/promises";
import {
  basename as basename22,
  dirname as dirname33,
  isAbsolute as isAbsolute18,
  join as join82,
  sep as pathSep,
  relative as relative13
} from "path";
function getSkillsPath(source, dir) {
  switch (source) {
    case "policySettings":
      return join82(getManagedFilePath(), ".claude", dir);
    case "userSettings":
      return join82(getClaudeConfigHomeDir(), dir);
    case "projectSettings":
      return `.claude/${dir}`;
    case "plugin":
      return "plugin";
    default:
      return "";
  }
}
function estimateSkillFrontmatterTokens(skill) {
  let frontmatterText = [skill.name, skill.description, skill.whenToUse].filter(Boolean).join(" ");
  return roughTokenCountEstimation(frontmatterText);
}
async function getFileIdentity2(filePath) {
  try {
    return await realpath9(filePath);
  } catch {
    return null;
  }
}
function parseHooksFromFrontmatter2(frontmatter, skillName) {
  if (!frontmatter.hooks)
    return;
  let result = HooksSchema().safeParse(frontmatter.hooks);
  if (!result.success) {
    logForDebugging(`Invalid hooks in skill '${skillName}': ${result.error.message}`);
    return;
  }
  return result.data;
}
function parseSkillPaths(frontmatter) {
  if (!frontmatter.paths)
    return;
  let patterns = splitPathInFrontmatter(frontmatter.paths).map((pattern) => {
    return pattern.endsWith("/**") ? pattern.slice(0, -3) : pattern;
  }).filter((p4) => p4.length > 0);
  if (patterns.length === 0 || patterns.every((p4) => p4 === "**"))
    return;
  return patterns;
}
function parseSkillFrontmatterFields(frontmatter, markdownContent, resolvedName, descriptionFallbackLabel = "Skill") {
  let validatedDescription = coerceDescriptionToString(frontmatter.description, resolvedName), description = validatedDescription ?? extractDescriptionFromMarkdown(markdownContent, descriptionFallbackLabel), userInvocable = frontmatter["user-invocable"] === void 0 ? !0 : parseBooleanFrontmatter(frontmatter["user-invocable"]), model = frontmatter.model === "inherit" ? void 0 : frontmatter.model ? parseUserSpecifiedModel(frontmatter.model) : void 0, effortRaw = frontmatter.effort, effort = effortRaw !== void 0 ? parseEffortValue(effortRaw) : void 0;
  if (effortRaw !== void 0 && effort === void 0)
    logForDebugging(`Skill ${resolvedName} has invalid effort '${effortRaw}'. Valid options: ${EFFORT_LEVELS.join(", ")} or an integer`);
  return {
    displayName: frontmatter.name != null ? String(frontmatter.name) : void 0,
    description,
    hasUserSpecifiedDescription: validatedDescription !== null,
    allowedTools: parseSlashCommandToolsFromFrontmatter(frontmatter["allowed-tools"]),
    argumentHint: frontmatter["argument-hint"] != null ? String(frontmatter["argument-hint"]) : void 0,
    argumentNames: parseArgumentNames(frontmatter.arguments),
    whenToUse: frontmatter.when_to_use,
    version: frontmatter.version,
    model,
    disableModelInvocation: parseBooleanFrontmatter(frontmatter["disable-model-invocation"]),
    userInvocable,
    hooks: parseHooksFromFrontmatter2(frontmatter, resolvedName),
    executionContext: frontmatter.context === "fork" ? "fork" : void 0,
    agent: frontmatter.agent,
    effort,
    shell: parseShellFrontmatter(frontmatter.shell, resolvedName)
  };
}
function createSkillCommand({
  skillName,
  displayName,
  description,
  hasUserSpecifiedDescription,
  markdownContent,
  allowedTools,
  argumentHint,
  argumentNames,
  whenToUse,
  version: version5,
  model,
  disableModelInvocation,
  userInvocable,
  source,
  baseDir,
  loadedFrom,
  hooks,
  executionContext,
  agent,
  paths: paths2,
  effort,
  shell
}) {
  return {
    type: "prompt",
    name: skillName,
    description,
    hasUserSpecifiedDescription,
    allowedTools,
    argumentHint,
    argNames: argumentNames.length > 0 ? argumentNames : void 0,
    whenToUse,
    version: version5,
    model,
    disableModelInvocation,
    userInvocable,
    context: executionContext,
    agent,
    effort,
    paths: paths2,
    contentLength: markdownContent.length,
    isHidden: !userInvocable,
    progressMessage: "running",
    userFacingName() {
      return displayName || skillName;
    },
    source,
    loadedFrom,
    hooks,
    skillRoot: baseDir,
    async getPromptForCommand(args, toolUseContext) {
      let finalContent = baseDir ? `Base directory for this skill: ${baseDir}

${markdownContent}` : markdownContent;
      if (finalContent = substituteArguments(finalContent, args, !0, argumentNames), baseDir) {
        let skillDir = process.platform === "win32" ? baseDir.replace(/\\/g, "/") : baseDir;
        finalContent = finalContent.replace(/\$\{CLAUDE_SKILL_DIR\}/g, skillDir);
      }
      if (finalContent = finalContent.replace(/\$\{CLAUDE_SESSION_ID\}/g, getSessionId()), loadedFrom !== "mcp")
        finalContent = await executeShellCommandsInPrompt(finalContent, {
          ...toolUseContext,
          getAppState() {
            let appState = toolUseContext.getAppState();
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
        }, `/${skillName}`, shell);
      return [{ type: "text", text: finalContent }];
    }
  };
}
async function loadSkillsFromSkillsDir(basePath, source) {
  let fs17 = getFsImplementation(), entries;
  try {
    entries = await fs17.readdir(basePath);
  } catch (e) {
    if (!isFsInaccessible(e))
      logError2(e);
    return [];
  }
  return (await Promise.all(entries.map(async (entry) => {
    try {
      if (!entry.isDirectory() && !entry.isSymbolicLink())
        return null;
      let skillDirPath = join82(basePath, entry.name), skillFilePath = join82(skillDirPath, "SKILL.md"), content;
      try {
        content = await fs17.readFile(skillFilePath, { encoding: "utf-8" });
      } catch (e) {
        if (!isENOENT(e))
          logForDebugging(`[skills] failed to read ${skillFilePath}: ${e}`, {
            level: "warn"
          });
        return null;
      }
      let { frontmatter, content: markdownContent } = parseFrontmatter(content, skillFilePath), skillName = entry.name, parsed = parseSkillFrontmatterFields(frontmatter, markdownContent, skillName), paths2 = parseSkillPaths(frontmatter);
      return {
        skill: createSkillCommand({
          ...parsed,
          skillName,
          markdownContent,
          source,
          baseDir: skillDirPath,
          loadedFrom: "skills",
          paths: paths2
        }),
        filePath: skillFilePath
      };
    } catch (error44) {
      return logError2(error44), null;
    }
  }))).filter((r4) => r4 !== null);
}
function isSkillFile(filePath) {
  return /^skill\.md$/i.test(basename22(filePath));
}
function transformSkillFiles(files2) {
  let filesByDir = /* @__PURE__ */ new Map;
  for (let file2 of files2) {
    let dir = dirname33(file2.filePath), dirFiles = filesByDir.get(dir) ?? [];
    dirFiles.push(file2), filesByDir.set(dir, dirFiles);
  }
  let result = [];
  for (let [dir, dirFiles] of filesByDir) {
    let skillFiles = dirFiles.filter((f) => isSkillFile(f.filePath));
    if (skillFiles.length > 0) {
      let skillFile = skillFiles[0];
      if (skillFiles.length > 1)
        logForDebugging(`Multiple skill files found in ${dir}, using ${basename22(skillFile.filePath)}`);
      result.push(skillFile);
    } else
      result.push(...dirFiles);
  }
  return result;
}
function buildNamespace(targetDir, baseDir) {
  let normalizedBaseDir = baseDir.endsWith(pathSep) ? baseDir.slice(0, -1) : baseDir;
  if (targetDir === normalizedBaseDir)
    return "";
  let relativePath = targetDir.slice(normalizedBaseDir.length + 1);
  return relativePath ? relativePath.split(pathSep).join(":") : "";
}
function getSkillCommandName(filePath, baseDir) {
  let skillDirectory = dirname33(filePath), parentOfSkillDir = dirname33(skillDirectory), commandBaseName = basename22(skillDirectory), namespace = buildNamespace(parentOfSkillDir, baseDir);
  return namespace ? `${namespace}:${commandBaseName}` : commandBaseName;
}
function getRegularCommandName(filePath, baseDir) {
  let fileName = basename22(filePath), fileDirectory = dirname33(filePath), commandBaseName = fileName.replace(/\.md$/, ""), namespace = buildNamespace(fileDirectory, baseDir);
  return namespace ? `${namespace}:${commandBaseName}` : commandBaseName;
}
function getCommandName2(file2) {
  return isSkillFile(file2.filePath) ? getSkillCommandName(file2.filePath, file2.baseDir) : getRegularCommandName(file2.filePath, file2.baseDir);
}
async function loadSkillsFromCommandsDir(cwd2) {
  try {
    let markdownFiles = await loadMarkdownFilesForSubdir("commands", cwd2), processedFiles = transformSkillFiles(markdownFiles), skills = [];
    for (let {
      baseDir,
      filePath,
      frontmatter,
      content,
      source
    } of processedFiles)
      try {
        let skillDirectory = isSkillFile(filePath) ? dirname33(filePath) : void 0, cmdName = getCommandName2({
          baseDir,
          filePath,
          frontmatter,
          content,
          source
        }), parsed = parseSkillFrontmatterFields(frontmatter, content, cmdName, "Custom command");
        skills.push({
          skill: createSkillCommand({
            ...parsed,
            skillName: cmdName,
            displayName: void 0,
            markdownContent: content,
            source,
            baseDir: skillDirectory,
            loadedFrom: "commands_DEPRECATED",
            paths: void 0
          }),
          filePath
        });
      } catch (error44) {
        logError2(error44);
      }
    return skills;
  } catch (error44) {
    return logError2(error44), [];
  }
}
function clearSkillCaches() {
  getSkillDirCommands.cache?.clear?.(), loadMarkdownFilesForSubdir.cache?.clear?.(), conditionalSkills.clear(), activatedConditionalSkillNames.clear();
}
function onDynamicSkillsLoaded(callback) {
  return skillsLoaded.subscribe(() => {
    try {
      callback();
    } catch (error44) {
      logError2(error44);
    }
  });
}
async function discoverSkillDirsForPaths(filePaths, cwd2) {
  let fs17 = getFsImplementation(), resolvedCwd = cwd2.endsWith(pathSep) ? cwd2.slice(0, -1) : cwd2, newDirs = [];
  for (let filePath of filePaths) {
    let currentDir = dirname33(filePath);
    while (currentDir.startsWith(resolvedCwd + pathSep)) {
      let skillDir = join82(currentDir, ".claude", "skills");
      if (!dynamicSkillDirs.has(skillDir)) {
        dynamicSkillDirs.add(skillDir);
        try {
          if (await fs17.stat(skillDir), await isPathGitignored(currentDir, resolvedCwd)) {
            logForDebugging(`[skills] Skipped gitignored skills dir: ${skillDir}`);
            continue;
          }
          newDirs.push(skillDir);
        } catch {}
      }
      let parent2 = dirname33(currentDir);
      if (parent2 === currentDir)
        break;
      currentDir = parent2;
    }
  }
  return newDirs.sort((a2, b) => b.split(pathSep).length - a2.split(pathSep).length);
}
async function addSkillDirectories(dirs) {
  if (!isSettingSourceEnabled("projectSettings") || isRestrictedToPluginOnly("skills")) {
    logForDebugging("[skills] Dynamic skill discovery skipped: projectSettings disabled or plugin-only policy");
    return;
  }
  if (dirs.length === 0)
    return;
  let previousSkillNamesForLogging = new Set(dynamicSkills.keys()), loadedSkills = await Promise.all(dirs.map((dir) => loadSkillsFromSkillsDir(dir, "projectSettings")));
  for (let i5 = loadedSkills.length - 1;i5 >= 0; i5--)
    for (let { skill } of loadedSkills[i5] ?? [])
      if (skill.type === "prompt")
        dynamicSkills.set(skill.name, skill);
  let newSkillCount = loadedSkills.flat().length;
  if (newSkillCount > 0) {
    let addedSkills = [...dynamicSkills.keys()].filter((n5) => !previousSkillNamesForLogging.has(n5));
    if (logForDebugging(`[skills] Dynamically discovered ${newSkillCount} skills from ${dirs.length} directories`), addedSkills.length > 0)
      logEvent("tengu_dynamic_skills_changed", {
        source: "file_operation",
        previousCount: previousSkillNamesForLogging.size,
        newCount: dynamicSkills.size,
        addedCount: addedSkills.length,
        directoryCount: dirs.length
      });
  }
  skillsLoaded.emit();
}
function getDynamicSkills() {
  return Array.from(dynamicSkills.values());
}
function activateConditionalSkillsForPaths(filePaths, cwd2) {
  if (conditionalSkills.size === 0)
    return [];
  let activated = [];
  for (let [name3, skill] of conditionalSkills) {
    if (skill.type !== "prompt" || !skill.paths || skill.paths.length === 0)
      continue;
    let skillIgnore = import_ignore3.default().add(skill.paths);
    for (let filePath of filePaths) {
      let relativePath = isAbsolute18(filePath) ? relative13(cwd2, filePath) : filePath;
      if (!relativePath || relativePath.startsWith("..") || isAbsolute18(relativePath))
        continue;
      if (skillIgnore.ignores(relativePath)) {
        dynamicSkills.set(name3, skill), conditionalSkills.delete(name3), activatedConditionalSkillNames.add(name3), activated.push(name3), logForDebugging(`[skills] Activated conditional skill '${name3}' (matched path: ${relativePath})`);
        break;
      }
    }
  }
  if (activated.length > 0)
    logEvent("tengu_dynamic_skills_changed", {
      source: "conditional_paths",
      previousCount: dynamicSkills.size - activated.length,
      newCount: dynamicSkills.size,
      addedCount: activated.length,
      directoryCount: 0
    }), skillsLoaded.emit();
  return activated;
}
function clearDynamicSkills() {
  dynamicSkillDirs.clear(), dynamicSkills.clear(), conditionalSkills.clear(), activatedConditionalSkillNames.clear();
}
var import_ignore3, getSkillDirCommands, dynamicSkillDirs, dynamicSkills, conditionalSkills, activatedConditionalSkillNames, skillsLoaded;
var init_loadSkillsDir = __esm(() => {
  init_memoize();
  init_state();
  init_tokenEstimation();
  init_argumentSubstitution();
  init_debug();
  init_effort();
  init_envUtils();
  init_errors();
  init_frontmatterParser();
  init_fsOperations();
  init_gitignore();
  init_log3();
  init_markdownConfigLoader();
  init_model();
  init_promptShellExecution();
  init_constants2();
  init_managedPath();
  init_pluginOnlyPolicy();
  init_types3();
  import_ignore3 = __toESM(require_ignore(), 1);
  getSkillDirCommands = memoize_default(async (cwd2) => {
    let userSkillsDir = join82(getClaudeConfigHomeDir(), "skills"), managedSkillsDir = join82(getManagedFilePath(), ".claude", "skills"), projectSkillsDirs = getProjectDirsUpToHome("skills", cwd2);
    logForDebugging(`Loading skills from: managed=${managedSkillsDir}, user=${userSkillsDir}, project=[${projectSkillsDirs.join(", ")}]`);
    let additionalDirs = getAdditionalDirectoriesForClaudeMd(), skillsLocked = isRestrictedToPluginOnly("skills"), projectSettingsEnabled = isSettingSourceEnabled("projectSettings") && !skillsLocked;
    if (isBareMode()) {
      if (additionalDirs.length === 0 || !projectSettingsEnabled)
        return logForDebugging(`[bare] Skipping skill dir discovery (${additionalDirs.length === 0 ? "no --add-dir" : "projectSettings disabled or skillsLocked"})`), [];
      return (await Promise.all(additionalDirs.map((dir) => loadSkillsFromSkillsDir(join82(dir, ".claude", "skills"), "projectSettings")))).flat().map((s2) => s2.skill);
    }
    let [
      managedSkills,
      userSkills,
      projectSkillsNested,
      additionalSkillsNested,
      legacyCommands
    ] = await Promise.all([
      isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_POLICY_SKILLS) ? Promise.resolve([]) : loadSkillsFromSkillsDir(managedSkillsDir, "policySettings"),
      isSettingSourceEnabled("userSettings") && !skillsLocked ? loadSkillsFromSkillsDir(userSkillsDir, "userSettings") : Promise.resolve([]),
      projectSettingsEnabled ? Promise.all(projectSkillsDirs.map((dir) => loadSkillsFromSkillsDir(dir, "projectSettings"))) : Promise.resolve([]),
      projectSettingsEnabled ? Promise.all(additionalDirs.map((dir) => loadSkillsFromSkillsDir(join82(dir, ".claude", "skills"), "projectSettings"))) : Promise.resolve([]),
      skillsLocked ? Promise.resolve([]) : loadSkillsFromCommandsDir(cwd2)
    ]), allSkillsWithPaths = [
      ...managedSkills,
      ...userSkills,
      ...projectSkillsNested.flat(),
      ...additionalSkillsNested.flat(),
      ...legacyCommands
    ], fileIds = await Promise.all(allSkillsWithPaths.map(({ skill, filePath }) => skill.type === "prompt" ? getFileIdentity2(filePath) : Promise.resolve(null))), seenFileIds = /* @__PURE__ */ new Map, deduplicatedSkills = [];
    for (let i5 = 0;i5 < allSkillsWithPaths.length; i5++) {
      let entry = allSkillsWithPaths[i5];
      if (entry === void 0 || entry.skill.type !== "prompt")
        continue;
      let { skill } = entry, fileId = fileIds[i5];
      if (fileId === null || fileId === void 0) {
        deduplicatedSkills.push(skill);
        continue;
      }
      let existingSource = seenFileIds.get(fileId);
      if (existingSource !== void 0) {
        logForDebugging(`Skipping duplicate skill '${skill.name}' from ${skill.source} (same file already loaded from ${existingSource})`);
        continue;
      }
      seenFileIds.set(fileId, skill.source), deduplicatedSkills.push(skill);
    }
    let duplicatesRemoved = allSkillsWithPaths.length - deduplicatedSkills.length;
    if (duplicatesRemoved > 0)
      logForDebugging(`Deduplicated ${duplicatesRemoved} skills (same file)`);
    let unconditionalSkills = [], newConditionalSkills = [];
    for (let skill of deduplicatedSkills)
      if (skill.type === "prompt" && skill.paths && skill.paths.length > 0 && !activatedConditionalSkillNames.has(skill.name))
        newConditionalSkills.push(skill);
      else
        unconditionalSkills.push(skill);
    for (let skill of newConditionalSkills)
      conditionalSkills.set(skill.name, skill);
    if (newConditionalSkills.length > 0)
      logForDebugging(`[skills] ${newConditionalSkills.length} conditional skills stored (activated when matching files are touched)`);
    return logForDebugging(`Loaded ${deduplicatedSkills.length} unique skills (${unconditionalSkills.length} unconditional, ${newConditionalSkills.length} conditional, managed: ${managedSkills.length}, user: ${userSkills.length}, project: ${projectSkillsNested.flat().length}, additional: ${additionalSkillsNested.flat().length}, legacy commands: ${legacyCommands.length})`), unconditionalSkills;
  });
  dynamicSkillDirs = /* @__PURE__ */ new Set, dynamicSkills = /* @__PURE__ */ new Map, conditionalSkills = /* @__PURE__ */ new Map, activatedConditionalSkillNames = /* @__PURE__ */ new Set, skillsLoaded = createSignal();
  registerMCPSkillBuilders({
    createSkillCommand,
    parseSkillFrontmatterFields
  });
});
