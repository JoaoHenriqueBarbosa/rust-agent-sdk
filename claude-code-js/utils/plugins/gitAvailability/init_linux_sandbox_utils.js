// var: init_linux_sandbox_utils
var init_linux_sandbox_utils = __esm(() => {
  init_which2();
  init_ripgrep2();
  init_sandbox_utils();
  init_generate_seccomp_filter();
  import_shell_quote = __toESM(require_shell_quote(), 1);
  bwrapMountPoints = /* @__PURE__ */ new Set;
});
