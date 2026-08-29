// Original: src/commands/permissions/index.ts
var permissions, permissions_default;
var init_permissions4 = __esm(() => {
  permissions = {
    type: "local-jsx",
    name: "permissions",
    aliases: ["allowed-tools"],
    description: "Manage allow & deny tool permission rules",
    load: () => Promise.resolve().then(() => (init_permissions3(), exports_permissions))
  }, permissions_default = permissions;
});
