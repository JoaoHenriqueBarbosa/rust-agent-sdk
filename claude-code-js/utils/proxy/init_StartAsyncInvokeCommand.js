// var: init_StartAsyncInvokeCommand
var init_StartAsyncInvokeCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint113 = __toESM(require_dist_cjs65(), 1);
  StartAsyncInvokeCommand = class StartAsyncInvokeCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint113.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "StartAsyncInvoke", {}).n("BedrockRuntimeClient", "StartAsyncInvokeCommand").sc(StartAsyncInvoke$).build() {
  };
});
