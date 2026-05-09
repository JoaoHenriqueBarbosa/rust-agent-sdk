// var: init_DeletePromptRouterCommand
var init_DeletePromptRouterCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint33 = __toESM(require_dist_cjs65(), 1);
  DeletePromptRouterCommand = class DeletePromptRouterCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint33.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeletePromptRouter", {}).n("BedrockClient", "DeletePromptRouterCommand").sc(DeletePromptRouter$).build() {
  };
});
