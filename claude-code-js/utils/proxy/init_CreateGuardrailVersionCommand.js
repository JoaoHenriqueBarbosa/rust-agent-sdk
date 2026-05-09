// var: init_CreateGuardrailVersionCommand
var init_CreateGuardrailVersionCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint12 = __toESM(require_dist_cjs65(), 1);
  CreateGuardrailVersionCommand = class CreateGuardrailVersionCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint12.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateGuardrailVersion", {}).n("BedrockClient", "CreateGuardrailVersionCommand").sc(CreateGuardrailVersion$).build() {
  };
});
