// var: init_CreateCustomModelCommand
var init_CreateCustomModelCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint7 = __toESM(require_dist_cjs65(), 1);
  CreateCustomModelCommand = class CreateCustomModelCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint7.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateCustomModel", {}).n("BedrockClient", "CreateCustomModelCommand").sc(CreateCustomModel$).build() {
  };
});
