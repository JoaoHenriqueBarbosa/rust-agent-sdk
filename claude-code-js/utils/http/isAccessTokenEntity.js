// function: isAccessTokenEntity
function isAccessTokenEntity(entity) {
  if (!entity)
    return !1;
  return isCredentialEntity(entity) && entity.hasOwnProperty("realm") && entity.hasOwnProperty("target") && (entity.credentialType === CredentialType.ACCESS_TOKEN || entity.credentialType === CredentialType.ACCESS_TOKEN_WITH_AUTH_SCHEME);
}
