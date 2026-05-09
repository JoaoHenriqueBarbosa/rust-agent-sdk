// var: getNewSsoOidcToken
var getNewSsoOidcToken = async (ssoToken, ssoRegion, init = {}, callerClientConfig) => {
  let { CreateTokenCommand } = await Promise.resolve().then(() => __toESM(require_sso_oidc(), 1));
  return (await getSsoOidcClient(ssoRegion, init, callerClientConfig)).send(new CreateTokenCommand({
    clientId: ssoToken.clientId,
    clientSecret: ssoToken.clientSecret,
    refreshToken: ssoToken.refreshToken,
    grantType: "refresh_token"
  }));
};
