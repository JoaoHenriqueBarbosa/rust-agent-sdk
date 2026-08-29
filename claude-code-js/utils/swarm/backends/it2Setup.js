// Original: src/utils/swarm/backends/it2Setup.ts
import { homedir as homedir24 } from "os";
async function detectPythonPackageManager() {
  if ((await execFileNoThrow("which", ["uv"])).code === 0)
    return logForDebugging("[it2Setup] Found uv (will use uv tool install)"), "uvx";
  if ((await execFileNoThrow("which", ["pipx"])).code === 0)
    return logForDebugging("[it2Setup] Found pipx package manager"), "pipx";
  if ((await execFileNoThrow("which", ["pip"])).code === 0)
    return logForDebugging("[it2Setup] Found pip package manager"), "pip";
  if ((await execFileNoThrow("which", ["pip3"])).code === 0)
    return logForDebugging("[it2Setup] Found pip3 package manager"), "pip";
  return logForDebugging("[it2Setup] No Python package manager found"), null;
}
async function isIt2CliAvailable2() {
  return (await execFileNoThrow("which", ["it2"])).code === 0;
}
async function installIt2(packageManager) {
  logForDebugging(`[it2Setup] Installing it2 using ${packageManager}`);
  let result;
  switch (packageManager) {
    case "uvx":
      result = await execFileNoThrowWithCwd("uv", ["tool", "install", "it2"], {
        cwd: homedir24()
      });
      break;
    case "pipx":
      result = await execFileNoThrowWithCwd("pipx", ["install", "it2"], {
        cwd: homedir24()
      });
      break;
    case "pip":
      if (result = await execFileNoThrowWithCwd("pip", ["install", "--user", "it2"], { cwd: homedir24() }), result.code !== 0)
        result = await execFileNoThrowWithCwd("pip3", ["install", "--user", "it2"], { cwd: homedir24() });
      break;
  }
  if (result.code !== 0) {
    let error44 = result.stderr || "Unknown installation error";
    return logError2(Error(`[it2Setup] Failed to install it2: ${error44}`)), {
      success: !1,
      error: error44,
      packageManager
    };
  }
  return logForDebugging("[it2Setup] it2 installed successfully"), {
    success: !0,
    packageManager
  };
}
async function verifyIt2Setup() {
  if (logForDebugging("[it2Setup] Verifying it2 setup..."), !await isIt2CliAvailable2())
    return {
      success: !1,
      error: "it2 CLI is not installed or not in PATH"
    };
  let result = await execFileNoThrow("it2", ["session", "list"]);
  if (result.code !== 0) {
    let stderr = result.stderr.toLowerCase();
    if (stderr.includes("api") || stderr.includes("python") || stderr.includes("connection refused") || stderr.includes("not enabled"))
      return logForDebugging("[it2Setup] Python API not enabled in iTerm2"), {
        success: !1,
        error: "Python API not enabled in iTerm2 preferences",
        needsPythonApiEnabled: !0
      };
    return {
      success: !1,
      error: result.stderr || "Failed to communicate with iTerm2"
    };
  }
  return logForDebugging("[it2Setup] it2 setup verified successfully"), {
    success: !0
  };
}
function getPythonApiInstructions() {
  return [
    "Almost done! Enable the Python API in iTerm2:",
    "",
    "  iTerm2 \u2192 Settings \u2192 General \u2192 Magic \u2192 Enable Python API",
    "",
    "After enabling, you may need to restart iTerm2."
  ];
}
function markIt2SetupComplete() {
  if (getGlobalConfig().iterm2It2SetupComplete !== !0)
    saveGlobalConfig((current) => ({
      ...current,
      iterm2It2SetupComplete: !0
    })), logForDebugging("[it2Setup] Marked it2 setup as complete");
}
function setPreferTmuxOverIterm2(prefer) {
  if (getGlobalConfig().preferTmuxOverIterm2 !== prefer)
    saveGlobalConfig((current) => ({
      ...current,
      preferTmuxOverIterm2: prefer
    })), logForDebugging(`[it2Setup] Set preferTmuxOverIterm2 = ${prefer}`);
}
function getPreferTmuxOverIterm2() {
  return getGlobalConfig().preferTmuxOverIterm2 === !0;
}
var init_it2Setup = __esm(() => {
  init_config4();
  init_debug();
  init_execFileNoThrow();
  init_log3();
});
