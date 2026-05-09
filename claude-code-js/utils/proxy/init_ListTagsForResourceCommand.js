// var: init_ListTagsForResourceCommand
var init_ListTagsForResourceCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint83 = __toESM(require_dist_cjs65(), 1);
  ListTagsForResourceCommand = class ListTagsForResourceCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint83.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListTagsForResource", {}).n("BedrockClient", "ListTagsForResourceCommand").sc(ListTagsForResource$).build() {
  };
});
