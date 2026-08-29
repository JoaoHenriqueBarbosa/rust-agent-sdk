// var: init_endpointResolver
var init_endpointResolver = __esm(() => {
  init_ruleset();
  import_util_endpoints = __toESM(require_dist_cjs51(), 1), import_util_endpoints2 = __toESM(require_dist_cjs50(), 1), cache = new import_util_endpoints2.EndpointCache({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
  });
  import_util_endpoints2.customEndpointFunctions.aws = import_util_endpoints.awsEndpointFunctions;
});
