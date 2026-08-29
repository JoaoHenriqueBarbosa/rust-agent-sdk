// var: init_CreateAutomatedReasoningPolicyCommand
var init_CreateAutomatedReasoningPolicyCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint4 = __toESM(require_dist_cjs65(), 1);
  CreateAutomatedReasoningPolicyCommand = class CreateAutomatedReasoningPolicyCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint4.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateAutomatedReasoningPolicy", {}).n("BedrockClient", "CreateAutomatedReasoningPolicyCommand").sc(CreateAutomatedReasoningPolicy$).build() {
  };
});
