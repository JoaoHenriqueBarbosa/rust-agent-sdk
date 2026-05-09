// function: redactHeaders
function redactHeaders(headers) {
  return Object.fromEntries(Object.entries(headers).map(([key3]) => [key3, "***REDACTED***"]));
}
