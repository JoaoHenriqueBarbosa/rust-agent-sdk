// var: init_CreateInferenceProfileCommand
var init_CreateInferenceProfileCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint13 = __toESM(require_dist_cjs65(), 1);
  CreateInferenceProfileCommand = class CreateInferenceProfileCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint13.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateInferenceProfile", {}).n("BedrockClient", "CreateInferenceProfileCommand").sc(CreateInferenceProfile$).build() {
  };
});
