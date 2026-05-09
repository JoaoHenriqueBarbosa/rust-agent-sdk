// var: getDefaultExtensionConfiguration2
var getDefaultExtensionConfiguration2 = (runtimeConfig) => {
  return Object.assign(getChecksumConfiguration2(runtimeConfig), getRetryConfiguration2(runtimeConfig));
}, getDefaultClientConfiguration2, resolveDefaultRuntimeConfig2 = (config4) => {
  return Object.assign(resolveChecksumRuntimeConfig2(config4), resolveRetryRuntimeConfig2(config4));
};
