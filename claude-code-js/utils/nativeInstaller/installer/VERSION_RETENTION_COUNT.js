// var: VERSION_RETENTION_COUNT
var VERSION_RETENTION_COUNT = 2, LOCK_STALE_MS = 604800000, inFlightInstall = null;
var init_installer = __esm(() => {
  init_autoUpdater();
  init_cleanupRegistry();
  init_config4();
  init_debug();
  init_doctorDiagnostic();
  init_env();
  init_envDynamic();
  init_envUtils();
  init_errors();
  init_execFileNoThrow();
  init_localInstaller();
  init_log3();
  init_shellConfig();
  init_xdg();
  init_download();
  init_pidLock();
});
