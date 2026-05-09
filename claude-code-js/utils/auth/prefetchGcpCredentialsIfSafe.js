// function: prefetchGcpCredentialsIfSafe
function prefetchGcpCredentialsIfSafe() {
  if (!getConfiguredGcpAuthRefresh())
    return;
  if (isGcpAuthRefreshFromProjectSettings()) {
    if (!checkHasTrustDialogAccepted() && !getIsNonInteractiveSession())
      return;
  }
  refreshGcpCredentialsIfNeeded();
}
