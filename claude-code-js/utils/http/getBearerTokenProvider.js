// function: getBearerTokenProvider
function getBearerTokenProvider(credential, scopes, options) {
  let { abortSignal, tracingOptions } = options || {}, pipeline2 = createEmptyPipeline2();
  pipeline2.addPolicy(bearerTokenAuthenticationPolicy({ credential, scopes }));
  async function getRefreshedToken() {
    let accessToken = (await pipeline2.sendRequest({
      sendRequest: (request2) => Promise.resolve({
        request: request2,
        status: 200,
        headers: request2.headers
      })
    }, createPipelineRequest2({
      url: "https://example.com",
      abortSignal,
      tracingOptions
    }))).headers.get("authorization")?.split(" ")[1];
    if (!accessToken)
      throw Error("Failed to get access token");
    return accessToken;
  }
  return getRefreshedToken;
}
