// Original: src/utils/completionCache.ts
import { homedir as homedir28 } from "os";
import { dirname as dirname47, join as join103 } from "path";
function detectShell() {
  let shell = process.env.SHELL || "", home = homedir28(), claudeDir = join103(home, ".claude");
  if (shell.endsWith("/zsh") || shell.endsWith("/zsh.exe")) {
    let cacheFile = join103(claudeDir, "completion.zsh");
    return {
      name: "zsh",
      rcFile: join103(home, ".zshrc"),
      cacheFile,
      completionLine: `[[ -f "${cacheFile}" ]] && source "${cacheFile}"`,
      shellFlag: "zsh"
    };
  }
  if (shell.endsWith("/bash") || shell.endsWith("/bash.exe")) {
    let cacheFile = join103(claudeDir, "completion.bash");
    return {
      name: "bash",
      rcFile: join103(home, ".bashrc"),
      cacheFile,
      completionLine: `[ -f "${cacheFile}" ] && source "${cacheFile}"`,
      shellFlag: "bash"
    };
  }
  if (shell.endsWith("/fish") || shell.endsWith("/fish.exe")) {
    let xdg = process.env.XDG_CONFIG_HOME || join103(home, ".config"), cacheFile = join103(claudeDir, "completion.fish");
    return {
      name: "fish",
      rcFile: join103(xdg, "fish", "config.fish"),
      cacheFile,
      completionLine: `[ -f "${cacheFile}" ] && source "${cacheFile}"`,
      shellFlag: "fish"
    };
  }
  return null;
}
async function regenerateCompletionCache() {
  let shell = detectShell();
  if (!shell)
    return;
  logForDebugging(`update: Regenerating ${shell.name} completion cache`);
  let claudeBin = process.argv[1] || "claude";
  if ((await execFileNoThrow(claudeBin, [
    "completion",
    shell.shellFlag,
    "--output",
    shell.cacheFile
  ])).code !== 0) {
    logForDebugging(`update: Failed to regenerate ${shell.name} completion cache`);
    return;
  }
  logForDebugging(`update: Regenerated ${shell.name} completion cache at ${shell.cacheFile}`);
}
var init_completionCache = __esm(() => {
  init_color();
  init_supports_hyperlinks();
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_log3();
});
