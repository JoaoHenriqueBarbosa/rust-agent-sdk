// Original: src/tools/EnterWorktreeTool/EnterWorktreeTool.ts
var inputSchema28, outputSchema22, EnterWorktreeTool;
var init_EnterWorktreeTool = __esm(() => {
  init_v4();
  init_state();
  init_systemPromptSections();
  init_Tool();
  init_claudemd();
  init_cwd2();
  init_git();
  init_plans();
  init_Shell();
  init_sessionStorage();
  init_worktree();
  init_UI20();
  inputSchema28 = lazySchema(() => exports_external.strictObject({
    name: exports_external.string().superRefine((s2, ctx) => {
      try {
        validateWorktreeSlug(s2);
      } catch (e) {
        ctx.addIssue({ code: "custom", message: e.message });
      }
    }).optional().describe('Optional name for the worktree. Each "/"-separated segment may contain only letters, digits, dots, underscores, and dashes; max 64 chars total. A random name is generated if not provided.')
  })), outputSchema22 = lazySchema(() => exports_external.object({
    worktreePath: exports_external.string(),
    worktreeBranch: exports_external.string().optional(),
    message: exports_external.string()
  })), EnterWorktreeTool = buildTool({
    name: ENTER_WORKTREE_TOOL_NAME,
    searchHint: "create an isolated git worktree and switch into it",
    maxResultSizeChars: 1e5,
    async description() {
      return "Creates an isolated worktree (via git or configured hooks) and switches the session into it";
    },
    async prompt() {
      return getEnterWorktreeToolPrompt();
    },
    get inputSchema() {
      return inputSchema28();
    },
    get outputSchema() {
      return outputSchema22();
    },
    userFacingName() {
      return "Creating worktree";
    },
    shouldDefer: !0,
    toAutoClassifierInput(input) {
      return input.name ?? "";
    },
    renderToolUseMessage: renderToolUseMessage21,
    renderToolResultMessage: renderToolResultMessage20,
    async call(input) {
      if (getCurrentWorktreeSession())
        throw Error("Already in a worktree session");
      let mainRepoRoot = findCanonicalGitRoot(getCwd());
      if (mainRepoRoot && mainRepoRoot !== getCwd())
        process.chdir(mainRepoRoot), setCwd(mainRepoRoot);
      let slug = input.name ?? getPlanSlug(), worktreeSession = await createWorktreeForSession(getSessionId(), slug);
      process.chdir(worktreeSession.worktreePath), setCwd(worktreeSession.worktreePath), setOriginalCwd(getCwd()), saveWorktreeState(worktreeSession), clearSystemPromptSections(), clearMemoryFileCaches(), getPlansDirectory.cache.clear?.(), logEvent("tengu_worktree_created", {
        mid_session: !0
      });
      let branchInfo = worktreeSession.worktreeBranch ? ` on branch ${worktreeSession.worktreeBranch}` : "";
      return {
        data: {
          worktreePath: worktreeSession.worktreePath,
          worktreeBranch: worktreeSession.worktreeBranch,
          message: `Created worktree at ${worktreeSession.worktreePath}${branchInfo}. The session is now working in the worktree. Use ExitWorktree to leave mid-session, or exit the session to be prompted.`
        }
      };
    },
    mapToolResultToToolResultBlockParam({ message }, toolUseID) {
      return {
        type: "tool_result",
        content: message,
        tool_use_id: toolUseID
      };
    }
  });
});
