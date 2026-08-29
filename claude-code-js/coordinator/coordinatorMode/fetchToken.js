// function: fetchToken
async function fetchToken(provider5, authorizationServerUrl, { metadata, resource, authorizationCode, fetchFn } = {}) {
  let scope = provider5.clientMetadata.scope, tokenRequestParams;
  if (provider5.prepareTokenRequest)
    tokenRequestParams = await provider5.prepareTokenRequest(scope);
  if (!tokenRequestParams) {
    if (!authorizationCode)
      throw Error("Either provider.prepareTokenRequest() or authorizationCode is required");
    if (!provider5.redirectUrl)
      throw Error("redirectUrl is required for authorization_code flow");
    let codeVerifier = await provider5.codeVerifier();
    tokenRequestParams = prepareAuthorizationCodeRequest(authorizationCode, codeVerifier, provider5.redirectUrl);
  }
  let clientInformation = await provider5.clientInformation();
  return executeTokenRequest(authorizationServerUrl, {
    metadata,
    tokenRequestParams,
    clientInformation: clientInformation ?? void 0,
    addClientAuthentication: provider5.addClientAuthentication,
    resource,
    fetchFn
  });
}
