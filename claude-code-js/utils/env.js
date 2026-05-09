// Original: src/utils/env.ts
import { homedir as homedir7 } from "os";
import { join as join15 } from "path";
async function isCommandAvailable(command) {
  try {
    return !!await which(command);
  } catch {
    return !1;
  }
}
function isConductor() {
  return process.env.__CFBundleIdentifier === "com.conductor.app";
}
function detectTerminal() {
  if (process.env.CURSOR_TRACE_ID)
    return "cursor";
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("cursor"))
    return "cursor";
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("windsurf"))
    return "windsurf";
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("antigravity"))
    return "antigravity";
  let bundleId = process.env.__CFBundleIdentifier?.toLowerCase();
  if (bundleId?.includes("vscodium"))
    return "codium";
  if (bundleId?.includes("windsurf"))
    return "windsurf";
  if (bundleId?.includes("com.google.android.studio"))
    return "androidstudio";
  if (bundleId) {
    for (let ide of JETBRAINS_IDES)
      if (bundleId.includes(ide))
        return ide;
  }
  if (process.env.VisualStudioVersion)
    return "visualstudio";
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
    if (process.platform === "darwin")
      return "pycharm";
    return "pycharm";
  }
  if (process.env.TERM === "xterm-ghostty")
    return "ghostty";
  if (process.env.TERM?.includes("kitty"))
    return "kitty";
  if (process.env.TERM_PROGRAM)
    return process.env.TERM_PROGRAM;
  if (process.env.TMUX)
    return "tmux";
  if (process.env.STY)
    return "screen";
  if (process.env.KONSOLE_VERSION)
    return "konsole";
  if (process.env.GNOME_TERMINAL_SERVICE)
    return "gnome-terminal";
  if (process.env.XTERM_VERSION)
    return "xterm";
  if (process.env.VTE_VERSION)
    return "vte-based";
  if (process.env.TERMINATOR_UUID)
    return "terminator";
  if (process.env.KITTY_WINDOW_ID)
    return "kitty";
  if (process.env.ALACRITTY_LOG)
    return "alacritty";
  if (process.env.TILIX_ID)
    return "tilix";
  if (process.env.WT_SESSION)
    return "windows-terminal";
  if (process.env.SESSIONNAME && process.env.TERM === "cygwin")
    return "cygwin";
  if (process.env.MSYSTEM)
    return process.env.MSYSTEM.toLowerCase();
  if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask)
    return "conemu";
  if (process.env.WSL_DISTRO_NAME)
    return `wsl-${process.env.WSL_DISTRO_NAME}`;
  if (isSSHSession())
    return "ssh-session";
  if (process.env.TERM) {
    let term = process.env.TERM;
    if (term.includes("alacritty"))
      return "alacritty";
    if (term.includes("rxvt"))
      return "rxvt";
    if (term.includes("termite"))
      return "termite";
    return process.env.TERM;
  }
  if (!process.stdout.isTTY)
    return "non-interactive";
  return null;
}
function isSSHSession() {
  return !!(process.env.SSH_CONNECTION || process.env.SSH_CLIENT || process.env.SSH_TTY);
}
function getHostPlatformForAnalytics() {
  let override = process.env.CLAUDE_CODE_HOST_PLATFORM;
  if (override === "win32" || override === "darwin" || override === "linux")
    return override;
  return env3.platform;
}
var getGlobalClaudeFile, hasInternetAccess, detectPackageManagers, detectRuntimes, isWslEnvironment, isNpmFromWindowsPath, JETBRAINS_IDES, detectDeploymentEnvironment, env3;
var init_env = __esm(() => {
  init_memoize();
  init_oauth();
  init_envUtils();
  init_findExecutable();
  init_fsOperations();
  init_which();
  getGlobalClaudeFile = memoize_default(() => {
    if (getFsImplementation().existsSync(join15(getClaudeConfigHomeDir(), ".config.json")))
      return join15(getClaudeConfigHomeDir(), ".config.json");
    let filename = `.claude${fileSuffixForOauthConfig()}.json`;
    return join15(process.env.CLAUDE_CONFIG_DIR || homedir7(), filename);
  }), hasInternetAccess = memoize_default(async () => {
    try {
      let { default: axiosClient } = await Promise.resolve().then(() => (init_axios2(), exports_axios));
      return await axiosClient.head("http://1.1.1.1", {
        signal: AbortSignal.timeout(1000)
      }), !0;
    } catch {
      return !1;
    }
  });
  detectPackageManagers = memoize_default(async () => {
    let packageManagers = [];
    if (await isCommandAvailable("npm"))
      packageManagers.push("npm");
    if (await isCommandAvailable("yarn"))
      packageManagers.push("yarn");
    if (await isCommandAvailable("pnpm"))
      packageManagers.push("pnpm");
    return packageManagers;
  }), detectRuntimes = memoize_default(async () => {
    let runtimes = [];
    if (await isCommandAvailable("bun"))
      runtimes.push("bun");
    if (await isCommandAvailable("deno"))
      runtimes.push("deno");
    if (await isCommandAvailable("node"))
      runtimes.push("node");
    return runtimes;
  }), isWslEnvironment = memoize_default(() => {
    try {
      return getFsImplementation().existsSync("/proc/sys/fs/binfmt_misc/WSLInterop");
    } catch (_error) {
      return !1;
    }
  }), isNpmFromWindowsPath = memoize_default(() => {
    try {
      if (!isWslEnvironment())
        return !1;
      let { cmd } = findExecutable2("npm", []);
      return cmd.startsWith("/mnt/c/");
    } catch (_error) {
      return !1;
    }
  });
  JETBRAINS_IDES = [
    "pycharm",
    "intellij",
    "webstorm",
    "phpstorm",
    "rubymine",
    "clion",
    "goland",
    "rider",
    "datagrip",
    "appcode",
    "dataspell",
    "aqua",
    "gateway",
    "fleet",
    "jetbrains",
    "androidstudio"
  ];
  detectDeploymentEnvironment = memoize_default(() => {
    if (isEnvTruthy(process.env.CODESPACES))
      return "codespaces";
    if (process.env.GITPOD_WORKSPACE_ID)
      return "gitpod";
    if (process.env.REPL_ID || process.env.REPL_SLUG)
      return "replit";
    if (process.env.PROJECT_DOMAIN)
      return "glitch";
    if (isEnvTruthy(process.env.VERCEL))
      return "vercel";
    if (process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_SERVICE_NAME)
      return "railway";
    if (isEnvTruthy(process.env.RENDER))
      return "render";
    if (isEnvTruthy(process.env.NETLIFY))
      return "netlify";
    if (process.env.DYNO)
      return "heroku";
    if (process.env.FLY_APP_NAME || process.env.FLY_MACHINE_ID)
      return "fly.io";
    if (isEnvTruthy(process.env.CF_PAGES))
      return "cloudflare-pages";
    if (process.env.DENO_DEPLOYMENT_ID)
      return "deno-deploy";
    if (process.env.AWS_LAMBDA_FUNCTION_NAME)
      return "aws-lambda";
    if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_FARGATE")
      return "aws-fargate";
    if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_EC2")
      return "aws-ecs";
    try {
      if (getFsImplementation().readFileSync("/sys/hypervisor/uuid", { encoding: "utf8" }).trim().toLowerCase().startsWith("ec2"))
        return "aws-ec2";
    } catch {}
    if (process.env.K_SERVICE)
      return "gcp-cloud-run";
    if (process.env.GOOGLE_CLOUD_PROJECT)
      return "gcp";
    if (process.env.WEBSITE_SITE_NAME || process.env.WEBSITE_SKU)
      return "azure-app-service";
    if (process.env.AZURE_FUNCTIONS_ENVIRONMENT)
      return "azure-functions";
    if (process.env.APP_URL?.includes("ondigitalocean.app"))
      return "digitalocean-app-platform";
    if (process.env.SPACE_CREATOR_USER_ID)
      return "huggingface-spaces";
    if (isEnvTruthy(process.env.GITHUB_ACTIONS))
      return "github-actions";
    if (isEnvTruthy(process.env.GITLAB_CI))
      return "gitlab-ci";
    if (process.env.CIRCLECI)
      return "circleci";
    if (process.env.BUILDKITE)
      return "buildkite";
    if (isEnvTruthy(process.env.CI))
      return "ci";
    if (process.env.KUBERNETES_SERVICE_HOST)
      return "kubernetes";
    try {
      if (getFsImplementation().existsSync("/.dockerenv"))
        return "docker";
    } catch {}
    if (env3.platform === "darwin")
      return "unknown-darwin";
    if (env3.platform === "linux")
      return "unknown-linux";
    if (env3.platform === "win32")
      return "unknown-win32";
    return "unknown";
  });
  env3 = {
    hasInternetAccess,
    isCI: isEnvTruthy(process.env.CI),
    platform: ["win32", "darwin"].includes(process.platform) ? process.platform : "linux",
    arch: process.arch,
    nodeVersion: process.version,
    terminal: detectTerminal(),
    isSSH: isSSHSession,
    getPackageManagers: detectPackageManagers,
    getRuntimes: detectRuntimes,
    isRunningWithBun: memoize_default(isRunningWithBun),
    isWslEnvironment,
    isNpmFromWindowsPath,
    isConductor,
    detectDeploymentEnvironment
  };
});
