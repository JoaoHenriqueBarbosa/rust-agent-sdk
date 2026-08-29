// var: init_ConverseStreamCommand
var init_ConverseStreamCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint106 = __toESM(require_dist_cjs65(), 1);
  ConverseStreamCommand = class ConverseStreamCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint106.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "ConverseStream", {
    eventStream: {
      output: !0
    }
  }).n("BedrockRuntimeClient", "ConverseStreamCommand").sc(ConverseStream$).build() {
  };
});
