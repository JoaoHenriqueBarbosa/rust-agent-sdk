// var: init_STS
var init_STS = __esm(() => {
  init_dist_es41();
  init_AssumeRoleCommand();
  init_AssumeRoleWithSAMLCommand();
  init_AssumeRoleWithWebIdentityCommand();
  init_AssumeRootCommand();
  init_DecodeAuthorizationMessageCommand();
  init_GetAccessKeyInfoCommand();
  init_GetCallerIdentityCommand();
  init_GetDelegatedAccessTokenCommand();
  init_GetFederationTokenCommand();
  init_GetSessionTokenCommand();
  init_GetWebIdentityTokenCommand();
  init_STSClient();
  commands5 = {
    AssumeRoleCommand,
    AssumeRoleWithSAMLCommand,
    AssumeRoleWithWebIdentityCommand,
    AssumeRootCommand,
    DecodeAuthorizationMessageCommand,
    GetAccessKeyInfoCommand,
    GetCallerIdentityCommand,
    GetDelegatedAccessTokenCommand,
    GetFederationTokenCommand,
    GetSessionTokenCommand,
    GetWebIdentityTokenCommand
  };
  STS = class STS extends STSClient {
  };
  createAggregatedClient4(commands5, STS);
});
