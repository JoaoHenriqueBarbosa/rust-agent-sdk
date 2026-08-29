// var: EXPIRE_WINDOW_MS2
var EXPIRE_WINDOW_MS2 = 300000, REFRESH_MESSAGE2 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.";

// node_modules/@aws-sdk/token-providers/dist-es/getSsoOidcClient.js
var getSsoOidcClient2 = async (ssoRegion, init = {}, callerClientConfig) => {
  let { SSOOIDCClient } = await Promise.resolve().then(() => __toESM(require_sso_oidc(), 1)), coalesce = (prop) => init.clientConfig?.[prop] ?? init.parentClientConfig?.[prop] ?? callerClientConfig?.[prop];
  return new SSOOIDCClient(Object.assign({}, init.clientConfig ?? {}, {
    region: ssoRegion ?? init.clientConfig?.region,
    logger: coalesce("logger"),
    userAgentAppId: coalesce("userAgentAppId")
  }));
};
