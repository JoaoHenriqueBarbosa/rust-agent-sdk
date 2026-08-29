// var: getSsoOidcClient
var getSsoOidcClient = async (ssoRegion, init = {}, callerClientConfig) => {
  let { SSOOIDCClient } = await Promise.resolve().then(() => __toESM(require_sso_oidc(), 1)), coalesce = (prop) => init.clientConfig?.[prop] ?? init.parentClientConfig?.[prop] ?? callerClientConfig?.[prop];
  return new SSOOIDCClient(Object.assign({}, init.clientConfig ?? {}, {
    region: ssoRegion ?? init.clientConfig?.region,
    logger: coalesce("logger"),
    userAgentAppId: coalesce("userAgentAppId")
  }));
};
