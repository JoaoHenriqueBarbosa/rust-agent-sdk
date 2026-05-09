// var: init_ListAutomatedReasoningPolicyTestCasesCommand
var init_ListAutomatedReasoningPolicyTestCasesCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint65 = __toESM(require_dist_cjs65(), 1);
  ListAutomatedReasoningPolicyTestCasesCommand = class ListAutomatedReasoningPolicyTestCasesCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint65.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListAutomatedReasoningPolicyTestCases", {}).n("BedrockClient", "ListAutomatedReasoningPolicyTestCasesCommand").sc(ListAutomatedReasoningPolicyTestCases$).build() {
  };
});
