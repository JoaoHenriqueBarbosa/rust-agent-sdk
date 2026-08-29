// var: init_AssumeRoleWithWebIdentityCommand
var init_AssumeRoleWithWebIdentityCommand = __esm(() => {
  init_dist_es41();
  init_EndpointParameters3();
  init_schemas_03();
  import_middleware_endpoint117 = __toESM(require_dist_cjs65(), 1);
  AssumeRoleWithWebIdentityCommand = class AssumeRoleWithWebIdentityCommand extends Command4.classBuilder().ep(commonParams3).m(function(Command5, cs, config6, o5) {
    return [import_middleware_endpoint117.getEndpointPlugin(config6, Command5.getEndpointParameterInstructions())];
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(AssumeRoleWithWebIdentity$).build() {
  };
});
