// Original: src/commands/version.ts
var call53 = async () => {
  return {
    type: "text",
    value: "2.1.90"
  };
}, version5, version_default;
var init_version = __esm(() => {
  version5 = {
    type: "local",
    name: "version",
    description: "Print the version this session is running (not what autoupdate downloaded)",
    isEnabled: () => !0,
    supportsNonInteractive: !0,
    load: () => Promise.resolve({ call: call53 })
  }, version_default = version5;
});
