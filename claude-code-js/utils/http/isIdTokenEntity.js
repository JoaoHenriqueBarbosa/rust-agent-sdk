// function: isIdTokenEntity
function isIdTokenEntity(entity) {
  if (!entity)
    return !1;
  return isCredentialEntity(entity) && entity.hasOwnProperty("realm") && entity.credentialType === CredentialType.ID_TOKEN;
}
