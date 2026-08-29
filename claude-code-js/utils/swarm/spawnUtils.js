// Original: src/utils/swarm/spawnUtils.ts
function getTeammateCommand() {
  if (process.env[TEAMMATE_COMMAND_ENV_VAR])
    return process.env[TEAMMATE_COMMAND_ENV_VAR];
  return isInBundledMode() ? process.execPath : process.argv[1];
}
function buildInheritedCliFlags(options2) {
  let flags = [], { planModeRequired, permissionMode } = options2 || {};
  if (planModeRequired)
    ;
  else if (permissionMode === "bypassPermissions" || getSessionBypassPermissionsMode())
    flags.push("--dangerously-skip-permissions");
  else if (permissionMode === "acceptEdits")
    flags.push("--permission-mode acceptEdits");
  let modelOverride = getMainLoopModelOverride();
  if (modelOverride)
    flags.push(`--model ${quote([modelOverride])}`);
  let settingsPath = getFlagSettingsPath();
  if (settingsPath)
    flags.push(`--settings ${quote([settingsPath])}`);
  let inlinePlugins = getInlinePlugins();
  for (let pluginDir of inlinePlugins)
    flags.push(`--plugin-dir ${quote([pluginDir])}`);
  let sessionMode = getTeammateModeFromSnapshot();
  flags.push(`--teammate-mode ${sessionMode}`);
  let chromeFlagOverride = getChromeFlagOverride();
  if (chromeFlagOverride === !0)
    flags.push("--chrome");
  else if (chromeFlagOverride === !1)
    flags.push("--no-chrome");
  return flags.join(" ");
}
function buildInheritedEnvVars() {
  let envVars = ["CLAUDECODE=1", "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1"];
  for (let key2 of TEAMMATE_ENV_VARS) {
    let value = process.env[key2];
    if (value !== void 0 && value !== "")
      envVars.push(`${key2}=${quote([value])}`);
  }
  return envVars.join(" ");
}
var TEAMMATE_ENV_VARS;
var init_spawnUtils = __esm(() => {
  init_state();
  init_shellQuote();
  init_teammateModeSnapshot();
  TEAMMATE_ENV_VARS = [
    "CLAUDE_CODE_USE_BEDROCK",
    "CLAUDE_CODE_USE_VERTEX",
    "CLAUDE_CODE_USE_FOUNDRY",
    "ANTHROPIC_BASE_URL",
    "CLAUDE_CONFIG_DIR",
    "CLAUDE_CODE_REMOTE",
    "CLAUDE_CODE_REMOTE_MEMORY_DIR",
    "HTTPS_PROXY",
    "https_proxy",
    "HTTP_PROXY",
    "http_proxy",
    "NO_PROXY",
    "no_proxy",
    "SSL_CERT_FILE",
    "NODE_EXTRA_CA_CERTS",
    "REQUESTS_CA_BUNDLE",
    "CURL_CA_BUNDLE"
  ];
});
