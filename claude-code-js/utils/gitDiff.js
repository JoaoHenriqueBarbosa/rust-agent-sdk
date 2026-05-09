// Original: src/utils/gitDiff.ts
import { access as access5, readFile as readFile39 } from "fs/promises";
import { dirname as dirname51, join as join112, relative as relative23, sep as sep26 } from "path";
async function fetchGitDiff() {
  if (!await getIsGit())
    return null;
  if (await isInTransientGitState())
    return null;
  let { stdout: shortstatOut, code: shortstatCode } = await execFileNoThrow(gitExe(), ["--no-optional-locks", "diff", "HEAD", "--shortstat"], { timeout: GIT_TIMEOUT_MS, preserveOutputOnError: !1 });
  if (shortstatCode === 0) {
    let quickStats = parseShortstat(shortstatOut);
    if (quickStats && quickStats.filesCount > MAX_FILES_FOR_DETAILS)
      return {
        stats: quickStats,
        perFileStats: /* @__PURE__ */ new Map,
        hunks: /* @__PURE__ */ new Map
      };
  }
  let { stdout: numstatOut, code: numstatCode } = await execFileNoThrow(gitExe(), ["--no-optional-locks", "diff", "HEAD", "--numstat"], { timeout: GIT_TIMEOUT_MS, preserveOutputOnError: !1 });
  if (numstatCode !== 0)
    return null;
  let { stats, perFileStats } = parseGitNumstat(numstatOut), remainingSlots = MAX_FILES - perFileStats.size;
  if (remainingSlots > 0) {
    let untrackedStats = await fetchUntrackedFiles(remainingSlots);
    if (untrackedStats) {
      stats.filesCount += untrackedStats.size;
      for (let [path22, fileStats] of untrackedStats)
        perFileStats.set(path22, fileStats);
    }
  }
  return { stats, perFileStats, hunks: /* @__PURE__ */ new Map };
}
async function fetchGitDiffHunks() {
  if (!await getIsGit())
    return /* @__PURE__ */ new Map;
  if (await isInTransientGitState())
    return /* @__PURE__ */ new Map;
  let { stdout: diffOut, code: diffCode } = await execFileNoThrow(gitExe(), ["--no-optional-locks", "diff", "HEAD"], { timeout: GIT_TIMEOUT_MS, preserveOutputOnError: !1 });
  if (diffCode !== 0)
    return /* @__PURE__ */ new Map;
  return parseGitDiff(diffOut);
}
function parseGitNumstat(stdout) {
  let lines2 = stdout.trim().split(`
`).filter(Boolean), added = 0, removed = 0, validFileCount = 0, perFileStats = /* @__PURE__ */ new Map;
  for (let line of lines2) {
    let parts = line.split("\t");
    if (parts.length < 3)
      continue;
    validFileCount++;
    let addStr = parts[0], remStr = parts[1], filePath = parts.slice(2).join("\t"), isBinary = addStr === "-" || remStr === "-", fileAdded = isBinary ? 0 : parseInt(addStr ?? "0", 10) || 0, fileRemoved = isBinary ? 0 : parseInt(remStr ?? "0", 10) || 0;
    if (added += fileAdded, removed += fileRemoved, perFileStats.size < MAX_FILES)
      perFileStats.set(filePath, {
        added: fileAdded,
        removed: fileRemoved,
        isBinary
      });
  }
  return {
    stats: {
      filesCount: validFileCount,
      linesAdded: added,
      linesRemoved: removed
    },
    perFileStats
  };
}
function parseGitDiff(stdout) {
  let result = /* @__PURE__ */ new Map;
  if (!stdout.trim())
    return result;
  let fileDiffs = stdout.split(/^diff --git /m).filter(Boolean);
  for (let fileDiff of fileDiffs) {
    if (result.size >= MAX_FILES)
      break;
    if (fileDiff.length > MAX_DIFF_SIZE_BYTES)
      continue;
    let lines2 = fileDiff.split(`
`), headerMatch = lines2[0]?.match(/^a\/(.+?) b\/(.+)$/);
    if (!headerMatch)
      continue;
    let filePath = headerMatch[2] ?? headerMatch[1] ?? "", fileHunks = [], currentHunk = null, lineCount = 0;
    for (let i5 = 1;i5 < lines2.length; i5++) {
      let line = lines2[i5] ?? "", hunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (hunkMatch) {
        if (currentHunk)
          fileHunks.push(currentHunk);
        currentHunk = {
          oldStart: parseInt(hunkMatch[1] ?? "0", 10),
          oldLines: parseInt(hunkMatch[2] ?? "1", 10),
          newStart: parseInt(hunkMatch[3] ?? "0", 10),
          newLines: parseInt(hunkMatch[4] ?? "1", 10),
          lines: []
        };
        continue;
      }
      if (line.startsWith("index ") || line.startsWith("---") || line.startsWith("+++") || line.startsWith("new file") || line.startsWith("deleted file") || line.startsWith("old mode") || line.startsWith("new mode") || line.startsWith("Binary files"))
        continue;
      if (currentHunk && (line.startsWith("+") || line.startsWith("-") || line.startsWith(" ") || line === "")) {
        if (lineCount >= MAX_LINES_PER_FILE)
          continue;
        currentHunk.lines.push("" + line), lineCount++;
      }
    }
    if (currentHunk)
      fileHunks.push(currentHunk);
    if (fileHunks.length > 0)
      result.set(filePath, fileHunks);
  }
  return result;
}
async function isInTransientGitState() {
  let gitDir = await getGitDir(getCwd());
  if (!gitDir)
    return !1;
  return (await Promise.all([
    "MERGE_HEAD",
    "REBASE_HEAD",
    "CHERRY_PICK_HEAD",
    "REVERT_HEAD"
  ].map((file2) => access5(join112(gitDir, file2)).then(() => !0).catch(() => !1)))).some(Boolean);
}
async function fetchUntrackedFiles(maxFiles) {
  let { stdout, code } = await execFileNoThrow(gitExe(), ["--no-optional-locks", "ls-files", "--others", "--exclude-standard"], { timeout: GIT_TIMEOUT_MS, preserveOutputOnError: !1 });
  if (code !== 0 || !stdout.trim())
    return null;
  let untrackedPaths = stdout.trim().split(`
`).filter(Boolean);
  if (untrackedPaths.length === 0)
    return null;
  let perFileStats = /* @__PURE__ */ new Map;
  for (let filePath of untrackedPaths.slice(0, maxFiles))
    perFileStats.set(filePath, {
      added: 0,
      removed: 0,
      isBinary: !1,
      isUntracked: !0
    });
  return perFileStats;
}
function parseShortstat(stdout) {
  let match = stdout.match(/(\d+)\s+files?\s+changed(?:,\s+(\d+)\s+insertions?\(\+\))?(?:,\s+(\d+)\s+deletions?\(-\))?/);
  if (!match)
    return null;
  return {
    filesCount: parseInt(match[1] ?? "0", 10),
    linesAdded: parseInt(match[2] ?? "0", 10),
    linesRemoved: parseInt(match[3] ?? "0", 10)
  };
}
var GIT_TIMEOUT_MS = 5000, MAX_FILES = 50, MAX_DIFF_SIZE_BYTES = 1e6, MAX_LINES_PER_FILE = 400, MAX_FILES_FOR_DETAILS = 500;
var init_gitDiff = __esm(() => {
  init_cwd2();
  init_detectRepository();
  init_execFileNoThrow();
  init_file();
  init_git();
});
