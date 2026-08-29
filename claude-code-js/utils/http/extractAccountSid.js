// function: extractAccountSid
function extractAccountSid(account) {
  return account.idTokenClaims?.sid || null;
}
