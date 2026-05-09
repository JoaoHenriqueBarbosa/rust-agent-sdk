// function: createAccountEntity
function createAccountEntity(accountDetails, authority, base64Decode) {
  let authorityType;
  if (authority.authorityType === AuthorityType.Adfs)
    authorityType = CACHE_ACCOUNT_TYPE_ADFS;
  else if (authority.protocolMode === ProtocolMode.OIDC)
    authorityType = CACHE_ACCOUNT_TYPE_GENERIC;
  else
    authorityType = CACHE_ACCOUNT_TYPE_MSSTS;
  let clientInfo, dataBoundary;
  if (accountDetails.clientInfo && base64Decode) {
    if (clientInfo = buildClientInfo(accountDetails.clientInfo, base64Decode), clientInfo.xms_tdbr)
      dataBoundary = clientInfo.xms_tdbr === "EU" ? "EU" : "None";
  }
  let env5 = accountDetails.environment || authority && authority.getPreferredCache();
  if (!env5)
    throw createClientAuthError(invalidCacheEnvironment);
  let preferredUsername = accountDetails.idTokenClaims?.preferred_username || accountDetails.idTokenClaims?.upn, email3 = accountDetails.idTokenClaims?.emails ? accountDetails.idTokenClaims.emails[0] : null, username = preferredUsername || email3 || "", loginHint = accountDetails.idTokenClaims?.login_hint, realm = clientInfo?.utid || getTenantIdFromIdTokenClaims(accountDetails.idTokenClaims) || "", localAccountId = clientInfo?.uid || accountDetails.idTokenClaims?.oid || accountDetails.idTokenClaims?.sub || "", tenantProfiles;
  if (accountDetails.tenantProfiles)
    tenantProfiles = accountDetails.tenantProfiles;
  else
    tenantProfiles = [buildTenantProfile(accountDetails.homeAccountId, localAccountId, realm, accountDetails.idTokenClaims)];
  return {
    homeAccountId: accountDetails.homeAccountId,
    environment: env5,
    realm,
    localAccountId,
    username,
    authorityType,
    loginHint,
    clientInfo: accountDetails.clientInfo,
    name: accountDetails.idTokenClaims?.name || "",
    lastModificationTime: void 0,
    lastModificationApp: void 0,
    cloudGraphHostName: accountDetails.cloudGraphHostName,
    msGraphHost: accountDetails.msGraphHost,
    nativeAccountId: accountDetails.nativeAccountId,
    tenantProfiles,
    dataBoundary
  };
}
