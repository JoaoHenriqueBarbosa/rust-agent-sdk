// function: InstallGitHubApp
function InstallGitHubApp(props) {
  let [existingApiKey] = import_react121.useState(() => getAnthropicApiKey()), [state3, setState] = import_react121.useState({
    ...INITIAL_STATE2,
    useExistingKey: !!existingApiKey,
    selectedApiKeyOption: existingApiKey ? "existing" : isAnthropicAuthEnabled() ? "oauth" : "new"
  });
  useExitOnCtrlCDWithKeybindings(), import_react121.default.useEffect(() => {
    logEvent("tengu_install_github_app_started", {});
  }, []);
  let checkGitHubCLI = import_react121.useCallback(async () => {
    let warnings = [];
    if ((await execa("gh --version", {
      shell: !0,
      reject: !1
    })).exitCode !== 0)
      warnings.push({
        title: "GitHub CLI not found",
        message: "GitHub CLI (gh) does not appear to be installed or accessible.",
        instructions: ["Install GitHub CLI from https://cli.github.com/", "macOS: brew install gh", "Windows: winget install --id GitHub.cli", "Linux: See installation instructions at https://github.com/cli/cli#installation"]
      });
    let authResult = await execa("gh auth status -a", {
      shell: !0,
      reject: !1
    });
    if (authResult.exitCode !== 0)
      warnings.push({
        title: "GitHub CLI not authenticated",
        message: "GitHub CLI does not appear to be authenticated.",
        instructions: ["Run: gh auth login", "Follow the prompts to authenticate with GitHub", "Or set up authentication using environment variables or other methods"]
      });
    else {
      let tokenScopesMatch = authResult.stdout.match(/Token scopes:.*$/m);
      if (tokenScopesMatch) {
        let scopes = tokenScopesMatch[0], missingScopes = [];
        if (!scopes.includes("repo"))
          missingScopes.push("repo");
        if (!scopes.includes("workflow"))
          missingScopes.push("workflow");
        if (missingScopes.length > 0) {
          setState((prev) => ({
            ...prev,
            step: "error",
            error: `GitHub CLI is missing required permissions: ${missingScopes.join(", ")}.`,
            errorReason: "Missing required scopes",
            errorInstructions: [`Your GitHub CLI authentication is missing the "${missingScopes.join('" and "')}" ${plural(missingScopes.length, "scope")} needed to manage GitHub Actions and secrets.`, "", "To fix this, run:", "  gh auth refresh -h github.com -s repo,workflow", "", "This will add the necessary permissions to manage workflows and secrets."]
          }));
          return;
        }
      }
    }
    let currentRepo = await getGithubRepo() ?? "";
    logEvent("tengu_install_github_app_step_completed", {
      step: "check-gh"
    }), setState((prev_0) => ({
      ...prev_0,
      warnings,
      currentRepo,
      selectedRepoName: currentRepo,
      useCurrentRepo: !!currentRepo,
      step: warnings.length > 0 ? "warnings" : "choose-repo"
    }));
  }, []);
  import_react121.default.useEffect(() => {
    if (state3.step === "check-gh")
      checkGitHubCLI();
  }, [state3.step, checkGitHubCLI]);
  let runSetupGitHubActions = import_react121.useCallback(async (apiKeyOrOAuthToken, secretName) => {
    setState((prev_1) => ({
      ...prev_1,
      step: "creating",
      currentWorkflowInstallStep: 0
    }));
    try {
      await setupGitHubActions(state3.selectedRepoName, apiKeyOrOAuthToken, secretName, () => {
        setState((prev_4) => ({
          ...prev_4,
          currentWorkflowInstallStep: prev_4.currentWorkflowInstallStep + 1
        }));
      }, state3.workflowAction === "skip", state3.selectedWorkflows, state3.authType, {
        useCurrentRepo: state3.useCurrentRepo,
        workflowExists: state3.workflowExists,
        secretExists: state3.secretExists
      }), logEvent("tengu_install_github_app_step_completed", {
        step: "creating"
      }), setState((prev_5) => ({
        ...prev_5,
        step: "success"
      }));
    } catch (error44) {
      let errorMessage3 = error44 instanceof Error ? error44.message : "Failed to set up GitHub Actions";
      if (errorMessage3.includes("workflow file already exists"))
        logEvent("tengu_install_github_app_error", {
          reason: "workflow_file_exists"
        }), setState((prev_2) => ({
          ...prev_2,
          step: "error",
          error: "A Claude workflow file already exists in this repository.",
          errorReason: "Workflow file conflict",
          errorInstructions: ["The file .github/workflows/claude.yml already exists", "You can either:", "  1. Delete the existing file and run this command again", "  2. Update the existing file manually using the template from:", `     ${GITHUB_ACTION_SETUP_DOCS_URL}`]
        }));
      else
        logEvent("tengu_install_github_app_error", {
          reason: "setup_github_actions_failed"
        }), setState((prev_3) => ({
          ...prev_3,
          step: "error",
          error: errorMessage3,
          errorReason: "GitHub Actions setup failed",
          errorInstructions: []
        }));
    }
  }, [state3.selectedRepoName, state3.workflowAction, state3.selectedWorkflows, state3.useCurrentRepo, state3.workflowExists, state3.secretExists, state3.authType]);
  async function openGitHubAppInstallation() {
    await openBrowser("https://github.com/apps/claude");
  }
  async function checkRepositoryPermissions(repoName) {
    try {
      let result = await execFileNoThrow("gh", ["api", `repos/${repoName}`, "--jq", ".permissions.admin"]);
      if (result.code === 0)
        return {
          hasAccess: result.stdout.trim() === "true"
        };
      if (result.stderr.includes("404") || result.stderr.includes("Not Found"))
        return {
          hasAccess: !1,
          error: "repository_not_found"
        };
      return {
        hasAccess: !1
      };
    } catch {
      return {
        hasAccess: !1
      };
    }
  }
  async function checkExistingWorkflowFile(repoName_0) {
    return (await execFileNoThrow("gh", ["api", `repos/${repoName_0}/contents/.github/workflows/claude.yml`, "--jq", ".sha"])).code === 0;
  }
  async function checkExistingSecret() {
    let checkSecretsResult = await execFileNoThrow("gh", ["secret", "list", "--app", "actions", "--repo", state3.selectedRepoName]);
    if (checkSecretsResult.code === 0)
      if (checkSecretsResult.stdout.split(`
`).some((line) => {
        return /^ANTHROPIC_API_KEY\s+/.test(line);
      }))
        setState((prev_6) => ({
          ...prev_6,
          secretExists: !0,
          step: "check-existing-secret"
        }));
      else if (existingApiKey)
        setState((prev_7) => ({
          ...prev_7,
          apiKeyOrOAuthToken: existingApiKey,
          useExistingKey: !0
        })), await runSetupGitHubActions(existingApiKey, state3.secretName);
      else
        setState((prev_8) => ({
          ...prev_8,
          step: "api-key"
        }));
    else if (existingApiKey)
      setState((prev_9) => ({
        ...prev_9,
        apiKeyOrOAuthToken: existingApiKey,
        useExistingKey: !0
      })), await runSetupGitHubActions(existingApiKey, state3.secretName);
    else
      setState((prev_10) => ({
        ...prev_10,
        step: "api-key"
      }));
  }
  let handleSubmit = async () => {
    if (state3.step === "warnings")
      logEvent("tengu_install_github_app_step_completed", {
        step: "warnings"
      }), setState((prev_11) => ({
        ...prev_11,
        step: "install-app"
      })), setTimeout(openGitHubAppInstallation, 0);
    else if (state3.step === "choose-repo") {
      let repoName_1 = state3.useCurrentRepo ? state3.currentRepo : state3.selectedRepoName;
      if (!repoName_1.trim())
        return;
      let repoWarnings = [];
      if (repoName_1.includes("github.com")) {
        let match = repoName_1.match(/github\.com[:/]([^/]+\/[^/]+)(\.git)?$/);
        if (!match)
          repoWarnings.push({
            title: "Invalid GitHub URL format",
            message: "The repository URL format appears to be invalid.",
            instructions: ["Use format: owner/repo or https://github.com/owner/repo", "Example: anthropics/claude-cli"]
          });
        else
          repoName_1 = match[1]?.replace(/\.git$/, "") || "";
      }
      if (!repoName_1.includes("/"))
        repoWarnings.push({
          title: "Repository format warning",
          message: 'Repository should be in format "owner/repo"',
          instructions: ["Use format: owner/repo", "Example: anthropics/claude-cli"]
        });
      let permissionCheck = await checkRepositoryPermissions(repoName_1);
      if (permissionCheck.error === "repository_not_found")
        repoWarnings.push({
          title: "Repository not found",
          message: `Repository ${repoName_1} was not found or you don't have access.`,
          instructions: [`Check that the repository name is correct: ${repoName_1}`, "Ensure you have access to this repository", 'For private repositories, make sure your GitHub token has the "repo" scope', "You can add the repo scope with: gh auth refresh -h github.com -s repo,workflow"]
        });
      else if (!permissionCheck.hasAccess)
        repoWarnings.push({
          title: "Admin permissions required",
          message: `You might need admin permissions on ${repoName_1} to set up GitHub Actions.`,
          instructions: ["Repository admins can install GitHub Apps and set secrets", "Ask a repository admin to run this command if setup fails", "Alternatively, you can use the manual setup instructions"]
        });
      let workflowExists = await checkExistingWorkflowFile(repoName_1);
      if (repoWarnings.length > 0) {
        let allWarnings = [...state3.warnings, ...repoWarnings];
        setState((prev_12) => ({
          ...prev_12,
          selectedRepoName: repoName_1,
          workflowExists,
          warnings: allWarnings,
          step: "warnings"
        }));
      } else
        logEvent("tengu_install_github_app_step_completed", {
          step: "choose-repo"
        }), setState((prev_13) => ({
          ...prev_13,
          selectedRepoName: repoName_1,
          workflowExists,
          step: "install-app"
        })), setTimeout(openGitHubAppInstallation, 0);
    } else if (state3.step === "install-app")
      if (logEvent("tengu_install_github_app_step_completed", {
        step: "install-app"
      }), state3.workflowExists)
        setState((prev_14) => ({
          ...prev_14,
          step: "check-existing-workflow"
        }));
      else
        setState((prev_15) => ({
          ...prev_15,
          step: "select-workflows"
        }));
    else if (state3.step === "check-existing-workflow")
      return;
    else if (state3.step === "select-workflows")
      return;
    else if (state3.step === "check-existing-secret")
      if (logEvent("tengu_install_github_app_step_completed", {
        step: "check-existing-secret"
      }), state3.useExistingSecret)
        await runSetupGitHubActions(null, state3.secretName);
      else
        await runSetupGitHubActions(state3.apiKeyOrOAuthToken, state3.secretName);
    else if (state3.step === "api-key") {
      if (state3.selectedApiKeyOption === "oauth")
        return;
      let apiKeyToUse = state3.selectedApiKeyOption === "existing" ? existingApiKey : state3.apiKeyOrOAuthToken;
      if (!apiKeyToUse) {
        logEvent("tengu_install_github_app_error", {
          reason: "api_key_missing"
        }), setState((prev_16) => ({
          ...prev_16,
          step: "error",
          error: "API key is required"
        }));
        return;
      }
      setState((prev_17) => ({
        ...prev_17,
        apiKeyOrOAuthToken: apiKeyToUse,
        useExistingKey: state3.selectedApiKeyOption === "existing"
      }));
      let checkSecretsResult_0 = await execFileNoThrow("gh", ["secret", "list", "--app", "actions", "--repo", state3.selectedRepoName]);
      if (checkSecretsResult_0.code === 0)
        if (checkSecretsResult_0.stdout.split(`
`).some((line_0) => {
          return /^ANTHROPIC_API_KEY\s+/.test(line_0);
        }))
          logEvent("tengu_install_github_app_step_completed", {
            step: "api-key"
          }), setState((prev_18) => ({
            ...prev_18,
            secretExists: !0,
            step: "check-existing-secret"
          }));
        else
          logEvent("tengu_install_github_app_step_completed", {
            step: "api-key"
          }), await runSetupGitHubActions(apiKeyToUse, state3.secretName);
      else
        logEvent("tengu_install_github_app_step_completed", {
          step: "api-key"
        }), await runSetupGitHubActions(apiKeyToUse, state3.secretName);
    }
  }, handleRepoUrlChange = (value) => {
    setState((prev_19) => ({
      ...prev_19,
      selectedRepoName: value
    }));
  }, handleApiKeyChange = (value_0) => {
    setState((prev_20) => ({
      ...prev_20,
      apiKeyOrOAuthToken: value_0
    }));
  }, handleApiKeyOptionChange = (option) => {
    setState((prev_21) => ({
      ...prev_21,
      selectedApiKeyOption: option
    }));
  }, handleCreateOAuthToken = import_react121.useCallback(() => {
    logEvent("tengu_install_github_app_step_completed", {
      step: "api-key"
    }), setState((prev_22) => ({
      ...prev_22,
      step: "oauth-flow"
    }));
  }, []), handleOAuthSuccess = import_react121.useCallback((token) => {
    logEvent("tengu_install_github_app_step_completed", {
      step: "oauth-flow"
    }), setState((prev_23) => ({
      ...prev_23,
      apiKeyOrOAuthToken: token,
      useExistingKey: !1,
      secretName: "CLAUDE_CODE_OAUTH_TOKEN",
      authType: "oauth_token"
    })), runSetupGitHubActions(token, "CLAUDE_CODE_OAUTH_TOKEN");
  }, [runSetupGitHubActions]), handleOAuthCancel = import_react121.useCallback(() => {
    setState((prev_24) => ({
      ...prev_24,
      step: "api-key"
    }));
  }, []), handleSecretNameChange = (value_1) => {
    if (value_1 && !/^[a-zA-Z0-9_]+$/.test(value_1))
      return;
    setState((prev_25) => ({
      ...prev_25,
      secretName: value_1
    }));
  }, handleToggleUseCurrentRepo = (useCurrentRepo) => {
    setState((prev_26) => ({
      ...prev_26,
      useCurrentRepo,
      selectedRepoName: useCurrentRepo ? prev_26.currentRepo : ""
    }));
  }, handleToggleUseExistingKey = (useExistingKey) => {
    setState((prev_27) => ({
      ...prev_27,
      useExistingKey
    }));
  }, handleToggleUseExistingSecret = (useExistingSecret) => {
    setState((prev_28) => ({
      ...prev_28,
      useExistingSecret,
      secretName: useExistingSecret ? "ANTHROPIC_API_KEY" : ""
    }));
  }, handleWorkflowAction = async (action2) => {
    if (action2 === "exit") {
      props.onDone("Installation cancelled by user");
      return;
    }
    if (logEvent("tengu_install_github_app_step_completed", {
      step: "check-existing-workflow"
    }), setState((prev_29) => ({
      ...prev_29,
      workflowAction: action2
    })), action2 === "skip" || action2 === "update")
      if (existingApiKey)
        await checkExistingSecret();
      else
        setState((prev_30) => ({
          ...prev_30,
          step: "api-key"
        }));
  };
  function handleDismissKeyDown(e) {
    if (e.preventDefault(), state3.step === "success")
      logEvent("tengu_install_github_app_completed", {});
    props.onDone(state3.step === "success" ? "GitHub Actions setup complete!" : state3.error ? `Couldn't install GitHub App: ${state3.error}
For manual setup instructions, see: ${GITHUB_ACTION_SETUP_DOCS_URL}` : `GitHub App installation failed
For manual setup instructions, see: ${GITHUB_ACTION_SETUP_DOCS_URL}`);
  }
  switch (state3.step) {
    case "check-gh":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(CheckGitHubStep, {}, void 0, !1, void 0, this);
    case "warnings":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(WarningsStep, {
        warnings: state3.warnings,
        onContinue: handleSubmit
      }, void 0, !1, void 0, this);
    case "choose-repo":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(ChooseRepoStep, {
        currentRepo: state3.currentRepo,
        useCurrentRepo: state3.useCurrentRepo,
        repoUrl: state3.selectedRepoName,
        onRepoUrlChange: handleRepoUrlChange,
        onToggleUseCurrentRepo: handleToggleUseCurrentRepo,
        onSubmit: handleSubmit
      }, void 0, !1, void 0, this);
    case "install-app":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(InstallAppStep, {
        repoUrl: state3.selectedRepoName,
        onSubmit: handleSubmit
      }, void 0, !1, void 0, this);
    case "check-existing-workflow":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(ExistingWorkflowStep, {
        repoName: state3.selectedRepoName,
        onSelectAction: handleWorkflowAction
      }, void 0, !1, void 0, this);
    case "check-existing-secret":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(CheckExistingSecretStep, {
        useExistingSecret: state3.useExistingSecret,
        secretName: state3.secretName,
        onToggleUseExistingSecret: handleToggleUseExistingSecret,
        onSecretNameChange: handleSecretNameChange,
        onSubmit: handleSubmit
      }, void 0, !1, void 0, this);
    case "api-key":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(ApiKeyStep, {
        existingApiKey,
        useExistingKey: state3.useExistingKey,
        apiKeyOrOAuthToken: state3.apiKeyOrOAuthToken,
        onApiKeyChange: handleApiKeyChange,
        onToggleUseExistingKey: handleToggleUseExistingKey,
        onSubmit: handleSubmit,
        onCreateOAuthToken: isAnthropicAuthEnabled() ? handleCreateOAuthToken : void 0,
        selectedOption: state3.selectedApiKeyOption,
        onSelectOption: handleApiKeyOptionChange
      }, void 0, !1, void 0, this);
    case "creating":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(CreatingStep, {
        currentWorkflowInstallStep: state3.currentWorkflowInstallStep,
        secretExists: state3.secretExists,
        useExistingSecret: state3.useExistingSecret,
        secretName: state3.secretName,
        skipWorkflow: state3.workflowAction === "skip",
        selectedWorkflows: state3.selectedWorkflows
      }, void 0, !1, void 0, this);
    case "success":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(ThemedBox_default, {
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: handleDismissKeyDown,
        children: /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(SuccessStep, {
          secretExists: state3.secretExists,
          useExistingSecret: state3.useExistingSecret,
          secretName: state3.secretName,
          skipWorkflow: state3.workflowAction === "skip"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    case "error":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(ThemedBox_default, {
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: handleDismissKeyDown,
        children: /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(ErrorStep, {
          error: state3.error,
          errorReason: state3.errorReason,
          errorInstructions: state3.errorInstructions
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    case "select-workflows":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(WorkflowMultiselectDialog, {
        defaultSelections: state3.selectedWorkflows,
        onSubmit: (selectedWorkflows) => {
          if (logEvent("tengu_install_github_app_step_completed", {
            step: "select-workflows"
          }), setState((prev_31) => ({
            ...prev_31,
            selectedWorkflows
          })), existingApiKey)
            checkExistingSecret();
          else
            setState((prev_32) => ({
              ...prev_32,
              step: "api-key"
            }));
        }
      }, void 0, !1, void 0, this);
    case "oauth-flow":
      return /* @__PURE__ */ jsx_dev_runtime222.jsxDEV(OAuthFlowStep, {
        onSuccess: handleOAuthSuccess,
        onCancel: handleOAuthCancel
      }, void 0, !1, void 0, this);
  }
}
