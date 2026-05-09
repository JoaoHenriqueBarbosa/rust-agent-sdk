// function: msalToPublic
function msalToPublic(clientId, account) {
  return {
    authority: account.environment ?? DefaultAuthority,
    homeAccountId: account.homeAccountId,
    tenantId: account.tenantId || DefaultTenantId,
    username: account.username,
    clientId,
    version: LatestAuthenticationRecordVersion
  };
}
