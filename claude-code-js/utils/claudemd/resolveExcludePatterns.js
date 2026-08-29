// function: resolveExcludePatterns
function resolveExcludePatterns(patterns) {
  let fs15 = getFsImplementation(), expanded = patterns.map((p4) => p4.replaceAll("\\", "/"));
  for (let normalized of expanded) {
    if (!normalized.startsWith("/"))
      continue;
    let globStart = normalized.search(/[*?{[]/), staticPrefix = globStart === -1 ? normalized : normalized.slice(0, globStart), dirToResolve = dirname24(staticPrefix);
    try {
      let resolvedDir = fs15.realpathSync(dirToResolve).replaceAll("\\", "/");
      if (resolvedDir !== dirToResolve) {
        let resolvedPattern = resolvedDir + normalized.slice(dirToResolve.length);
        expanded.push(resolvedPattern);
      }
    } catch {}
  }
  return expanded;
}
async function processMemoryFile(filePath, type, processedPaths, includeExternal, depth = 0, parent2) {
  let normalizedPath = normalizePathForComparison(filePath);
  if (processedPaths.has(normalizedPath) || depth >= MAX_INCLUDE_DEPTH)
    return [];
  if (isClaudeMdExcluded(filePath, type))
    return [];
  let { resolvedPath: resolvedPath5, isSymlink } = safeResolvePath(getFsImplementation(), filePath);
  if (processedPaths.add(normalizedPath), isSymlink)
    processedPaths.add(normalizePathForComparison(resolvedPath5));
  let { info: memoryFile, includePaths: resolvedIncludePaths } = await safelyReadMemoryFileAsync(filePath, type, resolvedPath5);
  if (!memoryFile || !memoryFile.content.trim())
    return [];
  if (parent2)
    memoryFile.parent = parent2;
  let result = [];
  result.push(memoryFile);
  for (let resolvedIncludePath of resolvedIncludePaths) {
    if (!pathInOriginalCwd(resolvedIncludePath) && !includeExternal)
      continue;
    let includedFiles = await processMemoryFile(resolvedIncludePath, type, processedPaths, includeExternal, depth + 1, filePath);
    result.push(...includedFiles);
  }
  return result;
}
async function processMdRules({
  rulesDir,
  type,
  processedPaths,
  includeExternal,
  conditionalRule,
  visitedDirs = /* @__PURE__ */ new Set
}) {
  if (visitedDirs.has(rulesDir))
    return [];
  try {
    let fs15 = getFsImplementation(), { resolvedPath: resolvedRulesDir, isSymlink } = safeResolvePath(fs15, rulesDir);
    if (visitedDirs.add(rulesDir), isSymlink)
      visitedDirs.add(resolvedRulesDir);
    let result = [], entries;
    try {
      entries = await fs15.readdir(resolvedRulesDir);
    } catch (e) {
      let code = getErrnoCode(e);
      if (code === "ENOENT" || code === "EACCES" || code === "ENOTDIR")
        return [];
      throw e;
    }
    for (let entry of entries) {
      let entryPath = join44(rulesDir, entry.name), { resolvedPath: resolvedEntryPath, isSymlink: isSymlink2 } = safeResolvePath(fs15, entryPath), stats = isSymlink2 ? await fs15.stat(resolvedEntryPath) : null, isDirectory = stats ? stats.isDirectory() : entry.isDirectory(), isFile2 = stats ? stats.isFile() : entry.isFile();
      if (isDirectory)
        result.push(...await processMdRules({
          rulesDir: resolvedEntryPath,
          type,
          processedPaths,
          includeExternal,
          conditionalRule,
          visitedDirs
        }));
      else if (isFile2 && entry.name.endsWith(".md")) {
        let files2 = await processMemoryFile(resolvedEntryPath, type, processedPaths, includeExternal);
        result.push(...files2.filter((f) => conditionalRule ? f.globs : !f.globs));
      }
    }
    return result;
  } catch (error44) {
    if (error44 instanceof Error && error44.message.includes("EACCES"))
      logEvent("tengu_claude_rules_md_permission_error", {
        is_access_error: 1,
        has_home_dir: rulesDir.includes(getClaudeConfigHomeDir()) ? 1 : 0
      });
    return [];
  }
}
function isInstructionsMemoryType(type) {
  return type === "User" || type === "Project" || type === "Local" || type === "Managed";
}
function consumeNextEagerLoadReason() {
  if (!shouldFireHook)
    return;
  shouldFireHook = !1;
  let reason = nextEagerLoadReason;
  return nextEagerLoadReason = "session_start", reason;
}
function clearMemoryFileCaches() {
  getMemoryFiles.cache?.clear?.();
}
function resetGetMemoryFilesCache(reason = "session_start") {
  nextEagerLoadReason = reason, shouldFireHook = !0, clearMemoryFileCaches();
}
function getLargeMemoryFiles(files2) {
  return files2.filter((f) => f.content.length > MAX_MEMORY_CHARACTER_COUNT);
}
function filterInjectedMemoryFiles(files2) {
  return files2;
}
async function getManagedAndUserConditionalRules(targetPath, processedPaths) {
  let result = [], managedClaudeRulesDir = getManagedClaudeRulesDir();
  if (result.push(...await processConditionedMdRules(targetPath, managedClaudeRulesDir, "Managed", processedPaths, !1)), isSettingSourceEnabled("userSettings")) {
    let userClaudeRulesDir = getUserClaudeRulesDir();
    result.push(...await processConditionedMdRules(targetPath, userClaudeRulesDir, "User", processedPaths, !0));
  }
  return result;
}
async function getMemoryFilesForNestedDirectory(dir, targetPath, processedPaths) {
  let result = [];
  if (isSettingSourceEnabled("projectSettings")) {
    let projectPath = join44(dir, "CLAUDE.md");
    result.push(...await processMemoryFile(projectPath, "Project", processedPaths, !1));
    let dotClaudePath = join44(dir, ".claude", "CLAUDE.md");
    result.push(...await processMemoryFile(dotClaudePath, "Project", processedPaths, !1));
  }
  if (isSettingSourceEnabled("localSettings")) {
    let localPath = join44(dir, "CLAUDE.local.md");
    result.push(...await processMemoryFile(localPath, "Local", processedPaths, !1));
  }
  let rulesDir = join44(dir, ".claude", "rules"), unconditionalProcessedPaths = new Set(processedPaths);
  result.push(...await processMdRules({
    rulesDir,
    type: "Project",
    processedPaths: unconditionalProcessedPaths,
    includeExternal: !1,
    conditionalRule: !1
  })), result.push(...await processConditionedMdRules(targetPath, rulesDir, "Project", processedPaths, !1));
  for (let path16 of unconditionalProcessedPaths)
    processedPaths.add(path16);
  return result;
}
async function getConditionalRulesForCwdLevelDirectory(dir, targetPath, processedPaths) {
  let rulesDir = join44(dir, ".claude", "rules");
  return processConditionedMdRules(targetPath, rulesDir, "Project", processedPaths, !1);
}
async function processConditionedMdRules(targetPath, rulesDir, type, processedPaths, includeExternal) {
  return (await processMdRules({
    rulesDir,
    type,
    processedPaths,
    includeExternal,
    conditionalRule: !0
  })).filter((file2) => {
    if (!file2.globs || file2.globs.length === 0)
      return !1;
    let baseDir = type === "Project" ? dirname24(dirname24(rulesDir)) : getOriginalCwd(), relativePath = isAbsolute10(targetPath) ? relative7(baseDir, targetPath) : targetPath;
    if (!relativePath || relativePath.startsWith("..") || isAbsolute10(relativePath))
      return !1;
    return import_ignore2.default().add(file2.globs).ignores(relativePath);
  });
}
function getExternalClaudeMdIncludes(files2) {
  let externals = [];
  for (let file2 of files2)
    if (file2.type !== "User" && file2.parent && !pathInOriginalCwd(file2.path))
      externals.push({ path: file2.path, parent: file2.parent });
  return externals;
}
function hasExternalClaudeMdIncludes(files2) {
  return getExternalClaudeMdIncludes(files2).length > 0;
}
async function shouldShowClaudeMdExternalIncludesWarning() {
  let config10 = getCurrentProjectConfig();
  if (config10.hasClaudeMdExternalIncludesApproved || config10.hasClaudeMdExternalIncludesWarningShown)
    return !1;
  return hasExternalClaudeMdIncludes(await getMemoryFiles(!0));
}
var import_ignore2, import_picomatch, hasLoggedInitialLoad = !1, MEMORY_INSTRUCTION_PROMPT = "Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written.", MAX_MEMORY_CHARACTER_COUNT = 40000, TEXT_FILE_EXTENSIONS, MAX_INCLUDE_DEPTH = 5, getMemoryFiles, nextEagerLoadReason = "session_start", shouldFireHook = !0, getClaudeMds = (memoryFiles, filter2) => {
  let memories = [];
  for (let file2 of memoryFiles) {
    if (filter2 && !filter2(file2.type))
      continue;
    if (file2.content) {
      let description = file2.type === "Project" ? " (project instructions, checked into the codebase)" : file2.type === "Local" ? " (user's private project instructions, not checked in)" : file2.type === "AutoMem" ? " (user's auto-memory, persists across conversations)" : " (user's private global instructions for all projects)", content = file2.content.trim();
      memories.push(`Contents of ${file2.path}${description}:

${content}`);
    }
  }
  if (memories.length === 0)
    return "";
  return `${MEMORY_INSTRUCTION_PROMPT}

${memories.join(`

`)}`;
};
var init_claudemd = __esm(() => {
  init_memoize();
  init_marked_esm();
  init_state();
  init_memdir();
  init_paths();
  init_config4();
  init_debug();
  init_diagLogs();
  init_envUtils();
  init_errors();
  init_file();
  init_fileStateCache();
  init_frontmatterParser();
  init_fsOperations();
  init_git();
  init_hooks5();
  init_path2();
  init_filesystem();
  init_constants2();
  init_settings2();
  import_ignore2 = __toESM(require_ignore(), 1), import_picomatch = __toESM(require_picomatch2(), 1), TEXT_FILE_EXTENSIONS = /* @__PURE__ */ new Set([
    ".md",
    ".txt",
    ".text",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".xml",
    ".csv",
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".mjs",
    ".cjs",
    ".mts",
    ".cts",
    ".py",
    ".pyi",
    ".pyw",
    ".rb",
    ".erb",
    ".rake",
    ".go",
    ".rs",
    ".java",
    ".kt",
    ".kts",
    ".scala",
    ".c",
    ".cpp",
    ".cc",
    ".cxx",
    ".h",
    ".hpp",
    ".hxx",
    ".cs",
    ".swift",
    ".sh",
    ".bash",
    ".zsh",
    ".fish",
    ".ps1",
    ".bat",
    ".cmd",
    ".env",
    ".ini",
    ".cfg",
    ".conf",
    ".config",
    ".properties",
    ".sql",
    ".graphql",
    ".gql",
    ".proto",
    ".vue",
    ".svelte",
    ".astro",
    ".ejs",
    ".hbs",
    ".pug",
    ".jade",
    ".php",
    ".pl",
    ".pm",
    ".lua",
    ".r",
    ".R",
    ".dart",
    ".ex",
    ".exs",
    ".erl",
    ".hrl",
    ".clj",
    ".cljs",
    ".cljc",
    ".edn",
    ".hs",
    ".lhs",
    ".elm",
    ".ml",
    ".mli",
    ".f",
    ".f90",
    ".f95",
    ".for",
    ".cmake",
    ".make",
    ".makefile",
    ".gradle",
    ".sbt",
    ".rst",
    ".adoc",
    ".asciidoc",
    ".org",
    ".tex",
    ".latex",
    ".lock",
    ".log",
    ".diff",
    ".patch"
  ]);
  getMemoryFiles = memoize_default(async (forceIncludeExternal = !1) => {
    let startTime = Date.now();
    logForDiagnosticsNoPII("info", "memory_files_started");
    let result = [], processedPaths = /* @__PURE__ */ new Set, config10 = getCurrentProjectConfig(), includeExternal = forceIncludeExternal || config10.hasClaudeMdExternalIncludesApproved || !1, managedClaudeMd = getMemoryPath("Managed");
    result.push(...await processMemoryFile(managedClaudeMd, "Managed", processedPaths, includeExternal));
    let managedClaudeRulesDir = getManagedClaudeRulesDir();
    if (result.push(...await processMdRules({
      rulesDir: managedClaudeRulesDir,
      type: "Managed",
      processedPaths,
      includeExternal,
      conditionalRule: !1
    })), isSettingSourceEnabled("userSettings")) {
      let userClaudeMd = getMemoryPath("User");
      result.push(...await processMemoryFile(userClaudeMd, "User", processedPaths, !0));
      let userClaudeRulesDir = getUserClaudeRulesDir();
      result.push(...await processMdRules({
        rulesDir: userClaudeRulesDir,
        type: "User",
        processedPaths,
        includeExternal: !0,
        conditionalRule: !1
      }));
    }
    let dirs = [], originalCwd = getOriginalCwd(), currentDir = originalCwd;
    while (currentDir !== parse10(currentDir).root)
      dirs.push(currentDir), currentDir = dirname24(currentDir);
    let gitRoot = findGitRoot(originalCwd), canonicalRoot = findCanonicalGitRoot(originalCwd), isNestedWorktree = gitRoot !== null && canonicalRoot !== null && normalizePathForComparison(gitRoot) !== normalizePathForComparison(canonicalRoot) && pathInWorkingPath(gitRoot, canonicalRoot);
    for (let dir of dirs.reverse()) {
      let skipProject = isNestedWorktree && pathInWorkingPath(dir, canonicalRoot) && !pathInWorkingPath(dir, gitRoot);
      if (isSettingSourceEnabled("projectSettings") && !skipProject) {
        let projectPath = join44(dir, "CLAUDE.md");
        result.push(...await processMemoryFile(projectPath, "Project", processedPaths, includeExternal));
        let dotClaudePath = join44(dir, ".claude", "CLAUDE.md");
        result.push(...await processMemoryFile(dotClaudePath, "Project", processedPaths, includeExternal));
        let rulesDir = join44(dir, ".claude", "rules");
        result.push(...await processMdRules({
          rulesDir,
          type: "Project",
          processedPaths,
          includeExternal,
          conditionalRule: !1
        }));
      }
      if (isSettingSourceEnabled("localSettings")) {
        let localPath = join44(dir, "CLAUDE.local.md");
        result.push(...await processMemoryFile(localPath, "Local", processedPaths, includeExternal));
      }
    }
    if (isEnvTruthy(process.env.CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD)) {
      let additionalDirs = getAdditionalDirectoriesForClaudeMd();
      for (let dir of additionalDirs) {
        let projectPath = join44(dir, "CLAUDE.md");
        result.push(...await processMemoryFile(projectPath, "Project", processedPaths, includeExternal));
        let dotClaudePath = join44(dir, ".claude", "CLAUDE.md");
        result.push(...await processMemoryFile(dotClaudePath, "Project", processedPaths, includeExternal));
        let rulesDir = join44(dir, ".claude", "rules");
        result.push(...await processMdRules({
          rulesDir,
          type: "Project",
          processedPaths,
          includeExternal,
          conditionalRule: !1
        }));
      }
    }
    if (isAutoMemoryEnabled()) {
      let { info: memdirEntry } = await safelyReadMemoryFileAsync(getAutoMemEntrypoint(), "AutoMem");
      if (memdirEntry) {
        let normalizedPath = normalizePathForComparison(memdirEntry.path);
        if (!processedPaths.has(normalizedPath))
          processedPaths.add(normalizedPath), result.push(memdirEntry);
      }
    }
    let totalContentLength = result.reduce((sum, f) => sum + f.content.length, 0);
    logForDiagnosticsNoPII("info", "memory_files_completed", {
      duration_ms: Date.now() - startTime,
      file_count: result.length,
      total_content_length: totalContentLength
    });
    let typeCounts = {};
    for (let f of result)
      typeCounts[f.type] = (typeCounts[f.type] ?? 0) + 1;
    if (!hasLoggedInitialLoad)
      hasLoggedInitialLoad = !0, logEvent("tengu_claudemd__initial_load", {
        file_count: result.length,
        total_content_length: totalContentLength,
        user_count: typeCounts.User ?? 0,
        project_count: typeCounts.Project ?? 0,
        local_count: typeCounts.Local ?? 0,
        managed_count: typeCounts.Managed ?? 0,
        automem_count: typeCounts.AutoMem ?? 0,
        ...{},
        duration_ms: Date.now() - startTime
      });
    if (!forceIncludeExternal) {
      let eagerLoadReason = consumeNextEagerLoadReason();
      if (eagerLoadReason !== void 0 && hasInstructionsLoadedHook())
        for (let file2 of result) {
          if (!isInstructionsMemoryType(file2.type))
            continue;
          let loadReason = file2.parent ? "include" : eagerLoadReason;
          executeInstructionsLoadedHooks(file2.path, file2.type, loadReason, {
            globs: file2.globs,
            parentFilePath: file2.parent
          });
        }
    }
    return result;
  });
});

