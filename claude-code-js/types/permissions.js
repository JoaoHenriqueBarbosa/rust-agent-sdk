// Original: src/types/permissions.ts
var EXTERNAL_PERMISSION_MODES, INTERNAL_PERMISSION_MODES, PERMISSION_MODES;
var init_permissions = __esm(() => {
  EXTERNAL_PERMISSION_MODES = [
    "acceptEdits",
    "bypassPermissions",
    "default",
    "dontAsk",
    "plan"
  ], INTERNAL_PERMISSION_MODES = [
    ...EXTERNAL_PERMISSION_MODES,
    ...[]
  ], PERMISSION_MODES = INTERNAL_PERMISSION_MODES;
});
