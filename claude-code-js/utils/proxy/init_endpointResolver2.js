// var: init_endpointResolver2
var init_endpointResolver2 = __esm(() => {
  init_ruleset2();
  import_util_endpoints3 = __toESM(require_dist_cjs51(), 1), import_util_endpoints4 = __toESM(require_dist_cjs50(), 1), cache2 = new import_util_endpoints4.EndpointCache({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
  });
  import_util_endpoints4.customEndpointFunctions.aws = import_util_endpoints3.awsEndpointFunctions;
});
