// var: init_ListGuardrailsCommand
var init_ListGuardrailsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint73 = __toESM(require_dist_cjs65(), 1);
  ListGuardrailsCommand = class ListGuardrailsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint73.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListGuardrails", {}).n("BedrockClient", "ListGuardrailsCommand").sc(ListGuardrails$).build() {
  };
});
