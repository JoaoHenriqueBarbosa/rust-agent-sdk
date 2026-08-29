// var: getRetryConfiguration4
var getRetryConfiguration4 = (runtimeConfig) => {
  return {
    setRetryStrategy(retryStrategy) {
      runtimeConfig.retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return runtimeConfig.retryStrategy;
    }
  };
}, resolveRetryRuntimeConfig4 = (retryStrategyConfiguration) => {
  let runtimeConfig = {};
  return runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy(), runtimeConfig;
};
