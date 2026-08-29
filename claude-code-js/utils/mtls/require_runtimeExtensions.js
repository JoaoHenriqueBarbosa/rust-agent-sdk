// var: require_runtimeExtensions
var require_runtimeExtensions = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.resolveRuntimeExtensions = void 0;
  var region_config_resolver_1 = require_dist_cjs87(), protocol_http_1 = require_dist_cjs88(), smithy_client_1 = require_dist_cjs71(), httpAuthExtensionConfiguration_1 = require_httpAuthExtensionConfiguration(), resolveRuntimeExtensions = (runtimeConfig, extensions4) => {
    let extensionConfiguration = Object.assign((0, region_config_resolver_1.getAwsRegionExtensionConfiguration)(runtimeConfig), (0, smithy_client_1.getDefaultExtensionConfiguration)(runtimeConfig), (0, protocol_http_1.getHttpHandlerExtensionConfiguration)(runtimeConfig), (0, httpAuthExtensionConfiguration_1.getHttpAuthExtensionConfiguration)(runtimeConfig));
    return extensions4.forEach((extension) => extension.configure(extensionConfiguration)), Object.assign(runtimeConfig, (0, region_config_resolver_1.resolveAwsRegionExtensionConfiguration)(extensionConfiguration), (0, smithy_client_1.resolveDefaultRuntimeConfig)(extensionConfiguration), (0, protocol_http_1.resolveHttpHandlerRuntimeConfig)(extensionConfiguration), (0, httpAuthExtensionConfiguration_1.resolveHttpAuthRuntimeConfig)(extensionConfiguration));
  };
  exports.resolveRuntimeExtensions = resolveRuntimeExtensions;
});
