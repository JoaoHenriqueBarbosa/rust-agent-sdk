// function: calculateRetryDelay
function calculateRetryDelay(retryAttempt, config8) {
  let exponentialDelay = config8.retryDelayInMs * Math.pow(2, retryAttempt), clampedDelay = Math.min(config8.maxRetryDelayInMs, exponentialDelay);
  return { retryAfterInMs: clampedDelay / 2 + getRandomIntegerInclusive(0, clampedDelay / 2) };
}
