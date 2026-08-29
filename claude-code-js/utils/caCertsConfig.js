// Original: src/utils/caCertsConfig.ts
function applyExtraCACertsFromConfig() {
  if (process.env.NODE_EXTRA_CA_CERTS)
    return;
  let configPath = getExtraCertsPathFromConfig();
  if (configPath)
    process.env.NODE_EXTRA_CA_CERTS = configPath, logForDebugging(`CA certs: Applied NODE_EXTRA_CA_CERTS from config to process.env: ${configPath}`);
}
function getExtraCertsPathFromConfig() {
  try {
    let globalEnv = getGlobalConfig()?.env, settingsEnv = getSettingsForSource("userSettings")?.env;
    logForDebugging(`CA certs: Config fallback - globalEnv keys: ${globalEnv ? Object.keys(globalEnv).join(",") : "none"}, settingsEnv keys: ${settingsEnv ? Object.keys(settingsEnv).join(",") : "none"}`);
    let path25 = settingsEnv?.NODE_EXTRA_CA_CERTS || globalEnv?.NODE_EXTRA_CA_CERTS;
    if (path25)
      logForDebugging(`CA certs: Found NODE_EXTRA_CA_CERTS in config/settings: ${path25}`);
    return path25;
  } catch (error44) {
    logForDebugging(`CA certs: Config fallback failed: ${error44}`, {
      level: "error"
    });
    return;
  }
}
var init_caCertsConfig = __esm(() => {
  init_config4();
  init_debug();
  init_settings2();
});
