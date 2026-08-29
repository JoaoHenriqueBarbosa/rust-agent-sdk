// function: getSessionEndHookTimeoutMs
function getSessionEndHookTimeoutMs() {
  let raw = process.env.CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS, parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : SESSION_END_HOOK_TIMEOUT_MS_DEFAULT;
}
