// Original: src/utils/activityManager.ts
class ActivityManager {
  activeOperations = /* @__PURE__ */ new Set;
  lastUserActivityTime = 0;
  lastCLIRecordedTime;
  isCLIActive = !1;
  USER_ACTIVITY_TIMEOUT_MS = 5000;
  getNow;
  getActiveTimeCounter;
  static instance = null;
  constructor(options2) {
    this.getNow = options2?.getNow ?? (() => Date.now()), this.getActiveTimeCounter = options2?.getActiveTimeCounter ?? getActiveTimeCounter, this.lastCLIRecordedTime = this.getNow();
  }
  static getInstance() {
    if (!ActivityManager.instance)
      ActivityManager.instance = new ActivityManager;
    return ActivityManager.instance;
  }
  static resetInstance() {
    ActivityManager.instance = null;
  }
  static createInstance(options2) {
    return ActivityManager.instance = new ActivityManager(options2), ActivityManager.instance;
  }
  recordUserActivity() {
    if (!this.isCLIActive && this.lastUserActivityTime !== 0) {
      let timeSinceLastActivity = (this.getNow() - this.lastUserActivityTime) / 1000;
      if (timeSinceLastActivity > 0) {
        let activeTimeCounter = this.getActiveTimeCounter();
        if (activeTimeCounter) {
          let timeoutSeconds = this.USER_ACTIVITY_TIMEOUT_MS / 1000;
          if (timeSinceLastActivity < timeoutSeconds)
            activeTimeCounter.add(timeSinceLastActivity, { type: "user" });
        }
      }
    }
    this.lastUserActivityTime = this.getNow();
  }
  startCLIActivity(operationId) {
    if (this.activeOperations.has(operationId))
      this.endCLIActivity(operationId);
    let wasEmpty = this.activeOperations.size === 0;
    if (this.activeOperations.add(operationId), wasEmpty)
      this.isCLIActive = !0, this.lastCLIRecordedTime = this.getNow();
  }
  endCLIActivity(operationId) {
    if (this.activeOperations.delete(operationId), this.activeOperations.size === 0) {
      let now2 = this.getNow(), timeSinceLastRecord = (now2 - this.lastCLIRecordedTime) / 1000;
      if (timeSinceLastRecord > 0) {
        let activeTimeCounter = this.getActiveTimeCounter();
        if (activeTimeCounter)
          activeTimeCounter.add(timeSinceLastRecord, { type: "cli" });
      }
      this.lastCLIRecordedTime = now2, this.isCLIActive = !1;
    }
  }
  async trackOperation(operationId, fn) {
    this.startCLIActivity(operationId);
    try {
      return await fn();
    } finally {
      this.endCLIActivity(operationId);
    }
  }
  getActivityStates() {
    return {
      isUserActive: (this.getNow() - this.lastUserActivityTime) / 1000 < this.USER_ACTIVITY_TIMEOUT_MS / 1000,
      isCLIActive: this.isCLIActive,
      activeOperationCount: this.activeOperations.size
    };
  }
}
var activityManager;
var init_activityManager = __esm(() => {
  init_state();
  activityManager = ActivityManager.getInstance();
});
