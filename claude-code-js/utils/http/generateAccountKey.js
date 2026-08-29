// function: generateAccountKey
function generateAccountKey(account) {
  let homeTenantId = account.homeAccountId.split(".")[1];
  return [
    account.homeAccountId,
    account.environment,
    homeTenantId || account.tenantId || ""
  ].join(CACHE.KEY_SEPARATOR).toLowerCase();
}
