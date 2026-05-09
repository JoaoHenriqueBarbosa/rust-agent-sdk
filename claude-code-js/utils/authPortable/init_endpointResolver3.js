// var: init_endpointResolver3
var init_endpointResolver3 = __esm(() => {
  init_ruleset3();
  import_util_endpoints5 = __toESM(require_dist_cjs51(), 1), import_util_endpoints6 = __toESM(require_dist_cjs50(), 1), cache3 = new import_util_endpoints6.EndpointCache({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS", "UseGlobalEndpoint"]
  });
  import_util_endpoints6.customEndpointFunctions.aws = import_util_endpoints5.awsEndpointFunctions;
});
