// var: init_GetAutomatedReasoningPolicyNextScenarioCommand
var init_GetAutomatedReasoningPolicyNextScenarioCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint42 = __toESM(require_dist_cjs65(), 1);
  GetAutomatedReasoningPolicyNextScenarioCommand = class GetAutomatedReasoningPolicyNextScenarioCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint42.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetAutomatedReasoningPolicyNextScenario", {}).n("BedrockClient", "GetAutomatedReasoningPolicyNextScenarioCommand").sc(GetAutomatedReasoningPolicyNextScenario$).build() {
  };
});
