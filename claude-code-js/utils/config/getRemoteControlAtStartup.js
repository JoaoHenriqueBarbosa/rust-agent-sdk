// function: getRemoteControlAtStartup
function getRemoteControlAtStartup() {
  let explicit = getGlobalConfig().remoteControlAtStartup;
  if (explicit !== void 0)
    return explicit;
  return !1;
}
