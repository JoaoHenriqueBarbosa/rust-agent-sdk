// function: buildAccountToCache
function buildAccountToCache(cacheStorage, authority, homeAccountId, base64Decode, correlationId, idTokenClaims, clientInfo, environment, claimsTenantId, authCodePayload, nativeAccountId, logger10, performanceClient) {
  logger10?.verbose("setCachedAccount called", correlationId);
  let accountEnvironment = environment || authority.getPreferredCache(), matchedAccounts = cacheStorage.getAccountsFilteredBy({ homeAccountId, environment: accountEnvironment }, correlationId);
  if (performanceClient?.addFields({ cacheMatchedAccounts: matchedAccounts.length }, correlationId), matchedAccounts.length > 1)
    logger10?.warning("Multiple base accounts matched homeAccountId. Ignoring cached account and creating a new base account.", correlationId);
  let baseAccount = (matchedAccounts.length === 1 ? matchedAccounts[0] : null) || createAccountEntity({
    homeAccountId,
    idTokenClaims,
    clientInfo,
    environment,
    cloudGraphHostName: authCodePayload?.cloud_graph_host_name,
    msGraphHost: authCodePayload?.msgraph_host,
    nativeAccountId
  }, authority, base64Decode), tenantProfiles = baseAccount.tenantProfiles || [], tenantId = claimsTenantId || baseAccount.realm;
  if (tenantId && !tenantProfiles.find((tenantProfile) => {
    return tenantProfile.tenantId === tenantId;
  })) {
    let newTenantProfile = buildTenantProfile(homeAccountId, baseAccount.localAccountId, tenantId, idTokenClaims);
    tenantProfiles.push(newTenantProfile);
  }
  return baseAccount.tenantProfiles = tenantProfiles, baseAccount;
}
