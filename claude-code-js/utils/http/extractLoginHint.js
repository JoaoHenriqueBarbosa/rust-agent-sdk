// function: extractLoginHint
function extractLoginHint(account) {
  return account.loginHint || account.idTokenClaims?.login_hint || null;
}
