// function: prefetchAwsCredentialsAndBedRockInfoIfSafe
function prefetchAwsCredentialsAndBedRockInfoIfSafe() {
  let awsAuthRefresh = getConfiguredAwsAuthRefresh(), awsCredentialExport = getConfiguredAwsCredentialExport();
  if (!awsAuthRefresh && !awsCredentialExport)
    return;
  if (isAwsAuthRefreshFromProjectSettings() || isAwsCredentialExportFromProjectSettings()) {
    if (!checkHasTrustDialogAccepted() && !getIsNonInteractiveSession())
      return;
  }
  refreshAndGetAwsCredentials(), getModelStrings2();
}
