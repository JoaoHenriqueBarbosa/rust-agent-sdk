// function: shouldSkipHookDueToTrust
function shouldSkipHookDueToTrust() {
  if (!!getIsNonInteractiveSession())
    return !1;
  return !checkHasTrustDialogAccepted();
}
