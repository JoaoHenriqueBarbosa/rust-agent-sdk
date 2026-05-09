// function: applySafeConfigEnvironmentVariables
function applySafeConfigEnvironmentVariables() {
  if (ccdSpawnEnvKeys === void 0)
    ccdSpawnEnvKeys = process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop" ? new Set(Object.keys(process.env)) : null;
  Object.assign(process.env, filterSettingsEnv(getGlobalConfig().env));
  for (let source of TRUSTED_SETTING_SOURCES) {
    if (source === "policySettings")
      continue;
    if (!isSettingSourceEnabled(source))
      continue;
    Object.assign(process.env, filterSettingsEnv(getSettingsForSource(source)?.env));
  }
  isRemoteManagedSettingsEligible(), Object.assign(process.env, filterSettingsEnv(getSettingsForSource("policySettings")?.env));
  let settingsEnv = filterSettingsEnv(getSettings_DEPRECATED()?.env);
  for (let [key3, value] of Object.entries(settingsEnv))
    if (SAFE_ENV_VARS2.has(key3.toUpperCase()))
      process.env[key3] = value;
}
