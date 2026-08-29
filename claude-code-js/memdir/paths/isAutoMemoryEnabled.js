// function: isAutoMemoryEnabled
function isAutoMemoryEnabled() {
  let envVal = process.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
  if (isEnvTruthy(envVal))
    return !1;
  if (isEnvDefinedFalsy(envVal))
    return !0;
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE))
    return !1;
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR)
    return !1;
  let settings = getInitialSettings();
  if (settings.autoMemoryEnabled !== void 0)
    return settings.autoMemoryEnabled;
  return !0;
}
