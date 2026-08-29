// function: getConfiguredAwsCredentialExport
function getConfiguredAwsCredentialExport() {
  return (getSettings_DEPRECATED() || {}).awsCredentialExport;
}
