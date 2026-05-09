// var: init_CreateGuardrailCommand
var init_CreateGuardrailCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint11 = __toESM(require_dist_cjs65(), 1);
  CreateGuardrailCommand = class CreateGuardrailCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint11.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateGuardrail", {}).n("BedrockClient", "CreateGuardrailCommand").sc(CreateGuardrail$).build() {
  };
});
