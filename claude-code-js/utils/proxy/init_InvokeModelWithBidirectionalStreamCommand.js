// var: init_InvokeModelWithBidirectionalStreamCommand
var init_InvokeModelWithBidirectionalStreamCommand = __esm(() => {
  init_dist_es23();
  init_dist_es29();
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint110 = __toESM(require_dist_cjs65(), 1);
  InvokeModelWithBidirectionalStreamCommand = class InvokeModelWithBidirectionalStreamCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [
      import_middleware_endpoint110.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions()),
      getEventStreamPlugin(config5),
      getWebSocketPlugin(config5, {
        headerPrefix: "x-amz-bedrock-"
      })
    ];
  }).s("AmazonBedrockFrontendService", "InvokeModelWithBidirectionalStream", {
    eventStream: {
      input: !0,
      output: !0
    }
  }).n("BedrockRuntimeClient", "InvokeModelWithBidirectionalStreamCommand").sc(InvokeModelWithBidirectionalStream$).build() {
  };
});
