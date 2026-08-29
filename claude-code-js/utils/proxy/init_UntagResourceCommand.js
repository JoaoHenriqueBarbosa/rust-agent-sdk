// var: init_UntagResourceCommand
var init_UntagResourceCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint95 = __toESM(require_dist_cjs65(), 1);
  UntagResourceCommand = class UntagResourceCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint95.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "UntagResource", {}).n("BedrockClient", "UntagResourceCommand").sc(UntagResource$).build() {
  };
});
