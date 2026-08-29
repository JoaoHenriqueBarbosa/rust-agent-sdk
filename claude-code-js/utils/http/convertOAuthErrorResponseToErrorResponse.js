// function: convertOAuthErrorResponseToErrorResponse
function convertOAuthErrorResponseToErrorResponse(errorBody) {
  return {
    error: errorBody.error,
    errorDescription: errorBody.error_description,
    correlationId: errorBody.correlation_id,
    errorCodes: errorBody.error_codes,
    timestamp: errorBody.timestamp,
    traceId: errorBody.trace_id
  };
}
