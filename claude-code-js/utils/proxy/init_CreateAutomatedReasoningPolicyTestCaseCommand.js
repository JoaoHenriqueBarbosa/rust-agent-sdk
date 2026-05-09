// var: init_CreateAutomatedReasoningPolicyTestCaseCommand
var init_CreateAutomatedReasoningPolicyTestCaseCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint5 = __toESM(require_dist_cjs65(), 1);
  CreateAutomatedReasoningPolicyTestCaseCommand = class CreateAutomatedReasoningPolicyTestCaseCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint5.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateAutomatedReasoningPolicyTestCase", {}).n("BedrockClient", "CreateAutomatedReasoningPolicyTestCaseCommand").sc(CreateAutomatedReasoningPolicyTestCase$).build() {
  };
});
