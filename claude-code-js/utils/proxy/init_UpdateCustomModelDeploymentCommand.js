// var: init_UpdateCustomModelDeploymentCommand
var init_UpdateCustomModelDeploymentCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint99 = __toESM(require_dist_cjs65(), 1);
  UpdateCustomModelDeploymentCommand = class UpdateCustomModelDeploymentCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint99.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "UpdateCustomModelDeployment", {}).n("BedrockClient", "UpdateCustomModelDeploymentCommand").sc(UpdateCustomModelDeployment$).build() {
  };
});
