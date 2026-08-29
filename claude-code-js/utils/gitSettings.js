// Original: src/utils/gitSettings.ts
function shouldIncludeGitInstructions() {
  let envVal = process.env.CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS;
  if (isEnvTruthy(envVal))
    return !1;
  if (isEnvDefinedFalsy(envVal))
    return !0;
  return getInitialSettings().includeGitInstructions ?? !0;
}
var init_gitSettings = __esm(() => {
  init_envUtils();
  init_settings2();
});
