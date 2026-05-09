// var: require_dist_cjs9
var require_dist_cjs9 = __commonJS((exports) => {
  var propertyProvider = require_dist_cjs6(), sharedIniFileLoader = require_dist_cjs8();
  function getSelectorName(functionString) {
    try {
      let constants4 = new Set(Array.from(functionString.match(/([A-Z_]){3,}/g) ?? []));
      return constants4.delete("CONFIG"), constants4.delete("CONFIG_PREFIX_SEPARATOR"), constants4.delete("ENV"), [...constants4].join(", ");
    } catch (e) {
      return functionString;
    }
  }
  var fromEnv3 = (envVarSelector, options) => async () => {
    try {
      let config2 = envVarSelector(process.env, options);
      if (config2 === void 0)
        throw Error();
      return config2;
    } catch (e) {
      throw new propertyProvider.CredentialsProviderError(e.message || `Not found in ENV: ${getSelectorName(envVarSelector.toString())}`, { logger: options?.logger });
    }
  }, fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
    let profile = sharedIniFileLoader.getProfileName(init), { configFile, credentialsFile } = await sharedIniFileLoader.loadSharedConfigFiles(init), profileFromCredentials = credentialsFile[profile] || {}, profileFromConfig = configFile[profile] || {}, mergedProfile = preferredFile === "config" ? { ...profileFromCredentials, ...profileFromConfig } : { ...profileFromConfig, ...profileFromCredentials };
    try {
      let configValue = configSelector(mergedProfile, preferredFile === "config" ? configFile : credentialsFile);
      if (configValue === void 0)
        throw Error();
      return configValue;
    } catch (e) {
      throw new propertyProvider.CredentialsProviderError(e.message || `Not found in config files w/ profile [${profile}]: ${getSelectorName(configSelector.toString())}`, { logger: init.logger });
    }
  }, isFunction4 = (func) => typeof func === "function", fromStatic = (defaultValue) => isFunction4(defaultValue) ? async () => await defaultValue() : propertyProvider.fromStatic(defaultValue), loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => {
    let { signingName, logger } = configuration, envOptions = { signingName, logger };
    return propertyProvider.memoize(propertyProvider.chain(fromEnv3(environmentVariableSelector, envOptions), fromSharedConfigFiles(configFileSelector, configuration), fromStatic(defaultValue)));
  };
  exports.loadConfig = loadConfig;
});
