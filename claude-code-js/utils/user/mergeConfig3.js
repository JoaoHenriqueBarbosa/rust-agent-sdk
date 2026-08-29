// function: mergeConfig3
function mergeConfig3(userConfig) {
  let perInstanceDefaults = {
    sampler: buildSamplerFromEnv()
  }, DEFAULT_CONFIG2 = loadDefaultConfig(), target = Object.assign({}, DEFAULT_CONFIG2, perInstanceDefaults, userConfig);
  return target.generalLimits = Object.assign({}, DEFAULT_CONFIG2.generalLimits, userConfig.generalLimits || {}), target.spanLimits = Object.assign({}, DEFAULT_CONFIG2.spanLimits, userConfig.spanLimits || {}), target;
}
