// function: Config
function Config({
  onClose,
  context: context6,
  setTabsHidden,
  onIsSearchModeChange,
  contentHeight
}) {
  let {
    headerFocused,
    focusHeader
  } = useTabHeaderFocus(), insideModal = useIsInsideModal(), [, setTheme] = useTheme(), themeSetting = useThemeSetting(), [globalConfig2, setGlobalConfig] = import_react104.useState(getGlobalConfig()), initialConfig = React53.useRef(getGlobalConfig()), [settingsData, setSettingsData] = import_react104.useState(getInitialSettings()), initialSettingsData = React53.useRef(getInitialSettings()), [currentOutputStyle, setCurrentOutputStyle] = import_react104.useState(settingsData?.outputStyle || DEFAULT_OUTPUT_STYLE_NAME), initialOutputStyle = React53.useRef(currentOutputStyle), [currentLanguage, setCurrentLanguage] = import_react104.useState(settingsData?.language), initialLanguage = React53.useRef(currentLanguage), [selectedIndex, setSelectedIndex] = import_react104.useState(0), [scrollOffset, setScrollOffset] = import_react104.useState(0), [isSearchMode, setIsSearchMode] = import_react104.useState(!0), isTerminalFocused = useTerminalFocus(), {
    rows
  } = useTerminalSize(), paneCap = contentHeight ?? Math.min(Math.floor(rows * 0.8), 30), maxVisible = Math.max(5, paneCap - 10), mainLoopModel = useAppState((s2) => s2.mainLoopModel), verbose = useAppState((s_0) => s_0.verbose), thinkingEnabled = useAppState((s_1) => s_1.thinkingEnabled), isFastMode = useAppState((s_2) => isFastModeEnabled() ? s_2.fastMode : !1), promptSuggestionEnabled = useAppState((s_3) => s_3.promptSuggestionEnabled), showAutoInDefaultModePicker = !1, showDefaultViewPicker = (init_BriefTool(), __toCommonJS(exports_BriefTool)).isBriefEntitled(), setAppState = useSetAppState(), [changes, setChanges] = import_react104.useState({}), initialThinkingEnabled = React53.useRef(thinkingEnabled), [initialLocalSettings] = import_react104.useState(() => getSettingsForSource("localSettings")), [initialUserSettings] = import_react104.useState(() => getSettingsForSource("userSettings")), initialThemeSetting = React53.useRef(themeSetting), store = useAppStateStore(), [initialAppState] = import_react104.useState(() => {
    let s_4 = store.getState();
    return {
      mainLoopModel: s_4.mainLoopModel,
      mainLoopModelForSession: s_4.mainLoopModelForSession,
      verbose: s_4.verbose,
      thinkingEnabled: s_4.thinkingEnabled,
      fastMode: s_4.fastMode,
      promptSuggestionEnabled: s_4.promptSuggestionEnabled,
      isBriefOnly: s_4.isBriefOnly,
      replBridgeEnabled: s_4.replBridgeEnabled,
      replBridgeOutboundOnly: s_4.replBridgeOutboundOnly,
      settings: s_4.settings
    };
  }), [initialUserMsgOptIn] = import_react104.useState(() => getUserMsgOptIn()), isDirty2 = React53.useRef(!1), [showThinkingWarning, setShowThinkingWarning] = import_react104.useState(!1), [showSubmenu, setShowSubmenu] = import_react104.useState(null), {
    query: searchQuery,
    setQuery: setSearchQuery,
    cursorOffset: searchCursorOffset
  } = useSearchInput({
    isActive: isSearchMode && showSubmenu === null && !headerFocused,
    onExit: () => setIsSearchMode(!1),
    onExitUp: focusHeader,
    passthroughCtrlKeys: ["c", "d"]
  }), ownsEsc = isSearchMode && !headerFocused;
  React53.useEffect(() => {
    onIsSearchModeChange?.(ownsEsc);
  }, [ownsEsc, onIsSearchModeChange]);
  let isConnectedToIde = hasAccessToIDEExtensionDiffFeature(context6.options.mcpClients), isFileCheckpointingAvailable = !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING), memoryFiles = React53.use(getMemoryFiles(!0)), shouldShowExternalIncludesToggle = hasExternalClaudeMdIncludes(memoryFiles), autoUpdaterDisabledReason = getAutoUpdaterDisabledReason();
  function onChangeMainModelConfig(value) {
    logEvent("tengu_config_model_changed", {
      from_model: mainLoopModel,
      to_model: value
    }), setAppState((prev) => ({
      ...prev,
      mainLoopModel: value,
      mainLoopModelForSession: null
    })), setChanges((prev_0) => {
      let valStr = modelDisplayString(value) + (isBilledAsExtraUsage(value, !1, isOpus1mMergeEnabled()) ? " \xB7 Billed as extra usage" : "");
      if ("model" in prev_0) {
        let {
          model,
          ...rest
        } = prev_0;
        return {
          ...rest,
          model: valStr
        };
      }
      return {
        ...prev_0,
        model: valStr
      };
    });
  }
  function onChangeVerbose(value_0) {
    saveGlobalConfig((current) => ({
      ...current,
      verbose: value_0
    })), setGlobalConfig({
      ...getGlobalConfig(),
      verbose: value_0
    }), setAppState((prev_1) => ({
      ...prev_1,
      verbose: value_0
    })), setChanges((prev_2) => {
      if ("verbose" in prev_2) {
        let {
          verbose: verbose_0,
          ...rest_0
        } = prev_2;
        return rest_0;
      }
      return {
        ...prev_2,
        verbose: value_0
      };
    });
  }
  let settingsItems = [
    {
      id: "autoCompactEnabled",
      label: "Auto-compact",
      value: globalConfig2.autoCompactEnabled,
      type: "boolean",
      onChange(autoCompactEnabled) {
        saveGlobalConfig((current_0) => ({
          ...current_0,
          autoCompactEnabled
        })), setGlobalConfig({
          ...getGlobalConfig(),
          autoCompactEnabled
        }), logEvent("tengu_auto_compact_setting_changed", {
          enabled: autoCompactEnabled
        });
      }
    },
    {
      id: "spinnerTipsEnabled",
      label: "Show tips",
      value: settingsData?.spinnerTipsEnabled ?? !0,
      type: "boolean",
      onChange(spinnerTipsEnabled) {
        updateSettingsForSource("localSettings", {
          spinnerTipsEnabled
        }), setSettingsData((prev_3) => ({
          ...prev_3,
          spinnerTipsEnabled
        })), logEvent("tengu_tips_setting_changed", {
          enabled: spinnerTipsEnabled
        });
      }
    },
    {
      id: "prefersReducedMotion",
      label: "Reduce motion",
      value: settingsData?.prefersReducedMotion ?? !1,
      type: "boolean",
      onChange(prefersReducedMotion) {
        updateSettingsForSource("localSettings", {
          prefersReducedMotion
        }), setSettingsData((prev_4) => ({
          ...prev_4,
          prefersReducedMotion
        })), setAppState((prev_5) => ({
          ...prev_5,
          settings: {
            ...prev_5.settings,
            prefersReducedMotion
          }
        })), logEvent("tengu_reduce_motion_setting_changed", {
          enabled: prefersReducedMotion
        });
      }
    },
    {
      id: "thinkingEnabled",
      label: "Thinking mode",
      value: thinkingEnabled ?? !0,
      type: "boolean",
      onChange(enabled2) {
        setAppState((prev_6) => ({
          ...prev_6,
          thinkingEnabled: enabled2
        })), updateSettingsForSource("userSettings", {
          alwaysThinkingEnabled: enabled2 ? void 0 : !1
        }), logEvent("tengu_thinking_toggled", {
          enabled: enabled2
        });
      }
    },
    ...isFastModeEnabled() && isFastModeAvailable() ? [{
      id: "fastMode",
      label: `Fast mode (${FAST_MODE_MODEL_DISPLAY} only)`,
      value: !!isFastMode,
      type: "boolean",
      onChange(enabled_0) {
        if (clearFastModeCooldown(), updateSettingsForSource("userSettings", {
          fastMode: enabled_0 ? !0 : void 0
        }), enabled_0)
          setAppState((prev_7) => ({
            ...prev_7,
            mainLoopModel: getFastModeModel(),
            mainLoopModelForSession: null,
            fastMode: !0
          })), setChanges((prev_8) => ({
            ...prev_8,
            model: getFastModeModel(),
            "Fast mode": "ON"
          }));
        else
          setAppState((prev_9) => ({
            ...prev_9,
            fastMode: !1
          })), setChanges((prev_10) => ({
            ...prev_10,
            "Fast mode": "OFF"
          }));
      }
    }] : [],
    {
      id: "promptSuggestionEnabled",
      label: "Prompt suggestions",
      value: promptSuggestionEnabled,
      type: "boolean",
      onChange(enabled_1) {
        setAppState((prev_11) => ({
          ...prev_11,
          promptSuggestionEnabled: enabled_1
        })), updateSettingsForSource("userSettings", {
          promptSuggestionEnabled: enabled_1 ? void 0 : !1
        });
      }
    },
    ...isFileCheckpointingAvailable ? [{
      id: "fileCheckpointingEnabled",
      label: "Rewind code (checkpoints)",
      value: globalConfig2.fileCheckpointingEnabled,
      type: "boolean",
      onChange(enabled_3) {
        saveGlobalConfig((current_2) => ({
          ...current_2,
          fileCheckpointingEnabled: enabled_3
        })), setGlobalConfig({
          ...getGlobalConfig(),
          fileCheckpointingEnabled: enabled_3
        }), logEvent("tengu_file_history_snapshots_setting_changed", {
          enabled: enabled_3
        });
      }
    }] : [],
    {
      id: "verbose",
      label: "Verbose output",
      value: verbose,
      type: "boolean",
      onChange: onChangeVerbose
    },
    {
      id: "terminalProgressBarEnabled",
      label: "Terminal progress bar",
      value: globalConfig2.terminalProgressBarEnabled,
      type: "boolean",
      onChange(terminalProgressBarEnabled) {
        saveGlobalConfig((current_3) => ({
          ...current_3,
          terminalProgressBarEnabled
        })), setGlobalConfig({
          ...getGlobalConfig(),
          terminalProgressBarEnabled
        }), logEvent("tengu_terminal_progress_bar_setting_changed", {
          enabled: terminalProgressBarEnabled
        });
      }
    },
    {
      id: "showStatusInTerminalTab",
      label: "Show status in terminal tab",
      value: globalConfig2.showStatusInTerminalTab ?? !1,
      type: "boolean",
      onChange(showStatusInTerminalTab) {
        saveGlobalConfig((current_4) => ({
          ...current_4,
          showStatusInTerminalTab
        })), setGlobalConfig({
          ...getGlobalConfig(),
          showStatusInTerminalTab
        }), logEvent("tengu_terminal_tab_status_setting_changed", {
          enabled: showStatusInTerminalTab
        });
      }
    },
    {
      id: "showTurnDuration",
      label: "Show turn duration",
      value: globalConfig2.showTurnDuration,
      type: "boolean",
      onChange(showTurnDuration) {
        saveGlobalConfig((current_5) => ({
          ...current_5,
          showTurnDuration
        })), setGlobalConfig({
          ...getGlobalConfig(),
          showTurnDuration
        }), logEvent("tengu_show_turn_duration_setting_changed", {
          enabled: showTurnDuration
        });
      }
    },
    {
      id: "defaultPermissionMode",
      label: "Default permission mode",
      value: settingsData?.permissions?.defaultMode || "default",
      options: (() => {
        let priorityOrder = ["default", "plan"], allModes = EXTERNAL_PERMISSION_MODES, excluded = ["bypassPermissions"];
        return [...priorityOrder, ...allModes.filter((m4) => !priorityOrder.includes(m4) && !excluded.includes(m4))];
      })(),
      type: "enum",
      onChange(mode) {
        let parsedMode = permissionModeFromString(mode), validatedMode = isExternalPermissionMode(parsedMode) ? toExternalPermissionMode(parsedMode) : parsedMode, result = updateSettingsForSource("userSettings", {
          permissions: {
            ...settingsData?.permissions,
            defaultMode: validatedMode
          }
        });
        if (result.error) {
          logError2(result.error);
          return;
        }
        setSettingsData((prev_12) => ({
          ...prev_12,
          permissions: {
            ...prev_12?.permissions,
            defaultMode: validatedMode
          }
        })), setChanges((prev_13) => ({
          ...prev_13,
          defaultPermissionMode: mode
        })), logEvent("tengu_config_changed", {
          setting: "defaultPermissionMode",
          value: mode
        });
      }
    },
    {
      id: "respectGitignore",
      label: "Respect .gitignore in file picker",
      value: globalConfig2.respectGitignore,
      type: "boolean",
      onChange(respectGitignore) {
        saveGlobalConfig((current_6) => ({
          ...current_6,
          respectGitignore
        })), setGlobalConfig({
          ...getGlobalConfig(),
          respectGitignore
        }), logEvent("tengu_respect_gitignore_setting_changed", {
          enabled: respectGitignore
        });
      }
    },
    {
      id: "copyFullResponse",
      label: "Always copy full response (skip /copy picker)",
      value: globalConfig2.copyFullResponse,
      type: "boolean",
      onChange(copyFullResponse) {
        saveGlobalConfig((current_7) => ({
          ...current_7,
          copyFullResponse
        })), setGlobalConfig({
          ...getGlobalConfig(),
          copyFullResponse
        }), logEvent("tengu_config_changed", {
          setting: "copyFullResponse",
          value: String(copyFullResponse)
        });
      }
    },
    ...isFullscreenEnvEnabled() ? [{
      id: "copyOnSelect",
      label: "Copy on select",
      value: globalConfig2.copyOnSelect ?? !0,
      type: "boolean",
      onChange(copyOnSelect) {
        saveGlobalConfig((current_8) => ({
          ...current_8,
          copyOnSelect
        })), setGlobalConfig({
          ...getGlobalConfig(),
          copyOnSelect
        }), logEvent("tengu_config_changed", {
          setting: "copyOnSelect",
          value: String(copyOnSelect)
        });
      }
    }] : [],
    autoUpdaterDisabledReason ? {
      id: "autoUpdatesChannel",
      label: "Auto-update channel",
      value: "disabled",
      type: "managedEnum",
      onChange() {}
    } : {
      id: "autoUpdatesChannel",
      label: "Auto-update channel",
      value: settingsData?.autoUpdatesChannel ?? "latest",
      type: "managedEnum",
      onChange() {}
    },
    {
      id: "theme",
      label: "Theme",
      value: themeSetting,
      type: "managedEnum",
      onChange: setTheme
    },
    {
      id: "notifChannel",
      label: "Local notifications",
      value: globalConfig2.preferredNotifChannel,
      options: ["auto", "iterm2", "terminal_bell", "iterm2_with_bell", "kitty", "ghostty", "notifications_disabled"],
      type: "enum",
      onChange(notifChannel) {
        saveGlobalConfig((current_9) => ({
          ...current_9,
          preferredNotifChannel: notifChannel
        })), setGlobalConfig({
          ...getGlobalConfig(),
          preferredNotifChannel: notifChannel
        });
      }
    },
    {
      id: "taskCompleteNotifEnabled",
      label: "Push when idle",
      value: globalConfig2.taskCompleteNotifEnabled ?? !1,
      type: "boolean",
      onChange(taskCompleteNotifEnabled) {
        saveGlobalConfig((current_10) => ({
          ...current_10,
          taskCompleteNotifEnabled
        })), setGlobalConfig({
          ...getGlobalConfig(),
          taskCompleteNotifEnabled
        });
      }
    },
    {
      id: "inputNeededNotifEnabled",
      label: "Push when input needed",
      value: globalConfig2.inputNeededNotifEnabled ?? !1,
      type: "boolean",
      onChange(inputNeededNotifEnabled) {
        saveGlobalConfig((current_11) => ({
          ...current_11,
          inputNeededNotifEnabled
        })), setGlobalConfig({
          ...getGlobalConfig(),
          inputNeededNotifEnabled
        });
      }
    },
    {
      id: "agentPushNotifEnabled",
      label: "Push when Claude decides",
      value: globalConfig2.agentPushNotifEnabled ?? !1,
      type: "boolean",
      onChange(agentPushNotifEnabled) {
        saveGlobalConfig((current_12) => ({
          ...current_12,
          agentPushNotifEnabled
        })), setGlobalConfig({
          ...getGlobalConfig(),
          agentPushNotifEnabled
        });
      }
    },
    {
      id: "outputStyle",
      label: "Output style",
      value: currentOutputStyle,
      type: "managedEnum",
      onChange: () => {}
    },
    ...showDefaultViewPicker ? [{
      id: "defaultView",
      label: "What you see by default",
      value: settingsData?.defaultView === void 0 ? "default" : String(settingsData.defaultView),
      options: ["transcript", "chat", "default"],
      type: "enum",
      onChange(selected) {
        let defaultView = selected === "default" ? void 0 : selected;
        updateSettingsForSource("localSettings", {
          defaultView
        }), setSettingsData((prev_17) => ({
          ...prev_17,
          defaultView
        }));
        let nextBrief = defaultView === "chat";
        setAppState((prev_18) => {
          if (prev_18.isBriefOnly === nextBrief)
            return prev_18;
          return {
            ...prev_18,
            isBriefOnly: nextBrief
          };
        }), setUserMsgOptIn(nextBrief), setChanges((prev_19) => ({
          ...prev_19,
          "Default view": selected
        })), logEvent("tengu_default_view_setting_changed", {
          value: defaultView ?? "unset"
        });
      }
    }] : [],
    {
      id: "language",
      label: "Language",
      value: currentLanguage ?? "Default (English)",
      type: "managedEnum",
      onChange: () => {}
    },
    {
      id: "editorMode",
      label: "Editor mode",
      value: globalConfig2.editorMode === "emacs" ? "normal" : globalConfig2.editorMode || "normal",
      options: ["normal", "vim"],
      type: "enum",
      onChange(value_1) {
        saveGlobalConfig((current_13) => ({
          ...current_13,
          editorMode: value_1
        })), setGlobalConfig({
          ...getGlobalConfig(),
          editorMode: value_1
        }), logEvent("tengu_editor_mode_changed", {
          mode: value_1,
          source: "config_panel"
        });
      }
    },
    {
      id: "prStatusFooterEnabled",
      label: "Show PR status footer",
      value: globalConfig2.prStatusFooterEnabled ?? !0,
      type: "boolean",
      onChange(enabled_4) {
        saveGlobalConfig((current_14) => {
          if (current_14.prStatusFooterEnabled === enabled_4)
            return current_14;
          return {
            ...current_14,
            prStatusFooterEnabled: enabled_4
          };
        }), setGlobalConfig({
          ...getGlobalConfig(),
          prStatusFooterEnabled: enabled_4
        }), logEvent("tengu_pr_status_footer_setting_changed", {
          enabled: enabled_4
        });
      }
    },
    {
      id: "model",
      label: "Model",
      value: mainLoopModel === null ? "Default (recommended)" : mainLoopModel,
      type: "managedEnum",
      onChange: onChangeMainModelConfig
    },
    ...isConnectedToIde ? [{
      id: "diffTool",
      label: "Diff tool",
      value: globalConfig2.diffTool ?? "auto",
      options: ["terminal", "auto"],
      type: "enum",
      onChange(diffTool) {
        saveGlobalConfig((current_15) => ({
          ...current_15,
          diffTool
        })), setGlobalConfig({
          ...getGlobalConfig(),
          diffTool
        }), logEvent("tengu_diff_tool_changed", {
          tool: diffTool,
          source: "config_panel"
        });
      }
    }] : [],
    ...!isSupportedTerminal() ? [{
      id: "autoConnectIde",
      label: "Auto-connect to IDE (external terminal)",
      value: globalConfig2.autoConnectIde ?? !1,
      type: "boolean",
      onChange(autoConnectIde) {
        saveGlobalConfig((current_16) => ({
          ...current_16,
          autoConnectIde
        })), setGlobalConfig({
          ...getGlobalConfig(),
          autoConnectIde
        }), logEvent("tengu_auto_connect_ide_changed", {
          enabled: autoConnectIde,
          source: "config_panel"
        });
      }
    }] : [],
    ...isSupportedTerminal() ? [{
      id: "autoInstallIdeExtension",
      label: "Auto-install IDE extension",
      value: globalConfig2.autoInstallIdeExtension ?? !0,
      type: "boolean",
      onChange(autoInstallIdeExtension) {
        saveGlobalConfig((current_17) => ({
          ...current_17,
          autoInstallIdeExtension
        })), setGlobalConfig({
          ...getGlobalConfig(),
          autoInstallIdeExtension
        }), logEvent("tengu_auto_install_ide_extension_changed", {
          enabled: autoInstallIdeExtension,
          source: "config_panel"
        });
      }
    }] : [],
    {
      id: "claudeInChromeDefaultEnabled",
      label: "Claude in Chrome enabled by default",
      value: globalConfig2.claudeInChromeDefaultEnabled ?? !0,
      type: "boolean",
      onChange(enabled_5) {
        saveGlobalConfig((current_18) => ({
          ...current_18,
          claudeInChromeDefaultEnabled: enabled_5
        })), setGlobalConfig({
          ...getGlobalConfig(),
          claudeInChromeDefaultEnabled: enabled_5
        }), logEvent("tengu_claude_in_chrome_setting_changed", {
          enabled: enabled_5
        });
      }
    },
    ...isAgentSwarmsEnabled() ? (() => {
      let cliOverride = getCliTeammateModeOverride();
      return [{
        id: "teammateMode",
        label: cliOverride ? `Teammate mode [overridden: ${cliOverride}]` : "Teammate mode",
        value: globalConfig2.teammateMode ?? "auto",
        options: ["auto", "tmux", "in-process"],
        type: "enum",
        onChange(mode_0) {
          if (mode_0 !== "auto" && mode_0 !== "tmux" && mode_0 !== "in-process")
            return;
          clearCliTeammateModeOverride(mode_0), saveGlobalConfig((current_19) => ({
            ...current_19,
            teammateMode: mode_0
          })), setGlobalConfig({
            ...getGlobalConfig(),
            teammateMode: mode_0
          }), logEvent("tengu_teammate_mode_changed", {
            mode: mode_0
          });
        }
      }, {
        id: "teammateDefaultModel",
        label: "Default teammate model",
        value: teammateModelDisplayString(globalConfig2.teammateDefaultModel),
        type: "managedEnum",
        onChange() {}
      }];
    })() : [],
    ...shouldShowExternalIncludesToggle ? [{
      id: "showExternalIncludesDialog",
      label: "External CLAUDE.md includes",
      value: (() => {
        if (getCurrentProjectConfig().hasClaudeMdExternalIncludesApproved)
          return "true";
        else
          return "false";
      })(),
      type: "managedEnum",
      onChange() {}
    }] : [],
    ...process.env.ANTHROPIC_API_KEY && !isRunningOnHomespace() ? [{
      id: "apiKey",
      label: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
        children: [
          "Use custom API key:",
          " ",
          /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
            bold: !0,
            children: normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      searchText: "Use custom API key",
      value: Boolean(process.env.ANTHROPIC_API_KEY && globalConfig2.customApiKeyResponses?.approved?.includes(normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY))),
      type: "boolean",
      onChange(useCustomKey) {
        saveGlobalConfig((current_22) => {
          let updated = {
            ...current_22
          };
          if (!updated.customApiKeyResponses)
            updated.customApiKeyResponses = {
              approved: [],
              rejected: []
            };
          if (!updated.customApiKeyResponses.approved)
            updated.customApiKeyResponses = {
              ...updated.customApiKeyResponses,
              approved: []
            };
          if (!updated.customApiKeyResponses.rejected)
            updated.customApiKeyResponses = {
              ...updated.customApiKeyResponses,
              rejected: []
            };
          if (process.env.ANTHROPIC_API_KEY) {
            let truncatedKey = normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY);
            if (useCustomKey)
              updated.customApiKeyResponses = {
                ...updated.customApiKeyResponses,
                approved: [...(updated.customApiKeyResponses.approved ?? []).filter((k3) => k3 !== truncatedKey), truncatedKey],
                rejected: (updated.customApiKeyResponses.rejected ?? []).filter((k_0) => k_0 !== truncatedKey)
              };
            else
              updated.customApiKeyResponses = {
                ...updated.customApiKeyResponses,
                approved: (updated.customApiKeyResponses.approved ?? []).filter((k_1) => k_1 !== truncatedKey),
                rejected: [...(updated.customApiKeyResponses.rejected ?? []).filter((k_2) => k_2 !== truncatedKey), truncatedKey]
              };
          }
          return updated;
        }), setGlobalConfig(getGlobalConfig());
      }
    }] : []
  ], filteredSettingsItems = React53.useMemo(() => {
    if (!searchQuery)
      return settingsItems;
    let lowerQuery = searchQuery.toLowerCase();
    return settingsItems.filter((setting) => {
      if (setting.id.toLowerCase().includes(lowerQuery))
        return !0;
      return ("searchText" in setting ? setting.searchText : setting.label).toLowerCase().includes(lowerQuery);
    });
  }, [settingsItems, searchQuery]);
  React53.useEffect(() => {
    if (selectedIndex >= filteredSettingsItems.length) {
      let newIndex = Math.max(0, filteredSettingsItems.length - 1);
      setSelectedIndex(newIndex), setScrollOffset(Math.max(0, newIndex - maxVisible + 1));
      return;
    }
    setScrollOffset((prev_21) => {
      if (selectedIndex < prev_21)
        return selectedIndex;
      if (selectedIndex >= prev_21 + maxVisible)
        return selectedIndex - maxVisible + 1;
      return prev_21;
    });
  }, [filteredSettingsItems.length, selectedIndex, maxVisible]);
  let adjustScrollOffset = import_react104.useCallback((newIndex_0) => {
    setScrollOffset((prev_22) => {
      if (newIndex_0 < prev_22)
        return newIndex_0;
      if (newIndex_0 >= prev_22 + maxVisible)
        return newIndex_0 - maxVisible + 1;
      return prev_22;
    });
  }, [maxVisible]), handleSaveAndClose = import_react104.useCallback(() => {
    if (showSubmenu !== null)
      return;
    let formattedChanges = Object.entries(changes).map(([key3, value_2]) => {
      return logEvent("tengu_config_changed", {
        key: key3,
        value: value_2
      }), `Set ${key3} to ${source_default.bold(value_2)}`;
    }), effectiveApiKey = isRunningOnHomespace() ? void 0 : process.env.ANTHROPIC_API_KEY, initialUsingCustomKey = Boolean(effectiveApiKey && initialConfig.current.customApiKeyResponses?.approved?.includes(normalizeApiKeyForConfig(effectiveApiKey))), currentUsingCustomKey = Boolean(effectiveApiKey && globalConfig2.customApiKeyResponses?.approved?.includes(normalizeApiKeyForConfig(effectiveApiKey)));
    if (initialUsingCustomKey !== currentUsingCustomKey)
      formattedChanges.push(`${currentUsingCustomKey ? "Enabled" : "Disabled"} custom API key`), logEvent("tengu_config_changed", {
        key: "env.ANTHROPIC_API_KEY",
        value: currentUsingCustomKey
      });
    if (globalConfig2.theme !== initialConfig.current.theme)
      formattedChanges.push(`Set theme to ${source_default.bold(globalConfig2.theme)}`);
    if (globalConfig2.preferredNotifChannel !== initialConfig.current.preferredNotifChannel)
      formattedChanges.push(`Set notifications to ${source_default.bold(globalConfig2.preferredNotifChannel)}`);
    if (currentOutputStyle !== initialOutputStyle.current)
      formattedChanges.push(`Set output style to ${source_default.bold(currentOutputStyle)}`);
    if (currentLanguage !== initialLanguage.current)
      formattedChanges.push(`Set response language to ${source_default.bold(currentLanguage ?? "Default (English)")}`);
    if (globalConfig2.editorMode !== initialConfig.current.editorMode)
      formattedChanges.push(`Set editor mode to ${source_default.bold(globalConfig2.editorMode || "emacs")}`);
    if (globalConfig2.diffTool !== initialConfig.current.diffTool)
      formattedChanges.push(`Set diff tool to ${source_default.bold(globalConfig2.diffTool)}`);
    if (globalConfig2.autoConnectIde !== initialConfig.current.autoConnectIde)
      formattedChanges.push(`${globalConfig2.autoConnectIde ? "Enabled" : "Disabled"} auto-connect to IDE`);
    if (globalConfig2.autoInstallIdeExtension !== initialConfig.current.autoInstallIdeExtension)
      formattedChanges.push(`${globalConfig2.autoInstallIdeExtension ? "Enabled" : "Disabled"} auto-install IDE extension`);
    if (globalConfig2.autoCompactEnabled !== initialConfig.current.autoCompactEnabled)
      formattedChanges.push(`${globalConfig2.autoCompactEnabled ? "Enabled" : "Disabled"} auto-compact`);
    if (globalConfig2.respectGitignore !== initialConfig.current.respectGitignore)
      formattedChanges.push(`${globalConfig2.respectGitignore ? "Enabled" : "Disabled"} respect .gitignore in file picker`);
    if (globalConfig2.copyFullResponse !== initialConfig.current.copyFullResponse)
      formattedChanges.push(`${globalConfig2.copyFullResponse ? "Enabled" : "Disabled"} always copy full response`);
    if (globalConfig2.copyOnSelect !== initialConfig.current.copyOnSelect)
      formattedChanges.push(`${globalConfig2.copyOnSelect ? "Enabled" : "Disabled"} copy on select`);
    if (globalConfig2.terminalProgressBarEnabled !== initialConfig.current.terminalProgressBarEnabled)
      formattedChanges.push(`${globalConfig2.terminalProgressBarEnabled ? "Enabled" : "Disabled"} terminal progress bar`);
    if (globalConfig2.showStatusInTerminalTab !== initialConfig.current.showStatusInTerminalTab)
      formattedChanges.push(`${globalConfig2.showStatusInTerminalTab ? "Enabled" : "Disabled"} terminal tab status`);
    if (globalConfig2.showTurnDuration !== initialConfig.current.showTurnDuration)
      formattedChanges.push(`${globalConfig2.showTurnDuration ? "Enabled" : "Disabled"} turn duration`);
    if (globalConfig2.remoteControlAtStartup !== initialConfig.current.remoteControlAtStartup) {
      let remoteLabel = globalConfig2.remoteControlAtStartup === void 0 ? "Reset Remote Control to default" : `${globalConfig2.remoteControlAtStartup ? "Enabled" : "Disabled"} Remote Control for all sessions`;
      formattedChanges.push(remoteLabel);
    }
    if (settingsData?.autoUpdatesChannel !== initialSettingsData.current?.autoUpdatesChannel)
      formattedChanges.push(`Set auto-update channel to ${source_default.bold(settingsData?.autoUpdatesChannel ?? "latest")}`);
    if (formattedChanges.length > 0)
      onClose(formattedChanges.join(`
`));
    else
      onClose("Config dialog dismissed", {
        display: "system"
      });
  }, [showSubmenu, changes, globalConfig2, mainLoopModel, currentOutputStyle, currentLanguage, settingsData?.autoUpdatesChannel, isFastModeEnabled() ? settingsData?.fastMode : void 0, onClose]), revertChanges = import_react104.useCallback(() => {
    if (themeSetting !== initialThemeSetting.current)
      setTheme(initialThemeSetting.current);
    saveGlobalConfig(() => initialConfig.current);
    let il = initialLocalSettings;
    updateSettingsForSource("localSettings", {
      spinnerTipsEnabled: il?.spinnerTipsEnabled,
      prefersReducedMotion: il?.prefersReducedMotion,
      defaultView: il?.defaultView,
      outputStyle: il?.outputStyle
    });
    let iu = initialUserSettings;
    updateSettingsForSource("userSettings", {
      alwaysThinkingEnabled: iu?.alwaysThinkingEnabled,
      fastMode: iu?.fastMode,
      promptSuggestionEnabled: iu?.promptSuggestionEnabled,
      autoUpdatesChannel: iu?.autoUpdatesChannel,
      minimumVersion: iu?.minimumVersion,
      language: iu?.language,
      ...{},
      syntaxHighlightingDisabled: iu?.syntaxHighlightingDisabled,
      permissions: iu?.permissions === void 0 ? void 0 : {
        ...iu.permissions,
        defaultMode: iu.permissions.defaultMode
      }
    });
    let ia = initialAppState;
    if (setAppState((prev_23) => ({
      ...prev_23,
      mainLoopModel: ia.mainLoopModel,
      mainLoopModelForSession: ia.mainLoopModelForSession,
      verbose: ia.verbose,
      thinkingEnabled: ia.thinkingEnabled,
      fastMode: ia.fastMode,
      promptSuggestionEnabled: ia.promptSuggestionEnabled,
      isBriefOnly: ia.isBriefOnly,
      replBridgeEnabled: ia.replBridgeEnabled,
      replBridgeOutboundOnly: ia.replBridgeOutboundOnly,
      settings: ia.settings,
      toolPermissionContext: transitionPlanAutoMode(prev_23.toolPermissionContext)
    })), getUserMsgOptIn() !== initialUserMsgOptIn)
      setUserMsgOptIn(initialUserMsgOptIn);
  }, [themeSetting, setTheme, initialLocalSettings, initialUserSettings, initialAppState, initialUserMsgOptIn, setAppState]), handleEscape = import_react104.useCallback(() => {
    if (showSubmenu !== null)
      return;
    if (isDirty2.current)
      revertChanges();
    onClose("Config dialog dismissed", {
      display: "system"
    });
  }, [showSubmenu, revertChanges, onClose]);
  useKeybinding("confirm:no", handleEscape, {
    context: "Settings",
    isActive: showSubmenu === null && !isSearchMode && !headerFocused
  }), useKeybinding("settings:close", handleSaveAndClose, {
    context: "Settings",
    isActive: showSubmenu === null && !isSearchMode && !headerFocused
  });
  let toggleSetting = import_react104.useCallback(() => {
    let setting_0 = filteredSettingsItems[selectedIndex];
    if (!setting_0 || !setting_0.onChange)
      return;
    if (setting_0.type === "boolean") {
      if (isDirty2.current = !0, setting_0.onChange(!setting_0.value), setting_0.id === "thinkingEnabled") {
        if (!setting_0.value === initialThinkingEnabled.current)
          setShowThinkingWarning(!1);
        else if (context6.messages.some((m_0) => m_0.type === "assistant"))
          setShowThinkingWarning(!0);
      }
      return;
    }
    if (setting_0.id === "theme" || setting_0.id === "model" || setting_0.id === "teammateDefaultModel" || setting_0.id === "showExternalIncludesDialog" || setting_0.id === "outputStyle" || setting_0.id === "language")
      switch (setting_0.id) {
        case "theme":
          setShowSubmenu("Theme"), setTabsHidden(!0);
          return;
        case "model":
          setShowSubmenu("Model"), setTabsHidden(!0);
          return;
        case "teammateDefaultModel":
          setShowSubmenu("TeammateModel"), setTabsHidden(!0);
          return;
        case "showExternalIncludesDialog":
          setShowSubmenu("ExternalIncludes"), setTabsHidden(!0);
          return;
        case "outputStyle":
          setShowSubmenu("OutputStyle"), setTabsHidden(!0);
          return;
        case "language":
          setShowSubmenu("Language"), setTabsHidden(!0);
          return;
      }
    if (setting_0.id === "autoUpdatesChannel") {
      if (autoUpdaterDisabledReason) {
        setShowSubmenu("EnableAutoUpdates"), setTabsHidden(!0);
        return;
      }
      if ((settingsData?.autoUpdatesChannel ?? "latest") === "latest")
        setShowSubmenu("ChannelDowngrade"), setTabsHidden(!0);
      else
        isDirty2.current = !0, updateSettingsForSource("userSettings", {
          autoUpdatesChannel: "latest",
          minimumVersion: void 0
        }), setSettingsData((prev_24) => ({
          ...prev_24,
          autoUpdatesChannel: "latest",
          minimumVersion: void 0
        })), logEvent("tengu_autoupdate_channel_changed", {
          channel: "latest"
        });
      return;
    }
    if (setting_0.type === "enum") {
      isDirty2.current = !0;
      let nextIndex = (setting_0.options.indexOf(setting_0.value) + 1) % setting_0.options.length;
      setting_0.onChange(setting_0.options[nextIndex]);
      return;
    }
  }, [autoUpdaterDisabledReason, filteredSettingsItems, selectedIndex, settingsData?.autoUpdatesChannel, setTabsHidden]), moveSelection = (delta) => {
    setShowThinkingWarning(!1);
    let newIndex_1 = Math.max(0, Math.min(filteredSettingsItems.length - 1, selectedIndex + delta));
    setSelectedIndex(newIndex_1), adjustScrollOffset(newIndex_1);
  };
  useKeybindings({
    "select:previous": () => {
      if (selectedIndex === 0)
        setShowThinkingWarning(!1), setIsSearchMode(!0), setScrollOffset(0);
      else
        moveSelection(-1);
    },
    "select:next": () => moveSelection(1),
    "scroll:lineUp": () => moveSelection(-1),
    "scroll:lineDown": () => moveSelection(1),
    "select:accept": toggleSetting,
    "settings:search": () => {
      setIsSearchMode(!0), setSearchQuery("");
    }
  }, {
    context: "Settings",
    isActive: showSubmenu === null && !isSearchMode && !headerFocused
  });
  let handleKeyDown = import_react104.useCallback((e) => {
    if (showSubmenu !== null)
      return;
    if (headerFocused)
      return;
    if (isSearchMode) {
      if (e.key === "escape") {
        if (e.preventDefault(), searchQuery.length > 0)
          setSearchQuery("");
        else
          setIsSearchMode(!1);
        return;
      }
      if (e.key === "return" || e.key === "down" || e.key === "wheeldown")
        e.preventDefault(), setIsSearchMode(!1), setSelectedIndex(0), setScrollOffset(0);
      return;
    }
    if (e.key === "left" || e.key === "right" || e.key === "tab") {
      e.preventDefault(), toggleSetting();
      return;
    }
    if (e.ctrl || e.meta)
      return;
    if (e.key === "j" || e.key === "k" || e.key === "/")
      return;
    if (e.key.length === 1 && e.key !== " ")
      e.preventDefault(), setIsSearchMode(!0), setSearchQuery(e.key);
  }, [showSubmenu, headerFocused, isSearchMode, searchQuery, setSearchQuery, toggleSetting]);
  return /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    width: "100%",
    tabIndex: 0,
    autoFocus: !0,
    onKeyDown: handleKeyDown,
    children: showSubmenu === "Theme" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemePicker, {
          onThemeSelect: (setting_1) => {
            isDirty2.current = !0, setTheme(setting_1), setShowSubmenu(null), setTabsHidden(!1);
          },
          onCancel: () => {
            setShowSubmenu(null), setTabsHidden(!1);
          },
          hideEscToCancel: !0,
          skipExitHandling: !0
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                  shortcut: "Enter",
                  action: "select"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                  action: "confirm:no",
                  context: "Confirmation",
                  fallback: "Esc",
                  description: "cancel"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : showSubmenu === "Model" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ModelPicker, {
          initial: mainLoopModel,
          onSelect: (model_0, _effort) => {
            isDirty2.current = !0, onChangeMainModelConfig(model_0), setShowSubmenu(null), setTabsHidden(!1);
          },
          onCancel: () => {
            setShowSubmenu(null), setTabsHidden(!1);
          },
          showFastModeNotice: isFastModeEnabled() ? isFastMode && isFastModeSupportedByModel(mainLoopModel) && isFastModeAvailable() : !1
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "confirm"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : showSubmenu === "TeammateModel" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ModelPicker, {
          initial: globalConfig2.teammateDefaultModel ?? null,
          skipSettingsWrite: !0,
          headerText: "Default model for newly spawned teammates. The leader can override via the tool call's model parameter.",
          onSelect: (model_1, _effort_0) => {
            if (setShowSubmenu(null), setTabsHidden(!1), globalConfig2.teammateDefaultModel === void 0 && model_1 === null)
              return;
            isDirty2.current = !0, saveGlobalConfig((current_23) => current_23.teammateDefaultModel === model_1 ? current_23 : {
              ...current_23,
              teammateDefaultModel: model_1
            }), setGlobalConfig({
              ...getGlobalConfig(),
              teammateDefaultModel: model_1
            }), setChanges((prev_25) => ({
              ...prev_25,
              teammateDefaultModel: teammateModelDisplayString(model_1)
            })), logEvent("tengu_teammate_default_model_changed", {
              model: model_1
            });
          },
          onCancel: () => {
            setShowSubmenu(null), setTabsHidden(!1);
          }
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "confirm"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : showSubmenu === "ExternalIncludes" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ClaudeMdExternalIncludesDialog, {
          onDone: () => {
            setShowSubmenu(null), setTabsHidden(!1);
          },
          externalIncludes: getExternalClaudeMdIncludes(memoryFiles)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "confirm"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "disable external includes"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : showSubmenu === "OutputStyle" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(OutputStylePicker, {
          initialStyle: currentOutputStyle,
          onComplete: (style) => {
            isDirty2.current = !0, setCurrentOutputStyle(style ?? DEFAULT_OUTPUT_STYLE_NAME), setShowSubmenu(null), setTabsHidden(!1), updateSettingsForSource("localSettings", {
              outputStyle: style
            }), logEvent("tengu_output_style_changed", {
              style: style ?? DEFAULT_OUTPUT_STYLE_NAME,
              source: "config_panel",
              settings_source: "localSettings"
            });
          },
          onCancel: () => {
            setShowSubmenu(null), setTabsHidden(!1);
          }
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "confirm"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : showSubmenu === "Language" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(LanguagePicker, {
          initialLanguage: currentLanguage,
          onComplete: (language) => {
            isDirty2.current = !0, setCurrentLanguage(language), setShowSubmenu(null), setTabsHidden(!1), updateSettingsForSource("userSettings", {
              language
            }), logEvent("tengu_language_changed", {
              language: language ?? "default",
              source: "config_panel"
            });
          },
          onCancel: () => {
            setShowSubmenu(null), setTabsHidden(!1);
          }
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "confirm"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Settings",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : showSubmenu === "EnableAutoUpdates" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Dialog, {
      title: "Enable Auto-Updates",
      onCancel: () => {
        setShowSubmenu(null), setTabsHidden(!1);
      },
      hideBorder: !0,
      hideInputGuide: !0,
      children: autoUpdaterDisabledReason?.type !== "config" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
            children: autoUpdaterDisabledReason?.type === "env" ? "Auto-updates are controlled by an environment variable and cannot be changed here." : "Auto-updates are disabled in development builds."
          }, void 0, !1, void 0, this),
          autoUpdaterDisabledReason?.type === "env" && /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Unset ",
              autoUpdaterDisabledReason.envVar,
              " to re-enable auto-updates."
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Select, {
        options: [{
          label: "Enable with latest channel",
          value: "latest"
        }, {
          label: "Enable with stable channel",
          value: "stable"
        }],
        onChange: (channel) => {
          isDirty2.current = !0, setShowSubmenu(null), setTabsHidden(!1), saveGlobalConfig((current_24) => ({
            ...current_24,
            autoUpdates: !0
          })), setGlobalConfig({
            ...getGlobalConfig(),
            autoUpdates: !0
          }), updateSettingsForSource("userSettings", {
            autoUpdatesChannel: channel,
            minimumVersion: void 0
          }), setSettingsData((prev_26) => ({
            ...prev_26,
            autoUpdatesChannel: channel,
            minimumVersion: void 0
          })), logEvent("tengu_autoupdate_enabled", {
            channel
          });
        }
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : showSubmenu === "ChannelDowngrade" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ChannelDowngradeDialog, {
      currentVersion: "2.1.90",
      onChoice: (choice) => {
        if (setShowSubmenu(null), setTabsHidden(!1), choice === "cancel")
          return;
        isDirty2.current = !0;
        let newSettings = {
          autoUpdatesChannel: "stable"
        };
        if (choice === "stay")
          newSettings.minimumVersion = "2.1.90";
        updateSettingsForSource("userSettings", newSettings), setSettingsData((prev_27) => ({
          ...prev_27,
          ...newSettings
        })), logEvent("tengu_autoupdate_channel_changed", {
          channel: "stable",
          minimum_version_set: choice === "stay"
        });
      }
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      marginY: insideModal ? void 0 : 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(SearchBox, {
          query: searchQuery,
          isFocused: isSearchMode && !headerFocused,
          isTerminalFocused,
          cursorOffset: searchCursorOffset,
          placeholder: "Search settings\u2026"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: filteredSettingsItems.length === 0 ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: [
              'No settings match "',
              searchQuery,
              '"'
            ]
          }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
            children: [
              scrollOffset > 0 && /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  figures_default.arrowUp,
                  " ",
                  scrollOffset,
                  " more above"
                ]
              }, void 0, !0, void 0, this),
              filteredSettingsItems.slice(scrollOffset, scrollOffset + maxVisible).map((setting_2, i5) => {
                let isSelected = scrollOffset + i5 === selectedIndex && !headerFocused && !isSearchMode;
                return /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(React53.Fragment, {
                  children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedBox_default, {
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedBox_default, {
                        width: 44,
                        children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                          color: isSelected ? "suggestion" : void 0,
                          children: [
                            isSelected ? figures_default.pointer : " ",
                            " ",
                            setting_2.label
                          ]
                        }, void 0, !0, void 0, this)
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedBox_default, {
                        children: setting_2.type === "boolean" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(jsx_dev_runtime179.Fragment, {
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                              color: isSelected ? "suggestion" : void 0,
                              children: setting_2.value.toString()
                            }, void 0, !1, void 0, this),
                            showThinkingWarning && setting_2.id === "thinkingEnabled" && /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                              color: "warning",
                              children: [
                                " ",
                                "Changing thinking mode mid-conversation will increase latency and may reduce quality."
                              ]
                            }, void 0, !0, void 0, this)
                          ]
                        }, void 0, !0, void 0, this) : setting_2.id === "theme" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                          color: isSelected ? "suggestion" : void 0,
                          children: THEME_LABELS[setting_2.value.toString()] ?? setting_2.value.toString()
                        }, void 0, !1, void 0, this) : setting_2.id === "notifChannel" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                          color: isSelected ? "suggestion" : void 0,
                          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(NotifChannelLabel, {
                            value: setting_2.value.toString()
                          }, void 0, !1, void 0, this)
                        }, void 0, !1, void 0, this) : setting_2.id === "defaultPermissionMode" ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                          color: isSelected ? "suggestion" : void 0,
                          children: permissionModeTitle(setting_2.value)
                        }, void 0, !1, void 0, this) : setting_2.id === "autoUpdatesChannel" && autoUpdaterDisabledReason ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedBox_default, {
                          flexDirection: "column",
                          children: [
                            /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                              color: isSelected ? "suggestion" : void 0,
                              children: "disabled"
                            }, void 0, !1, void 0, this),
                            /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                              dimColor: !0,
                              children: [
                                "(",
                                formatAutoUpdaterDisabledReason(autoUpdaterDisabledReason),
                                ")"
                              ]
                            }, void 0, !0, void 0, this)
                          ]
                        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                          color: isSelected ? "suggestion" : void 0,
                          children: setting_2.value.toString()
                        }, void 0, !1, void 0, this)
                      }, isSelected ? "selected" : "unselected", !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this)
                }, setting_2.id, !1, void 0, this);
              }),
              scrollOffset + maxVisible < filteredSettingsItems.length && /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  figures_default.arrowDown,
                  " ",
                  filteredSettingsItems.length - scrollOffset - maxVisible,
                  " ",
                  "more below"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        headerFocused ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "\u2190/\u2192 tab",
                action: "switch"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "\u2193",
                action: "return"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Settings",
                fallback: "Esc",
                description: "close"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this) : isSearchMode ? /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
                children: "Type to filter"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter/\u2193",
                action: "select"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(KeyboardShortcutHint, {
                shortcut: "\u2191",
                action: "tabs"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Settings",
                fallback: "Esc",
                description: "clear"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "select:accept",
                context: "Settings",
                fallback: "Space",
                description: "change"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "settings:close",
                context: "Settings",
                fallback: "Enter",
                description: "save"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "settings:search",
                context: "Settings",
                fallback: "/",
                description: "search"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime179.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Settings",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
