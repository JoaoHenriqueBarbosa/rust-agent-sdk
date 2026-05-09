// class: LinearRetryStrategy
class LinearRetryStrategy {
  calculateDelay(retryHeader, minimumDelay) {
    if (!retryHeader)
      return minimumDelay;
    let millisToSleep = Math.round(parseFloat(retryHeader) * 1000);
    if (isNaN(millisToSleep))
      millisToSleep = new Date(retryHeader).valueOf() - (/* @__PURE__ */ new Date()).valueOf();
    return Math.max(minimumDelay, millisToSleep);
  }
}
