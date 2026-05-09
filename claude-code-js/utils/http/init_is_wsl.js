// var: init_is_wsl
var init_is_wsl = __esm(() => {
  init_is_inside_container();
  is_wsl_default = process15.env.__IS_WSL_TEST__ ? isWsl : isWsl();
});
