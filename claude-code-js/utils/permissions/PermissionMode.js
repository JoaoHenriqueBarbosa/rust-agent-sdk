// Original: src/utils/permissions/PermissionMode.ts
function isExternalPermissionMode(mode) {
  return !0;
}
function getModeConfig(mode) {
  return PERMISSION_MODE_CONFIG[mode] ?? PERMISSION_MODE_CONFIG.default;
}
function toExternalPermissionMode(mode) {
  return getModeConfig(mode).external;
}
function permissionModeFromString(str) {
  return PERMISSION_MODES.includes(str) ? str : "default";
}
function permissionModeTitle(mode) {
  return getModeConfig(mode).title;
}
function isDefaultMode(mode) {
  return mode === "default" || mode === void 0;
}
function permissionModeSymbol(mode) {
  return getModeConfig(mode).symbol;
}
function getModeColor(mode) {
  return getModeConfig(mode).color;
}
var permissionModeSchema, externalPermissionModeSchema, PERMISSION_MODE_CONFIG;
var init_PermissionMode = __esm(() => {
  init_v4();
  init_figures2();
  init_permissions();
  permissionModeSchema = lazySchema(() => v4_default.enum(PERMISSION_MODES)), externalPermissionModeSchema = lazySchema(() => v4_default.enum(EXTERNAL_PERMISSION_MODES)), PERMISSION_MODE_CONFIG = {
    default: {
      title: "Default",
      shortTitle: "Default",
      symbol: "",
      color: "text",
      external: "default"
    },
    plan: {
      title: "Plan Mode",
      shortTitle: "Plan",
      symbol: PAUSE_ICON,
      color: "planMode",
      external: "plan"
    },
    acceptEdits: {
      title: "Accept edits",
      shortTitle: "Accept",
      symbol: "\u23F5\u23F5",
      color: "autoAccept",
      external: "acceptEdits"
    },
    bypassPermissions: {
      title: "Bypass Permissions",
      shortTitle: "Bypass",
      symbol: "\u23F5\u23F5",
      color: "error",
      external: "bypassPermissions"
    },
    dontAsk: {
      title: "Don't Ask",
      shortTitle: "DontAsk",
      symbol: "\u23F5\u23F5",
      color: "error",
      external: "dontAsk"
    },
    ...{}
  };
});