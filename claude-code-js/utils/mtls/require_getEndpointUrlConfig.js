// var: require_getEndpointUrlConfig
var require_getEndpointUrlConfig = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getEndpointUrlConfig = void 0;
  var shared_ini_file_loader_1 = require_dist_cjs8(), ENV_ENDPOINT_URL = "AWS_ENDPOINT_URL", CONFIG_ENDPOINT_URL = "endpoint_url", getEndpointUrlConfig = (serviceId) => ({
    environmentVariableSelector: (env4) => {
      let serviceSuffixParts = serviceId.split(" ").map((w) => w.toUpperCase()), serviceEndpointUrl = env4[[ENV_ENDPOINT_URL, ...serviceSuffixParts].join("_")];
      if (serviceEndpointUrl)
        return serviceEndpointUrl;
      let endpointUrl = env4[ENV_ENDPOINT_URL];
      if (endpointUrl)
        return endpointUrl;
      return;
    },
    configFileSelector: (profile2, config3) => {
      if (config3 && profile2.services) {
        let servicesSection = config3[["services", profile2.services].join(shared_ini_file_loader_1.CONFIG_PREFIX_SEPARATOR)];
        if (servicesSection) {
          let servicePrefixParts = serviceId.split(" ").map((w) => w.toLowerCase()), endpointUrl2 = servicesSection[[servicePrefixParts.join("_"), CONFIG_ENDPOINT_URL].join(shared_ini_file_loader_1.CONFIG_PREFIX_SEPARATOR)];
          if (endpointUrl2)
            return endpointUrl2;
        }
      }
      let endpointUrl = profile2[CONFIG_ENDPOINT_URL];
      if (endpointUrl)
        return endpointUrl;
      return;
    },
    default: void 0
  });
  exports.getEndpointUrlConfig = getEndpointUrlConfig;
});
