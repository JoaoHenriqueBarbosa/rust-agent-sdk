// var: init_DeleteCustomModelDeploymentCommand
var init_DeleteCustomModelDeploymentCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint25 = __toESM(require_dist_cjs65(), 1);
  DeleteCustomModelDeploymentCommand = class DeleteCustomModelDeploymentCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint25.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteCustomModelDeployment", {}).n("BedrockClient", "DeleteCustomModelDeploymentCommand").sc(DeleteCustomModelDeployment$).build() {
  };
});
