// Original: src/utils/nativeInstaller/pidLock.ts
import { basename as basename14, join as join68 } from "path";
function isPidBasedLockingEnabled() {
  let envVar = process.env.ENABLE_PID_BASED_VERSION_LOCKING;
  if (isEnvTruthy(envVar))
    return !0;
  if (isEnvDefinedFalsy(envVar))
    return !1;
  return !1;
}
function isProcessRunning3(pid) {
  if (pid <= 1)
    return !1;
  try {
    return process.kill(pid, 0), !0;
  } catch {
    return !1;
  }
}
function isClaudeProcess(pid, expectedExecPath) {
  if (!isProcessRunning3(pid))
    return !1;
  if (pid === process.pid)
    return !0;
  try {
    let command12 = getProcessCommand(pid);
    if (!command12)
      return !0;
    let normalizedCommand = command12.toLowerCase(), normalizedExecPath = expectedExecPath.toLowerCase();
    return normalizedCommand.includes("claude") || normalizedCommand.includes(normalizedExecPath);
  } catch {
    return !0;
  }
}
function readLockContent(lockFilePath) {
  let fs16 = getFsImplementation();
  try {
    let content = fs16.readFileSync(lockFilePath, { encoding: "utf8" });
    if (!content || content.trim() === "")
      return null;
    let parsed = jsonParse(content);
    if (typeof parsed.pid !== "number" || !parsed.version || !parsed.execPath)
      return null;
    return parsed;
  } catch {
    return null;
  }
}
function isLockActive(lockFilePath) {
  let content = readLockContent(lockFilePath);
  if (!content)
    return !1;
  let { pid, execPath: execPath2 } = content;
  if (!isProcessRunning3(pid))
    return !1;
  if (!isClaudeProcess(pid, execPath2))
    return logForDebugging(`Lock PID ${pid} is running but does not appear to be Claude - treating as stale`), !1;
  let fs16 = getFsImplementation();
  try {
    let stats = fs16.statSync(lockFilePath);
    if (Date.now() - stats.mtimeMs > FALLBACK_STALE_MS) {
      if (!isProcessRunning3(pid))
        return !1;
    }
  } catch {}
  return !0;
}
function writeLockFile(lockFilePath, content) {
  let fs16 = getFsImplementation(), tempPath = `${lockFilePath}.tmp.${process.pid}.${Date.now()}`;
  try {
    writeFileSync_DEPRECATED(tempPath, jsonStringify(content, null, 2), {
      encoding: "utf8",
      flush: !0
    }), fs16.renameSync(tempPath, lockFilePath);
  } catch (error44) {
    try {
      fs16.unlinkSync(tempPath);
    } catch {}
    throw error44;
  }
}
async function tryAcquireLock(versionPath, lockFilePath) {
  let fs16 = getFsImplementation(), versionName = basename14(versionPath);
  if (isLockActive(lockFilePath)) {
    let existingContent = readLockContent(lockFilePath);
    return logForDebugging(`Cannot acquire lock for ${versionName} - held by PID ${existingContent?.pid}`), null;
  }
  let lockContent = {
    pid: process.pid,
    version: versionName,
    execPath: process.execPath,
    acquiredAt: Date.now()
  };
  try {
    if (writeLockFile(lockFilePath, lockContent), readLockContent(lockFilePath)?.pid !== process.pid)
      return null;
    return logForDebugging(`Acquired PID lock for ${versionName} (PID ${process.pid})`), () => {
      try {
        if (readLockContent(lockFilePath)?.pid === process.pid)
          fs16.unlinkSync(lockFilePath), logForDebugging(`Released PID lock for ${versionName}`);
      } catch (error44) {
        logForDebugging(`Failed to release lock for ${versionName}: ${error44}`);
      }
    };
  } catch (error44) {
    return logForDebugging(`Failed to acquire lock for ${versionName}: ${error44}`), null;
  }
}
async function acquireProcessLifetimeLock(versionPath, lockFilePath) {
  let release = await tryAcquireLock(versionPath, lockFilePath);
  if (!release)
    return !1;
  let cleanup = () => {
    try {
      release();
    } catch {}
  };
  return process.on("exit", cleanup), process.on("SIGINT", cleanup), process.on("SIGTERM", cleanup), !0;
}
async function withLock(versionPath, lockFilePath, callback) {
  let release = await tryAcquireLock(versionPath, lockFilePath);
  if (!release)
    return !1;
  try {
    return await callback(), !0;
  } finally {
    release();
  }
}
function getAllLockInfo(locksDir) {
  let fs16 = getFsImplementation(), lockInfos = [];
  try {
    let lockFiles = fs16.readdirStringSync(locksDir).filter((f) => f.endsWith(".lock"));
    for (let lockFile of lockFiles) {
      let lockFilePath = join68(locksDir, lockFile), content = readLockContent(lockFilePath);
      if (content)
        lockInfos.push({
          version: content.version,
          pid: content.pid,
          isProcessRunning: isProcessRunning3(content.pid),
          execPath: content.execPath,
          acquiredAt: new Date(content.acquiredAt),
          lockFilePath
        });
    }
  } catch (error44) {
    if (isENOENT(error44))
      return lockInfos;
    logError2(toError(error44));
  }
  return lockInfos;
}
function cleanupStaleLocks(locksDir) {
  let fs16 = getFsImplementation(), cleanedCount = 0;
  try {
    let lockEntries = fs16.readdirStringSync(locksDir).filter((f) => f.endsWith(".lock"));
    for (let lockEntry of lockEntries) {
      let lockFilePath = join68(locksDir, lockEntry);
      try {
        if (fs16.lstatSync(lockFilePath).isDirectory())
          fs16.rmSync(lockFilePath, { recursive: !0, force: !0 }), cleanedCount++, logForDebugging(`Cleaned up legacy directory lock: ${lockEntry}`);
        else if (!isLockActive(lockFilePath))
          fs16.unlinkSync(lockFilePath), cleanedCount++, logForDebugging(`Cleaned up stale lock: ${lockEntry}`);
      } catch {}
    }
  } catch (error44) {
    if (isENOENT(error44))
      return 0;
    logError2(toError(error44));
  }
  return cleanedCount;
}
var FALLBACK_STALE_MS = 7200000;
var init_pidLock = __esm(() => {
  init_debug();
  init_envUtils();
  init_errors();
  init_fsOperations();
  init_genericProcessUtils();
  init_log3();
  init_slowOperations();
});
