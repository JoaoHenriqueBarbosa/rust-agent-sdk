// function: migrateConfigFields
function migrateConfigFields(config5) {
  if (config5.installMethod !== void 0)
    return config5;
  let legacy = config5, installMethod = "unknown", autoUpdates = config5.autoUpdates ?? !0;
  switch (legacy.autoUpdaterStatus) {
    case "migrated":
      installMethod = "local";
      break;
    case "installed":
      installMethod = "native";
      break;
    case "disabled":
      autoUpdates = !1;
      break;
    case "enabled":
    case "no_permissions":
    case "not_configured":
      installMethod = "global";
      break;
    case void 0:
      break;
  }
  return {
    ...config5,
    installMethod,
    autoUpdates
  };
}
