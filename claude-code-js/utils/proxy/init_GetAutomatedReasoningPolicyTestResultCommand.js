// var: init_GetAutomatedReasoningPolicyTestResultCommand
var init_GetAutomatedReasoningPolicyTestResultCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint44 = __toESM(require_dist_cjs65(), 1);
  GetAutomatedReasoningPolicyTestResultCommand = class GetAutomatedReasoningPolicyTestResultCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint44.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetAutomatedReasoningPolicyTestResult", {}).n("BedrockClient", "GetAutomatedReasoningPolicyTestResultCommand").sc(GetAutomatedReasoningPolicyTestResult$).build() {
  };
});
