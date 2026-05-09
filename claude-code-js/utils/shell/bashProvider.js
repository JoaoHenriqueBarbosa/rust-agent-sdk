// Original: src/utils/shell/bashProvider.ts
import { access as access4 } from "fs/promises";
import { tmpdir as osTmpdir } from "os";
import { join as nativeJoin } from "path";
import { join as posixJoin } from "path/posix";
function getDisableExtglobCommand(shellPath) {
  if (process.env.CLAUDE_CODE_SHELL_PREFIX)
    return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
  if (shellPath.includes("bash"))
    return "shopt -u extglob 2>/dev/null || true";
  else if (shellPath.includes("zsh"))
    return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
  return null;
}
async function createBashShellProvider(shellPath, options2) {
  let currentSandboxTmpDir, snapshotPromise = options2?.skipSnapshot ? Promise.resolve(void 0) : createAndSaveSnapshot(shellPath).catch((error44) => {
    logForDebugging(`Failed to create shell snapshot: ${error44}`);
    return;
  }), lastSnapshotFilePath;
  return {
    type: "bash",
    shellPath,
    detached: !0,
    async buildExecCommand(command12, opts) {
      let snapshotFilePath = await snapshotPromise;
      if (snapshotFilePath)
        try {
          await access4(snapshotFilePath);
        } catch {
          logForDebugging(`Snapshot file missing, falling back to login shell: ${snapshotFilePath}`), snapshotFilePath = void 0;
        }
      lastSnapshotFilePath = snapshotFilePath, currentSandboxTmpDir = opts.sandboxTmpDir;
      let tmpdir7 = osTmpdir(), shellTmpdir = getPlatform() === "windows" ? windowsPathToPosixPath(tmpdir7) : tmpdir7, shellCwdFilePath = opts.useSandbox ? posixJoin(opts.sandboxTmpDir, `cwd-${opts.id}`) : posixJoin(shellTmpdir, `claude-${opts.id}-cwd`), cwdFilePath = opts.useSandbox ? posixJoin(opts.sandboxTmpDir, `cwd-${opts.id}`) : nativeJoin(tmpdir7, `claude-${opts.id}-cwd`), normalizedCommand = rewriteWindowsNullRedirect(command12), addStdinRedirect = shouldAddStdinRedirect(normalizedCommand), quotedCommand = quoteShellCommand(normalizedCommand, addStdinRedirect);
      if (normalizedCommand.includes("|") && addStdinRedirect)
        quotedCommand = rearrangePipeCommand(normalizedCommand);
      let commandParts = [];
      if (snapshotFilePath) {
        let finalPath = getPlatform() === "windows" ? windowsPathToPosixPath(snapshotFilePath) : snapshotFilePath;
        commandParts.push(`source ${quote([finalPath])} 2>/dev/null || true`);
      }
      let sessionEnvScript2 = await getSessionEnvironmentScript();
      if (sessionEnvScript2)
        commandParts.push(sessionEnvScript2);
      let disableExtglobCmd = getDisableExtglobCommand(shellPath);
      if (disableExtglobCmd)
        commandParts.push(disableExtglobCmd);
      commandParts.push(`eval ${quotedCommand}`), commandParts.push(`pwd -P >| ${quote([shellCwdFilePath])}`);
      let commandString = commandParts.join(" && ");
      if (process.env.CLAUDE_CODE_SHELL_PREFIX)
        commandString = formatShellPrefixCommand(process.env.CLAUDE_CODE_SHELL_PREFIX, commandString);
      return { commandString, cwdFilePath };
    },
    getSpawnArgs(commandString) {
      let skipLoginShell = lastSnapshotFilePath !== void 0;
      if (skipLoginShell)
        logForDebugging("Spawning shell without login (-l flag skipped)");
      return ["-c", ...skipLoginShell ? [] : ["-l"], commandString];
    },
    async getEnvironmentOverrides(command12) {
      let commandUsesTmux = command12.includes("tmux"), claudeTmuxEnv = getClaudeTmuxEnv(), env5 = {};
      if (claudeTmuxEnv)
        env5.TMUX = claudeTmuxEnv;
      if (currentSandboxTmpDir) {
        let posixTmpDir = currentSandboxTmpDir;
        if (getPlatform() === "windows")
          posixTmpDir = windowsPathToPosixPath(posixTmpDir);
        env5.TMPDIR = posixTmpDir, env5.CLAUDE_CODE_TMPDIR = posixTmpDir, env5.TMPPREFIX = posixJoin(posixTmpDir, "zsh");
      }
      for (let [key2, value] of getSessionEnvVars())
        env5[key2] = value;
      return env5;
    }
  };
}
var init_bashProvider = __esm(() => {
  init_bashPipeCommand();
  init_ShellSnapshot();
  init_shellPrefix();
  init_shellQuote();
  init_shellQuoting();
  init_debug();
  init_platform();
  init_sessionEnvironment();
  init_sessionEnvVars();
  init_tmuxSocket();
  init_windowsPaths();
});
