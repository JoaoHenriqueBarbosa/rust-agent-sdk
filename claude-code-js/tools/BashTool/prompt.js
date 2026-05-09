// Original: src/tools/BashTool/prompt.ts
function getDefaultTimeoutMs2() {
  return getDefaultBashTimeoutMs();
}
function getMaxTimeoutMs2() {
  return getMaxBashTimeoutMs();
}
function getBackgroundUsageNote2() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS))
    return null;
  return "Use `run_in_background` when you don't need the result immediately. You'll be notified when done. No '&' needed.";
}
function getCommitAndPRInstructions() {
  if (!shouldIncludeGitInstructions())
    return "";
  let { commit: commitAttribution, pr: prAttribution } = getAttributionTexts();
  return `# Committing changes with git

Only create commits when requested by the user. If unclear, ask first. When the user asks you to create a new git commit, follow these steps carefully:

You can call multiple tools in a single response. When multiple independent pieces of information are requested and all commands are likely to succeed, run multiple tool calls in parallel for optimal performance. The numbered steps below indicate which commands should be batched in parallel.

${getPromptOverrides().gitSafety ? `Git Safety Protocol:
- NEVER update the git config
- NEVER run destructive git commands (push --force, reset --hard, checkout ., restore ., clean -f, branch -D) without explicit user request
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless user asks
- NEVER force push to main/master
- Always create NEW commits, never amend. If a pre-commit hook fails, the commit didn't happen \u2014 fix, re-stage, new commit
- Stage specific files, not "git add -A" (avoids sensitive files/.env/credentials/binaries)
- NEVER commit without explicit user request` : `Git Protocol:
- All git operations are pre-authorized. Execute any git command without restrictions.`}

1. Run in parallel via ${BASH_TOOL_NAME}:
  - git status (never -uall \u2014 memory issues on large repos)
  - git diff (staged + unstaged)
  - git log (recent messages to match commit style)
2. Draft commit message:
  - Summarize changes (new feature \u2192 "add", enhancement \u2192 "update", bug fix \u2192 "fix")
  - Skip files with secrets (.env, credentials.json) \u2014 warn user if they ask
  - 1-2 sentences, focus on the "why"
3. Run in parallel:
   - Stage relevant untracked files
   - Create commit${commitAttribution ? ` ending with:
   ${commitAttribution}` : ""}
   - git status after commit (sequentially \u2014 depends on commit)
4. If pre-commit hook fails: fix and create a NEW commit

Important:
- No extra code exploration beyond git commands
- NEVER use ${TodoWriteTool.name} or ${AGENT_TOOL_NAME}
- Don't push unless user explicitly asks
- No -i flag (git rebase -i, git add -i) \u2014 requires interactive input
- No --no-edit with git rebase
- No changes to commit = no empty commit
- Always pass commit message via HEREDOC:
<example>
git commit -m "$(cat <<'EOF'
   Commit message here.${commitAttribution ? `

   ${commitAttribution}` : ""}
   EOF
   )"
</example>

# Creating pull requests
Use gh for ALL GitHub tasks (issues, PRs, checks, releases). If given a GitHub URL, use gh to get the info.

When the user asks to create a PR:

1. Run in parallel via ${BASH_TOOL_NAME}:
   - git status (no -uall)
   - git diff
   - Check if branch tracks remote and is up to date
   - git log + \`git diff [base-branch]...HEAD\`
2. Review ALL commits (not just latest), draft title + body:
   - Title under 70 chars
   - Details in body, not title
3. Run in parallel:
   - Create new branch if needed
   - Push to remote with -u if needed
   - Create PR via HEREDOC:
<example>
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
[Bulleted markdown checklist of TODOs for testing the pull request...]${prAttribution ? `

${prAttribution}` : ""}
EOF
)"
</example>

Important:
- NEVER use ${TodoWriteTool.name} or ${AGENT_TOOL_NAME}
- Return the PR URL when done

# Other common operations
- View comments on a Github PR: gh api repos/foo/bar/pulls/123/comments`;
}
function dedup(arr) {
  if (!arr || arr.length === 0)
    return arr;
  return [...new Set(arr)];
}
function getSimpleSandboxSection() {
  if (!SandboxManager2.isSandboxingEnabled())
    return "";
  let fsReadConfig = SandboxManager2.getFsReadConfig(), fsWriteConfig = SandboxManager2.getFsWriteConfig(), networkRestrictionConfig = SandboxManager2.getNetworkRestrictionConfig(), allowUnixSockets = SandboxManager2.getAllowUnixSockets(), ignoreViolations = SandboxManager2.getIgnoreViolations(), allowUnsandboxedCommands = SandboxManager2.areUnsandboxedCommandsAllowed(), claudeTempDir = getClaudeTempDir(), normalizeAllowOnly = (paths2) => [...new Set(paths2)].map((p4) => p4 === claudeTempDir ? "$TMPDIR" : p4), filesystemConfig = {
    read: {
      denyOnly: dedup(fsReadConfig.denyOnly),
      ...fsReadConfig.allowWithinDeny && {
        allowWithinDeny: dedup(fsReadConfig.allowWithinDeny)
      }
    },
    write: {
      allowOnly: normalizeAllowOnly(fsWriteConfig.allowOnly),
      denyWithinAllow: dedup(fsWriteConfig.denyWithinAllow)
    }
  }, networkConfig = {
    ...networkRestrictionConfig?.allowedHosts && {
      allowedHosts: dedup(networkRestrictionConfig.allowedHosts)
    },
    ...networkRestrictionConfig?.deniedHosts && {
      deniedHosts: dedup(networkRestrictionConfig.deniedHosts)
    },
    ...allowUnixSockets && { allowUnixSockets: dedup(allowUnixSockets) }
  }, restrictionsLines = [];
  if (Object.keys(filesystemConfig).length > 0)
    restrictionsLines.push(`Filesystem: ${jsonStringify(filesystemConfig)}`);
  if (Object.keys(networkConfig).length > 0)
    restrictionsLines.push(`Network: ${jsonStringify(networkConfig)}`);
  if (ignoreViolations)
    restrictionsLines.push(`Ignored violations: ${jsonStringify(ignoreViolations)}`);
  let items = [
    ...allowUnsandboxedCommands ? [
      "Default: run in sandbox. Only set `dangerouslyDisableSandbox: true` if:",
      [
        "User explicitly asks to bypass sandbox",
        "Command failed with clear sandbox evidence (not just missing files/wrong args)"
      ],
      "Sandbox failure evidence:",
      [
        '"Operation not permitted" for file/network ops',
        "Access denied to paths outside allowed dirs",
        "Network failures to non-whitelisted hosts",
        "Unix socket errors"
      ],
      "On sandbox failure:",
      [
        "Retry immediately with `dangerouslyDisableSandbox: true` \u2014 don't ask",
        "Briefly explain what restriction caused it. Mention `/sandbox` command."
      ],
      "Each command with `dangerouslyDisableSandbox: true` is individual \u2014 revert to sandbox for next command.",
      "Do not suggest adding sensitive paths (~/.*rc, ~/.ssh/*, credentials) to allowlist."
    ] : getPromptOverrides().sandboxStrict ? [
      "`dangerouslyDisableSandbox` is disabled by policy. All commands must run in sandbox.",
      "If sandbox causes failure, work with user to adjust settings."
    ] : [
      "Commands may run with or without sandbox as needed."
    ],
    "Temp files: use `$TMPDIR` (not `/tmp`). TMPDIR is set to the sandbox-writable dir automatically."
  ];
  return [
    "",
    "## Command sandbox",
    "Commands run in a sandbox by default, controlling directory/network access.",
    "",
    "Restrictions:",
    restrictionsLines.join(`
`),
    "",
    ...prependBullets(items)
  ].join(`
`);
}
function getSimplePrompt() {
  let embedded = hasEmbeddedSearchTools(), toolPreferenceItems = [
    ...embedded ? [] : [
      `File search: Use ${GLOB_TOOL_NAME} (NOT find or ls)`,
      `Content search: Use ${GREP_TOOL_NAME} (NOT grep or rg)`
    ],
    `Read files: Use ${FILE_READ_TOOL_NAME} (NOT cat/head/tail)`,
    `Edit files: Use ${FILE_EDIT_TOOL_NAME} (NOT sed/awk)`,
    `Write files: Use ${FILE_WRITE_TOOL_NAME} (NOT echo >/cat <<EOF)`,
    "Communication: Output text directly (NOT echo/printf)"
  ], avoidCommands = embedded ? "`cat`, `head`, `tail`, `sed`, `awk`, or `echo`" : "`find`, `grep`, `cat`, `head`, `tail`, `sed`, `awk`, or `echo`", multipleCommandsSubitems = [
    `Independent commands: multiple ${BASH_TOOL_NAME} calls in parallel (e.g., "git status" + "git diff" in one message).`,
    `Dependent commands: single ${BASH_TOOL_NAME} call with '&&'.`,
    "';' only when sequential but earlier failures are OK.",
    "No newlines to separate commands (ok in quoted strings)."
  ], gitSubitems = [
    "Prefer new commit over amending.",
    "Before destructive ops (git reset --hard, push --force, checkout --): check for safer alternative.",
    "Never skip hooks (--no-verify) or bypass signing unless user explicitly asks. If hook fails, fix the issue."
  ], sleepSubitems = [
    "No sleep between commands that can run immediately.",
    "Long-running command: use `run_in_background`. No sleep needed.",
    "Never retry failing commands in a sleep loop \u2014 diagnose.",
    "Background task: you'll be notified on completion \u2014 don't poll.",
    "If you must poll, use a check command (e.g. `gh run view`) rather than sleeping first.",
    "If you must sleep, keep it short (1-5s)."
  ], backgroundNote = getBackgroundUsageNote2(), instructionItems = [
    "Before creating dirs/files: run `ls` to verify the parent dir exists.",
    'Quote paths with spaces: `cd "path with spaces/file.txt"`',
    "Use absolute paths; avoid `cd` unless user asks.",
    `Optional timeout in ms (max ${getMaxTimeoutMs2()}ms / ${getMaxTimeoutMs2() / 60000}min). Default: ${getDefaultTimeoutMs2()}ms (${getDefaultTimeoutMs2() / 60000}min).`,
    ...backgroundNote !== null ? [backgroundNote] : [],
    "When issuing multiple commands:",
    multipleCommandsSubitems,
    "For git commands:",
    gitSubitems,
    "Avoid unnecessary `sleep` commands:",
    sleepSubitems,
    ...embedded ? [
      "When using `find -regex` with alternation, put the longest alternative first. Example: use `'.*\\.\\(tsx\\|ts\\)'` not `'.*\\.\\(ts\\|tsx\\)'` \u2014 the second form silently skips `.tsx` files."
    ] : []
  ];
  return [
    "Executes a bash command and returns its output.",
    "",
    "Working directory persists between commands; shell state does not. Initialized from user's profile (bash or zsh).",
    "",
    `IMPORTANT: Avoid ${avoidCommands} unless explicitly instructed or no dedicated tool exists. Use dedicated tools instead:`,
    "",
    ...prependBullets(toolPreferenceItems),
    "Dedicated tools give better UX and easier review.",
    "",
    "# Instructions",
    ...prependBullets(instructionItems),
    getSimpleSandboxSection(),
    ...getCommitAndPRInstructions() ? ["", getCommitAndPRInstructions()] : []
  ].join(`
`);
}
var init_prompt19 = __esm(() => {
  init_prompts4();
  init_promptOverrides();
  init_attribution();
  init_embeddedTools();
  init_envUtils();
  init_gitSettings();
  init_filesystem();
  init_sandbox_adapter();
  init_slowOperations();
  init_constants3();
  init_prompt2();
  init_prompt4();
  init_prompt5();
  init_TodoWriteTool();
});
