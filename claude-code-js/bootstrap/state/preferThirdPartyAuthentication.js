// function: preferThirdPartyAuthentication
function preferThirdPartyAuthentication() {
  return getIsNonInteractiveSession() && STATE.clientType !== "claude-vscode";
}
