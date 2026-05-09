// var: init_ListAsyncInvokesCommand
var init_ListAsyncInvokesCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint112 = __toESM(require_dist_cjs65(), 1);
  ListAsyncInvokesCommand = class ListAsyncInvokesCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint112.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "ListAsyncInvokes", {}).n("BedrockRuntimeClient", "ListAsyncInvokesCommand").sc(ListAsyncInvokes$).build() {
  };
});
