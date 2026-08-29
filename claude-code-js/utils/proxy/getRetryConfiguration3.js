// var: getRetryConfiguration3
var getRetryConfiguration3 = (runtimeConfig) => {
  return {
    setRetryStrategy(retryStrategy) {
      runtimeConfig.retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return runtimeConfig.retryStrategy;
    }
  };
}, resolveRetryRuntimeConfig3 = (retryStrategyConfiguration) => {
  let runtimeConfig = {};
  return runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy(), runtimeConfig;
};
