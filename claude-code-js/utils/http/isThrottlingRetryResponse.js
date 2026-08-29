// function: isThrottlingRetryResponse
function isThrottlingRetryResponse(response7) {
  return Number.isFinite(getRetryAfterInMs(response7));
}
