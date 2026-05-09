// function: isGcpAuthRefreshFromProjectSettings
function isGcpAuthRefreshFromProjectSettings() {
  let gcpAuthRefresh = getConfiguredGcpAuthRefresh();
  if (!gcpAuthRefresh)
    return !1;
  let projectSettings = getSettingsForSource("projectSettings"), localSettings = getSettingsForSource("localSettings");
  return projectSettings?.gcpAuthRefresh === gcpAuthRefresh || localSettings?.gcpAuthRefresh === gcpAuthRefresh;
}
