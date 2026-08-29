// Original: src/utils/sessionEnvironment.ts
import { mkdir as mkdir15, readdir as readdir10, readFile as readFile23, writeFile as writeFile19 } from "fs/promises";
import { join as join75 } from "path";
async function getSessionEnvDirPath() {
  let sessionEnvDir = join75(getClaudeConfigHomeDir(), "session-env", getSessionId());
  return await mkdir15(sessionEnvDir, { recursive: !0 }), sessionEnvDir;
}
async function getHookEnvFilePath(hookEvent, hookIndex) {
  let prefix = hookEvent.toLowerCase();
  return join75(await getSessionEnvDirPath(), `${prefix}-hook-${hookIndex}.sh`);
}
async function clearCwdEnvFiles() {
  try {
    let dir = await getSessionEnvDirPath(), files2 = await readdir10(dir);
    await Promise.all(files2.filter((f) => (f.startsWith("filechanged-hook-") || f.startsWith("cwdchanged-hook-")) && HOOK_ENV_REGEX.test(f)).map((f) => writeFile19(join75(dir, f), "")));
  } catch (e) {
    if (getErrnoCode(e) !== "ENOENT")
      logForDebugging(`Failed to clear cwd env files: ${errorMessage(e)}`);
  }
}
function invalidateSessionEnvCache() {
  logForDebugging("Invalidating session environment cache"), sessionEnvScript = void 0;
}
async function getSessionEnvironmentScript() {
  if (getPlatform() === "windows")
    return logForDebugging("Session environment not yet supported on Windows"), null;
  if (sessionEnvScript !== void 0)
    return sessionEnvScript;
  let scripts = [], envFile = process.env.CLAUDE_ENV_FILE;
  if (envFile)
    try {
      let envScript = (await readFile23(envFile, "utf8")).trim();
      if (envScript)
        scripts.push(envScript), logForDebugging(`Session environment loaded from CLAUDE_ENV_FILE: ${envFile} (${envScript.length} chars)`);
    } catch (e) {
      if (getErrnoCode(e) !== "ENOENT")
        logForDebugging(`Failed to read CLAUDE_ENV_FILE: ${errorMessage(e)}`);
    }
  let sessionEnvDir = await getSessionEnvDirPath();
  try {
    let hookFiles = (await readdir10(sessionEnvDir)).filter((f) => HOOK_ENV_REGEX.test(f)).sort(sortHookEnvFiles);
    for (let file2 of hookFiles) {
      let filePath = join75(sessionEnvDir, file2);
      try {
        let content = (await readFile23(filePath, "utf8")).trim();
        if (content)
          scripts.push(content);
      } catch (e) {
        if (getErrnoCode(e) !== "ENOENT")
          logForDebugging(`Failed to read hook file ${filePath}: ${errorMessage(e)}`);
      }
    }
    if (hookFiles.length > 0)
      logForDebugging(`Session environment loaded from ${hookFiles.length} hook file(s)`);
  } catch (e) {
    if (getErrnoCode(e) !== "ENOENT")
      logForDebugging(`Failed to load session environment from hooks: ${errorMessage(e)}`);
  }
  if (scripts.length === 0)
    return logForDebugging("No session environment scripts found"), sessionEnvScript = null, sessionEnvScript;
  return sessionEnvScript = scripts.join(`
`), logForDebugging(`Session environment script ready (${sessionEnvScript.length} chars total)`), sessionEnvScript;
}
function sortHookEnvFiles(a2, b) {
  let aMatch = a2.match(HOOK_ENV_REGEX), bMatch = b.match(HOOK_ENV_REGEX), aType = aMatch?.[1] || "", bType = bMatch?.[1] || "";
  if (aType !== bType)
    return (HOOK_ENV_PRIORITY[aType] ?? 99) - (HOOK_ENV_PRIORITY[bType] ?? 99);
  let aIndex = parseInt(aMatch?.[2] || "0", 10), bIndex = parseInt(bMatch?.[2] || "0", 10);
  return aIndex - bIndex;
}
var sessionEnvScript = void 0, HOOK_ENV_PRIORITY, HOOK_ENV_REGEX;
var init_sessionEnvironment = __esm(() => {
  init_state();
  init_debug();
  init_envUtils();
  init_errors();
  init_platform();
  HOOK_ENV_PRIORITY = {
    setup: 0,
    sessionstart: 1,
    cwdchanged: 2,
    filechanged: 3
  }, HOOK_ENV_REGEX = /^(setup|sessionstart|cwdchanged|filechanged)-hook-(\d+)\.sh$/;
});
