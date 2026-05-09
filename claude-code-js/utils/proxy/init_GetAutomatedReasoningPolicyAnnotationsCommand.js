// var: init_GetAutomatedReasoningPolicyAnnotationsCommand
var init_GetAutomatedReasoningPolicyAnnotationsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint38 = __toESM(require_dist_cjs65(), 1);
  GetAutomatedReasoningPolicyAnnotationsCommand = class GetAutomatedReasoningPolicyAnnotationsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint38.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetAutomatedReasoningPolicyAnnotations", {}).n("BedrockClient", "GetAutomatedReasoningPolicyAnnotationsCommand").sc(GetAutomatedReasoningPolicyAnnotations$).build() {
  };
});
