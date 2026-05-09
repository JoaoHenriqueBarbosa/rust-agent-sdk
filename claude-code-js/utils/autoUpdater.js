// Original: src/utils/autoUpdater.ts
import { constants as fsConstants4 } from "fs";
import { access as access2, writeFile as writeFile13 } from "fs/promises";
import { homedir as homedir21 } from "os";
import { join as join64 } from "path";
async function assertMinVersion() {
  try {
    let versionConfig = { minVersion: "0.0.0" };
    if (versionConfig.minVersion && lt("2.1.90", versionConfig.minVersion))
      console.error(`
It looks like your version of Claude Code (2.1.90) needs an update.
A newer version (${versionConfig.minVersion} or higher) is required to continue.

To update, please run:
    claude update

This will ensure you have access to the latest features and improvements.
`), gracefulShutdownSync(1);
  } catch (error44) {
    logError2(error44);
  }
}
async function getMaxVersion() {
  return (await getMaxVersionConfig()).external || void 0;
}
async function getMaxVersionMessage() {
  return (await getMaxVersionConfig()).external_message || void 0;
}
async function getMaxVersionConfig() {
  try {
    return {};
  } catch (error44) {
    return logError2(error44), {};
  }
}
function shouldSkipVersion(targetVersion) {
  let minimumVersion = getInitialSettings()?.minimumVersion;
  if (!minimumVersion)
    return !1;
  let shouldSkip = !gte(targetVersion, minimumVersion);
  if (shouldSkip)
    logForDebugging(`Skipping update to ${targetVersion} - below minimumVersion ${minimumVersion}`);
  return shouldSkip;
}
function getLockFilePath() {
  return join64(getClaudeConfigHomeDir(), ".update.lock");
}
async function acquireLock() {
  let fs16 = getFsImplementation(), lockPath = getLockFilePath();
  try {
    let stats = await fs16.stat(lockPath);
    if (Date.now() - stats.mtimeMs < LOCK_TIMEOUT_MS)
      return !1;
    try {
      let recheck = await fs16.stat(lockPath);
      if (Date.now() - recheck.mtimeMs < LOCK_TIMEOUT_MS)
        return !1;
      await fs16.unlink(lockPath);
    } catch (err2) {
      if (!isENOENT(err2))
        return logError2(err2), !1;
    }
  } catch (err2) {
    if (!isENOENT(err2))
      return logError2(err2), !1;
  }
  try {
    return await writeFile13(lockPath, `${process.pid}`, {
      encoding: "utf8",
      flag: "wx"
    }), !0;
  } catch (err2) {
    let code = getErrnoCode(err2);
    if (code === "EEXIST")
      return !1;
    if (code === "ENOENT")
      try {
        return await fs16.mkdir(getClaudeConfigHomeDir()), await writeFile13(lockPath, `${process.pid}`, {
          encoding: "utf8",
          flag: "wx"
        }), !0;
      } catch (mkdirErr) {
        if (getErrnoCode(mkdirErr) === "EEXIST")
          return !1;
        return logError2(mkdirErr), !1;
      }
    return logError2(err2), !1;
  }
}
async function releaseLock() {
  let fs16 = getFsImplementation(), lockPath = getLockFilePath();
  try {
    if (await fs16.readFile(lockPath, { encoding: "utf8" }) === `${process.pid}`)
      await fs16.unlink(lockPath);
  } catch (err2) {
    if (isENOENT(err2))
      return;
    logError2(err2);
  }
}
async function getInstallationPrefix() {
  let isBun2 = env3.isRunningWithBun(), prefixResult = null;
  if (isBun2)
    prefixResult = await execFileNoThrowWithCwd("bun", ["pm", "bin", "-g"], {
      cwd: homedir21()
    });
  else
    prefixResult = await execFileNoThrowWithCwd("npm", ["-g", "config", "get", "prefix"], { cwd: homedir21() });
  if (prefixResult.code !== 0)
    return logError2(Error(`Failed to check ${isBun2 ? "bun" : "npm"} permissions`)), null;
  return prefixResult.stdout.trim();
}
async function checkGlobalInstallPermissions() {
  try {
    let prefix = await getInstallationPrefix();
    if (!prefix)
      return { hasPermissions: !1, npmPrefix: null };
    try {
      return await access2(prefix, fsConstants4.W_OK), { hasPermissions: !0, npmPrefix: prefix };
    } catch {
      return logError2(new AutoUpdaterError("Insufficient permissions for global npm install.")), { hasPermissions: !1, npmPrefix: prefix };
    }
  } catch (error44) {
    return logError2(error44), { hasPermissions: !1, npmPrefix: null };
  }
}
async function getLatestVersion(channel) {
  let result = await execFileNoThrowWithCwd("npm", ["view", `@anthropic-ai/claude-code@${channel === "stable" ? "stable" : "latest"}`, "version", "--prefer-online"], { abortSignal: AbortSignal.timeout(5000), cwd: homedir21() });
  if (result.code !== 0) {
    if (logForDebugging(`npm view failed with code ${result.code}`), result.stderr)
      logForDebugging(`npm stderr: ${result.stderr.trim()}`);
    else
      logForDebugging("npm stderr: (empty)");
    if (result.stdout)
      logForDebugging(`npm stdout: ${result.stdout.trim()}`);
    return null;
  }
  return result.stdout.trim();
}
async function getNpmDistTags() {
  let result = await execFileNoThrowWithCwd("npm", ["view", "@anthropic-ai/claude-code", "dist-tags", "--json", "--prefer-online"], { abortSignal: AbortSignal.timeout(5000), cwd: homedir21() });
  if (result.code !== 0)
    return logForDebugging(`npm view dist-tags failed with code ${result.code}`), { latest: null, stable: null };
  try {
    let parsed = jsonParse(result.stdout.trim());
    return {
      latest: typeof parsed.latest === "string" ? parsed.latest : null,
      stable: typeof parsed.stable === "string" ? parsed.stable : null
    };
  } catch (error44) {
    return logForDebugging(`Failed to parse dist-tags: ${error44}`), { latest: null, stable: null };
  }
}
async function getLatestVersionFromGcs(channel) {
  try {
    return (await axios_default.get(`${GCS_BUCKET_URL}/${channel}`, {
      timeout: 5000,
      responseType: "text"
    })).data.trim();
  } catch (error44) {
    return logForDebugging(`Failed to fetch ${channel} from GCS: ${error44}`), null;
  }
}
async function getGcsDistTags() {
  let [latest, stable] = await Promise.all([
    getLatestVersionFromGcs("latest"),
    getLatestVersionFromGcs("stable")
  ]);
  return { latest, stable };
}
async function installGlobalPackage(specificVersion) {
  if (!await acquireLock())
    return logError2(new AutoUpdaterError("Another process is currently installing an update")), logEvent("tengu_auto_updater_lock_contention", {
      pid: process.pid,
      currentVersion: "2.1.90"
    }), "in_progress";
  try {
    if (await removeClaudeAliasesFromShellConfigs(), !env3.isRunningWithBun() && env3.isNpmFromWindowsPath())
      return logError2(Error("Windows NPM detected in WSL environment")), logEvent("tengu_auto_updater_windows_npm_in_wsl", {
        currentVersion: "2.1.90"
      }), console.error(`
Error: Windows NPM detected in WSL

You're running Claude Code in WSL but using the Windows NPM installation from /mnt/c/.
This configuration is not supported for updates.

To fix this issue:
  1. Install Node.js within your Linux distribution: e.g. sudo apt install nodejs npm
  2. Make sure Linux NPM is in your PATH before the Windows version
  3. Try updating again with 'claude update'
`), "install_failed";
    let { hasPermissions } = await checkGlobalInstallPermissions();
    if (!hasPermissions)
      return "no_permissions";
    let packageSpec = specificVersion ? `@anthropic-ai/claude-code@${specificVersion}` : "@anthropic-ai/claude-code", packageManager = env3.isRunningWithBun() ? "bun" : "npm", installResult = await execFileNoThrowWithCwd(packageManager, ["install", "-g", packageSpec], { cwd: homedir21() });
    if (installResult.code !== 0) {
      let error44 = new AutoUpdaterError(`Failed to install new version of claude: ${installResult.stdout} ${installResult.stderr}`);
      return logError2(error44), "install_failed";
    }
    return saveGlobalConfig((current) => ({
      ...current,
      installMethod: "global"
    })), "success";
  } finally {
    await releaseLock();
  }
}
async function removeClaudeAliasesFromShellConfigs() {
  let configMap = getShellConfigPaths();
  for (let [, configFile] of Object.entries(configMap))
    try {
      let lines2 = await readFileLines(configFile);
      if (!lines2)
        continue;
      let { filtered, hadAlias } = filterClaudeAliases(lines2);
      if (hadAlias)
        await writeFileLines(configFile, filtered), logForDebugging(`Removed claude alias from ${configFile}`);
    } catch (error44) {
      logForDebugging(`Failed to remove alias from ${configFile}: ${error44}`, {
        level: "error"
      });
    }
}
var GCS_BUCKET_URL = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases", AutoUpdaterError, LOCK_TIMEOUT_MS = 300000;
var init_autoUpdater = __esm(() => {
  init_axios2();
  init_config4();
  init_debug();
  init_env();
  init_envUtils();
  init_errors();
  init_execFileNoThrow();
  init_fsOperations();
  init_gracefulShutdown();
  init_log3();
  init_settings2();
  init_shellConfig();
  init_slowOperations();
  AutoUpdaterError = class AutoUpdaterError extends ClaudeError {
  };
});
