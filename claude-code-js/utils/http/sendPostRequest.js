// function: sendPostRequest
async function sendPostRequest(thumbprint, tokenEndpoint, options, correlationId, cacheManager, networkClient, logger10, performanceClient) {
  ThrottlingUtils.preProcess(cacheManager, thumbprint, correlationId);
  let response7;
  try {
    response7 = await invokeAsync(networkClient.sendPostRequestAsync.bind(networkClient), NetworkClientSendPostRequestAsync, logger10, performanceClient, correlationId)(tokenEndpoint, options);
    let responseHeaders = response7.headers || {};
    performanceClient?.addFields({
      refreshTokenSize: response7.body.refresh_token?.length || 0,
      httpVerToken: responseHeaders[HeaderNames.X_MS_HTTP_VERSION] || "",
      requestId: responseHeaders[HeaderNames.X_MS_REQUEST_ID] || ""
    }, correlationId);
  } catch (e) {
    if (e instanceof NetworkError) {
      let responseHeaders = e.responseHeaders;
      if (responseHeaders)
        performanceClient?.addFields({
          httpVerToken: responseHeaders[HeaderNames.X_MS_HTTP_VERSION] || "",
          requestId: responseHeaders[HeaderNames.X_MS_REQUEST_ID] || "",
          contentTypeHeader: responseHeaders[HeaderNames.CONTENT_TYPE] || void 0,
          contentLengthHeader: responseHeaders[HeaderNames.CONTENT_LENGTH] || void 0,
          httpStatus: e.httpStatus
        }, correlationId);
      throw e.error;
    }
    if (e instanceof AuthError)
      throw e;
    else
      throw createClientAuthError(networkError);
  }
  return ThrottlingUtils.postProcess(cacheManager, thumbprint, response7, correlationId), response7;
}
