// Original: src/commands/install-github-app/index.ts
var installGitHubApp, install_github_app_default;
var init_install_github_app2 = __esm(() => {
  init_envUtils();
  installGitHubApp = {
    type: "local-jsx",
    name: "install-github-app",
    description: "Set up Claude GitHub Actions for a repository",
    availability: ["claude-ai", "console"],
    isEnabled: () => !isEnvTruthy(process.env.DISABLE_INSTALL_GITHUB_APP_COMMAND),
    load: () => Promise.resolve().then(() => (init_install_github_app(), exports_install_github_app))
  }, install_github_app_default = installGitHubApp;
});
