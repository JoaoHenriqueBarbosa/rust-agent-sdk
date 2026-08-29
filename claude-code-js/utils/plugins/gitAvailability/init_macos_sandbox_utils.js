// var: init_macos_sandbox_utils
var init_macos_sandbox_utils = __esm(() => {
  init_which2();
  init_sandbox_utils();
  import_shell_quote2 = __toESM(require_shell_quote(), 1);
  sessionSuffix = `_${Math.random().toString(36).slice(2, 11)}_SBX`;
});
