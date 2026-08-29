// Original: src/utils/model/contextWindowUpgradeCheck.ts
function getAvailableUpgrade() {
  let currentModelSetting = getUserSpecifiedModelSetting();
  if (currentModelSetting === "opus" && checkOpus1mAccess())
    return {
      alias: "opus[1m]",
      name: "Opus 1M",
      multiplier: 5
    };
  else if (currentModelSetting === "sonnet" && checkSonnet1mAccess())
    return {
      alias: "sonnet[1m]",
      name: "Sonnet 1M",
      multiplier: 5
    };
  return null;
}
function getUpgradeMessage(context3) {
  let upgrade = getAvailableUpgrade();
  if (!upgrade)
    return null;
  switch (context3) {
    case "warning":
      return `/model ${upgrade.alias}`;
    case "tip":
      return `Tip: You have access to ${upgrade.name} with ${upgrade.multiplier}x more context`;
    default:
      return null;
  }
}
var init_contextWindowUpgradeCheck = __esm(() => {
  init_check1mAccess();
  init_model();
});
