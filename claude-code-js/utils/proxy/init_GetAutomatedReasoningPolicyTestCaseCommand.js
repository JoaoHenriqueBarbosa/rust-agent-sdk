// var: init_GetAutomatedReasoningPolicyTestCaseCommand
var init_GetAutomatedReasoningPolicyTestCaseCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint43 = __toESM(require_dist_cjs65(), 1);
  GetAutomatedReasoningPolicyTestCaseCommand = class GetAutomatedReasoningPolicyTestCaseCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint43.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetAutomatedReasoningPolicyTestCase", {}).n("BedrockClient", "GetAutomatedReasoningPolicyTestCaseCommand").sc(GetAutomatedReasoningPolicyTestCase$).build() {
  };
});
