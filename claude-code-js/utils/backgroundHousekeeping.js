// Original: src/utils/backgroundHousekeeping.ts
var exports_backgroundHousekeeping = {};
__export(exports_backgroundHousekeeping, {
  startBackgroundHousekeeping: () => startBackgroundHousekeeping
});
function startBackgroundHousekeeping() {
  initMagicDocs(), initSkillImprovement(), initAutoDream(), autoUpdateMarketplacesAndPluginsInBackground();
  let needsCleanup = !0;
  async function runVerySlowOps() {
    if (getIsInteractive() && getLastInteractionTime() > Date.now() - 60000) {
      setTimeout(runVerySlowOps, DELAY_VERY_SLOW_OPERATIONS_THAT_HAPPEN_EVERY_SESSION).unref();
      return;
    }
    if (needsCleanup)
      needsCleanup = !1, await cleanupOldMessageFilesInBackground();
    if (getIsInteractive() && getLastInteractionTime() > Date.now() - 60000) {
      setTimeout(runVerySlowOps, DELAY_VERY_SLOW_OPERATIONS_THAT_HAPPEN_EVERY_SESSION).unref();
      return;
    }
    await cleanupOldVersions();
  }
  setTimeout(runVerySlowOps, DELAY_VERY_SLOW_OPERATIONS_THAT_HAPPEN_EVERY_SESSION).unref();
}
var DELAY_VERY_SLOW_OPERATIONS_THAT_HAPPEN_EVERY_SESSION = 600000;
var init_backgroundHousekeeping = __esm(() => {
  init_autoDream();
  init_magicDocs();
  init_skillImprovement();
  init_state();
  init_cleanup2();
  init_nativeInstaller();
  init_pluginAutoupdate();
});
