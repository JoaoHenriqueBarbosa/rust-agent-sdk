// function: getCredentialScopes
function getCredentialScopes(options) {
  if (options.credentialScopes)
    return options.credentialScopes;
  if (options.endpoint)
    return `${options.endpoint}/.default`;
  if (options.baseUri)
    return `${options.baseUri}/.default`;
  if (options.credential && !options.credentialScopes)
    throw Error("When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy");
  return;
}
