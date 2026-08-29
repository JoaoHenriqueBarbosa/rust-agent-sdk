// Original: src/utils/permissions/denialTracking.ts
function createDenialTrackingState() {
  return {
    consecutiveDenials: 0,
    totalDenials: 0
  };
}
var init_denialTracking = () => {};
