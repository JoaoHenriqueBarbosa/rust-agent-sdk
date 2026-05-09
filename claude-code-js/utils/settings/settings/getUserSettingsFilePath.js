// function: getUserSettingsFilePath
function getUserSettingsFilePath() {
  if (getUseCoworkPlugins() || isEnvTruthy(process.env.CLAUDE_CODE_USE_COWORK_PLUGINS))
    return "cowork_settings.json";
  return "settings.json";
}
