// var: init_sandbox_utils
var init_sandbox_utils = __esm(() => {
  init_platform3();
  DANGEROUS_FILES = [
    ".gitconfig",
    ".gitmodules",
    ".bashrc",
    ".bash_profile",
    ".zshrc",
    ".zprofile",
    ".profile",
    ".ripgreprc",
    ".mcp.json"
  ], DANGEROUS_DIRECTORIES = [".git", ".vscode", ".idea"];
});
