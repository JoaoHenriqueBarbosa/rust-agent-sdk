// function: generateCredentialKey
function generateCredentialKey(credential) {
  let familyId = credential.credentialType === exports_Constants.CredentialType.REFRESH_TOKEN && credential.familyId || credential.clientId, scheme = credential.tokenType && credential.tokenType.toLowerCase() !== exports_Constants.AuthenticationScheme.BEARER.toLowerCase() ? credential.tokenType.toLowerCase() : "";
  return [
    credential.homeAccountId,
    credential.environment,
    credential.credentialType,
    familyId,
    credential.realm || "",
    credential.target || "",
    scheme
  ].join(CACHE.KEY_SEPARATOR).toLowerCase();
}
