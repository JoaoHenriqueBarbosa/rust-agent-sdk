// var: init_bashPermissions
var init_bashPermissions = __esm(() => {
  init_sdk();
  init_ast();
  init_commands4();
  init_parser4();
  init_shellQuote();
  init_cwd2();
  init_debug();
  init_envUtils();
  init_errors();
  init_PermissionUpdate();
  init_permissionRuleParser();
  init_permissions2();
  init_shellRuleMatching();
  init_platform();
  init_sandbox_adapter();
  init_slowOperations();
  init_windowsPaths();
  init_BashTool();
  init_bashCommandHelpers();
  init_bashSecurity();
  init_modeValidation2();
  init_pathValidation2();
  init_sedValidation();
  init_shouldUseSandbox();
  bashCommandIsSafeAsync = bashCommandIsSafeAsync_DEPRECATED, splitCommand = splitCommand_DEPRECATED, ENV_VAR_ASSIGN_RE = /^[A-Za-z_]\w*=/;
  BARE_SHELL_PREFIXES = /* @__PURE__ */ new Set([
    "sh",
    "bash",
    "zsh",
    "fish",
    "csh",
    "tcsh",
    "ksh",
    "dash",
    "cmd",
    "powershell",
    "pwsh",
    "env",
    "xargs",
    "nice",
    "stdbuf",
    "nohup",
    "timeout",
    "time",
    "sudo",
    "doas",
    "pkexec"
  ]);
  permissionRuleExtractPrefix3 = permissionRuleExtractPrefix2;
  bashPermissionRule = parsePermissionRule, SAFE_ENV_VARS3 = /* @__PURE__ */ new Set([
    "GOEXPERIMENT",
    "GOOS",
    "GOARCH",
    "CGO_ENABLED",
    "GO111MODULE",
    "RUST_BACKTRACE",
    "RUST_LOG",
    "NODE_ENV",
    "PYTHONUNBUFFERED",
    "PYTHONDONTWRITEBYTECODE",
    "PYTEST_DISABLE_PLUGIN_AUTOLOAD",
    "PYTEST_DEBUG",
    "ANTHROPIC_API_KEY",
    "LANG",
    "LANGUAGE",
    "LC_ALL",
    "LC_CTYPE",
    "LC_TIME",
    "CHARSET",
    "TERM",
    "COLORTERM",
    "NO_COLOR",
    "FORCE_COLOR",
    "TZ",
    "LS_COLORS",
    "LSCOLORS",
    "GREP_COLOR",
    "GREP_COLORS",
    "GCC_COLORS",
    "TIME_STYLE",
    "BLOCK_SIZE",
    "BLOCKSIZE"
  ]);
  BINARY_HIJACK_VARS = /^(LD_|DYLD_|PATH$)/;
  speculativeChecks = /* @__PURE__ */ new Map;
});
