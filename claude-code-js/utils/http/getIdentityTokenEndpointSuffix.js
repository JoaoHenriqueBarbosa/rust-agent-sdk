// function: getIdentityTokenEndpointSuffix
function getIdentityTokenEndpointSuffix(tenantId) {
  if (tenantId === "adfs")
    return "oauth2/token";
  else
    return "oauth2/v2.0/token";
}
