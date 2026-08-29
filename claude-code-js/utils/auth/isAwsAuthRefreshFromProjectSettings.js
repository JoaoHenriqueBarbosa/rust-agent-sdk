// function: isAwsAuthRefreshFromProjectSettings
function isAwsAuthRefreshFromProjectSettings() {
  let awsAuthRefresh = getConfiguredAwsAuthRefresh();
  if (!awsAuthRefresh)
    return !1;
  let projectSettings = getSettingsForSource("projectSettings"), localSettings = getSettingsForSource("localSettings");
  return projectSettings?.awsAuthRefresh === awsAuthRefresh || localSettings?.awsAuthRefresh === awsAuthRefresh;
}
