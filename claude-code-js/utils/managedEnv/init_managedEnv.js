// var: init_managedEnv
var init_managedEnv = __esm(() => {
  init_syncCache();
  init_caCerts();
  init_config4();
  init_envUtils();
  init_managedEnvConstants();
  init_mtls();
  init_proxy();
  init_constants2();
  init_settings2();
  TRUSTED_SETTING_SOURCES = [
    "userSettings",
    "flagSettings",
    "policySettings"
  ];
});
