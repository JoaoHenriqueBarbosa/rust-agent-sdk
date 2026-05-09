// function: applyConfigEnvironmentVariables
function applyConfigEnvironmentVariables() {
  Object.assign(process.env, filterSettingsEnv(getGlobalConfig().env)), Object.assign(process.env, filterSettingsEnv(getSettings_DEPRECATED()?.env)), clearCACertsCache(), clearMTLSCache(), clearProxyCache(), configureGlobalAgents();
}
