// var: getDefaultExtensionConfiguration
var getDefaultExtensionConfiguration = (runtimeConfig) => {
  return Object.assign(getChecksumConfiguration(runtimeConfig), getRetryConfiguration(runtimeConfig));
}, getDefaultClientConfiguration, resolveDefaultRuntimeConfig = (config3) => {
  return Object.assign(resolveChecksumRuntimeConfig(config3), resolveRetryRuntimeConfig(config3));
};
