// var: retryWrapper
var retryWrapper = (toRetry, maxRetries, delayMs) => {
  return async () => {
    for (let i2 = 0;i2 < maxRetries; ++i2)
      try {
        return await toRetry();
      } catch (e) {
        await new Promise((resolve8) => setTimeout(resolve8, delayMs));
      }
    return await toRetry();
  };
};
