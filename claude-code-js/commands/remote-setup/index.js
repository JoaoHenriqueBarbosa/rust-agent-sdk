// Original: src/commands/remote-setup/index.ts
var exports_remote_setup2 = {};
__export(exports_remote_setup2, {
  default: () => remote_setup_default
});
var web, remote_setup_default;
var init_remote_setup2 = __esm(() => {
  web = {
    type: "local-jsx",
    name: "web-setup",
    description: "Setup Claude Code on the web (requires connecting your GitHub account)",
    availability: ["claude-ai"],
    isEnabled: () => !0,
    load: () => Promise.resolve().then(() => (init_remote_setup(), exports_remote_setup))
  }, remote_setup_default = web;
});
