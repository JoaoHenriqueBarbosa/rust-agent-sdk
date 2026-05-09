// function: defaultAuthorizeRequest
async function defaultAuthorizeRequest(options) {
  let { scopes, getAccessToken, request: request2 } = options, getTokenOptions = {
    abortSignal: request2.abortSignal,
    tracingOptions: request2.tracingOptions,
    enableCae: !0
  }, accessToken = await getAccessToken(scopes, getTokenOptions);
  if (accessToken)
    options.request.headers.set("Authorization", `Bearer ${accessToken.token}`);
}
