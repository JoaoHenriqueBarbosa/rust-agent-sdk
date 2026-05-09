// function: tryCreateSpan
function tryCreateSpan(tracingClient2, request2, spanAttributes) {
  try {
    let { span, updatedOptions } = tracingClient2.startSpan(`HTTP ${request2.method}`, { tracingOptions: request2.tracingOptions }, {
      spanKind: "client",
      spanAttributes
    });
    if (!span.isRecording()) {
      span.end();
      return;
    }
    let headers = tracingClient2.createRequestHeaders(updatedOptions.tracingOptions.tracingContext);
    for (let [key, value] of Object.entries(headers))
      request2.headers.set(key, value);
    return { span, tracingContext: updatedOptions.tracingOptions.tracingContext };
  } catch (e) {
    logger12.warning(`Skipping creating a tracing span due to an error: ${getErrorMessage2(e)}`);
    return;
  }
}
