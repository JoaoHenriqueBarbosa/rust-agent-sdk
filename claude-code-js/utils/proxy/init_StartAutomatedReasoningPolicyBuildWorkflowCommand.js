// var: init_StartAutomatedReasoningPolicyBuildWorkflowCommand
var init_StartAutomatedReasoningPolicyBuildWorkflowCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint89 = __toESM(require_dist_cjs65(), 1);
  StartAutomatedReasoningPolicyBuildWorkflowCommand = class StartAutomatedReasoningPolicyBuildWorkflowCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint89.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "StartAutomatedReasoningPolicyBuildWorkflow", {}).n("BedrockClient", "StartAutomatedReasoningPolicyBuildWorkflowCommand").sc(StartAutomatedReasoningPolicyBuildWorkflow$).build() {
  };
});
