// Original: src/utils/cleanup.ts
import { join as join142 } from "path";
function getCutoffDate() {
  let cleanupPeriodMs = ((getSettings_DEPRECATED() || {}).cleanupPeriodDays ?? DEFAULT_CLEANUP_PERIOD_DAYS) * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - cleanupPeriodMs);
}
function addCleanupResults(a2, b) {
  return {
    messages: a2.messages + b.messages,
    errors: a2.errors + b.errors
  };
}
function convertFileNameToDate(filename) {
  let isoStr = filename.split(".")[0].replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, "T$1:$2:$3.$4Z");
  return new Date(isoStr);
}
async function cleanupOldFilesInDirectory(dirPath, cutoffDate, isMessagePath) {
  let result = { messages: 0, errors: 0 };
  try {
    let files3 = await getFsImplementation().readdir(dirPath);
    for (let file2 of files3)
      try {
        if (convertFileNameToDate(file2.name) < cutoffDate)
          if (await getFsImplementation().unlink(join142(dirPath, file2.name)), isMessagePath)
            result.messages++;
          else
            result.errors++;
      } catch (error44) {
        logError2(error44);
      }
  } catch (error44) {
    if (error44 instanceof Error && "code" in error44 && error44.code !== "ENOENT")
      logError2(error44);
  }
  return result;
}
async function cleanupOldMessageFiles() {
  let fsImpl = getFsImplementation(), cutoffDate = getCutoffDate(), errorPath = CACHE_PATHS.errors(), baseCachePath = CACHE_PATHS.baseLogs(), result = await cleanupOldFilesInDirectory(errorPath, cutoffDate, !1);
  try {
    let dirents;
    try {
      dirents = await fsImpl.readdir(baseCachePath);
    } catch {
      return result;
    }
    let mcpLogDirs = dirents.filter((dirent) => dirent.isDirectory() && dirent.name.startsWith("mcp-logs-")).map((dirent) => join142(baseCachePath, dirent.name));
    for (let mcpLogDir of mcpLogDirs)
      result = addCleanupResults(result, await cleanupOldFilesInDirectory(mcpLogDir, cutoffDate, !0)), await tryRmdir(mcpLogDir, fsImpl);
  } catch (error44) {
    if (error44 instanceof Error && "code" in error44 && error44.code !== "ENOENT")
      logError2(error44);
  }
  return result;
}
async function unlinkIfOld(filePath, cutoffDate, fsImpl) {
  if ((await fsImpl.stat(filePath)).mtime < cutoffDate)
    return await fsImpl.unlink(filePath), !0;
  return !1;
}
async function tryRmdir(dirPath, fsImpl) {
  try {
    await fsImpl.rmdir(dirPath);
  } catch {}
}
async function cleanupOldSessionFiles() {
  let cutoffDate = getCutoffDate(), result = { messages: 0, errors: 0 }, projectsDir = getProjectsDir2(), fsImpl = getFsImplementation(), projectDirents;
  try {
    projectDirents = await fsImpl.readdir(projectsDir);
  } catch {
    return result;
  }
  for (let projectDirent of projectDirents) {
    if (!projectDirent.isDirectory())
      continue;
    let projectDir = join142(projectsDir, projectDirent.name), entries2;
    try {
      entries2 = await fsImpl.readdir(projectDir);
    } catch {
      result.errors++;
      continue;
    }
    for (let entry of entries2)
      if (entry.isFile()) {
        if (!entry.name.endsWith(".jsonl") && !entry.name.endsWith(".cast"))
          continue;
        try {
          if (await unlinkIfOld(join142(projectDir, entry.name), cutoffDate, fsImpl))
            result.messages++;
        } catch {
          result.errors++;
        }
      } else if (entry.isDirectory()) {
        let sessionDir = join142(projectDir, entry.name), toolResultsDir = join142(sessionDir, TOOL_RESULTS_SUBDIR), toolDirs;
        try {
          toolDirs = await fsImpl.readdir(toolResultsDir);
        } catch {
          await tryRmdir(sessionDir, fsImpl);
          continue;
        }
        for (let toolEntry of toolDirs)
          if (toolEntry.isFile())
            try {
              if (await unlinkIfOld(join142(toolResultsDir, toolEntry.name), cutoffDate, fsImpl))
                result.messages++;
            } catch {
              result.errors++;
            }
          else if (toolEntry.isDirectory()) {
            let toolDirPath = join142(toolResultsDir, toolEntry.name), toolFiles;
            try {
              toolFiles = await fsImpl.readdir(toolDirPath);
            } catch {
              continue;
            }
            for (let tf of toolFiles) {
              if (!tf.isFile())
                continue;
              try {
                if (await unlinkIfOld(join142(toolDirPath, tf.name), cutoffDate, fsImpl))
                  result.messages++;
              } catch {
                result.errors++;
              }
            }
            await tryRmdir(toolDirPath, fsImpl);
          }
        await tryRmdir(toolResultsDir, fsImpl), await tryRmdir(sessionDir, fsImpl);
      }
    await tryRmdir(projectDir, fsImpl);
  }
  return result;
}
async function cleanupSingleDirectory(dirPath, extension, removeEmptyDir = !0) {
  let cutoffDate = getCutoffDate(), result = { messages: 0, errors: 0 }, fsImpl = getFsImplementation(), dirents;
  try {
    dirents = await fsImpl.readdir(dirPath);
  } catch {
    return result;
  }
  for (let dirent of dirents) {
    if (!dirent.isFile() || !dirent.name.endsWith(extension))
      continue;
    try {
      if (await unlinkIfOld(join142(dirPath, dirent.name), cutoffDate, fsImpl))
        result.messages++;
    } catch {
      result.errors++;
    }
  }
  if (removeEmptyDir)
    await tryRmdir(dirPath, fsImpl);
  return result;
}
function cleanupOldPlanFiles() {
  let plansDir = join142(getClaudeConfigHomeDir(), "plans");
  return cleanupSingleDirectory(plansDir, ".md");
}
async function cleanupOldFileHistoryBackups() {
  let cutoffDate = getCutoffDate(), result = { messages: 0, errors: 0 }, fsImpl = getFsImplementation();
  try {
    let configDir = getClaudeConfigHomeDir(), fileHistoryStorageDir = join142(configDir, "file-history"), dirents;
    try {
      dirents = await fsImpl.readdir(fileHistoryStorageDir);
    } catch {
      return result;
    }
    let fileHistorySessionsDirs = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => join142(fileHistoryStorageDir, dirent.name));
    await Promise.all(fileHistorySessionsDirs.map(async (fileHistorySessionDir) => {
      try {
        if ((await fsImpl.stat(fileHistorySessionDir)).mtime < cutoffDate)
          await fsImpl.rm(fileHistorySessionDir, {
            recursive: !0,
            force: !0
          }), result.messages++;
      } catch {
        result.errors++;
      }
    })), await tryRmdir(fileHistoryStorageDir, fsImpl);
  } catch (error44) {
    logError2(error44);
  }
  return result;
}
async function cleanupOldSessionEnvDirs() {
  let cutoffDate = getCutoffDate(), result = { messages: 0, errors: 0 }, fsImpl = getFsImplementation();
  try {
    let configDir = getClaudeConfigHomeDir(), sessionEnvBaseDir = join142(configDir, "session-env"), dirents;
    try {
      dirents = await fsImpl.readdir(sessionEnvBaseDir);
    } catch {
      return result;
    }
    let sessionEnvDirs = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => join142(sessionEnvBaseDir, dirent.name));
    for (let sessionEnvDir of sessionEnvDirs)
      try {
        if ((await fsImpl.stat(sessionEnvDir)).mtime < cutoffDate)
          await fsImpl.rm(sessionEnvDir, { recursive: !0, force: !0 }), result.messages++;
      } catch {
        result.errors++;
      }
    await tryRmdir(sessionEnvBaseDir, fsImpl);
  } catch (error44) {
    logError2(error44);
  }
  return result;
}
async function cleanupOldDebugLogs() {
  let cutoffDate = getCutoffDate(), result = { messages: 0, errors: 0 }, fsImpl = getFsImplementation(), debugDir = join142(getClaudeConfigHomeDir(), "debug"), dirents;
  try {
    dirents = await fsImpl.readdir(debugDir);
  } catch {
    return result;
  }
  for (let dirent of dirents) {
    if (!dirent.isFile() || !dirent.name.endsWith(".txt") || dirent.name === "latest")
      continue;
    try {
      if (await unlinkIfOld(join142(debugDir, dirent.name), cutoffDate, fsImpl))
        result.messages++;
    } catch {
      result.errors++;
    }
  }
  return result;
}
async function cleanupOldMessageFilesInBackground() {
  let { errors: errors8 } = getSettingsWithAllErrors();
  if (errors8.length > 0 && rawSettingsContainsKey("cleanupPeriodDays")) {
    logForDebugging("Skipping cleanup: settings have validation errors but cleanupPeriodDays was explicitly set. Fix settings errors to enable cleanup.");
    return;
  }
  await cleanupOldMessageFiles(), await cleanupOldSessionFiles(), await cleanupOldPlanFiles(), await cleanupOldFileHistoryBackups(), await cleanupOldSessionEnvDirs(), await cleanupOldDebugLogs(), await cleanupOldImageCaches(), await cleanupOldPastes(getCutoffDate());
  let removedWorktrees = await cleanupStaleAgentWorktrees(getCutoffDate());
  if (removedWorktrees > 0)
    logEvent("tengu_worktree_cleanup", { removed: removedWorktrees });
}
var DEFAULT_CLEANUP_PERIOD_DAYS = 30;
var init_cleanup2 = __esm(() => {
  init_cachePaths();
  init_debug();
  init_envUtils();
  init_fsOperations();
  init_imageStore();
  init_log3();
  init_nativeInstaller();
  init_pasteStore();
  init_sessionStorage();
  init_allErrors();
  init_settings2();
  init_toolResultStorage();
  init_worktree();
});
