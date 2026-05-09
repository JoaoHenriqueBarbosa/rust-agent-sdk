// var: init_DeleteFoundationModelAgreementCommand
var init_DeleteFoundationModelAgreementCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint27 = __toESM(require_dist_cjs65(), 1);
  DeleteFoundationModelAgreementCommand = class DeleteFoundationModelAgreementCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint27.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteFoundationModelAgreement", {}).n("BedrockClient", "DeleteFoundationModelAgreementCommand").sc(DeleteFoundationModelAgreement$).build() {
  };
});
