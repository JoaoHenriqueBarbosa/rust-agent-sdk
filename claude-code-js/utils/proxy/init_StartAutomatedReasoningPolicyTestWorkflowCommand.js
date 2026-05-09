// var: init_StartAutomatedReasoningPolicyTestWorkflowCommand
var init_StartAutomatedReasoningPolicyTestWorkflowCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint90 = __toESM(require_dist_cjs65(), 1);
  StartAutomatedReasoningPolicyTestWorkflowCommand = class StartAutomatedReasoningPolicyTestWorkflowCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint90.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "StartAutomatedReasoningPolicyTestWorkflow", {}).n("BedrockClient", "StartAutomatedReasoningPolicyTestWorkflowCommand").sc(StartAutomatedReasoningPolicyTestWorkflow$).build() {
  };
});
