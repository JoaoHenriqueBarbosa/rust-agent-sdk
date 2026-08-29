// var: getRetryConfiguration
var getRetryConfiguration = (runtimeConfig) => {
  return {
    setRetryStrategy(retryStrategy) {
      runtimeConfig.retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return runtimeConfig.retryStrategy;
    }
  };
}, resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
  let runtimeConfig = {};
  return runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy(), runtimeConfig;
};
