// var: init_worktree
var init_worktree = __esm(() => {
  init_source();
  init_config4();
  init_cwd2();
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_gitConfigParser();
  init_gitFilesystem();
  init_git();
  init_hooks5();
  init_path2();
  init_platform();
  init_settings2();
  init_detection();
  import_ignore6 = __toESM(require_ignore(), 1), VALID_WORKTREE_SLUG_SEGMENT = /^[a-zA-Z0-9._-]+$/;
  GIT_NO_PROMPT_ENV2 = {
    GIT_TERMINAL_PROMPT: "0",
    GIT_ASKPASS: ""
  };
  EPHEMERAL_WORKTREE_PATTERNS = [
    /^agent-a[0-9a-f]{7}$/,
    /^wf_[0-9a-f]{8}-[0-9a-f]{3}-\d+$/,
    /^wf-\d+$/,
    /^bridge-[A-Za-z0-9_]+(-[A-Za-z0-9_]+)*$/,
    /^job-[a-zA-Z0-9._-]{1,55}-[0-9a-f]{8}$/
  ];
});
