// Original: src/commands/remote-env/index.ts
var remote_env_default;
var init_remote_env2 = __esm(() => {
  init_policyLimits();
  init_auth14();
  remote_env_default = {
    type: "local-jsx",
    name: "remote-env",
    description: "Configure the default remote environment for teleport sessions",
    isEnabled: () => isClaudeAISubscriber() && isPolicyAllowed("allow_remote_sessions"),
    get isHidden() {
      return !isClaudeAISubscriber() || !isPolicyAllowed("allow_remote_sessions");
    },
    load: () => Promise.resolve().then(() => (init_remote_env(), exports_remote_env))
  };
});
