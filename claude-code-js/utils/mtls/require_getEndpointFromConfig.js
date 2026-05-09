// var: require_getEndpointFromConfig
var require_getEndpointFromConfig = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getEndpointFromConfig = void 0;
  var node_config_provider_1 = require_dist_cjs9(), getEndpointUrlConfig_1 = require_getEndpointUrlConfig(), getEndpointFromConfig = async (serviceId) => (0, node_config_provider_1.loadConfig)((0, getEndpointUrlConfig_1.getEndpointUrlConfig)(serviceId ?? ""))();
  exports.getEndpointFromConfig = getEndpointFromConfig;
});
