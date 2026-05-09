// var: init_DeleteInferenceProfileCommand
var init_DeleteInferenceProfileCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint30 = __toESM(require_dist_cjs65(), 1);
  DeleteInferenceProfileCommand = class DeleteInferenceProfileCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint30.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteInferenceProfile", {}).n("BedrockClient", "DeleteInferenceProfileCommand").sc(DeleteInferenceProfile$).build() {
  };
});
