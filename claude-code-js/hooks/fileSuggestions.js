// Original: src/hooks/fileSuggestions.ts
import { statSync as statSync11 } from "fs";
import * as path21 from "path";
function getFileIndex() {
  if (!fileIndex)
    fileIndex = new FileIndex;
  return fileIndex;
}
function clearFileSuggestionCaches() {
  fileIndex = null, fileListRefreshPromise = null, cacheGeneration++, untrackedFetchPromise = null, cachedTrackedFiles = [], cachedConfigFiles = [], cachedTrackedDirs = [], indexBuildComplete.clear(), ignorePatternsCache = null, ignorePatternsCacheKey = null, lastRefreshMs = 0, lastGitIndexMtime = null, loadedTrackedSignature = null, loadedMergedSignature = null;
}
function pathListSignature(paths2) {
  let n5 = paths2.length, stride = Math.max(1, Math.floor(n5 / 500)), h4 = -2128831035;
  for (let i5 = 0;i5 < n5; i5 += stride) {
    let p4 = paths2[i5];
    for (let j4 = 0;j4 < p4.length; j4++)
      h4 = (h4 ^ p4.charCodeAt(j4)) * 16777619 | 0;
    h4 = h4 * 16777619 | 0;
  }
  if (n5 > 0) {
    let last2 = paths2[n5 - 1];
    for (let j4 = 0;j4 < last2.length; j4++)
      h4 = (h4 ^ last2.charCodeAt(j4)) * 16777619 | 0;
  }
  return `${n5}:${(h4 >>> 0).toString(16)}`;
}
function getGitIndexMtime() {
  let repoRoot = findGitRoot(getCwd());
  if (!repoRoot)
    return null;
  try {
    return statSync11(path21.join(repoRoot, ".git", "index")).mtimeMs;
  } catch {
    return null;
  }
}
function normalizeGitPaths(files2, repoRoot, originalCwd) {
  if (originalCwd === repoRoot)
    return files2;
  return files2.map((f) => {
    let absolutePath = path21.join(repoRoot, f);
    return path21.relative(originalCwd, absolutePath);
  });
}
async function mergeUntrackedIntoNormalizedCache(normalizedUntracked) {
  if (normalizedUntracked.length === 0)
    return;
  if (!fileIndex || cachedTrackedFiles.length === 0)
    return;
  let untrackedDirs = await getDirectoryNamesAsync(normalizedUntracked), allPaths = [
    ...cachedTrackedFiles,
    ...cachedConfigFiles,
    ...cachedTrackedDirs,
    ...normalizedUntracked,
    ...untrackedDirs
  ], sig = pathListSignature(allPaths);
  if (sig === loadedMergedSignature) {
    logForDebugging("[FileIndex] skipped index rebuild \u2014 merged paths unchanged");
    return;
  }
  await fileIndex.loadFromFileListAsync(allPaths).done, loadedMergedSignature = sig, logForDebugging(`[FileIndex] rebuilt index with ${cachedTrackedFiles.length} tracked + ${normalizedUntracked.length} untracked files`);
}
async function loadRipgrepIgnorePatterns(repoRoot, cwd2) {
  let cacheKey = `${repoRoot}:${cwd2}`;
  if (ignorePatternsCacheKey === cacheKey)
    return ignorePatternsCache;
  let fs17 = getFsImplementation(), ignoreFiles = [".ignore", ".rgignore"], directories = [.../* @__PURE__ */ new Set([repoRoot, cwd2])], ig = import_ignore4.default(), hasPatterns = !1, paths2 = directories.flatMap((dir) => ignoreFiles.map((f) => path21.join(dir, f))), contents = await Promise.all(paths2.map((p4) => fs17.readFile(p4, { encoding: "utf8" }).catch(() => null)));
  for (let [i5, content] of contents.entries()) {
    if (content === null)
      continue;
    ig.add(content), hasPatterns = !0, logForDebugging(`[FileIndex] loaded ignore patterns from ${paths2[i5]}`);
  }
  let result = hasPatterns ? ig : null;
  return ignorePatternsCache = result, ignorePatternsCacheKey = cacheKey, result;
}
async function getFilesUsingGit(abortSignal, respectGitignore) {
  let startTime = Date.now();
  logForDebugging("[FileIndex] getFilesUsingGit called");
  let repoRoot = findGitRoot(getCwd());
  if (!repoRoot)
    return logForDebugging("[FileIndex] not a git repo, returning null"), null;
  try {
    let cwd2 = getCwd(), lsFilesStart = Date.now(), trackedResult = await execFileNoThrowWithCwd(gitExe(), ["-c", "core.quotepath=false", "ls-files", "--recurse-submodules"], { timeout: 5000, abortSignal, cwd: repoRoot });
    if (logForDebugging(`[FileIndex] git ls-files (tracked) took ${Date.now() - lsFilesStart}ms`), trackedResult.code !== 0)
      return logForDebugging(`[FileIndex] git ls-files failed (code=${trackedResult.code}, stderr=${trackedResult.stderr}), falling back to ripgrep`), null;
    let trackedFiles = trackedResult.stdout.trim().split(`
`).filter(Boolean), normalizedTracked = normalizeGitPaths(trackedFiles, repoRoot, cwd2), ignorePatterns = await loadRipgrepIgnorePatterns(repoRoot, cwd2);
    if (ignorePatterns) {
      let beforeCount = normalizedTracked.length;
      normalizedTracked = ignorePatterns.filter(normalizedTracked), logForDebugging(`[FileIndex] applied ignore patterns: ${beforeCount} -> ${normalizedTracked.length} files`);
    }
    cachedTrackedFiles = normalizedTracked;
    let duration3 = Date.now() - startTime;
    if (logForDebugging(`[FileIndex] git ls-files: ${normalizedTracked.length} tracked files in ${duration3}ms`), logEvent("tengu_file_suggestions_git_ls_files", {
      file_count: normalizedTracked.length,
      tracked_count: normalizedTracked.length,
      untracked_count: 0,
      duration_ms: duration3
    }), !untrackedFetchPromise) {
      let untrackedArgs = respectGitignore ? [
        "-c",
        "core.quotepath=false",
        "ls-files",
        "--others",
        "--exclude-standard"
      ] : ["-c", "core.quotepath=false", "ls-files", "--others"], generation = cacheGeneration;
      untrackedFetchPromise = execFileNoThrowWithCwd(gitExe(), untrackedArgs, {
        timeout: 1e4,
        cwd: repoRoot
      }).then(async (untrackedResult) => {
        if (generation !== cacheGeneration)
          return;
        if (untrackedResult.code === 0) {
          let rawUntrackedFiles = untrackedResult.stdout.trim().split(`
`).filter(Boolean), normalizedUntracked = normalizeGitPaths(rawUntrackedFiles, repoRoot, cwd2), ignorePatterns2 = await loadRipgrepIgnorePatterns(repoRoot, cwd2);
          if (ignorePatterns2 && normalizedUntracked.length > 0) {
            let beforeCount = normalizedUntracked.length;
            normalizedUntracked = ignorePatterns2.filter(normalizedUntracked), logForDebugging(`[FileIndex] applied ignore patterns to untracked: ${beforeCount} -> ${normalizedUntracked.length} files`);
          }
          logForDebugging(`[FileIndex] background untracked fetch: ${normalizedUntracked.length} files`), mergeUntrackedIntoNormalizedCache(normalizedUntracked);
        }
      }).catch((error44) => {
        logForDebugging(`[FileIndex] background untracked fetch failed: ${error44}`);
      }).finally(() => {
        untrackedFetchPromise = null;
      });
    }
    return normalizedTracked;
  } catch (error44) {
    return logForDebugging(`[FileIndex] git ls-files error: ${errorMessage(error44)}`), null;
  }
}
async function getDirectoryNamesAsync(files2) {
  let directoryNames = /* @__PURE__ */ new Set, chunkStart = performance.now();
  for (let i5 = 0;i5 < files2.length; i5++)
    if (collectDirectoryNames(files2, i5, i5 + 1, directoryNames), (i5 & 255) === 255 && performance.now() - chunkStart > CHUNK_MS)
      await yieldToEventLoop(), chunkStart = performance.now();
  return [...directoryNames].map((d) => d + path21.sep);
}
function collectDirectoryNames(files2, start, end, out) {
  for (let i5 = start;i5 < end; i5++) {
    let currentDir = path21.dirname(files2[i5]);
    while (currentDir !== "." && !out.has(currentDir)) {
      let parent2 = path21.dirname(currentDir);
      if (parent2 === currentDir)
        break;
      out.add(currentDir), currentDir = parent2;
    }
  }
}
async function getClaudeConfigFiles(cwd2) {
  return (await Promise.all(CLAUDE_CONFIG_DIRECTORIES.map((subdir) => loadMarkdownFilesForSubdir(subdir, cwd2)))).flatMap((markdownFiles) => markdownFiles.map((f) => f.filePath));
}
async function getProjectFiles(abortSignal, respectGitignore) {
  logForDebugging(`[FileIndex] getProjectFiles called, respectGitignore=${respectGitignore}`);
  let gitFiles = await getFilesUsingGit(abortSignal, respectGitignore);
  if (gitFiles !== null)
    return logForDebugging(`[FileIndex] using git ls-files result (${gitFiles.length} files)`), gitFiles;
  logForDebugging("[FileIndex] git ls-files returned null, falling back to ripgrep");
  let startTime = Date.now(), rgArgs = [
    "--files",
    "--follow",
    "--hidden",
    "--glob",
    "!.git/",
    "--glob",
    "!.svn/",
    "--glob",
    "!.hg/",
    "--glob",
    "!.bzr/",
    "--glob",
    "!.jj/",
    "--glob",
    "!.sl/"
  ];
  if (!respectGitignore)
    rgArgs.push("--no-ignore-vcs");
  let relativePaths = (await ripGrep(rgArgs, ".", abortSignal)).map((f) => path21.relative(getCwd(), f)), duration3 = Date.now() - startTime;
  return logForDebugging(`[FileIndex] ripgrep: ${relativePaths.length} files in ${duration3}ms`), logEvent("tengu_file_suggestions_ripgrep", {
    file_count: relativePaths.length,
    duration_ms: duration3
  }), relativePaths;
}
async function getPathsForSuggestions() {
  let signal = AbortSignal.timeout(1e4), index = getFileIndex();
  try {
    let projectSettings = getInitialSettings(), globalConfig2 = getGlobalConfig(), respectGitignore = projectSettings.respectGitignore ?? globalConfig2.respectGitignore ?? !0, cwd2 = getCwd(), [projectFiles, configFiles] = await Promise.all([
      getProjectFiles(signal, respectGitignore),
      getClaudeConfigFiles(cwd2)
    ]);
    cachedConfigFiles = configFiles;
    let allFiles = [...projectFiles, ...configFiles], directories = await getDirectoryNamesAsync(allFiles);
    cachedTrackedDirs = directories;
    let allPathsList = [...directories, ...allFiles], sig = pathListSignature(allPathsList);
    if (sig !== loadedTrackedSignature)
      await index.loadFromFileListAsync(allPathsList).done, loadedTrackedSignature = sig, loadedMergedSignature = null;
    else
      logForDebugging("[FileIndex] skipped index rebuild \u2014 tracked paths unchanged");
  } catch (error44) {
    logError2(error44);
  }
  return index;
}
function findCommonPrefix(a2, b) {
  let minLength = Math.min(a2.length, b.length), i5 = 0;
  while (i5 < minLength && a2[i5] === b[i5])
    i5++;
  return a2.substring(0, i5);
}
function findLongestCommonPrefix(suggestions) {
  if (suggestions.length === 0)
    return "";
  let strings = suggestions.map((item) => item.displayText), prefix = strings[0];
  for (let i5 = 1;i5 < strings.length; i5++) {
    let currentString = strings[i5];
    if (prefix = findCommonPrefix(prefix, currentString), prefix === "")
      return "";
  }
  return prefix;
}
function createFileSuggestionItem(filePath, score) {
  return {
    id: `file-${filePath}`,
    displayText: filePath,
    metadata: score !== void 0 ? { score } : void 0
  };
}
function findMatchingFiles(fileIndex2, partialPath) {
  return fileIndex2.search(partialPath, MAX_SUGGESTIONS).map((result) => createFileSuggestionItem(result.path, result.score));
}
function startBackgroundCacheRefresh() {
  if (fileListRefreshPromise)
    return;
  let indexMtime = getGitIndexMtime();
  if (fileIndex) {
    if (!(indexMtime !== null && indexMtime !== lastGitIndexMtime) && Date.now() - lastRefreshMs < REFRESH_THROTTLE_MS)
      return;
  }
  let generation = cacheGeneration, refreshStart = Date.now();
  getFileIndex(), fileListRefreshPromise = getPathsForSuggestions().then((result) => {
    if (generation !== cacheGeneration)
      return result;
    return fileListRefreshPromise = null, indexBuildComplete.emit(), lastGitIndexMtime = indexMtime, lastRefreshMs = Date.now(), logForDebugging(`[FileIndex] cache refresh completed in ${Date.now() - refreshStart}ms`), result;
  }).catch((error44) => {
    if (logForDebugging(`[FileIndex] Cache refresh failed: ${errorMessage(error44)}`), logError2(error44), generation === cacheGeneration)
      fileListRefreshPromise = null;
    return getFileIndex();
  });
}
async function getTopLevelPaths() {
  let fs17 = getFsImplementation(), cwd2 = getCwd();
  try {
    return (await fs17.readdir(cwd2)).map((entry) => {
      let fullPath = path21.join(cwd2, entry.name), relativePath = path21.relative(cwd2, fullPath);
      return entry.isDirectory() ? relativePath + path21.sep : relativePath;
    });
  } catch (error44) {
    return logError2(error44), [];
  }
}
async function generateFileSuggestions(partialPath, showOnEmpty = !1) {
  if (!partialPath && !showOnEmpty)
    return [];
  if (getInitialSettings().fileSuggestion?.type === "command") {
    let input = {
      ...createBaseHookInput(),
      query: partialPath
    };
    return (await executeFileSuggestionCommand(input)).slice(0, MAX_SUGGESTIONS).map(createFileSuggestionItem);
  }
  if (partialPath === "" || partialPath === "." || partialPath === "./") {
    let topLevelPaths = await getTopLevelPaths();
    return startBackgroundCacheRefresh(), topLevelPaths.slice(0, MAX_SUGGESTIONS).map(createFileSuggestionItem);
  }
  let startTime = Date.now();
  try {
    let wasBuilding = fileListRefreshPromise !== null;
    startBackgroundCacheRefresh();
    let normalizedPath = partialPath, currentDirPrefix = "." + path21.sep;
    if (partialPath.startsWith(currentDirPrefix))
      normalizedPath = partialPath.substring(2);
    if (normalizedPath.startsWith("~"))
      normalizedPath = expandPath(normalizedPath);
    let matches2 = fileIndex ? findMatchingFiles(fileIndex, normalizedPath) : [], duration3 = Date.now() - startTime;
    return logForDebugging(`[FileIndex] generateFileSuggestions: ${matches2.length} results in ${duration3}ms (${wasBuilding ? "partial" : "full"} index)`), logEvent("tengu_file_suggestions_query", {
      duration_ms: duration3,
      cache_hit: !wasBuilding,
      result_count: matches2.length,
      query_length: partialPath.length
    }), matches2;
  } catch (error44) {
    return logError2(error44), [];
  }
}
function applyFileSuggestion(suggestion, input, partialPath, startPos, onInputChange, setCursorOffset) {
  let suggestionText = typeof suggestion === "string" ? suggestion : suggestion.displayText, newInput = input.substring(0, startPos) + suggestionText + input.substring(startPos + partialPath.length);
  onInputChange(newInput);
  let newCursorPos = startPos + suggestionText.length;
  setCursorOffset(newCursorPos);
}
var import_ignore4, fileIndex = null, fileListRefreshPromise = null, indexBuildComplete, onIndexBuildComplete, cacheGeneration = 0, untrackedFetchPromise = null, cachedTrackedFiles, cachedConfigFiles, cachedTrackedDirs, ignorePatternsCache = null, ignorePatternsCacheKey = null, lastRefreshMs = 0, lastGitIndexMtime = null, loadedTrackedSignature = null, loadedMergedSignature = null, MAX_SUGGESTIONS = 15, REFRESH_THROTTLE_MS = 5000;
var init_fileSuggestions = __esm(() => {
  init_markdownConfigLoader();
  init_file_index();
  init_config4();
  init_cwd2();
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_fsOperations();
  init_git();
  init_hooks5();
  init_log3();
  init_path2();
  init_ripgrep();
  init_settings2();
  import_ignore4 = __toESM(require_ignore(), 1);
  indexBuildComplete = createSignal(), onIndexBuildComplete = indexBuildComplete.subscribe, cachedTrackedFiles = [], cachedConfigFiles = [], cachedTrackedDirs = [];
});
