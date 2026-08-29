// function: createAccessTokenEntity
function createAccessTokenEntity(homeAccountId, environment, accessToken, clientId, tenantId, scopes, expiresOn, extExpiresOn, base64Decode, refreshOn, tokenType, userAssertionHash, keyId) {
  let atEntity = {
    homeAccountId,
    credentialType: CredentialType.ACCESS_TOKEN,
    secret: accessToken,
    cachedAt: nowSeconds().toString(),
    expiresOn: expiresOn.toString(),
    extendedExpiresOn: extExpiresOn.toString(),
    environment,
    clientId,
    realm: tenantId,
    target: scopes,
    tokenType: tokenType || AuthenticationScheme.BEARER,
    lastUpdatedAt: Date.now().toString()
  };
  if (userAssertionHash)
    atEntity.userAssertionHash = userAssertionHash;
  if (refreshOn)
    atEntity.refreshOn = refreshOn.toString();
  if (atEntity.tokenType?.toLowerCase() !== AuthenticationScheme.BEARER.toLowerCase())
    switch (atEntity.credentialType = CredentialType.ACCESS_TOKEN_WITH_AUTH_SCHEME, atEntity.tokenType) {
      case AuthenticationScheme.POP:
        let tokenClaims = extractTokenClaims(accessToken, base64Decode);
        if (!tokenClaims?.cnf?.kid)
          throw createClientAuthError(tokenClaimsCnfRequiredForSignedJwt);
        atEntity.keyId = tokenClaims.cnf.kid;
        break;
      case AuthenticationScheme.SSH:
        atEntity.keyId = keyId;
    }
  return atEntity;
}
