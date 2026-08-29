// function: getAccountInfo
function getAccountInfo(accountEntity) {
  let tenantProfiles = accountEntity.tenantProfiles || [];
  if (tenantProfiles.length === 0 && accountEntity.realm && accountEntity.localAccountId)
    tenantProfiles.push(buildTenantProfile(accountEntity.homeAccountId, accountEntity.localAccountId, accountEntity.realm));
  return {
    homeAccountId: accountEntity.homeAccountId,
    environment: accountEntity.environment,
    tenantId: accountEntity.realm,
    username: accountEntity.username,
    localAccountId: accountEntity.localAccountId,
    loginHint: accountEntity.loginHint,
    name: accountEntity.name,
    nativeAccountId: accountEntity.nativeAccountId,
    authorityType: accountEntity.authorityType,
    tenantProfiles: new Map(tenantProfiles.map((tenantProfile) => {
      return [tenantProfile.tenantId, tenantProfile];
    })),
    dataBoundary: accountEntity.dataBoundary
  };
}
