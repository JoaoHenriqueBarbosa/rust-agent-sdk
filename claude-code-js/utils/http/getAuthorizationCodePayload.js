// function: getAuthorizationCodePayload
function getAuthorizationCodePayload(serverParams, cachedState) {
  if (validateAuthorizationResponse(serverParams, cachedState), !serverParams.code)
    throw createClientAuthError(authorizationCodeMissingFromServerResponse);
  return serverParams;
}
