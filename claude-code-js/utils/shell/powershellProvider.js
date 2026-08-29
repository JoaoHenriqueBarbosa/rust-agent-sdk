// Original: src/utils/shell/powershellProvider.ts
import { tmpdir as tmpdir7 } from "os";
import { join as join81 } from "path";
import { join as posixJoin2 } from "path/posix";
function buildPowerShellArgs(cmd) {
  return ["-NoProfile", "-NonInteractive", "-Command", cmd];
}
function encodePowerShellCommand(psCommand) {
  return Buffer.from(psCommand, "utf16le").toString("base64");
}
function createPowerShellProvider(shellPath) {
  let currentSandboxTmpDir;
  return {
    type: "powershell",
    shellPath,
    detached: !1,
    async buildExecCommand(command12, opts) {
      currentSandboxTmpDir = opts.useSandbox ? opts.sandboxTmpDir : void 0;
      let cwdFilePath = opts.useSandbox && opts.sandboxTmpDir ? posixJoin2(opts.sandboxTmpDir, `claude-pwd-ps-${opts.id}`) : join81(tmpdir7(), `claude-pwd-ps-${opts.id}`), cwdTracking = `
; $_ec = if ($null -ne $LASTEXITCODE) { $LASTEXITCODE } elseif ($?) { 0 } else { 1 }
; (Get-Location).Path | Out-File -FilePath '${cwdFilePath.replace(/'/g, "''")}' -Encoding utf8 -NoNewline
; exit $_ec`, psCommand = command12 + cwdTracking;
      return { commandString: opts.useSandbox ? [
        `'${shellPath.replace(/'/g, "'\\''")}'`,
        "-NoProfile",
        "-NonInteractive",
        "-EncodedCommand",
        encodePowerShellCommand(psCommand)
      ].join(" ") : psCommand, cwdFilePath };
    },
    getSpawnArgs(commandString) {
      return buildPowerShellArgs(commandString);
    },
    async getEnvironmentOverrides() {
      let env5 = {};
      for (let [key2, value] of getSessionEnvVars())
        env5[key2] = value;
      if (currentSandboxTmpDir)
        env5.TMPDIR = currentSandboxTmpDir, env5.CLAUDE_CODE_TMPDIR = currentSandboxTmpDir;
      return env5;
    }
  };
}
var init_powershellProvider = __esm(() => {
  init_sessionEnvVars();
});
