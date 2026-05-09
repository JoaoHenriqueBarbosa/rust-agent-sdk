// function: defaultParseResponse
async function defaultParseResponse(client, props) {
  let { response, requestLogID, retryOfRequestLogID, startTime } = props, body = await (async () => {
    if (props.options.stream) {
      if (loggerFor(client).debug("response", response.status, response.url, response.headers, response.body), props.options.__streamClass)
        return props.options.__streamClass.fromSSEResponse(response, props.controller);
      return Stream.fromSSEResponse(response, props.controller);
    }
    if (response.status === 204)
      return null;
    if (props.options.__binaryResponse)
      return response;
    let mediaType = response.headers.get("content-type")?.split(";")[0]?.trim();
    if (mediaType?.includes("application/json") || mediaType?.endsWith("+json")) {
      let json = await response.json();
      return addRequestID(json, response);
    }
    return await response.text();
  })();
  return loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
    retryOfRequestLogID,
    url: response.url,
    status: response.status,
    body,
    durationMs: Date.now() - startTime
  })), body;
}
