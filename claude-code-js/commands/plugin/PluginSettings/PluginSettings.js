// function: PluginSettings
function PluginSettings(t0) {
  let $3 = import_compiler_runtime193.c(75), {
    onComplete,
    args,
    showMcpRedirectMessage
  } = t0, parsedCommand, t1;
  if ($3[0] !== args)
    parsedCommand = parsePluginArgs(args), t1 = getInitialViewState(parsedCommand), $3[0] = args, $3[1] = parsedCommand, $3[2] = t1;
  else
    parsedCommand = $3[1], t1 = $3[2];
  let initialViewState = t1, [viewState, setViewState] = import_react139.useState(initialViewState), t2;
  if ($3[3] !== initialViewState)
    t2 = getInitialTab(initialViewState), $3[3] = initialViewState, $3[4] = t2;
  else
    t2 = $3[4];
  let [activeTab, setActiveTab] = import_react139.useState(t2), [inputValue, setInputValue] = import_react139.useState(viewState.type === "add-marketplace" ? viewState.initialValue || "" : ""), [cursorOffset, setCursorOffset] = import_react139.useState(0), [error44, setError] = import_react139.useState(null), [result, setResult] = import_react139.useState(null), [childSearchActive, setChildSearchActive] = import_react139.useState(!1), setAppState = useSetAppState(), pluginErrorCount = useAppState(_temp03), errorsTabTitle = pluginErrorCount > 0 ? `Errors (${pluginErrorCount})` : "Errors", exitState = useExitOnCtrlCDWithKeybindings(), cliMode = parsedCommand.type === "marketplace" && parsedCommand.action === "add" && parsedCommand.target !== void 0, t3;
  if ($3[5] !== setAppState)
    t3 = () => {
      setAppState(_temp113);
    }, $3[5] = setAppState, $3[6] = t3;
  else
    t3 = $3[6];
  let markPluginsChanged = t3, t4;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t4 = (tabId) => {
      let tab = tabId;
      setActiveTab(tab), setError(null);
      bb37:
        switch (tab) {
          case "discover": {
            setViewState({
              type: "discover-plugins"
            });
            break bb37;
          }
          case "installed": {
            setViewState({
              type: "manage-plugins"
            });
            break bb37;
          }
          case "marketplaces": {
            setViewState({
              type: "manage-marketplaces"
            });
            break bb37;
          }
          case "errors":
        }
    }, $3[7] = t4;
  else
    t4 = $3[7];
  let handleTabChange = t4, t5, t6;
  if ($3[8] !== onComplete || $3[9] !== result || $3[10] !== viewState.type)
    t5 = () => {
      if (viewState.type === "menu" && !result)
        onComplete();
    }, t6 = [viewState.type, result, onComplete], $3[8] = onComplete, $3[9] = result, $3[10] = viewState.type, $3[11] = t5, $3[12] = t6;
  else
    t5 = $3[11], t6 = $3[12];
  import_react139.useEffect(t5, t6);
  let t7, t8;
  if ($3[13] !== activeTab || $3[14] !== viewState.type)
    t7 = () => {
      if (viewState.type === "browse-marketplace" && activeTab !== "discover")
        setActiveTab("discover");
    }, t8 = [viewState.type, activeTab], $3[13] = activeTab, $3[14] = viewState.type, $3[15] = t7, $3[16] = t8;
  else
    t7 = $3[15], t8 = $3[16];
  import_react139.useEffect(t7, t8);
  let t9;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t9 = () => {
      setActiveTab("marketplaces"), setViewState({
        type: "manage-marketplaces"
      }), setInputValue(""), setError(null);
    }, $3[17] = t9;
  else
    t9 = $3[17];
  let handleAddMarketplaceEscape = t9, t10 = viewState.type === "add-marketplace", t11;
  if ($3[18] !== t10)
    t11 = {
      context: "Settings",
      isActive: t10
    }, $3[18] = t10, $3[19] = t11;
  else
    t11 = $3[19];
  useKeybinding("confirm:no", handleAddMarketplaceEscape, t11);
  let t12, t13;
  if ($3[20] !== onComplete || $3[21] !== result)
    t12 = () => {
      if (result)
        onComplete(result);
    }, t13 = [result, onComplete], $3[20] = onComplete, $3[21] = result, $3[22] = t12, $3[23] = t13;
  else
    t12 = $3[22], t13 = $3[23];
  import_react139.useEffect(t12, t13);
  let t14, t15;
  if ($3[24] !== onComplete || $3[25] !== viewState.type)
    t14 = () => {
      if (viewState.type === "help")
        onComplete();
    }, t15 = [viewState.type, onComplete], $3[24] = onComplete, $3[25] = viewState.type, $3[26] = t14, $3[27] = t15;
  else
    t14 = $3[26], t15 = $3[27];
  if (import_react139.useEffect(t14, t15), viewState.type === "help") {
    let t162;
    if ($3[28] === Symbol.for("react.memo_cache_sentinel"))
      t162 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            bold: !0,
            children: "Plugin Command Usage:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Installation:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin install - Browse and install plugins"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: [
              " ",
              "/plugin install <marketplace> - Install from specific marketplace"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin install <plugin> - Install specific plugin"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: [
              " ",
              "/plugin install <plugin>@<market> - Install plugin from marketplace"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Management:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin manage - Manage installed plugins"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin enable <plugin> - Enable a plugin"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin disable <plugin> - Disable a plugin"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin uninstall <plugin> - Uninstall a plugin"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Marketplaces:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin marketplace - Marketplace management menu"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin marketplace add - Add a marketplace"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: [
              " ",
              "/plugin marketplace add <path/url> - Add marketplace directly"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin marketplace update - Update marketplaces"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: [
              " ",
              "/plugin marketplace update <name> - Update specific marketplace"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin marketplace remove - Remove a marketplace"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: [
              " ",
              "/plugin marketplace remove <name> - Remove specific marketplace"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin marketplace list - List all marketplaces"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Validation:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: [
              " ",
              "/plugin validate <path> - Validate a manifest file or directory"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Other:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin - Main plugin menu"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugin help - Show this help"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: " /plugins - Alias for /plugin"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[28] = t162;
    else
      t162 = $3[28];
    return t162;
  }
  if (viewState.type === "validate") {
    let t162;
    if ($3[29] !== onComplete || $3[30] !== viewState.path)
      t162 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ValidatePlugin, {
        onComplete,
        path: viewState.path
      }, void 0, !1, void 0, this), $3[29] = onComplete, $3[30] = viewState.path, $3[31] = t162;
    else
      t162 = $3[31];
    return t162;
  }
  if (viewState.type === "marketplace-menu")
    return setViewState({
      type: "menu"
    }), null;
  if (viewState.type === "marketplace-list") {
    let t162;
    if ($3[32] !== onComplete)
      t162 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(MarketplaceList, {
        onComplete
      }, void 0, !1, void 0, this), $3[32] = onComplete, $3[33] = t162;
    else
      t162 = $3[33];
    return t162;
  }
  if (viewState.type === "add-marketplace") {
    let t162;
    if ($3[34] !== cliMode || $3[35] !== cursorOffset || $3[36] !== error44 || $3[37] !== inputValue || $3[38] !== markPluginsChanged || $3[39] !== result)
      t162 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(AddMarketplace, {
        inputValue,
        setInputValue,
        cursorOffset,
        setCursorOffset,
        error: error44,
        setError,
        result,
        setResult,
        setViewState,
        onAddComplete: markPluginsChanged,
        cliMode
      }, void 0, !1, void 0, this), $3[34] = cliMode, $3[35] = cursorOffset, $3[36] = error44, $3[37] = inputValue, $3[38] = markPluginsChanged, $3[39] = result, $3[40] = t162;
    else
      t162 = $3[40];
    return t162;
  }
  let t16;
  if ($3[41] !== activeTab || $3[42] !== showMcpRedirectMessage)
    t16 = showMcpRedirectMessage && activeTab === "installed" ? /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(McpRedirectBanner, {}, void 0, !1, void 0, this) : void 0, $3[41] = activeTab, $3[42] = showMcpRedirectMessage, $3[43] = t16;
  else
    t16 = $3[43];
  let t17;
  if ($3[44] !== error44 || $3[45] !== markPluginsChanged || $3[46] !== result || $3[47] !== viewState.targetMarketplace || $3[48] !== viewState.targetPlugin || $3[49] !== viewState.type)
    t17 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(Tab, {
      id: "discover",
      title: "Discover",
      children: viewState.type === "browse-marketplace" ? /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(BrowseMarketplace, {
        error: error44,
        setError,
        result,
        setResult,
        setViewState,
        onInstallComplete: markPluginsChanged,
        targetMarketplace: viewState.targetMarketplace,
        targetPlugin: viewState.targetPlugin
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(DiscoverPlugins, {
        error: error44,
        setError,
        result,
        setResult,
        setViewState,
        onInstallComplete: markPluginsChanged,
        onSearchModeChange: setChildSearchActive,
        targetPlugin: viewState.type === "discover-plugins" ? viewState.targetPlugin : void 0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[44] = error44, $3[45] = markPluginsChanged, $3[46] = result, $3[47] = viewState.targetMarketplace, $3[48] = viewState.targetPlugin, $3[49] = viewState.type, $3[50] = t17;
  else
    t17 = $3[50];
  let t18 = viewState.type === "manage-plugins" ? viewState.targetPlugin : void 0, t19 = viewState.type === "manage-plugins" ? viewState.targetMarketplace : void 0, t20 = viewState.type === "manage-plugins" ? viewState.action : void 0, t21;
  if ($3[51] !== markPluginsChanged || $3[52] !== t18 || $3[53] !== t19 || $3[54] !== t20)
    t21 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(Tab, {
      id: "installed",
      title: "Installed",
      children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ManagePlugins, {
        setViewState,
        setResult,
        onManageComplete: markPluginsChanged,
        onSearchModeChange: setChildSearchActive,
        targetPlugin: t18,
        targetMarketplace: t19,
        action: t20
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[51] = markPluginsChanged, $3[52] = t18, $3[53] = t19, $3[54] = t20, $3[55] = t21;
  else
    t21 = $3[55];
  let t22 = viewState.type === "manage-marketplaces" ? viewState.targetMarketplace : void 0, t23 = viewState.type === "manage-marketplaces" ? viewState.action : void 0, t24;
  if ($3[56] !== error44 || $3[57] !== exitState || $3[58] !== markPluginsChanged || $3[59] !== t22 || $3[60] !== t23)
    t24 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(Tab, {
      id: "marketplaces",
      title: "Marketplaces",
      children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ManageMarketplaces, {
        setViewState,
        error: error44,
        setError,
        setResult,
        exitState,
        onManageComplete: markPluginsChanged,
        targetMarketplace: t22,
        action: t23
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[56] = error44, $3[57] = exitState, $3[58] = markPluginsChanged, $3[59] = t22, $3[60] = t23, $3[61] = t24;
  else
    t24 = $3[61];
  let t25;
  if ($3[62] !== markPluginsChanged)
    t25 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ErrorsTabContent, {
      setViewState,
      setActiveTab,
      markPluginsChanged
    }, void 0, !1, void 0, this), $3[62] = markPluginsChanged, $3[63] = t25;
  else
    t25 = $3[63];
  let t26;
  if ($3[64] !== errorsTabTitle || $3[65] !== t25)
    t26 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(Tab, {
      id: "errors",
      title: errorsTabTitle,
      children: t25
    }, void 0, !1, void 0, this), $3[64] = errorsTabTitle, $3[65] = t25, $3[66] = t26;
  else
    t26 = $3[66];
  let t27;
  if ($3[67] !== activeTab || $3[68] !== childSearchActive || $3[69] !== t16 || $3[70] !== t17 || $3[71] !== t21 || $3[72] !== t24 || $3[73] !== t26)
    t27 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(Pane, {
      color: "suggestion",
      children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(Tabs, {
        title: "Plugins",
        selectedTab: activeTab,
        onTabChange: handleTabChange,
        color: "suggestion",
        disableNavigation: childSearchActive,
        banner: t16,
        children: [
          t17,
          t21,
          t24,
          t26
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[67] = activeTab, $3[68] = childSearchActive, $3[69] = t16, $3[70] = t17, $3[71] = t21, $3[72] = t24, $3[73] = t26, $3[74] = t27;
  else
    t27 = $3[74];
  return t27;
}
