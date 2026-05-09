// function: createSystemAPIErrorMessage
function createSystemAPIErrorMessage(error44, retryInMs, retryAttempt, maxRetries) {
  return {
    type: "system",
    subtype: "api_error",
    level: "error",
    cause: error44.cause instanceof Error ? error44.cause : void 0,
    error: error44,
    retryInMs,
    retryAttempt,
    maxRetries,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22()
  };
}
