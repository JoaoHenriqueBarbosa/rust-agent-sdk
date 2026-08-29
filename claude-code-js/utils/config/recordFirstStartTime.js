// function: recordFirstStartTime
function recordFirstStartTime() {
  if (!getGlobalConfig().firstStartTime) {
    let firstStartTime = (/* @__PURE__ */ new Date()).toISOString();
    saveGlobalConfig((current) => ({
      ...current,
      firstStartTime: current.firstStartTime ?? firstStartTime
    }));
  }
}
