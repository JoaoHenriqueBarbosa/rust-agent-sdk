// function: createRefreshTokenEntity
function createRefreshTokenEntity(homeAccountId, environment, refreshToken, clientId, familyId, userAssertionHash, expiresOn) {
  let rtEntity = {
    credentialType: CredentialType.REFRESH_TOKEN,
    homeAccountId,
    environment,
    clientId,
    secret: refreshToken,
    lastUpdatedAt: Date.now().toString()
  };
  if (userAssertionHash)
    rtEntity.userAssertionHash = userAssertionHash;
  if (familyId)
    rtEntity.familyId = familyId;
  if (expiresOn)
    rtEntity.expiresOn = expiresOn.toString();
  return rtEntity;
}
