// Original: src/commands/install-slack-app/install-slack-app.ts
var exports_install_slack_app = {};
__export(exports_install_slack_app, {
  call: () => call25
});
async function call25() {
  if (logEvent("tengu_install_slack_app_clicked", {}), saveGlobalConfig((current) => ({
    ...current,
    slackAppInstallCount: (current.slackAppInstallCount ?? 0) + 1
  })), await openBrowser(SLACK_APP_URL))
    return {
      type: "text",
      value: "Opening Slack app installation page in browser\u2026"
    };
  else
    return {
      type: "text",
      value: `Couldn't open browser. Visit: ${SLACK_APP_URL}`
    };
}
var SLACK_APP_URL = "https://slack.com/marketplace/A08SF47R6P4-claude";
var init_install_slack_app = __esm(() => {
  init_browser();
  init_config4();
});
