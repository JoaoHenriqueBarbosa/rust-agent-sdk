// var: init_DeleteCustomModelCommand
var init_DeleteCustomModelCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint24 = __toESM(require_dist_cjs65(), 1);
  DeleteCustomModelCommand = class DeleteCustomModelCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint24.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteCustomModel", {}).n("BedrockClient", "DeleteCustomModelCommand").sc(DeleteCustomModel$).build() {
  };
});
