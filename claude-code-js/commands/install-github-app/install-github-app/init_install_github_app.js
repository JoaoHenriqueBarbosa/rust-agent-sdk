// var: init_install_github_app
var init_install_github_app = __esm(() => {
  init_execa();
  init_WorkflowMultiselectDialog();
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_auth14();
  init_browser();
  init_execFileNoThrow();
  init_git();
  init_ApiKeyStep();
  init_CheckExistingSecretStep();
  init_CheckGitHubStep();
  init_ChooseRepoStep();
  init_CreatingStep();
  init_ErrorStep();
  init_ExistingWorkflowStep();
  init_InstallAppStep();
  init_OAuthFlowStep();
  init_SuccessStep();
  init_setupGitHubActions();
  init_WarningsStep();
  import_react121 = __toESM(require_react_development(), 1), jsx_dev_runtime222 = __toESM(require_react_jsx_dev_runtime_development(), 1), INITIAL_STATE2 = {
    step: "check-gh",
    selectedRepoName: "",
    currentRepo: "",
    useCurrentRepo: !1,
    apiKeyOrOAuthToken: "",
    useExistingKey: !0,
    currentWorkflowInstallStep: 0,
    warnings: [],
    secretExists: !1,
    secretName: "ANTHROPIC_API_KEY",
    useExistingSecret: !0,
    workflowExists: !1,
    selectedWorkflows: ["claude", "claude-review"],
    selectedApiKeyOption: "new",
    authType: "api_key"
  };
});
