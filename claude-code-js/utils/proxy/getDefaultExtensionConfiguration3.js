// var: getDefaultExtensionConfiguration3
var getDefaultExtensionConfiguration3 = (runtimeConfig) => {
  return Object.assign(getChecksumConfiguration3(runtimeConfig), getRetryConfiguration3(runtimeConfig));
}, getDefaultClientConfiguration3, resolveDefaultRuntimeConfig3 = (config5) => {
  return Object.assign(resolveChecksumRuntimeConfig3(config5), resolveRetryRuntimeConfig3(config5));
};
