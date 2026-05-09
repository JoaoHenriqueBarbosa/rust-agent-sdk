// function: isOpenIdConfigResponse
function isOpenIdConfigResponse(response7) {
  return response7.hasOwnProperty("authorization_endpoint") && response7.hasOwnProperty("token_endpoint") && response7.hasOwnProperty("issuer") && response7.hasOwnProperty("jwks_uri");
}
