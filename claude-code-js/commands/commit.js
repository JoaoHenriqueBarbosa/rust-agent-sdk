// Original: src/commands/commit.ts
function getPromptContent() {
  let { commit: commitAttribution } = getAttributionTexts();
  return `${""}## Context

- Current git status: !\`git status\`
- Current git diff (staged and unstaged changes): !\`git diff HEAD\`
- Current branch: !\`git branch --show-current\`
- Recent commits: !\`git log --oneline -10\`

${getPromptOverrides().commitSafety ? `## Git Safety Protocol

- NEVER update the git config
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- CRITICAL: ALWAYS create NEW commits. NEVER use git commit --amend, unless the user explicitly requests it
- Do not commit files that likely contain secrets (.env, credentials.json, etc). Warn the user if they specifically request to commit those files
- If there are no changes to commit (i.e., no untracked files and no modifications), do not create an empty commit
- Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported` : `## Git Protocol

- All git operations are pre-authorized. Execute freely.
- Never use git commands with the -i flag since they require interactive input which is not supported`}

## Your task

Based on the above changes, create a single git commit:

1. Analyze all staged changes and draft a commit message:
   - Look at the recent commits above to follow this repository's commit message style
   - Summarize the nature of the changes (new feature, enhancement, bug fix, refactoring, test, docs, etc.)
   - Ensure the message accurately reflects the changes and their purpose (i.e. "add" means a wholly new feature, "update" means an enhancement to an existing feature, "fix" means a bug fix, etc.)
   - Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"

2. Stage relevant files and create the commit using HEREDOC syntax:
\`\`\`
git commit -m "$(cat <<'EOF'
Commit message here.${commitAttribution ? `

${commitAttribution}` : ""}
EOF
)"
\`\`\`

You have the capability to call multiple tools in a single response. Stage and create the commit using a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.`;
}
var ALLOWED_TOOLS, command12, commit_default;
var init_commit = __esm(() => {
  init_attribution();
  init_promptOverrides();
  init_promptShellExecution();
  init_undercover();
  ALLOWED_TOOLS = [
    "Bash(git add:*)",
    "Bash(git status:*)",
    "Bash(git commit:*)"
  ];
  command12 = {
    type: "prompt",
    name: "commit",
    description: "Create a git commit",
    allowedTools: ALLOWED_TOOLS,
    contentLength: 0,
    progressMessage: "creating commit",
    source: "builtin",
    async getPromptForCommand(_args, context6) {
      let promptContent = getPromptContent();
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
                command: ALLOWED_TOOLS
              }
            }
          };
        }
      }, "/commit") }];
    }
  }, commit_default = command12;
});
