// Original: src/utils/markdownConfigLoader.ts
import { statSync as statSync5 } from "fs";
import { lstat as lstat3, readdir as readdir6, readFile as readFile11, realpath as realpath4, stat as stat11 } from "fs/promises";
import { homedir as homedir13 } from "os";
import { dirname as dirname17, join as join28, resolve as resolve14, sep as sep7 } from "path";
function extractDescriptionFromMarkdown(content, defaultDescription = "Custom item") {
  let lines = content.split(`
`);
  for (let line of lines) {
    let trimmed = line.trim();
    if (trimmed) {
      let text = trimmed.match(/^#+\s+(.+)$/)?.[1] ?? trimmed;
      return text.length > 100 ? text.substring(0, 97) + "..." : text;
    }
  }
  return defaultDescription;
}
function parseToolListString(toolsValue) {
  if (toolsValue === void 0 || toolsValue === null)
    return null;
  if (!toolsValue)
    return [];
  let toolsArray = [];
  if (typeof toolsValue === "string")
    toolsArray = [toolsValue];
  else if (Array.isArray(toolsValue))
    toolsArray = toolsValue.filter((item) => typeof item === "string");
  if (toolsArray.length === 0)
    return [];
  let parsedTools = parseToolListFromCLI(toolsArray);
  if (parsedTools.includes("*"))
    return ["*"];
  return parsedTools;
}
function parseAgentToolsFromFrontmatter(toolsValue) {
  let parsed = parseToolListString(toolsValue);
  if (parsed === null)
    return toolsValue === void 0 ? void 0 : [];
  if (parsed.includes("*"))
    return;
  return parsed;
}
function parseSlashCommandToolsFromFrontmatter(toolsValue) {
  let parsed = parseToolListString(toolsValue);
  if (parsed === null)
    return [];
  return parsed;
}
async function getFileIdentity(filePath) {
  try {
    let stats = await lstat3(filePath, { bigint: !0 });
    if (stats.dev === 0n && stats.ino === 0n)
      return null;
    return `${stats.dev}:${stats.ino}`;
  } catch {
    return null;
  }
}
function resolveStopBoundary(cwd2) {
  let cwdGitRoot = findGitRoot(cwd2), sessionGitRoot = findGitRoot(getProjectRoot());
  if (!cwdGitRoot || !sessionGitRoot)
    return cwdGitRoot;
  let cwdCanonical = findCanonicalGitRoot(cwd2);
  if (cwdCanonical && normalizePathForComparison(cwdCanonical) === normalizePathForComparison(sessionGitRoot))
    return cwdGitRoot;
  let nCwdGitRoot = normalizePathForComparison(cwdGitRoot), nSessionRoot = normalizePathForComparison(sessionGitRoot);
  if (nCwdGitRoot !== nSessionRoot && nCwdGitRoot.startsWith(nSessionRoot + sep7))
    return sessionGitRoot;
  return cwdGitRoot;
}
function getProjectDirsUpToHome(subdir, cwd2) {
  let home = resolve14(homedir13()).normalize("NFC"), gitRoot = resolveStopBoundary(cwd2), current = resolve14(cwd2), dirs = [];
  while (!0) {
    if (normalizePathForComparison(current) === normalizePathForComparison(home))
      break;
    let claudeSubdir = join28(current, ".claude", subdir);
    try {
      statSync5(claudeSubdir), dirs.push(claudeSubdir);
    } catch (e) {
      if (!isFsInaccessible(e))
        throw e;
    }
    if (gitRoot && normalizePathForComparison(current) === normalizePathForComparison(gitRoot))
      break;
    let parent = dirname17(current);
    if (parent === current)
      break;
    current = parent;
  }
  return dirs;
}
async function findMarkdownFilesNative(dir, signal) {
  let files = [], visitedDirs = /* @__PURE__ */ new Set;
  async function walk(currentDir) {
    if (signal.aborted)
      return;
    try {
      let stats = await stat11(currentDir, { bigint: !0 });
      if (stats.isDirectory()) {
        let dirKey = stats.dev !== void 0 && stats.ino !== void 0 ? `${stats.dev}:${stats.ino}` : await realpath4(currentDir);
        if (visitedDirs.has(dirKey)) {
          logForDebugging(`Skipping already visited directory (circular symlink): ${currentDir}`);
          return;
        }
        visitedDirs.add(dirKey);
      }
    } catch (error44) {
      let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
      logForDebugging(`Failed to stat directory ${currentDir}: ${errorMessage2}`);
      return;
    }
    try {
      let entries = await readdir6(currentDir, { withFileTypes: !0 });
      for (let entry of entries) {
        if (signal.aborted)
          break;
        let fullPath = join28(currentDir, entry.name);
        try {
          if (entry.isSymbolicLink())
            try {
              let stats = await stat11(fullPath);
              if (stats.isDirectory())
                await walk(fullPath);
              else if (stats.isFile() && entry.name.endsWith(".md"))
                files.push(fullPath);
            } catch (error44) {
              let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
              logForDebugging(`Failed to follow symlink ${fullPath}: ${errorMessage2}`);
            }
          else if (entry.isDirectory())
            await walk(fullPath);
          else if (entry.isFile() && entry.name.endsWith(".md"))
            files.push(fullPath);
        } catch (error44) {
          let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
          logForDebugging(`Failed to access ${fullPath}: ${errorMessage2}`);
        }
      }
    } catch (error44) {
      let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
      logForDebugging(`Failed to read directory ${currentDir}: ${errorMessage2}`);
    }
  }
  return await walk(dir), files;
}
async function loadMarkdownFiles(dir) {
  let useNative = isEnvTruthy(process.env.CLAUDE_CODE_USE_NATIVE_FILE_SEARCH), signal = AbortSignal.timeout(3000), files;
  try {
    files = useNative ? await findMarkdownFilesNative(dir, signal) : await ripGrep(["--files", "--hidden", "--follow", "--no-ignore", "--glob", "*.md"], dir, signal);
  } catch (e) {
    if (isFsInaccessible(e))
      return [];
    throw e;
  }
  return (await Promise.all(files.map(async (filePath) => {
    try {
      let rawContent2 = await readFile11(filePath, { encoding: "utf-8" }), { frontmatter, content } = parseFrontmatter(rawContent2, filePath);
      return {
        filePath,
        frontmatter,
        content
      };
    } catch (error44) {
      let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
      return logForDebugging(`Failed to read/parse markdown file:  ${filePath}: ${errorMessage2}`), null;
    }
  }))).filter((_) => _ !== null);
}
var CLAUDE_CONFIG_DIRECTORIES, loadMarkdownFilesForSubdir;
var init_markdownConfigLoader = __esm(() => {
  init_memoize();
  init_state();
  init_debug();
  init_envUtils();
  init_errors();
  init_file();
  init_frontmatterParser();
  init_git();
  init_permissionSetup();
  init_ripgrep();
  init_constants2();
  init_managedPath();
  init_pluginOnlyPolicy();
  CLAUDE_CONFIG_DIRECTORIES = [
    "commands",
    "agents",
    "output-styles",
    "skills",
    "workflows",
    ...[]
  ];
  loadMarkdownFilesForSubdir = memoize_default(async function(subdir, cwd2) {
    let searchStartTime = Date.now(), userDir = join28(getClaudeConfigHomeDir(), subdir), managedDir = join28(getManagedFilePath(), ".claude", subdir), projectDirs = getProjectDirsUpToHome(subdir, cwd2), gitRoot = findGitRoot(cwd2), canonicalRoot = findCanonicalGitRoot(cwd2);
    if (gitRoot && canonicalRoot && canonicalRoot !== gitRoot) {
      let worktreeSubdir = normalizePathForComparison(join28(gitRoot, ".claude", subdir));
      if (!projectDirs.some((dir) => normalizePathForComparison(dir) === worktreeSubdir)) {
        let mainClaudeSubdir = join28(canonicalRoot, ".claude", subdir);
        if (!projectDirs.includes(mainClaudeSubdir))
          projectDirs.push(mainClaudeSubdir);
      }
    }
    let [managedFiles, userFiles, projectFilesNested] = await Promise.all([
      loadMarkdownFiles(managedDir).then((_) => _.map((file2) => ({
        ...file2,
        baseDir: managedDir,
        source: "policySettings"
      }))),
      isSettingSourceEnabled("userSettings") && !(subdir === "agents" && isRestrictedToPluginOnly("agents")) ? loadMarkdownFiles(userDir).then((_) => _.map((file2) => ({
        ...file2,
        baseDir: userDir,
        source: "userSettings"
      }))) : Promise.resolve([]),
      isSettingSourceEnabled("projectSettings") && !(subdir === "agents" && isRestrictedToPluginOnly("agents")) ? Promise.all(projectDirs.map((projectDir) => loadMarkdownFiles(projectDir).then((_) => _.map((file2) => ({
        ...file2,
        baseDir: projectDir,
        source: "projectSettings"
      }))))) : Promise.resolve([])
    ]), projectFiles = projectFilesNested.flat(), allFiles = [...managedFiles, ...userFiles, ...projectFiles], fileIdentities = await Promise.all(allFiles.map((file2) => getFileIdentity(file2.filePath))), seenFileIds = /* @__PURE__ */ new Map, deduplicatedFiles = [];
    for (let [i4, file2] of allFiles.entries()) {
      let fileId = fileIdentities[i4] ?? null;
      if (fileId === null) {
        deduplicatedFiles.push(file2);
        continue;
      }
      let existingSource = seenFileIds.get(fileId);
      if (existingSource !== void 0) {
        logForDebugging(`Skipping duplicate file '${file2.filePath}' from ${file2.source} (same inode already loaded from ${existingSource})`);
        continue;
      }
      seenFileIds.set(fileId, file2.source), deduplicatedFiles.push(file2);
    }
    let duplicatesRemoved = allFiles.length - deduplicatedFiles.length;
    if (duplicatesRemoved > 0)
      logForDebugging(`Deduplicated ${duplicatesRemoved} files in ${subdir} (same inode via symlinks or hard links)`);
    return logEvent("tengu_dir_search", {
      durationMs: Date.now() - searchStartTime,
      managedFilesFound: managedFiles.length,
      userFilesFound: userFiles.length,
      projectFilesFound: projectFiles.length,
      projectDirsSearched: projectDirs.length,
      subdir
    }), deduplicatedFiles;
  }, (subdir, cwd2) => `${subdir}:${cwd2}`);
});
