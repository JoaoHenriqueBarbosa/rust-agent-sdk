// var: init_CreateFoundationModelAgreementCommand
var init_CreateFoundationModelAgreementCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint10 = __toESM(require_dist_cjs65(), 1);
  CreateFoundationModelAgreementCommand = class CreateFoundationModelAgreementCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint10.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateFoundationModelAgreement", {}).n("BedrockClient", "CreateFoundationModelAgreementCommand").sc(CreateFoundationModelAgreement$).build() {
  };
});
