// var: require_endpointResolver5
var require_endpointResolver5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.defaultEndpointResolver = void 0;
  var util_endpoints_1 = require_dist_cjs51(), util_endpoints_2 = require_dist_cjs50(), ruleset_1 = require_ruleset5(), cache4 = new util_endpoints_2.EndpointCache({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
  }), defaultEndpointResolver4 = (endpointParams, context = {}) => {
    return cache4.get(endpointParams, () => (0, util_endpoints_2.resolveEndpoint)(ruleset_1.ruleSet, {
      endpointParams,
      logger: context.logger
    }));
  };
  exports.defaultEndpointResolver = defaultEndpointResolver4;
  util_endpoints_2.customEndpointFunctions.aws = util_endpoints_1.awsEndpointFunctions;
});
