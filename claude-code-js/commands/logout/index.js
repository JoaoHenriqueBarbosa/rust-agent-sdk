// Original: src/commands/logout/index.ts
var logout_default;
var init_logout2 = __esm(() => {
  init_envUtils();
  logout_default = {
    type: "local-jsx",
    name: "logout",
    description: "Sign out from your Anthropic account",
    isEnabled: () => !isEnvTruthy(process.env.DISABLE_LOGOUT_COMMAND),
    load: () => Promise.resolve().then(() => (init_logout(), exports_logout))
  };
});
