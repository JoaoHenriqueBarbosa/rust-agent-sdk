// var: init_CountTokensCommand
var init_CountTokensCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint107 = __toESM(require_dist_cjs65(), 1);
  CountTokensCommand = class CountTokensCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint107.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "CountTokens", {}).n("BedrockRuntimeClient", "CountTokensCommand").sc(CountTokens$).build() {
  };
});
