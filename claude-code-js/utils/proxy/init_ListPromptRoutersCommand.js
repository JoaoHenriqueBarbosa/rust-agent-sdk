// var: init_ListPromptRoutersCommand
var init_ListPromptRoutersCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint81 = __toESM(require_dist_cjs65(), 1);
  ListPromptRoutersCommand = class ListPromptRoutersCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint81.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListPromptRouters", {}).n("BedrockClient", "ListPromptRoutersCommand").sc(ListPromptRouters$).build() {
  };
});
