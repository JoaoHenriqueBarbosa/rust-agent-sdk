// var: init_CancelAutomatedReasoningPolicyBuildWorkflowCommand
var init_CancelAutomatedReasoningPolicyBuildWorkflowCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint3 = __toESM(require_dist_cjs65(), 1);
  CancelAutomatedReasoningPolicyBuildWorkflowCommand = class CancelAutomatedReasoningPolicyBuildWorkflowCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint3.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CancelAutomatedReasoningPolicyBuildWorkflow", {}).n("BedrockClient", "CancelAutomatedReasoningPolicyBuildWorkflowCommand").sc(CancelAutomatedReasoningPolicyBuildWorkflow$).build() {
  };
});
