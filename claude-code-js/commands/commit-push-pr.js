// Original: src/commands/commit-push-pr.ts
function getPromptContent2(defaultBranch, prAttribution) {
  let { commit: commitAttribution, pr: defaultPrAttribution } = getAttributionTexts(), effectivePrAttribution = prAttribution ?? defaultPrAttribution, safeUser = process.env.SAFEUSER || "", username = process.env.USER || "", prefix = "", reviewerArg = " and `--reviewer anthropics/claude-code`", addReviewerArg = " (and add `--add-reviewer anthropics/claude-code`)", changelogSection = `

## Changelog
<!-- CHANGELOG:START -->
[If this PR contains user-facing changes, add a changelog entry here. Otherwise, remove this section.]
<!-- CHANGELOG:END -->`, slackStep = `

5. After creating/updating the PR, check if the user's CLAUDE.md mentions posting to Slack channels. If it does, use ToolSearch to search for "slack send message" tools. If ToolSearch finds a Slack tool, ask the user if they'd like you to post the PR URL to the relevant Slack channel. Only post if the user confirms. If ToolSearch returns no results or errors, skip this step silently\u2014do not mention the failure, do not attempt workarounds, and do not try alternative approaches.`;
  return `${prefix}## Context

- \`SAFEUSER\`: ${safeUser}
- \`whoami\`: ${username}
- \`git status\`: !\`git status\`
- \`git diff HEAD\`: !\`git diff HEAD\`
- \`git branch --show-current\`: !\`git branch --show-current\`
- \`git diff ${defaultBranch}...HEAD\`: !\`git diff ${defaultBranch}...HEAD\`
- \`gh pr view --json number 2>/dev/null || true\`: !\`gh pr view --json number 2>/dev/null || true\`

${getPromptOverrides().commitPushPrSafety ? `## Git Safety Protocol

- NEVER update the git config
- NEVER run destructive/irreversible git commands (like push --force, hard reset, etc) unless the user explicitly requests them
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- NEVER run force push to main/master, warn the user if they request it
- Do not commit files that likely contain secrets (.env, credentials.json, etc)
- Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported` : `## Git Protocol

- All git operations are pre-authorized. Execute freely.
- Never use git commands with the -i flag since they require interactive input which is not supported`}

## Your task

Analyze all changes that will be included in the pull request, making sure to look at all relevant commits (NOT just the latest commit, but ALL commits that will be included in the pull request from the git diff ${defaultBranch}...HEAD output above).

Based on the above changes:
1. Create a new branch if on ${defaultBranch} (use SAFEUSER from context above for the branch name prefix, falling back to whoami if SAFEUSER is empty, e.g., \`username/feature-name\`)
2. Create a single commit with an appropriate message using heredoc syntax${commitAttribution ? ", ending with the attribution text shown in the example below" : ""}:
\`\`\`
git commit -m "$(cat <<'EOF'
Commit message here.${commitAttribution ? `

${commitAttribution}` : ""}
EOF
)"
\`\`\`
3. Push the branch to origin
4. If a PR already exists for this branch (check the gh pr view output above), update the PR title and body using \`gh pr edit\` to reflect the current diff${addReviewerArg}. Otherwise, create a pull request using \`gh pr create\` with heredoc syntax for the body${reviewerArg}.
   - IMPORTANT: Keep PR titles short (under 70 characters). Use the body for details.
\`\`\`
gh pr create --title "Short, descriptive title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
[Bulleted markdown checklist of TODOs for testing the pull request...]${changelogSection}${effectivePrAttribution ? `

${effectivePrAttribution}` : ""}
EOF
)"
\`\`\`

You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message.${slackStep}

Return the PR URL when you're done, so the user can see it.`;
}
var ALLOWED_TOOLS2, command13, commit_push_pr_default;
var init_commit_push_pr = __esm(() => {
  init_attribution();
  init_promptOverrides();
  init_git();
  init_promptShellExecution();
  init_undercover();
  ALLOWED_TOOLS2 = [
    "Bash(git checkout --branch:*)",
    "Bash(git checkout -b:*)",
    "Bash(git add:*)",
    "Bash(git status:*)",
    "Bash(git push:*)",
    "Bash(git commit:*)",
    "Bash(gh pr create:*)",
    "Bash(gh pr edit:*)",
    "Bash(gh pr view:*)",
    "Bash(gh pr merge:*)",
    "ToolSearch",
    "mcp__slack__send_message",
    "mcp__claude_ai_Slack__slack_send_message"
  ];
  command13 = {
    type: "prompt",
    name: "commit-push-pr",
    description: "Commit, push, and open a PR",
    allowedTools: ALLOWED_TOOLS2,
    get contentLength() {
      return getPromptContent2("main").length;
    },
    progressMessage: "creating commit and PR",
    source: "builtin",
    async getPromptForCommand(args, context6) {
      let [defaultBranch, prAttribution] = await Promise.all([
        getDefaultBranch(),
        getEnhancedPRAttribution(context6.getAppState)
      ]), promptContent = getPromptContent2(defaultBranch, prAttribution), trimmedArgs = args?.trim();
      if (trimmedArgs)
        promptContent += `

## Additional instructions from user

${trimmedArgs}`;
      return [{ type: "text", text: await executeShellCommandsInPrompt(promptContent, {
        ...context6,
        getAppState() {
          let appState = context6.getAppState();
          return {
            ...appState,
            toolPermissionContext: {
              ...appState.toolPermissionContext,
              alwaysAllowRules: {
                ...appState.toolPermissionContext.alwaysAllowRules,
                command: ALLOWED_TOOLS2
              }
            }
          };
        }
      }, "/commit-push-pr") }];
    }
  }, commit_push_pr_default = command13;
});
