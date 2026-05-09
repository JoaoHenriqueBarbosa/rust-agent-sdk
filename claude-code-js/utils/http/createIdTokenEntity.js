// function: createIdTokenEntity
function createIdTokenEntity(homeAccountId, environment, idToken, clientId, tenantId) {
  return {
    credentialType: CredentialType.ID_TOKEN,
    homeAccountId,
    environment,
    clientId,
    secret: idToken,
    realm: tenantId,
    lastUpdatedAt: Date.now().toString()
  };
}
