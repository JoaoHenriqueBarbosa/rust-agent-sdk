// Original: src/services/tips/tipScheduler.ts
function selectTipWithLongestTimeSinceShown(availableTips) {
  if (availableTips.length === 0)
    return;
  if (availableTips.length === 1)
    return availableTips[0];
  let tipsWithSessions = availableTips.map((tip) => ({
    tip,
    sessions: getSessionsSinceLastShown(tip.id)
  }));
  return tipsWithSessions.sort((a2, b) => b.sessions - a2.sessions), tipsWithSessions[0]?.tip;
}
async function getTipToShowOnSpinner(context7) {
  if (getSettings_DEPRECATED().spinnerTipsEnabled === !1)
    return;
  let tips = await getRelevantTips(context7);
  if (tips.length === 0)
    return;
  return selectTipWithLongestTimeSinceShown(tips);
}
function recordShownTip(tip) {
  recordTipShown(tip.id), logEvent("tengu_tip_shown", {
    tipIdLength: tip.id,
    cooldownSessions: tip.cooldownSessions
  });
}
var init_tipScheduler = __esm(() => {
  init_settings2();
  init_tipHistory();
  init_tipRegistry();
});
