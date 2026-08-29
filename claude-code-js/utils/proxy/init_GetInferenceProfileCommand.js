// var: init_GetInferenceProfileCommand
var init_GetInferenceProfileCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint52 = __toESM(require_dist_cjs65(), 1);
  GetInferenceProfileCommand = class GetInferenceProfileCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint52.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetInferenceProfile", {}).n("BedrockClient", "GetInferenceProfileCommand").sc(GetInferenceProfile$).build() {
  };
});
