// Original: src/hooks/notifs/useNpmDeprecationNotification.tsx
function useNpmDeprecationNotification() {
  useStartupNotification(_temp291);
}
async function _temp291() {
  if (isInBundledMode() || isEnvTruthy(process.env.DISABLE_INSTALLATION_CHECKS))
    return null;
  if (await getCurrentInstallationType() === "development")
    return null;
  return {
    timeoutMs: 15000,
    key: "npm-deprecation-warning",
    text: NPM_DEPRECATION_MESSAGE,
    color: "warning",
    priority: "high"
  };
}
var NPM_DEPRECATION_MESSAGE = "Claude Code has switched from npm to native installer. Run `claude install` or see https://docs.anthropic.com/en/docs/claude-code/getting-started for more options.";
var init_useNpmDeprecationNotification = __esm(() => {
  init_doctorDiagnostic();
  init_envUtils();
  init_useStartupNotification();
});
