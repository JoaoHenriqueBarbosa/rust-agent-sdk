// var: init_AssumeRoleWithSAMLCommand
var init_AssumeRoleWithSAMLCommand = __esm(() => {
  init_dist_es41();
  init_EndpointParameters3();
  init_schemas_03();
  import_middleware_endpoint116 = __toESM(require_dist_cjs65(), 1);
  AssumeRoleWithSAMLCommand = class AssumeRoleWithSAMLCommand extends Command4.classBuilder().ep(commonParams3).m(function(Command5, cs, config6, o5) {
    return [import_middleware_endpoint116.getEndpointPlugin(config6, Command5.getEndpointParameterInstructions())];
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithSAML", {}).n("STSClient", "AssumeRoleWithSAMLCommand").sc(AssumeRoleWithSAML$).build() {
  };
});
