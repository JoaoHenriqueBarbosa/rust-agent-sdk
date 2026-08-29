// Original: src/utils/concurrentSessions.ts
import { chmod as chmod10, mkdir as mkdir34, readdir as readdir25, readFile as readFile48, unlink as unlink17, writeFile as writeFile40 } from "fs/promises";
import { join as join127 } from "path";
function getSessionsDir() {
  return join127(getClaudeConfigHomeDir(), "sessions");
}
function envSessionKind() {
  return;
}
async function registerSession() {
  if (getAgentId() != null)
    return !1;
  let kind = envSessionKind() ?? "interactive", dir = getSessionsDir(), pidFile = join127(dir, `${process.pid}.json`);
  registerCleanup(async () => {
    try {
      await unlink17(pidFile);
    } catch {}
  });
  try {
    return await mkdir34(dir, { recursive: !0, mode: 448 }), await chmod10(dir, 448), await writeFile40(pidFile, jsonStringify({
      pid: process.pid,
      sessionId: getSessionId(),
      cwd: getOriginalCwd(),
      startedAt: Date.now(),
      kind,
      entrypoint: process.env.CLAUDE_CODE_ENTRYPOINT,
      ...{},
      ...{}
    })), onSessionSwitch((id) => {
      updatePidFile({ sessionId: id });
    }), !0;
  } catch (e) {
    return logForDebugging(`[concurrentSessions] register failed: ${errorMessage(e)}`), !1;
  }
}
async function updatePidFile(patch) {
  let pidFile = join127(getSessionsDir(), `${process.pid}.json`);
  try {
    let data = jsonParse(await readFile48(pidFile, "utf8"));
    await writeFile40(pidFile, jsonStringify({ ...data, ...patch }));
  } catch (e) {
    logForDebugging(`[concurrentSessions] updatePidFile failed: ${errorMessage(e)}`);
  }
}
async function updateSessionName(name3) {
  if (!name3)
    return;
  await updatePidFile({ name: name3 });
}
async function countConcurrentSessions() {
  let dir = getSessionsDir(), files3;
  try {
    files3 = await readdir25(dir);
  } catch (e) {
    if (!isFsInaccessible(e))
      logForDebugging(`[concurrentSessions] readdir failed: ${errorMessage(e)}`);
    return 0;
  }
  let count4 = 0;
  for (let file2 of files3) {
    if (!/^\d+\.json$/.test(file2))
      continue;
    let pid = parseInt(file2.slice(0, -5), 10);
    if (pid === process.pid) {
      count4++;
      continue;
    }
    if (isProcessRunning(pid))
      count4++;
    else if (getPlatform() !== "wsl")
      unlink17(join127(dir, file2)).catch(() => {});
  }
  return count4;
}
var init_concurrentSessions = __esm(() => {
  init_state();
  init_cleanupRegistry();
  init_debug();
  init_envUtils();
  init_errors();
  init_genericProcessUtils();
  init_platform();
  init_slowOperations();
  init_teammate();
});
