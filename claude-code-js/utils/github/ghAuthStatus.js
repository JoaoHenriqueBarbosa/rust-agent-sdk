// Original: src/utils/github/ghAuthStatus.ts
async function getGhAuthStatus() {
  if (!await which("gh"))
    return "not_installed";
  let { exitCode } = await execa("gh", ["auth", "token"], {
    stdout: "ignore",
    stderr: "ignore",
    timeout: 5000,
    reject: !1
  });
  return exitCode === 0 ? "authenticated" : "not_authenticated";
}
var init_ghAuthStatus = __esm(() => {
  init_execa();
  init_which();
});
