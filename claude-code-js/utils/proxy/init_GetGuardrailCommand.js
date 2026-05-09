// var: init_GetGuardrailCommand
var init_GetGuardrailCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint50 = __toESM(require_dist_cjs65(), 1);
  GetGuardrailCommand = class GetGuardrailCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint50.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetGuardrail", {}).n("BedrockClient", "GetGuardrailCommand").sc(GetGuardrail$).build() {
  };
});
