// Original: src/projectOnboardingState.ts
import { join as join101 } from "path";
function getSteps() {
  let hasClaudeMd = getFsImplementation().existsSync(join101(getCwd(), "CLAUDE.md")), isWorkspaceDirEmpty = isDirEmpty(getCwd());
  return [
    {
      key: "workspace",
      text: "Ask Claude to create a new app or clone a repository",
      isComplete: !1,
      isCompletable: !0,
      isEnabled: isWorkspaceDirEmpty
    },
    {
      key: "claudemd",
      text: "Run /init to create a CLAUDE.md file with instructions for Claude",
      isComplete: hasClaudeMd,
      isCompletable: !0,
      isEnabled: !isWorkspaceDirEmpty
    }
  ];
}
function isProjectOnboardingComplete() {
  return getSteps().filter(({ isCompletable, isEnabled: isEnabled2 }) => isCompletable && isEnabled2).every(({ isComplete }) => isComplete);
}
function maybeMarkProjectOnboardingComplete() {
  if (getCurrentProjectConfig().hasCompletedProjectOnboarding)
    return;
  if (isProjectOnboardingComplete())
    saveCurrentProjectConfig((current) => ({
      ...current,
      hasCompletedProjectOnboarding: !0
    }));
}
function incrementProjectOnboardingSeenCount() {
  saveCurrentProjectConfig((current) => ({
    ...current,
    projectOnboardingSeenCount: current.projectOnboardingSeenCount + 1
  }));
}
var shouldShowProjectOnboarding;
var init_projectOnboardingState = __esm(() => {
  init_memoize();
  init_config4();
  init_cwd2();
  init_file();
  init_fsOperations();
  shouldShowProjectOnboarding = memoize_default(() => {
    let projectConfig = getCurrentProjectConfig();
    if (projectConfig.hasCompletedProjectOnboarding || projectConfig.projectOnboardingSeenCount >= 4 || process.env.IS_DEMO)
      return !1;
    return !isProjectOnboardingComplete();
  });
});
