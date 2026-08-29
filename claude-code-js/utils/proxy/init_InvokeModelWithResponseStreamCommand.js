// var: init_InvokeModelWithResponseStreamCommand
var init_InvokeModelWithResponseStreamCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint111 = __toESM(require_dist_cjs65(), 1);
  InvokeModelWithResponseStreamCommand = class InvokeModelWithResponseStreamCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint111.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "InvokeModelWithResponseStream", {
    eventStream: {
      output: !0
    }
  }).n("BedrockRuntimeClient", "InvokeModelWithResponseStreamCommand").sc(InvokeModelWithResponseStream$).build() {
  };
});
