// Original: src/commands/install-slack-app/index.ts
var installSlackApp, install_slack_app_default;
var init_install_slack_app2 = __esm(() => {
  installSlackApp = {
    type: "local",
    name: "install-slack-app",
    description: "Install the Claude Slack app",
    availability: ["claude-ai"],
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => (init_install_slack_app(), exports_install_slack_app))
  }, install_slack_app_default = installSlackApp;
});
