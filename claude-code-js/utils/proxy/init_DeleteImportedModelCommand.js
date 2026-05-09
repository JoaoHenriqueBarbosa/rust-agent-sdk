// var: init_DeleteImportedModelCommand
var init_DeleteImportedModelCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint29 = __toESM(require_dist_cjs65(), 1);
  DeleteImportedModelCommand = class DeleteImportedModelCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint29.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteImportedModel", {}).n("BedrockClient", "DeleteImportedModelCommand").sc(DeleteImportedModel$).build() {
  };
});
