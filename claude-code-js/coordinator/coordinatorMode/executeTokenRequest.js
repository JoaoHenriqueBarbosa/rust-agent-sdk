// function: executeTokenRequest
async function executeTokenRequest(authorizationServerUrl, { metadata, tokenRequestParams, clientInformation, addClientAuthentication, resource, fetchFn }) {
  let tokenUrl = metadata?.token_endpoint ? new URL(metadata.token_endpoint) : new URL("/token", authorizationServerUrl), headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json"
  });
  if (resource)
    tokenRequestParams.set("resource", resource.href);
  if (addClientAuthentication)
    await addClientAuthentication(headers, tokenRequestParams, tokenUrl, metadata);
  else if (clientInformation) {
    let supportedMethods = metadata?.token_endpoint_auth_methods_supported ?? [], authMethod = selectClientAuthMethod(clientInformation, supportedMethods);
    applyClientAuthentication(authMethod, clientInformation, headers, tokenRequestParams);
  }
  let response7 = await (fetchFn ?? fetch)(tokenUrl, {
    method: "POST",
    headers,
    body: tokenRequestParams
  });
  if (!response7.ok)
    throw await parseErrorResponse(response7);
  return OAuthTokensSchema.parse(await response7.json());
}
