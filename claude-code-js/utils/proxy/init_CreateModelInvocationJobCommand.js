// var: init_CreateModelInvocationJobCommand
var init_CreateModelInvocationJobCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint18 = __toESM(require_dist_cjs65(), 1);
  CreateModelInvocationJobCommand = class CreateModelInvocationJobCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint18.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateModelInvocationJob", {}).n("BedrockClient", "CreateModelInvocationJobCommand").sc(CreateModelInvocationJob$).build() {
  };
});
