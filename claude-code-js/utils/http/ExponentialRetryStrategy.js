// class: ExponentialRetryStrategy
class ExponentialRetryStrategy {
  constructor(minExponentialBackoff, maxExponentialBackoff, exponentialDeltaBackoff) {
    this.minExponentialBackoff = minExponentialBackoff, this.maxExponentialBackoff = maxExponentialBackoff, this.exponentialDeltaBackoff = exponentialDeltaBackoff;
  }
  calculateDelay(currentRetry) {
    if (currentRetry === 0)
      return this.minExponentialBackoff;
    return Math.min(Math.pow(2, currentRetry - 1) * this.exponentialDeltaBackoff, this.maxExponentialBackoff);
  }
}
