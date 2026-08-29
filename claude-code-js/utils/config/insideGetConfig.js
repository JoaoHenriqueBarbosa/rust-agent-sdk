// var: insideGetConfig
var insideGetConfig = !1, DEFAULT_PROJECT_CONFIG, DEFAULT_GLOBAL_CONFIG, GLOBAL_CONFIG_KEYS, PROJECT_CONFIG_KEYS, TEST_GLOBAL_CONFIG_FOR_TESTING, TEST_PROJECT_CONFIG_FOR_TESTING, globalConfigCache, lastReadFileStats = null, configCacheHits = 0, configCacheMisses = 0, globalConfigWriteCount = 0, CONFIG_WRITE_DISPLAY_THRESHOLD = 20, CONFIG_FRESHNESS_POLL_MS = 1000, freshnessWatcherStarted = !1, configReadingAllowed = !1, getProjectPathForConfig, _getConfigForTesting, _wouldLoseAuthStateForTesting;
var init_config4 = __esm(() => {
  init_memoize();
  init_pickBy();
  init_state();
  init_paths();
  init_cleanupRegistry();
  init_debug();
  init_diagLogs();
  init_env();
  init_envUtils();
  init_errors();
  init_file();
  init_fsOperations();
  init_git();
  init_json();
  init_log3();
  init_path2();
  init_managedPath();
  init_slowOperations();
  init_configConstants();
  DEFAULT_PROJECT_CONFIG = {
    allowedTools: [],
    mcpContextUris: [],
    mcpServers: {},
    enabledMcpjsonServers: [],
    disabledMcpjsonServers: [],
    hasTrustDialogAccepted: !1,
    projectOnboardingSeenCount: 0,
    hasClaudeMdExternalIncludesApproved: !1,
    hasClaudeMdExternalIncludesWarningShown: !1
  };
  DEFAULT_GLOBAL_CONFIG = createDefaultGlobalConfig(), GLOBAL_CONFIG_KEYS = [
    "apiKeyHelper",
    "installMethod",
    "autoUpdates",
    "autoUpdatesProtectedForNative",
    "theme",
    "verbose",
    "preferredNotifChannel",
    "shiftEnterKeyBindingInstalled",
    "editorMode",
    "hasUsedBackslashReturn",
    "autoCompactEnabled",
    "showTurnDuration",
    "diffTool",
    "env",
    "tipsHistory",
    "todoFeatureEnabled",
    "showExpandedTodos",
    "messageIdleNotifThresholdMs",
    "autoConnectIde",
    "autoInstallIdeExtension",
    "fileCheckpointingEnabled",
    "terminalProgressBarEnabled",
    "showStatusInTerminalTab",
    "taskCompleteNotifEnabled",
    "inputNeededNotifEnabled",
    "agentPushNotifEnabled",
    "respectGitignore",
    "claudeInChromeDefaultEnabled",
    "hasCompletedClaudeInChromeOnboarding",
    "lspRecommendationDisabled",
    "lspRecommendationNeverPlugins",
    "lspRecommendationIgnoredCount",
    "copyFullResponse",
    "copyOnSelect",
    "permissionExplainerEnabled",
    "prStatusFooterEnabled",
    "remoteControlAtStartup",
    "remoteDialogSeen"
  ];
  PROJECT_CONFIG_KEYS = [
    "allowedTools",
    "hasTrustDialogAccepted",
    "hasCompletedProjectOnboarding"
  ];
  TEST_GLOBAL_CONFIG_FOR_TESTING = {
    ...DEFAULT_GLOBAL_CONFIG,
    autoUpdates: !1
  }, TEST_PROJECT_CONFIG_FOR_TESTING = {
    ...DEFAULT_PROJECT_CONFIG
  };
  globalConfigCache = {
    config: null,
    mtime: 0
  };
  registerCleanup(async () => {
    reportConfigCacheStats();
  });
  getProjectPathForConfig = memoize_default(() => {
    let originalCwd = getOriginalCwd(), gitRoot = findCanonicalGitRoot(originalCwd);
    if (gitRoot)
      return normalizePathForConfigKey(gitRoot);
    return normalizePathForConfigKey(resolve8(originalCwd));
  });
  _getConfigForTesting = getConfig, _wouldLoseAuthStateForTesting = wouldLoseAuthState;
});
