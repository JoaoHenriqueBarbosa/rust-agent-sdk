// function: publicToMsal
function publicToMsal(account) {
  return {
    localAccountId: account.homeAccountId,
    environment: account.authority,
    username: account.username,
    homeAccountId: account.homeAccountId,
    tenantId: account.tenantId
  };
}
