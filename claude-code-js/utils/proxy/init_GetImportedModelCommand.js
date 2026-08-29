// var: init_GetImportedModelCommand
var init_GetImportedModelCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint51 = __toESM(require_dist_cjs65(), 1);
  GetImportedModelCommand = class GetImportedModelCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint51.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetImportedModel", {}).n("BedrockClient", "GetImportedModelCommand").sc(GetImportedModel$).build() {
  };
});
