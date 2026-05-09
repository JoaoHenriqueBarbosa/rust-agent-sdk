// var: require_dist_cjs77
var require_dist_cjs77 = __commonJS((exports) => {
  var configResolver = require_dist_cjs58(), nodeConfigProvider = require_dist_cjs9(), propertyProvider = require_dist_cjs6(), AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV", AWS_REGION_ENV = "AWS_REGION", AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION", ENV_IMDS_DISABLED2 = "AWS_EC2_METADATA_DISABLED", DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"], IMDS_REGION_PATH = "/latest/meta-data/placement/region", AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE", AWS_DEFAULTS_MODE_CONFIG = "defaults_mode", NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => {
      return env4[AWS_DEFAULTS_MODE_ENV];
    },
    configFileSelector: (profile2) => {
      return profile2[AWS_DEFAULTS_MODE_CONFIG];
    },
    default: "legacy"
  }, resolveDefaultsModeConfig = ({ region = nodeConfigProvider.loadConfig(configResolver.NODE_REGION_CONFIG_OPTIONS), defaultsMode = nodeConfigProvider.loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => propertyProvider.memoize(async () => {
    let mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
    switch (mode?.toLowerCase()) {
      case "auto":
        return resolveNodeDefaultsModeAuto(region);
      case "in-region":
      case "cross-region":
      case "mobile":
      case "standard":
      case "legacy":
        return Promise.resolve(mode?.toLocaleLowerCase());
      case void 0:
        return Promise.resolve("legacy");
      default:
        throw Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
    }
  }), resolveNodeDefaultsModeAuto = async (clientRegion) => {
    if (clientRegion) {
      let resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion, inferredRegion = await inferPhysicalRegion();
      if (!inferredRegion)
        return "standard";
      if (resolvedRegion === inferredRegion)
        return "in-region";
      else
        return "cross-region";
    }
    return "standard";
  }, inferPhysicalRegion = async () => {
    if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV]))
      return process.env[AWS_REGION_ENV] ?? process.env[AWS_DEFAULT_REGION_ENV];
    if (!process.env[ENV_IMDS_DISABLED2])
      try {
        let { getInstanceMetadataEndpoint: getInstanceMetadataEndpoint2, httpRequest: httpRequest3 } = await Promise.resolve().then(() => (init_dist_es2(), exports_dist_es2)), endpoint2 = await getInstanceMetadataEndpoint2();
        return (await httpRequest3({ ...endpoint2, path: IMDS_REGION_PATH })).toString();
      } catch (e) {}
  };
  exports.resolveDefaultsModeConfig = resolveDefaultsModeConfig;
});
