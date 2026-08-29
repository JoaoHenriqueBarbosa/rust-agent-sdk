// Original: src/services/autoDream/consolidationLock.ts
import { mkdir as mkdir19, readFile as readFile27, stat as stat26, unlink as unlink11, utimes, writeFile as writeFile21 } from "fs/promises";
import { join as join87 } from "path";
function lockPath() {
  return join87(getAutoMemPath(), LOCK_FILE);
}
async function readLastConsolidatedAt() {
  try {
    return (await stat26(lockPath())).mtimeMs;
  } catch {
    return 0;
  }
}
async function tryAcquireConsolidationLock() {
  let path19 = lockPath(), mtimeMs, holderPid;
  try {
    let [s2, raw] = await Promise.all([stat26(path19), readFile27(path19, "utf8")]);
    mtimeMs = s2.mtimeMs;
    let parsed = parseInt(raw.trim(), 10);
    holderPid = Number.isFinite(parsed) ? parsed : void 0;
  } catch {}
  if (mtimeMs !== void 0 && Date.now() - mtimeMs < HOLDER_STALE_MS) {
    if (holderPid !== void 0 && isProcessRunning(holderPid))
      return logForDebugging(`[autoDream] lock held by live PID ${holderPid} (mtime ${Math.round((Date.now() - mtimeMs) / 1000)}s ago)`), null;
  }
  await mkdir19(getAutoMemPath(), { recursive: !0 }), await writeFile21(path19, String(process.pid));
  let verify;
  try {
    verify = await readFile27(path19, "utf8");
  } catch {
    return null;
  }
  if (parseInt(verify.trim(), 10) !== process.pid)
    return null;
  return mtimeMs ?? 0;
}
async function rollbackConsolidationLock(priorMtime) {
  let path19 = lockPath();
  try {
    if (priorMtime === 0) {
      await unlink11(path19);
      return;
    }
    await writeFile21(path19, "");
    let t2 = priorMtime / 1000;
    await utimes(path19, t2, t2);
  } catch (e) {
    logForDebugging(`[autoDream] rollback failed: ${e.message} \u2014 next trigger delayed to minHours`);
  }
}
async function listSessionsTouchedSince(sinceMs) {
  let dir = getProjectDir2(getOriginalCwd());
  return (await listCandidates(dir, !0)).filter((c3) => c3.mtime > sinceMs).map((c3) => c3.sessionId);
}
var LOCK_FILE = ".consolidate-lock", HOLDER_STALE_MS = 3600000;
var init_consolidationLock = __esm(() => {
  init_state();
  init_paths();
  init_debug();
  init_genericProcessUtils();
  init_listSessionsImpl();
  init_sessionStorage();
});
