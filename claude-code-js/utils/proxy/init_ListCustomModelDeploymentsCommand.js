// var: init_ListCustomModelDeploymentsCommand
var init_ListCustomModelDeploymentsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint67 = __toESM(require_dist_cjs65(), 1);
  ListCustomModelDeploymentsCommand = class ListCustomModelDeploymentsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint67.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListCustomModelDeployments", {}).n("BedrockClient", "ListCustomModelDeploymentsCommand").sc(ListCustomModelDeployments$).build() {
  };
});
