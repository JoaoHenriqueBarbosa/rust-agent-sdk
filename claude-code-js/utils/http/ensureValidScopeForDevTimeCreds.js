// function: ensureValidScopeForDevTimeCreds
function ensureValidScopeForDevTimeCreds(scope, logger15) {
  if (!scope.match(/^[0-9a-zA-Z-_.:/]+$/)) {
    let error43 = Error("Invalid scope was specified by the user or calling client");
    throw logger15.getToken.info(formatError2(scope, error43)), error43;
  }
}
