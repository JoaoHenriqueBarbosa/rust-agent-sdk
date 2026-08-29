// var: init_UpdateAutomatedReasoningPolicyCommand
var init_UpdateAutomatedReasoningPolicyCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint97 = __toESM(require_dist_cjs65(), 1);
  UpdateAutomatedReasoningPolicyCommand = class UpdateAutomatedReasoningPolicyCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint97.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "UpdateAutomatedReasoningPolicy", {}).n("BedrockClient", "UpdateAutomatedReasoningPolicyCommand").sc(UpdateAutomatedReasoningPolicy$).build() {
  };
});
