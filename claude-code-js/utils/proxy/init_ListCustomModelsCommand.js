// var: init_ListCustomModelsCommand
var init_ListCustomModelsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint68 = __toESM(require_dist_cjs65(), 1);
  ListCustomModelsCommand = class ListCustomModelsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint68.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListCustomModels", {}).n("BedrockClient", "ListCustomModelsCommand").sc(ListCustomModels$).build() {
  };
});
