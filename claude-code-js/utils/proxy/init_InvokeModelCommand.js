// var: init_InvokeModelCommand
var init_InvokeModelCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint109 = __toESM(require_dist_cjs65(), 1);
  InvokeModelCommand = class InvokeModelCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint109.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "InvokeModel", {}).n("BedrockRuntimeClient", "InvokeModelCommand").sc(InvokeModel$).build() {
  };
});
