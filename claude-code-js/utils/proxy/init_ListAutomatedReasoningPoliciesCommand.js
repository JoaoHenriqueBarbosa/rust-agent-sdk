// var: init_ListAutomatedReasoningPoliciesCommand
var init_ListAutomatedReasoningPoliciesCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint63 = __toESM(require_dist_cjs65(), 1);
  ListAutomatedReasoningPoliciesCommand = class ListAutomatedReasoningPoliciesCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint63.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListAutomatedReasoningPolicies", {}).n("BedrockClient", "ListAutomatedReasoningPoliciesCommand").sc(ListAutomatedReasoningPolicies$).build() {
  };
});
