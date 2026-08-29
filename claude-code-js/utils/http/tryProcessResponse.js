// function: tryProcessResponse
function tryProcessResponse(span, response7) {
  try {
    span.setAttribute("http.status_code", response7.status);
    let serviceRequestId = response7.headers.get("x-ms-request-id");
    if (serviceRequestId)
      span.setAttribute("serviceRequestId", serviceRequestId);
    if (response7.status >= 400)
      span.setStatus({
        status: "error"
      });
    span.end();
  } catch (e) {
    logger12.warning(`Skipping tracing span processing due to an error: ${getErrorMessage2(e)}`);
  }
}
