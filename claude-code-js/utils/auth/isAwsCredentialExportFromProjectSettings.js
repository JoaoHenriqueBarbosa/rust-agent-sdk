// function: isAwsCredentialExportFromProjectSettings
function isAwsCredentialExportFromProjectSettings() {
  let awsCredentialExport = getConfiguredAwsCredentialExport();
  if (!awsCredentialExport)
    return !1;
  let projectSettings = getSettingsForSource("projectSettings"), localSettings = getSettingsForSource("localSettings");
  return projectSettings?.awsCredentialExport === awsCredentialExport || localSettings?.awsCredentialExport === awsCredentialExport;
}
