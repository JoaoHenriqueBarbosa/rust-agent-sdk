// Original: src/tools/ConfigTool/supportedSettings.ts
function isSupported(key3) {
  return key3 in SUPPORTED_SETTINGS;
}
function getConfig3(key3) {
  return SUPPORTED_SETTINGS[key3];
}
function getOptionsForSetting(key3) {
  let config10 = SUPPORTED_SETTINGS[key3];
  if (!config10)
    return;
  if (config10.options)
    return [...config10.options];
  if (config10.getOptions)
    return config10.getOptions();
  return;
}
function getPath(key3) {
  return SUPPORTED_SETTINGS[key3]?.path ?? key3.split(".");
}
var SUPPORTED_SETTINGS;
var init_supportedSettings = __esm(() => {
  init_config4();
  init_configConstants();
  init_modelOptions();
  init_validateModel();
  init_theme();
  SUPPORTED_SETTINGS = {
    theme: {
      source: "global",
      type: "string",
      description: "Color theme for the UI",
      options: THEME_NAMES
    },
    editorMode: {
      source: "global",
      type: "string",
      description: "Key binding mode",
      options: EDITOR_MODES
    },
    verbose: {
      source: "global",
      type: "boolean",
      description: "Show detailed debug output",
      appStateKey: "verbose"
    },
    preferredNotifChannel: {
      source: "global",
      type: "string",
      description: "Preferred notification channel",
      options: NOTIFICATION_CHANNELS
    },
    autoCompactEnabled: {
      source: "global",
      type: "boolean",
      description: "Auto-compact when context is full"
    },
    autoMemoryEnabled: {
      source: "settings",
      type: "boolean",
      description: "Enable auto-memory"
    },
    autoDreamEnabled: {
      source: "settings",
      type: "boolean",
      description: "Enable background memory consolidation"
    },
    fileCheckpointingEnabled: {
      source: "global",
      type: "boolean",
      description: "Enable file checkpointing for code rewind"
    },
    showTurnDuration: {
      source: "global",
      type: "boolean",
      description: 'Show turn duration message after responses (e.g., "Cooked for 1m 6s")'
    },
    terminalProgressBarEnabled: {
      source: "global",
      type: "boolean",
      description: "Show OSC 9;4 progress indicator in supported terminals"
    },
    todoFeatureEnabled: {
      source: "global",
      type: "boolean",
      description: "Enable todo/task tracking"
    },
    model: {
      source: "settings",
      type: "string",
      description: "Override the default model",
      appStateKey: "mainLoopModel",
      getOptions: () => {
        try {
          return getModelOptions().filter((o5) => o5.value !== null).map((o5) => o5.value);
        } catch {
          return ["sonnet", "opus", "haiku"];
        }
      },
      validateOnWrite: (v2) => validateModel(String(v2)),
      formatOnRead: (v2) => v2 === null ? "default" : v2
    },
    alwaysThinkingEnabled: {
      source: "settings",
      type: "boolean",
      description: "Enable extended thinking (false to disable)",
      appStateKey: "thinkingEnabled"
    },
    "permissions.defaultMode": {
      source: "settings",
      type: "string",
      description: "Default permission mode for tool usage",
      options: ["default", "plan", "acceptEdits", "dontAsk"]
    },
    language: {
      source: "settings",
      type: "string",
      description: 'Preferred language for Claude responses and voice dictation (e.g., "japanese", "spanish")'
    },
    teammateMode: {
      source: "global",
      type: "string",
      description: 'How to spawn teammates: "tmux" for traditional tmux, "in-process" for same process, "auto" to choose automatically',
      options: TEAMMATE_MODES
    },
    ...{},
    ...{},
    ...{},
    ...{
      taskCompleteNotifEnabled: {
        source: "global",
        type: "boolean",
        description: "Push to your mobile device when idle after Claude finishes (requires Remote Control)"
      },
      inputNeededNotifEnabled: {
        source: "global",
        type: "boolean",
        description: "Push to your mobile device when a permission prompt or question is waiting (requires Remote Control)"
      },
      agentPushNotifEnabled: {
        source: "global",
        type: "boolean",
        description: "Allow Claude to push to your mobile device when it deems it appropriate (requires Remote Control)"
      }
    }
  };
});
