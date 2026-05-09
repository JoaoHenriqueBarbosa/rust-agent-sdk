// function: createDefaultGlobalConfig
function createDefaultGlobalConfig() {
  return {
    numStartups: 0,
    installMethod: void 0,
    autoUpdates: void 0,
    theme: "dark",
    preferredNotifChannel: "auto",
    verbose: !1,
    editorMode: "normal",
    autoCompactEnabled: !0,
    showTurnDuration: !0,
    hasSeenTasksHint: !1,
    hasUsedStash: !1,
    hasUsedBackgroundTask: !1,
    queuedCommandUpHintCount: 0,
    diffTool: "auto",
    customApiKeyResponses: {
      approved: [],
      rejected: []
    },
    env: {},
    tipsHistory: {},
    memoryUsageCount: 0,
    promptQueueUseCount: 0,
    btwUseCount: 0,
    todoFeatureEnabled: !0,
    showExpandedTodos: !1,
    messageIdleNotifThresholdMs: 60000,
    autoConnectIde: !1,
    autoInstallIdeExtension: !0,
    fileCheckpointingEnabled: !0,
    terminalProgressBarEnabled: !0,
    cachedStatsigGates: {},
    cachedDynamicConfigs: {},
    cachedGrowthBookFeatures: {},
    respectGitignore: !0,
    copyFullResponse: !1
  };
}
