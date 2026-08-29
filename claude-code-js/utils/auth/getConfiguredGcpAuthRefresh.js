// function: getConfiguredGcpAuthRefresh
function getConfiguredGcpAuthRefresh() {
  return (getSettings_DEPRECATED() || {}).gcpAuthRefresh;
}
