// function: isOtelHeadersHelperFromProjectOrLocalSettings
function isOtelHeadersHelperFromProjectOrLocalSettings() {
  let otelHeadersHelper = getConfiguredOtelHeadersHelper();
  if (!otelHeadersHelper)
    return !1;
  let projectSettings = getSettingsForSource("projectSettings"), localSettings = getSettingsForSource("localSettings");
  return projectSettings?.otelHeadersHelper === otelHeadersHelper || localSettings?.otelHeadersHelper === otelHeadersHelper;
}
