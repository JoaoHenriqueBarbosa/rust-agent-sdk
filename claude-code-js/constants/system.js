// Original: src/constants/system.ts
function getCLISyspromptPrefix(options) {
  if (getAPIProvider() === "vertex")
    return DEFAULT_PREFIX;
  if (options?.isNonInteractive) {
    if (options.hasAppendSystemPrompt)
      return AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX;
    return AGENT_SDK_PREFIX;
  }
  return DEFAULT_PREFIX;
}
function isAttributionHeaderEnabled() {
  if (isEnvDefinedFalsy(process.env.CLAUDE_CODE_ATTRIBUTION_HEADER))
    return !1;
  return !0;
}
function getAttributionHeader(fingerprint) {
  if (!isAttributionHeaderEnabled())
    return "";
  let version5 = `2.1.90.${fingerprint}`, entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT ?? "unknown", cch = "", workload = getWorkload(), workloadPair = workload ? ` cc_workload=${workload};` : "", header = `x-anthropic-billing-header: cc_version=${version5}; cc_entrypoint=${entrypoint};${cch}${workloadPair}`;
  return logForDebugging(`attribution header ${header}`), header;
}
var DEFAULT_PREFIX = "You are Claude Code, Anthropic's official CLI for Claude.", AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK.", AGENT_SDK_PREFIX = "You are a Claude agent, built on Anthropic's Claude Agent SDK.", CLI_SYSPROMPT_PREFIX_VALUES, CLI_SYSPROMPT_PREFIXES;
var init_system = __esm(() => {
  init_debug();
  init_envUtils();
  init_providers();
  init_workloadContext();
  CLI_SYSPROMPT_PREFIX_VALUES = [
    DEFAULT_PREFIX,
    AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX,
    AGENT_SDK_PREFIX
  ], CLI_SYSPROMPT_PREFIXES = new Set(CLI_SYSPROMPT_PREFIX_VALUES);
});
