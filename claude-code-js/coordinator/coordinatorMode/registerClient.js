// function: registerClient
async function registerClient(authorizationServerUrl, { metadata, clientMetadata, scope, fetchFn }) {
  let registrationUrl;
  if (metadata) {
    if (!metadata.registration_endpoint)
      throw Error("Incompatible auth server: does not support dynamic client registration");
    registrationUrl = new URL(metadata.registration_endpoint);
  } else
    registrationUrl = new URL("/register", authorizationServerUrl);
  let response7 = await (fetchFn ?? fetch)(registrationUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...clientMetadata,
      ...scope !== void 0 ? { scope } : {}
    })
  });
  if (!response7.ok)
    throw await parseErrorResponse(response7);
  return OAuthClientInformationFullSchema.parse(await response7.json());
}
