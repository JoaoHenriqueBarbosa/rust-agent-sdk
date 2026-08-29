// function: selectClientAuthMethod
function selectClientAuthMethod(clientInformation, supportedMethods) {
  let hasClientSecret = clientInformation.client_secret !== void 0;
  if ("token_endpoint_auth_method" in clientInformation && clientInformation.token_endpoint_auth_method && isClientAuthMethod(clientInformation.token_endpoint_auth_method) && (supportedMethods.length === 0 || supportedMethods.includes(clientInformation.token_endpoint_auth_method)))
    return clientInformation.token_endpoint_auth_method;
  if (supportedMethods.length === 0)
    return hasClientSecret ? "client_secret_basic" : "none";
  if (hasClientSecret && supportedMethods.includes("client_secret_basic"))
    return "client_secret_basic";
  if (hasClientSecret && supportedMethods.includes("client_secret_post"))
    return "client_secret_post";
  if (supportedMethods.includes("none"))
    return "none";
  return hasClientSecret ? "client_secret_post" : "none";
}
