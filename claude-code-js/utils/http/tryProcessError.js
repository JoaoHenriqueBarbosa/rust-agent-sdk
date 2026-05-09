// function: tryProcessError
function tryProcessError(span, error43) {
  try {
    if (span.setStatus({
      status: "error",
      error: isError2(error43) ? error43 : void 0
    }), isRestError2(error43) && error43.statusCode)
      span.setAttribute("http.status_code", error43.statusCode);
    span.end();
  } catch (e) {
    logger12.warning(`Skipping tracing span processing due to an error: ${getErrorMessage2(e)}`);
  }
}
