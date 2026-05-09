// Original: src/commands/privacy-settings/index.ts
var privacySettings, privacy_settings_default;
var init_privacy_settings2 = __esm(() => {
  init_auth14();
  privacySettings = {
    type: "local-jsx",
    name: "privacy-settings",
    description: "View and update your privacy settings",
    isEnabled: () => {
      return isConsumerSubscriber();
    },
    load: () => Promise.resolve().then(() => (init_privacy_settings(), exports_privacy_settings))
  }, privacy_settings_default = privacySettings;
});
