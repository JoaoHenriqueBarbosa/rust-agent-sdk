// var: init_ApplyGuardrailCommand
var init_ApplyGuardrailCommand = __esm(() => {
  init_dist_es32();
  init_EndpointParameters2();
  init_schemas_02();
  import_middleware_endpoint104 = __toESM(require_dist_cjs65(), 1);
  ApplyGuardrailCommand = class ApplyGuardrailCommand extends Command3.classBuilder().ep(commonParams2).m(function(Command4, cs, config5, o4) {
    return [import_middleware_endpoint104.getEndpointPlugin(config5, Command4.getEndpointParameterInstructions())];
  }).s("AmazonBedrockFrontendService", "ApplyGuardrail", {}).n("BedrockRuntimeClient", "ApplyGuardrailCommand").sc(ApplyGuardrail$).build() {
  };
});
