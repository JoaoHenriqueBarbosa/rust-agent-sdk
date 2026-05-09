// var: init_ListImportedModelsCommand
var init_ListImportedModelsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint74 = __toESM(require_dist_cjs65(), 1);
  ListImportedModelsCommand = class ListImportedModelsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint74.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListImportedModels", {}).n("BedrockClient", "ListImportedModelsCommand").sc(ListImportedModels$).build() {
  };
});
