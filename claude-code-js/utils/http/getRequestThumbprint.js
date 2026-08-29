// function: getRequestThumbprint
function getRequestThumbprint(clientId, request2, homeAccountId) {
  return {
    clientId,
    authority: request2.authority,
    scopes: request2.scopes,
    homeAccountIdentifier: homeAccountId,
    claims: request2.claims,
    authenticationScheme: request2.authenticationScheme,
    resourceRequestMethod: request2.resourceRequestMethod,
    resourceRequestUri: request2.resourceRequestUri,
    shrClaims: request2.shrClaims,
    sshKid: request2.sshKid,
    embeddedClientId: request2.embeddedClientId || request2.extraParameters?.clientId
  };
}
