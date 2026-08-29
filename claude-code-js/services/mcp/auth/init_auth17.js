// var: init_auth17
var init_auth17 = __esm(() => {
  init_auth16();
  init_errors10();
  init_auth15();
  init_axios2();
  init_oauth();
  init_browser();
  init_envUtils();
  init_errors();
  init_log3();
  init_platform();
  init_secureStorage();
  init_macOsKeychainHelpers();
  init_slowOperations();
  init_oauthPort();
  init_utils7();
  init_xaa();
  init_xaaIdpLogin();
  import_xss2 = __toESM(require_lib8(), 1), SENSITIVE_OAUTH_PARAMS = [
    "state",
    "nonce",
    "code_challenge",
    "code_verifier",
    "code"
  ];
  NONSTANDARD_INVALID_GRANT_ALIASES = /* @__PURE__ */ new Set([
    "invalid_refresh_token",
    "expired_refresh_token",
    "token_expired"
  ]);
  AuthenticationCancelledError = class AuthenticationCancelledError extends Error {
    constructor() {
      super("Authentication was cancelled");
      this.name = "AuthenticationCancelledError";
    }
  };
});
