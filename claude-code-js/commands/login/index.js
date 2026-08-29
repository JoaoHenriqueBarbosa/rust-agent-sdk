// Original: src/commands/login/index.ts
var login_default = () => ({
  type: "local-jsx",
  name: "login",
  description: hasAnthropicApiKeyAuth() ? "Switch Anthropic accounts" : "Sign in with your Anthropic account",
  isEnabled: () => !isEnvTruthy(process.env.DISABLE_LOGIN_COMMAND),
  load: () => Promise.resolve().then(() => (init_login(), exports_login))
});
var init_login2 = __esm(() => {
  init_auth14();
  init_envUtils();
});
