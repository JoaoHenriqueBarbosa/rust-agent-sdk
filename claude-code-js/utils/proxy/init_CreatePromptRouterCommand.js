// var: init_CreatePromptRouterCommand
var init_CreatePromptRouterCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint19 = __toESM(require_dist_cjs65(), 1);
  CreatePromptRouterCommand = class CreatePromptRouterCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint19.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreatePromptRouter", {}).n("BedrockClient", "CreatePromptRouterCommand").sc(CreatePromptRouter$).build() {
  };
});
