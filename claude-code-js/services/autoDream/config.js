// Original: src/services/autoDream/config.ts
function isAutoDreamEnabled() {
  let setting = getInitialSettings().autoDreamEnabled;
  if (setting !== void 0)
    return setting;
  return !1;
}
var init_config11 = __esm(() => {
  init_settings2();
});
