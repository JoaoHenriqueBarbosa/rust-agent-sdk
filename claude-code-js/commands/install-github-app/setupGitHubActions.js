// Original: src/commands/install-github-app/setupGitHubActions.ts
async function createWorkflowFile(repoName, branchName, workflowPath, workflowContent, secretName, message, context7) {
  let checkFileResult = await execFileNoThrow("gh", [
    "api",
    `repos/${repoName}/contents/${workflowPath}`,
    "--jq",
    ".sha"
  ]), fileSha = null;
  if (checkFileResult.code === 0)
    fileSha = checkFileResult.stdout.trim();
  let content = workflowContent;
  if (secretName === "CLAUDE_CODE_OAUTH_TOKEN")
    content = workflowContent.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, "claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}");
  else if (secretName !== "ANTHROPIC_API_KEY")
    content = workflowContent.replace(/anthropic_api_key: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/g, `anthropic_api_key: \${{ secrets.${secretName} }}`);
  let base64Content = Buffer.from(content).toString("base64"), apiParams = [
    "api",
    "--method",
    "PUT",
    `repos/${repoName}/contents/${workflowPath}`,
    "-f",
    `message=${fileSha ? `"Update ${message}"` : `"${message}"`}`,
    "-f",
    `content=${base64Content}`,
    "-f",
    `branch=${branchName}`
  ];
  if (fileSha)
    apiParams.push("-f", `sha=${fileSha}`);
  let createFileResult = await execFileNoThrow("gh", apiParams);
  if (createFileResult.code !== 0) {
    if (createFileResult.stderr.includes("422") && createFileResult.stderr.includes("sha"))
      throw logEvent("tengu_setup_github_actions_failed", {
        reason: "failed_to_create_workflow_file",
        exit_code: createFileResult.code,
        ...context7
      }), Error(`Failed to create workflow file ${workflowPath}: A Claude workflow file already exists in this repository. Please remove it first or update it manually.`);
    logEvent("tengu_setup_github_actions_failed", {
      reason: "failed_to_create_workflow_file",
      exit_code: createFileResult.code,
      ...context7
    });
    let helpText = `

Need help? Common issues:
` + `\xB7 Permission denied \u2192 Run: gh auth refresh -h github.com -s repo,workflow
` + `\xB7 Not authorized \u2192 Ensure you have admin access to the repository
` + "\xB7 For manual setup \u2192 Visit: https://github.com/anthropics/claude-code-action";
    throw Error(`Failed to create workflow file ${workflowPath}: ${createFileResult.stderr}${helpText}`);
  }
}
async function setupGitHubActions(repoName, apiKeyOrOAuthToken, secretName, updateProgress, skipWorkflow = !1, selectedWorkflows, authType, context7) {
  try {
    logEvent("tengu_setup_github_actions_started", {
      skip_workflow: skipWorkflow,
      has_api_key: !!apiKeyOrOAuthToken,
      using_default_secret_name: secretName === "ANTHROPIC_API_KEY",
      selected_claude_workflow: selectedWorkflows.includes("claude"),
      selected_claude_review_workflow: selectedWorkflows.includes("claude-review"),
      ...context7
    });
    let repoCheckResult = await execFileNoThrow("gh", [
      "api",
      `repos/${repoName}`,
      "--jq",
      ".id"
    ]);
    if (repoCheckResult.code !== 0)
      throw logEvent("tengu_setup_github_actions_failed", {
        reason: "repo_not_found",
        exit_code: repoCheckResult.code,
        ...context7
      }), Error(`Failed to access repository ${repoName}: ${repoCheckResult.stderr}`);
    let defaultBranchResult = await execFileNoThrow("gh", [
      "api",
      `repos/${repoName}`,
      "--jq",
      ".default_branch"
    ]);
    if (defaultBranchResult.code !== 0)
      throw logEvent("tengu_setup_github_actions_failed", {
        reason: "failed_to_get_default_branch",
        exit_code: defaultBranchResult.code,
        ...context7
      }), Error(`Failed to get default branch: ${defaultBranchResult.stderr}`);
    let defaultBranch = defaultBranchResult.stdout.trim(), shaResult = await execFileNoThrow("gh", [
      "api",
      `repos/${repoName}/git/ref/heads/${defaultBranch}`,
      "--jq",
      ".object.sha"
    ]);
    if (shaResult.code !== 0)
      throw logEvent("tengu_setup_github_actions_failed", {
        reason: "failed_to_get_branch_sha",
        exit_code: shaResult.code,
        ...context7
      }), Error(`Failed to get branch SHA: ${shaResult.stderr}`);
    let sha = shaResult.stdout.trim(), branchName = null;
    if (!skipWorkflow) {
      updateProgress(), branchName = `add-claude-github-actions-${Date.now()}`;
      let createBranchResult = await execFileNoThrow("gh", [
        "api",
        "--method",
        "POST",
        `repos/${repoName}/git/refs`,
        "-f",
        `ref=refs/heads/${branchName}`,
        "-f",
        `sha=${sha}`
      ]);
      if (createBranchResult.code !== 0)
        throw logEvent("tengu_setup_github_actions_failed", {
          reason: "failed_to_create_branch",
          exit_code: createBranchResult.code,
          ...context7
        }), Error(`Failed to create branch: ${createBranchResult.stderr}`);
      updateProgress();
      let workflows = [];
      if (selectedWorkflows.includes("claude"))
        workflows.push({
          path: ".github/workflows/claude.yml",
          content: WORKFLOW_CONTENT,
          message: "Claude PR Assistant workflow"
        });
      if (selectedWorkflows.includes("claude-review"))
        workflows.push({
          path: ".github/workflows/claude-code-review.yml",
          content: CODE_REVIEW_PLUGIN_WORKFLOW_CONTENT,
          message: "Claude Code Review workflow"
        });
      for (let workflow of workflows)
        await createWorkflowFile(repoName, branchName, workflow.path, workflow.content, secretName, workflow.message, context7);
    }
    if (updateProgress(), apiKeyOrOAuthToken) {
      let setSecretResult = await execFileNoThrow("gh", [
        "secret",
        "set",
        secretName,
        "--body",
        apiKeyOrOAuthToken,
        "--repo",
        repoName
      ]);
      if (setSecretResult.code !== 0) {
        logEvent("tengu_setup_github_actions_failed", {
          reason: "failed_to_set_api_key_secret",
          exit_code: setSecretResult.code,
          ...context7
        });
        let helpText = `

Need help? Common issues:
` + `\xB7 Permission denied \u2192 Run: gh auth refresh -h github.com -s repo
` + `\xB7 Not authorized \u2192 Ensure you have admin access to the repository
` + "\xB7 For manual setup \u2192 Visit: https://github.com/anthropics/claude-code-action";
        throw Error(`Failed to set API key secret: ${setSecretResult.stderr || "Unknown error"}${helpText}`);
      }
    }
    if (!skipWorkflow && branchName) {
      updateProgress();
      let compareUrl = `https://github.com/${repoName}/compare/${defaultBranch}...${branchName}?quick_pull=1&title=${encodeURIComponent(PR_TITLE)}&body=${encodeURIComponent(PR_BODY)}`;
      await openBrowser(compareUrl);
    }
    logEvent("tengu_setup_github_actions_completed", {
      skip_workflow: skipWorkflow,
      has_api_key: !!apiKeyOrOAuthToken,
      auth_type: authType,
      using_default_secret_name: secretName === "ANTHROPIC_API_KEY",
      selected_claude_workflow: selectedWorkflows.includes("claude"),
      selected_claude_review_workflow: selectedWorkflows.includes("claude-review"),
      ...context7
    }), saveGlobalConfig((current) => ({
      ...current,
      githubActionSetupCount: (current.githubActionSetupCount ?? 0) + 1
    }));
  } catch (error44) {
    if (!error44 || !(error44 instanceof Error) || !error44.message.includes("Failed to"))
      logEvent("tengu_setup_github_actions_failed", {
        reason: "unexpected_error",
        ...context7
      });
    if (error44 instanceof Error)
      logError2(error44);
    throw error44;
  }
}
var init_setupGitHubActions = __esm(() => {
  init_config4();
  init_browser();
  init_execFileNoThrow();
  init_log3();
});
