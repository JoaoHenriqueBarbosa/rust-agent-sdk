// var: init_ListAutomatedReasoningPolicyTestResultsCommand
var init_ListAutomatedReasoningPolicyTestResultsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint66 = __toESM(require_dist_cjs65(), 1);
  ListAutomatedReasoningPolicyTestResultsCommand = class ListAutomatedReasoningPolicyTestResultsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint66.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListAutomatedReasoningPolicyTestResults", {}).n("BedrockClient", "ListAutomatedReasoningPolicyTestResultsCommand").sc(ListAutomatedReasoningPolicyTestResults$).build() {
  };
});
