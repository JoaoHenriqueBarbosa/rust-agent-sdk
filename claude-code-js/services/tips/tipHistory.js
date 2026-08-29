// Original: src/services/tips/tipHistory.ts
function recordTipShown(tipId) {
  let numStartups = getGlobalConfig().numStartups;
  saveGlobalConfig((c3) => {
    let history = c3.tipsHistory ?? {};
    if (history[tipId] === numStartups)
      return c3;
    return { ...c3, tipsHistory: { ...history, [tipId]: numStartups } };
  });
}
function getSessionsSinceLastShown(tipId) {
  let config11 = getGlobalConfig(), lastShown = config11.tipsHistory?.[tipId];
  if (!lastShown)
    return 1 / 0;
  return config11.numStartups - lastShown;
}
var init_tipHistory = __esm(() => {
  init_config4();
});
