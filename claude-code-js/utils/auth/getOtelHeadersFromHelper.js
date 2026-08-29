// function: getOtelHeadersFromHelper
function getOtelHeadersFromHelper() {
  let otelHeadersHelper = getConfiguredOtelHeadersHelper();
  if (!otelHeadersHelper)
    return {};
  let debounceMs = parseInt(process.env.CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS || DEFAULT_OTEL_HEADERS_DEBOUNCE_MS.toString());
  if (cachedOtelHeaders && Date.now() - cachedOtelHeadersTimestamp < debounceMs)
    return cachedOtelHeaders;
  if (isOtelHeadersHelperFromProjectOrLocalSettings()) {
    if (!checkHasTrustDialogAccepted())
      return {};
  }
  try {
    let result = execSyncWithDefaults_DEPRECATED(otelHeadersHelper, {
      timeout: 30000
    })?.toString().trim();
    if (!result)
      throw Error("otelHeadersHelper did not return a valid value");
    let headers = jsonParse(result);
    if (typeof headers !== "object" || headers === null || Array.isArray(headers))
      throw Error("otelHeadersHelper must return a JSON object with string key-value pairs");
    for (let [key, value] of Object.entries(headers))
      if (typeof value !== "string")
        throw Error(`otelHeadersHelper returned non-string value for key "${key}": ${typeof value}`);
    return cachedOtelHeaders = headers, cachedOtelHeadersTimestamp = Date.now(), cachedOtelHeaders;
  } catch (error44) {
    throw logError2(Error(`Error getting OpenTelemetry headers from otelHeadersHelper (in settings): ${errorMessage(error44)}`)), error44;
  }
}
