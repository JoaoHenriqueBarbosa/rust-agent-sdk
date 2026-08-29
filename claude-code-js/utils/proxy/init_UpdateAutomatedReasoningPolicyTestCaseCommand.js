// var: init_UpdateAutomatedReasoningPolicyTestCaseCommand
var init_UpdateAutomatedReasoningPolicyTestCaseCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint98 = __toESM(require_dist_cjs65(), 1);
  UpdateAutomatedReasoningPolicyTestCaseCommand = class UpdateAutomatedReasoningPolicyTestCaseCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint98.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "UpdateAutomatedReasoningPolicyTestCase", {}).n("BedrockClient", "UpdateAutomatedReasoningPolicyTestCaseCommand").sc(UpdateAutomatedReasoningPolicyTestCase$).build() {
  };
});
