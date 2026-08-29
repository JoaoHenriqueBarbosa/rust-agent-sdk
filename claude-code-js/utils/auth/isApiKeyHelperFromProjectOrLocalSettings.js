// function: isApiKeyHelperFromProjectOrLocalSettings
function isApiKeyHelperFromProjectOrLocalSettings() {
  let apiKeyHelper = getConfiguredApiKeyHelper();
  if (!apiKeyHelper)
    return !1;
  let projectSettings = getSettingsForSource("projectSettings"), localSettings = getSettingsForSource("localSettings");
  return projectSettings?.apiKeyHelper === apiKeyHelper || localSettings?.apiKeyHelper === apiKeyHelper;
}
