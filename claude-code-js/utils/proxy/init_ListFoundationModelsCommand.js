// var: init_ListFoundationModelsCommand
var init_ListFoundationModelsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint72 = __toESM(require_dist_cjs65(), 1);
  ListFoundationModelsCommand = class ListFoundationModelsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint72.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListFoundationModels", {}).n("BedrockClient", "ListFoundationModelsCommand").sc(ListFoundationModels$).build() {
  };
});
