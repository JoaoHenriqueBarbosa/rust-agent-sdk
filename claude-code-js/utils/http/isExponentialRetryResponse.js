// function: isExponentialRetryResponse
function isExponentialRetryResponse(response7) {
  return Boolean(response7 && response7.status !== void 0 && (response7.status >= 500 || response7.status === 408) && response7.status !== 501 && response7.status !== 505);
}
