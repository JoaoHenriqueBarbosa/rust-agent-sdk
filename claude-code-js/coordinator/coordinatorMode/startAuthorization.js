// function: startAuthorization
async function startAuthorization(authorizationServerUrl, { metadata, clientInformation, redirectUrl, scope, state: state3, resource }) {
  let authorizationUrl;
  if (metadata) {
    if (authorizationUrl = new URL(metadata.authorization_endpoint), !metadata.response_types_supported.includes(AUTHORIZATION_CODE_RESPONSE_TYPE))
      throw Error(`Incompatible auth server: does not support response type ${AUTHORIZATION_CODE_RESPONSE_TYPE}`);
    if (metadata.code_challenge_methods_supported && !metadata.code_challenge_methods_supported.includes(AUTHORIZATION_CODE_CHALLENGE_METHOD))
      throw Error(`Incompatible auth server: does not support code challenge method ${AUTHORIZATION_CODE_CHALLENGE_METHOD}`);
  } else
    authorizationUrl = new URL("/authorize", authorizationServerUrl);
  let challenge = await pkceChallenge(), codeVerifier = challenge.code_verifier, codeChallenge = challenge.code_challenge;
  if (authorizationUrl.searchParams.set("response_type", AUTHORIZATION_CODE_RESPONSE_TYPE), authorizationUrl.searchParams.set("client_id", clientInformation.client_id), authorizationUrl.searchParams.set("code_challenge", codeChallenge), authorizationUrl.searchParams.set("code_challenge_method", AUTHORIZATION_CODE_CHALLENGE_METHOD), authorizationUrl.searchParams.set("redirect_uri", String(redirectUrl)), state3)
    authorizationUrl.searchParams.set("state", state3);
  if (scope)
    authorizationUrl.searchParams.set("scope", scope);
  if (scope?.includes("offline_access"))
    authorizationUrl.searchParams.append("prompt", "consent");
  if (resource)
    authorizationUrl.searchParams.set("resource", resource.href);
  return { authorizationUrl, codeVerifier };
}
