// var: serviceFabricErrorMessage
var serviceFabricErrorMessage = "Specifying a `clientId` or `resourceId` is not supported by the Service Fabric managed identity environment. The managed identity configuration is determined by the Service Fabric cluster resource configuration. See https://aka.ms/servicefabricmi for more information";

// node_modules/@azure/identity/dist/esm/client/identityClient.js
function getIdentityClientAuthorityHost(options) {
  let authorityHost = options?.authorityHost;
  if (isNode)
    authorityHost = authorityHost ?? process.env.AZURE_AUTHORITY_HOST;
  return authorityHost ?? DefaultAuthorityHost;
}
