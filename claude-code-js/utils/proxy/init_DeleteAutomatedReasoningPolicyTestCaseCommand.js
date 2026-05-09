// var: init_DeleteAutomatedReasoningPolicyTestCaseCommand
var init_DeleteAutomatedReasoningPolicyTestCaseCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint23 = __toESM(require_dist_cjs65(), 1);
  DeleteAutomatedReasoningPolicyTestCaseCommand = class DeleteAutomatedReasoningPolicyTestCaseCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint23.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteAutomatedReasoningPolicyTestCase", {}).n("BedrockClient", "DeleteAutomatedReasoningPolicyTestCaseCommand").sc(DeleteAutomatedReasoningPolicyTestCase$).build() {
  };
});
