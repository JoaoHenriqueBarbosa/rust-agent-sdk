// var: getDefaultExtensionConfiguration4
var getDefaultExtensionConfiguration4 = (runtimeConfig) => {
  return Object.assign(getChecksumConfiguration4(runtimeConfig), getRetryConfiguration4(runtimeConfig));
}, getDefaultClientConfiguration4, resolveDefaultRuntimeConfig4 = (config6) => {
  return Object.assign(resolveChecksumRuntimeConfig4(config6), resolveRetryRuntimeConfig4(config6));
};
