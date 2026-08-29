// var: init_ListInferenceProfilesCommand
var init_ListInferenceProfilesCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint75 = __toESM(require_dist_cjs65(), 1);
  ListInferenceProfilesCommand = class ListInferenceProfilesCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint75.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListInferenceProfiles", {}).n("BedrockClient", "ListInferenceProfilesCommand").sc(ListInferenceProfiles$).build() {
  };
});
