// var: init_GetAsyncInvokeCommand
var init_GetAsyncInvokeCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint108 = __toESM(require_dist_cjs65(), 1);
  GetAsyncInvokeCommand = class GetAsyncInvokeCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint108.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "GetAsyncInvoke", {}).n("BedrockRuntimeClient", "GetAsyncInvokeCommand").sc(GetAsyncInvoke$).build() {
  };
});
