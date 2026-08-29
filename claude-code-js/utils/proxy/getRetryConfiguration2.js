// var: getRetryConfiguration2
var getRetryConfiguration2 = (runtimeConfig) => {
  return {
    setRetryStrategy(retryStrategy) {
      runtimeConfig.retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return runtimeConfig.retryStrategy;
    }
  };
}, resolveRetryRuntimeConfig2 = (retryStrategyConfiguration) => {
  let runtimeConfig = {};
  return runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy(), runtimeConfig;
};
