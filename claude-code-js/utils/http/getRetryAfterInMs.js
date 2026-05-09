// function: getRetryAfterInMs
function getRetryAfterInMs(response7) {
  if (!(response7 && [429, 503].includes(response7.status)))
    return;
  try {
    for (let header of AllRetryAfterHeaders) {
      let retryAfterValue = parseHeaderValueAsNumber(response7, header);
      if (retryAfterValue === 0 || retryAfterValue)
        return retryAfterValue * (header === RetryAfterHeader ? 1000 : 1);
    }
    let retryAfterHeader = response7.headers.get(RetryAfterHeader);
    if (!retryAfterHeader)
      return;
    let diff = Date.parse(retryAfterHeader) - Date.now();
    return Number.isFinite(diff) ? Math.max(0, diff) : void 0;
  } catch {
    return;
  }
}
