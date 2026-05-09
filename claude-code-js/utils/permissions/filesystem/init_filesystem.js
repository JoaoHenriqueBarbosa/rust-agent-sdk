// var: init_filesystem
var init_filesystem = __esm(() => {
  init_memoize();
  init_paths();
  init_agentMemory();
  init_state();
  init_prompt2();
  init_cwd2();
  init_envUtils();
  init_fsOperations();
  init_path2();
  init_plans();
  init_platform();
  init_sessionStorage();
  init_constants2();
  init_settings2();
  init_readOnlyCommandValidation();
  init_toolResultStorage();
  init_windowsPaths();
  init_PermissionUpdate();
  init_permissions2();
  import_ignore5 = __toESM(require_ignore(), 1), DANGEROUS_FILES2 = [
    ".gitconfig",
    ".gitmodules",
    ".bashrc",
    ".bash_profile",
    ".zshrc",
    ".zprofile",
    ".profile",
    ".ripgreprc",
    ".mcp.json",
    ".claude.json"
  ], DANGEROUS_DIRECTORIES2 = [
    ".git",
    ".vscode",
    ".idea",
    ".claude"
  ];
  DIR_SEP = posix7.sep;
  getClaudeTempDir = memoize_default(function() {
    let baseTmpDir = process.env.CLAUDE_CODE_TMPDIR || (getPlatform() === "windows" ? tmpdir11() : "/tmp"), fs18 = getFsImplementation(), resolvedBaseTmpDir = baseTmpDir;
    try {
      resolvedBaseTmpDir = fs18.realpathSync(baseTmpDir);
    } catch {}
    return join136(resolvedBaseTmpDir, getClaudeTempDirName()) + sep32;
  }), getBundledSkillsRoot = memoize_default(function() {
    let nonce = randomBytes19(16).toString("hex");
    return join136(getClaudeTempDir(), "bundled-skills", "2.1.90", nonce);
  });
  getResolvedWorkingDirPaths = memoize_default(getPathsForPermissionCheck);
});
