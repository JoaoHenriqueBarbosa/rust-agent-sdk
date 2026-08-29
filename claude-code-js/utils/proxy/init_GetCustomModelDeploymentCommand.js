// var: init_GetCustomModelDeploymentCommand
var init_GetCustomModelDeploymentCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint46 = __toESM(require_dist_cjs65(), 1);
  GetCustomModelDeploymentCommand = class GetCustomModelDeploymentCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint46.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetCustomModelDeployment", {}).n("BedrockClient", "GetCustomModelDeploymentCommand").sc(GetCustomModelDeployment$).build() {
  };
});
