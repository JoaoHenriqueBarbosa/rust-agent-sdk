// function: getTenantIdFromIdTokenClaims
function getTenantIdFromIdTokenClaims(idTokenClaims) {
  if (idTokenClaims)
    return idTokenClaims.tid || idTokenClaims.tfp || idTokenClaims.acr || null;
  return null;
}
