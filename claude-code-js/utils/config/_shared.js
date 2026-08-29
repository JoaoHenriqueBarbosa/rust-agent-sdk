// Shared module state and imports
// Original: src/utils/config.ts
__export(exports_config, {
  shouldSkipPluginAutoupdate: () => shouldSkipPluginAutoupdate,
  saveGlobalConfig: () => saveGlobalConfig,
  saveCurrentProjectConfig: () => saveCurrentProjectConfig,
  resetTrustDialogAcceptedCacheForTesting: () => resetTrustDialogAcceptedCacheForTesting,
  recordFirstStartTime: () => recordFirstStartTime,
  isProjectConfigKey: () => isProjectConfigKey,
  isPathTrusted: () => isPathTrusted,
  isGlobalConfigKey: () => isGlobalConfigKey,
  isAutoUpdaterDisabled: () => isAutoUpdaterDisabled,
  getUserClaudeRulesDir: () => getUserClaudeRulesDir,
  getRemoteControlAtStartup: () => getRemoteControlAtStartup,
  getProjectPathForConfig: () => getProjectPathForConfig,
  getOrCreateUserID: () => getOrCreateUserID,
  getMemoryPath: () => getMemoryPath,
  getManagedClaudeRulesDir: () => getManagedClaudeRulesDir,
  getGlobalConfigWriteCount: () => getGlobalConfigWriteCount,
  getGlobalConfig: () => getGlobalConfig,
  getCustomApiKeyStatus: () => getCustomApiKeyStatus,
  getCurrentProjectConfig: () => getCurrentProjectConfig,
  getAutoUpdaterDisabledReason: () => getAutoUpdaterDisabledReason,
  formatAutoUpdaterDisabledReason: () => formatAutoUpdaterDisabledReason,
  enableConfigs: () => enableConfigs,
  checkHasTrustDialogAccepted: () => checkHasTrustDialogAccepted,
  _wouldLoseAuthStateForTesting: () => _wouldLoseAuthStateForTesting,
  _setGlobalConfigCacheForTesting: () => _setGlobalConfigCacheForTesting,
  _getConfigForTesting: () => _getConfigForTesting,
  PROJECT_CONFIG_KEYS: () => PROJECT_CONFIG_KEYS,
  NOTIFICATION_CHANNELS: () => NOTIFICATION_CHANNELS,
  GLOBAL_CONFIG_KEYS: () => GLOBAL_CONFIG_KEYS,
  EDITOR_MODES: () => EDITOR_MODES,
  DEFAULT_GLOBAL_CONFIG: () => DEFAULT_GLOBAL_CONFIG,
  CONFIG_WRITE_DISPLAY_THRESHOLD: () => CONFIG_WRITE_DISPLAY_THRESHOLD
});
import { randomBytes } from "crypto";
import { unwatchFile as unwatchFile2, watchFile as watchFile2 } from "fs";
import { basename as basename4, dirname as dirname12, join as join20, resolve as resolve8 } from "path";

