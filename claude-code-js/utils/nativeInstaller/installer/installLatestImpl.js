// function: installLatestImpl
async function installLatestImpl(channelOrVersion, forceReinstall = !1) {
  let updateResult = await updateLatest(channelOrVersion, forceReinstall);
  if (!updateResult.success)
    return {
      latestVersion: null,
      wasUpdated: !1,
      lockFailed: updateResult.lockFailed,
      lockHolderPid: updateResult.lockHolderPid
    };
  if (getGlobalConfig().installMethod !== "native")
    saveGlobalConfig((current) => ({
      ...current,
      installMethod: "native",
      autoUpdates: !1,
      autoUpdatesProtectedForNative: !0
    })), logForDebugging('Native installer: Set installMethod to "native" and disabled legacy auto-updater for protection');
  return cleanupOldVersions(), {
    latestVersion: updateResult.latestVersion,
    wasUpdated: updateResult.success,
    lockFailed: !1
  };
}
