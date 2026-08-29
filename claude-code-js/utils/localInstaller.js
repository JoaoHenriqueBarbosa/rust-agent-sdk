// Original: src/utils/localInstaller.ts
import { access, chmod as chmod3, writeFile as writeFile12 } from "fs/promises";
import { join as join62 } from "path";
function getLocalInstallDir() {
  return join62(getClaudeConfigHomeDir(), "local");
}
function getLocalClaudePath() {
  return join62(getLocalInstallDir(), "claude");
}
function isRunningFromLocalInstallation() {
  return (process.argv[1] || "").includes("/.claude/local/node_modules/");
}
async function writeIfMissing(path16, content, mode) {
  try {
    return await writeFile12(path16, content, { encoding: "utf8", flag: "wx", mode }), !0;
  } catch (e) {
    if (getErrnoCode(e) === "EEXIST")
      return !1;
    throw e;
  }
}
async function ensureLocalPackageEnvironment() {
  try {
    let localInstallDir = getLocalInstallDir();
    await getFsImplementation().mkdir(localInstallDir), await writeIfMissing(join62(localInstallDir, "package.json"), jsonStringify({ name: "claude-local", version: "0.0.1", private: !0 }, null, 2));
    let wrapperPath = join62(localInstallDir, "claude");
    if (await writeIfMissing(wrapperPath, `#!/bin/sh
exec "${localInstallDir}/node_modules/.bin/claude" "$@"`, 493))
      await chmod3(wrapperPath, 493);
    return !0;
  } catch (error44) {
    return logError2(error44), !1;
  }
}
async function installOrUpdateClaudePackage(channel, specificVersion) {
  try {
    if (!await ensureLocalPackageEnvironment())
      return "install_failed";
    let result = await execFileNoThrowWithCwd("npm", ["install", `@anthropic-ai/claude-code@${specificVersion ? specificVersion : channel === "stable" ? "stable" : "latest"}`], { cwd: getLocalInstallDir(), maxBuffer: 1e6 });
    if (result.code !== 0) {
      let error44 = Error(`Failed to install Claude CLI package: ${result.stderr}`);
      return logError2(error44), result.code === 190 ? "in_progress" : "install_failed";
    }
    return saveGlobalConfig((current) => ({
      ...current,
      installMethod: "local"
    })), "success";
  } catch (error44) {
    return logError2(error44), "install_failed";
  }
}
async function localInstallationExists() {
  try {
    return await access(join62(getLocalInstallDir(), "node_modules", ".bin", "claude")), !0;
  } catch {
    return !1;
  }
}
function getShellType() {
  let shellPath = process.env.SHELL || "";
  if (shellPath.includes("zsh"))
    return "zsh";
  if (shellPath.includes("bash"))
    return "bash";
  if (shellPath.includes("fish"))
    return "fish";
  return "unknown";
}
var init_localInstaller = __esm(() => {
  init_config4();
  init_envUtils();
  init_errors();
  init_execFileNoThrow();
  init_fsOperations();
  init_log3();
  init_slowOperations();
});
