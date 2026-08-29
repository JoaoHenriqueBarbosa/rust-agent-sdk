// var: init_GetAutomatedReasoningPolicyBuildWorkflowCommand
var init_GetAutomatedReasoningPolicyBuildWorkflowCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint39 = __toESM(require_dist_cjs65(), 1);
  GetAutomatedReasoningPolicyBuildWorkflowCommand = class GetAutomatedReasoningPolicyBuildWorkflowCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint39.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetAutomatedReasoningPolicyBuildWorkflow", {}).n("BedrockClient", "GetAutomatedReasoningPolicyBuildWorkflowCommand").sc(GetAutomatedReasoningPolicyBuildWorkflow$).build() {
  };
});
