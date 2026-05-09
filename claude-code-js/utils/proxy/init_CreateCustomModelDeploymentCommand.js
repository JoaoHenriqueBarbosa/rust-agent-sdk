// var: init_CreateCustomModelDeploymentCommand
var init_CreateCustomModelDeploymentCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint8 = __toESM(require_dist_cjs65(), 1);
  CreateCustomModelDeploymentCommand = class CreateCustomModelDeploymentCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint8.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateCustomModelDeployment", {}).n("BedrockClient", "CreateCustomModelDeploymentCommand").sc(CreateCustomModelDeployment$).build() {
  };
});
