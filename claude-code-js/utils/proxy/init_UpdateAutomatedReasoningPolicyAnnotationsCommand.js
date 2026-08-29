// var: init_UpdateAutomatedReasoningPolicyAnnotationsCommand
var init_UpdateAutomatedReasoningPolicyAnnotationsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint96 = __toESM(require_dist_cjs65(), 1);
  UpdateAutomatedReasoningPolicyAnnotationsCommand = class UpdateAutomatedReasoningPolicyAnnotationsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint96.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "UpdateAutomatedReasoningPolicyAnnotations", {}).n("BedrockClient", "UpdateAutomatedReasoningPolicyAnnotationsCommand").sc(UpdateAutomatedReasoningPolicyAnnotations$).build() {
  };
});
