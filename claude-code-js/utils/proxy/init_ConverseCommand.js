// var: init_ConverseCommand
var init_ConverseCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint105 = __toESM(require_dist_cjs65(), 1);
  ConverseCommand = class ConverseCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint105.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "Converse", {}).n("BedrockRuntimeClient", "ConverseCommand").sc(Converse$).build() {
  };
});
