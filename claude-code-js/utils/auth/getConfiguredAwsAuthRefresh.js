// function: getConfiguredAwsAuthRefresh
function getConfiguredAwsAuthRefresh() {
  return (getSettings_DEPRECATED() || {}).awsAuthRefresh;
}
