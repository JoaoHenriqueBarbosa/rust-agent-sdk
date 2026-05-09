// function: isRefreshTokenEntity
function isRefreshTokenEntity(entity) {
  if (!entity)
    return !1;
  return isCredentialEntity(entity) && entity.credentialType === CredentialType.REFRESH_TOKEN;
}
