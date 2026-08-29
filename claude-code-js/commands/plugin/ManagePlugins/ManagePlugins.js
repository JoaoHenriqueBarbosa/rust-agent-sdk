// function: ManagePlugins
function ManagePlugins({
  setViewState: setParentViewState,
  setResult,
  onManageComplete,
  onSearchModeChange,
  targetPlugin,
  targetMarketplace,
  action: action2
}) {
  let mcpClients = useAppState((s2) => s2.mcp.clients), mcpTools = useAppState((s_0) => s_0.mcp.tools), pluginErrors = useAppState((s_1) => s_1.plugins.errors), flaggedPlugins = getFlaggedPlugins(), [isSearchMode, setIsSearchModeRaw] = import_react137.useState(!1), setIsSearchMode = import_react137.useCallback((active) => {
    setIsSearchModeRaw(active), onSearchModeChange?.(active);
  }, [onSearchModeChange]), isTerminalFocused = useTerminalFocus(), {
    columns: terminalWidth
  } = useTerminalSize(), [viewState, setViewState] = import_react137.useState("plugin-list"), {
    query: searchQuery,
    setQuery: setSearchQuery,
    cursorOffset: searchCursorOffset
  } = useSearchInput({
    isActive: viewState === "plugin-list" && isSearchMode,
    onExit: () => {
      setIsSearchMode(!1);
    }
  }), [selectedPlugin, setSelectedPlugin] = import_react137.useState(null), [marketplaces, setMarketplaces] = import_react137.useState([]), [pluginStates, setPluginStates] = import_react137.useState([]), [loading, setLoading] = import_react137.useState(!0), [pendingToggles, setPendingToggles] = import_react137.useState(/* @__PURE__ */ new Map), hasAutoNavigated = import_react137.useRef(!1), pendingAutoActionRef = import_react137.useRef(void 0), toggleMcpServer = useMcpToggleEnabled(), handleBack = React77.useCallback(() => {
    if (viewState === "plugin-details")
      setViewState("plugin-list"), setSelectedPlugin(null), setProcessError(null);
    else if (typeof viewState === "object" && viewState.type === "failed-plugin-details")
      setViewState("plugin-list"), setProcessError(null);
    else if (viewState === "configuring")
      setViewState("plugin-details"), setConfigNeeded(null);
    else if (typeof viewState === "object" && (viewState.type === "plugin-options" || viewState.type === "configuring-options")) {
      if (setViewState("plugin-list"), setSelectedPlugin(null), setResult("Plugin enabled. Configuration skipped \u2014 run /reload-plugins to apply."), onManageComplete)
        onManageComplete();
    } else if (typeof viewState === "object" && viewState.type === "flagged-detail")
      setViewState("plugin-list"), setProcessError(null);
    else if (typeof viewState === "object" && viewState.type === "mcp-detail")
      setViewState("plugin-list"), setProcessError(null);
    else if (typeof viewState === "object" && viewState.type === "mcp-tools")
      setViewState({
        type: "mcp-detail",
        client: viewState.client
      });
    else if (typeof viewState === "object" && viewState.type === "mcp-tool-detail")
      setViewState({
        type: "mcp-tools",
        client: viewState.client
      });
    else {
      if (pendingToggles.size > 0) {
        setResult("Run /reload-plugins to apply plugin changes.");
        return;
      }
      setParentViewState({
        type: "menu"
      });
    }
  }, [viewState, setParentViewState, pendingToggles, setResult]);
  useKeybinding("confirm:no", handleBack, {
    context: "Confirmation",
    isActive: (viewState !== "plugin-list" || !isSearchMode) && viewState !== "confirm-project-uninstall" && !(typeof viewState === "object" && viewState.type === "confirm-data-cleanup")
  });
  let getMcpStatus = (client15) => {
    if (client15.type === "connected")
      return "connected";
    if (client15.type === "disabled")
      return "disabled";
    if (client15.type === "pending")
      return "pending";
    if (client15.type === "needs-auth")
      return "needs-auth";
    return "failed";
  }, unifiedItems = import_react137.useMemo(() => {
    let mergedSettings = getSettings_DEPRECATED(), pluginMcpMap = /* @__PURE__ */ new Map;
    for (let client_0 of mcpClients)
      if (client_0.name.startsWith("plugin:")) {
        let parts = client_0.name.split(":");
        if (parts.length >= 3) {
          let pluginName = parts[1], serverName = parts.slice(2).join(":"), existing = pluginMcpMap.get(pluginName) || [];
          existing.push({
            displayName: serverName,
            client: client_0
          }), pluginMcpMap.set(pluginName, existing);
        }
      }
    let pluginsWithChildren = [];
    for (let state3 of pluginStates) {
      let pluginId = `${state3.plugin.name}@${state3.marketplace}`, isEnabled2 = mergedSettings?.enabledPlugins?.[pluginId] !== !1, errors8 = pluginErrors.filter((e) => ("plugin" in e) && e.plugin === state3.plugin.name || e.source === pluginId || e.source.startsWith(`${state3.plugin.name}@`)), originalScope = state3.plugin.isBuiltin ? "builtin" : state3.scope || "user";
      pluginsWithChildren.push({
        item: {
          type: "plugin",
          id: pluginId,
          name: state3.plugin.name,
          description: state3.plugin.manifest.description,
          marketplace: state3.marketplace,
          scope: originalScope,
          isEnabled: isEnabled2,
          errorCount: errors8.length,
          errors: errors8,
          plugin: state3.plugin,
          pendingEnable: state3.pendingEnable,
          pendingUpdate: state3.pendingUpdate,
          pendingToggle: pendingToggles.get(pluginId)
        },
        originalScope,
        childMcps: pluginMcpMap.get(state3.plugin.name) || []
      });
    }
    let matchedPluginIds = new Set(pluginsWithChildren.map(({
      item
    }) => item.id)), matchedPluginNames = new Set(pluginsWithChildren.map(({
      item: item_0
    }) => item_0.name)), orphanErrorsBySource = /* @__PURE__ */ new Map;
    for (let error44 of pluginErrors) {
      if (matchedPluginIds.has(error44.source) || "plugin" in error44 && typeof error44.plugin === "string" && matchedPluginNames.has(error44.plugin))
        continue;
      let existing_0 = orphanErrorsBySource.get(error44.source) || [];
      existing_0.push(error44), orphanErrorsBySource.set(error44.source, existing_0);
    }
    let pluginScopes = getPluginEditableScopes(), failedPluginItems = [];
    for (let [pluginId_0, errors_0] of orphanErrorsBySource) {
      if (pluginId_0 in flaggedPlugins)
        continue;
      let parsed = parsePluginIdentifier(pluginId_0), pluginName_0 = parsed.name || pluginId_0, marketplace = parsed.marketplace || "unknown", rawScope = pluginScopes.get(pluginId_0), scope = rawScope === "flag" || rawScope === void 0 ? "user" : rawScope;
      failedPluginItems.push({
        type: "failed-plugin",
        id: pluginId_0,
        name: pluginName_0,
        marketplace,
        scope,
        errorCount: errors_0.length,
        errors: errors_0
      });
    }
    let standaloneMcps = [];
    for (let client_1 of mcpClients) {
      if (client_1.name === "ide")
        continue;
      if (client_1.name.startsWith("plugin:"))
        continue;
      standaloneMcps.push({
        type: "mcp",
        id: `mcp:${client_1.name}`,
        name: client_1.name,
        description: void 0,
        scope: client_1.config.scope,
        status: getMcpStatus(client_1),
        client: client_1
      });
    }
    let scopeOrder = {
      flagged: -1,
      project: 0,
      local: 1,
      user: 2,
      enterprise: 3,
      managed: 4,
      dynamic: 5,
      builtin: 6
    }, unified = [], itemsByScope = /* @__PURE__ */ new Map;
    for (let {
      item: item_1,
      originalScope: originalScope_0,
      childMcps
    } of pluginsWithChildren) {
      let scope_0 = item_1.scope;
      if (!itemsByScope.has(scope_0))
        itemsByScope.set(scope_0, []);
      itemsByScope.get(scope_0).push(item_1);
      for (let {
        displayName,
        client: client_2
      } of childMcps) {
        let displayScope = originalScope_0 === "builtin" ? "user" : originalScope_0;
        if (!itemsByScope.has(displayScope))
          itemsByScope.set(displayScope, []);
        itemsByScope.get(displayScope).push({
          type: "mcp",
          id: `mcp:${client_2.name}`,
          name: displayName,
          description: void 0,
          scope: displayScope,
          status: getMcpStatus(client_2),
          client: client_2,
          indented: !0
        });
      }
    }
    for (let mcp of standaloneMcps) {
      let scope_1 = mcp.scope;
      if (!itemsByScope.has(scope_1))
        itemsByScope.set(scope_1, []);
      itemsByScope.get(scope_1).push(mcp);
    }
    for (let failedPlugin of failedPluginItems) {
      let scope_2 = failedPlugin.scope;
      if (!itemsByScope.has(scope_2))
        itemsByScope.set(scope_2, []);
      itemsByScope.get(scope_2).push(failedPlugin);
    }
    for (let [pluginId_1, entry] of Object.entries(flaggedPlugins)) {
      let parsed_0 = parsePluginIdentifier(pluginId_1), pluginName_1 = parsed_0.name || pluginId_1, marketplace_0 = parsed_0.marketplace || "unknown";
      if (!itemsByScope.has("flagged"))
        itemsByScope.set("flagged", []);
      itemsByScope.get("flagged").push({
        type: "flagged-plugin",
        id: pluginId_1,
        name: pluginName_1,
        marketplace: marketplace_0,
        scope: "flagged",
        reason: "delisted",
        text: "Removed from marketplace",
        flaggedAt: entry.flaggedAt
      });
    }
    let sortedScopes = [...itemsByScope.keys()].sort((a2, b) => (scopeOrder[a2] ?? 99) - (scopeOrder[b] ?? 99));
    for (let scope_3 of sortedScopes) {
      let items = itemsByScope.get(scope_3), pluginGroups = [], standaloneMcpsInScope = [], i5 = 0;
      while (i5 < items.length) {
        let item_2 = items[i5];
        if (item_2.type === "plugin" || item_2.type === "failed-plugin" || item_2.type === "flagged-plugin") {
          let group = [item_2];
          i5++;
          let nextItem = items[i5];
          while (nextItem?.type === "mcp" && nextItem.indented)
            group.push(nextItem), i5++, nextItem = items[i5];
          pluginGroups.push(group);
        } else if (item_2.type === "mcp" && !item_2.indented)
          standaloneMcpsInScope.push(item_2), i5++;
        else
          i5++;
      }
      pluginGroups.sort((a_0, b_0) => a_0[0].name.localeCompare(b_0[0].name)), standaloneMcpsInScope.sort((a_1, b_1) => a_1.name.localeCompare(b_1.name));
      for (let group_0 of pluginGroups)
        unified.push(...group_0);
      unified.push(...standaloneMcpsInScope);
    }
    return unified;
  }, [pluginStates, mcpClients, pluginErrors, pendingToggles, flaggedPlugins]), flaggedIds = import_react137.useMemo(() => unifiedItems.filter((item_3) => item_3.type === "flagged-plugin").map((item_4) => item_4.id), [unifiedItems]);
  import_react137.useEffect(() => {
    if (flaggedIds.length > 0)
      markFlaggedPluginsSeen(flaggedIds);
  }, [flaggedIds]);
  let filteredItems = import_react137.useMemo(() => {
    if (!searchQuery)
      return unifiedItems;
    let lowerQuery = searchQuery.toLowerCase();
    return unifiedItems.filter((item_5) => item_5.name.toLowerCase().includes(lowerQuery) || ("description" in item_5) && item_5.description?.toLowerCase().includes(lowerQuery));
  }, [unifiedItems, searchQuery]), [selectedIndex, setSelectedIndex] = import_react137.useState(0), pagination9 = usePagination2({
    totalItems: filteredItems.length,
    selectedIndex,
    maxVisible: 8
  }), [detailsMenuIndex, setDetailsMenuIndex] = import_react137.useState(0), [isProcessing, setIsProcessing] = import_react137.useState(!1), [processError, setProcessError] = import_react137.useState(null), [configNeeded, setConfigNeeded] = import_react137.useState(null), [_isLoadingConfig, setIsLoadingConfig] = import_react137.useState(!1), [selectedPluginHasMcpb, setSelectedPluginHasMcpb] = import_react137.useState(!1);
  import_react137.useEffect(() => {
    if (!selectedPlugin) {
      setSelectedPluginHasMcpb(!1);
      return;
    }
    async function detectMcpb() {
      let mcpServersSpec = selectedPlugin.plugin.manifest.mcpServers, hasMcpb = !1;
      if (mcpServersSpec)
        hasMcpb = typeof mcpServersSpec === "string" && isMcpbSource(mcpServersSpec) || Array.isArray(mcpServersSpec) && mcpServersSpec.some((s_2) => typeof s_2 === "string" && isMcpbSource(s_2));
      if (!hasMcpb)
        try {
          let marketplaceDir = path23.join(selectedPlugin.plugin.path, ".."), marketplaceJsonPath = path23.join(marketplaceDir, ".claude-plugin", "marketplace.json"), content = await fs17.readFile(marketplaceJsonPath, "utf-8"), entry_0 = jsonParse(content).plugins?.find((p4) => p4.name === selectedPlugin.plugin.name);
          if (entry_0?.mcpServers) {
            let spec = entry_0.mcpServers;
            hasMcpb = typeof spec === "string" && isMcpbSource(spec) || Array.isArray(spec) && spec.some((s_3) => typeof s_3 === "string" && isMcpbSource(s_3));
          }
        } catch (err2) {
          logForDebugging(`Failed to read raw marketplace.json: ${err2}`);
        }
      setSelectedPluginHasMcpb(hasMcpb);
    }
    detectMcpb();
  }, [selectedPlugin]), import_react137.useEffect(() => {
    async function loadInstalledPlugins() {
      setLoading(!0);
      try {
        let {
          enabled: enabled2,
          disabled
        } = await loadAllPlugins(), mergedSettings = getSettings_DEPRECATED(), allPlugins = filterManagedDisabledPlugins([...enabled2, ...disabled]), pluginsByMarketplace = {};
        for (let plugin of allPlugins) {
          let marketplace = plugin.source.split("@")[1] || "local";
          if (!pluginsByMarketplace[marketplace])
            pluginsByMarketplace[marketplace] = [];
          pluginsByMarketplace[marketplace].push(plugin);
        }
        let marketplaceInfos = [];
        for (let [name3, plugins] of Object.entries(pluginsByMarketplace)) {
          let enabledCount = count2(plugins, (p4) => {
            let pluginId = `${p4.name}@${name3}`;
            return mergedSettings?.enabledPlugins?.[pluginId] !== !1;
          }), disabledCount = plugins.length - enabledCount;
          marketplaceInfos.push({
            name: name3,
            installedPlugins: plugins,
            enabledCount,
            disabledCount
          });
        }
        marketplaceInfos.sort((a2, b) => {
          if (a2.name === "claude-plugin-directory")
            return -1;
          if (b.name === "claude-plugin-directory")
            return 1;
          return a2.name.localeCompare(b.name);
        }), setMarketplaces(marketplaceInfos);
        let allStates = [];
        for (let marketplace of marketplaceInfos)
          for (let plugin of marketplace.installedPlugins) {
            let pluginId = `${plugin.name}@${marketplace.name}`, scope = plugin.isBuiltin ? "builtin" : getPluginInstallationFromV2(pluginId).scope;
            allStates.push({
              plugin,
              marketplace: marketplace.name,
              scope,
              pendingEnable: void 0,
              pendingUpdate: !1
            });
          }
        setPluginStates(allStates), setSelectedIndex(0);
      } finally {
        setLoading(!1);
      }
    }
    loadInstalledPlugins();
  }, []), import_react137.useEffect(() => {
    if (hasAutoNavigated.current)
      return;
    if (targetPlugin && marketplaces.length > 0 && !loading) {
      let {
        name: targetName,
        marketplace: targetMktFromId
      } = parsePluginIdentifier(targetPlugin), effectiveTargetMarketplace = targetMarketplace ?? targetMktFromId, marketplacesToSearch = effectiveTargetMarketplace ? marketplaces.filter((m4) => m4.name === effectiveTargetMarketplace) : marketplaces;
      for (let marketplace_2 of marketplacesToSearch) {
        let plugin = marketplace_2.installedPlugins.find((p_0) => p_0.name === targetName);
        if (plugin) {
          let pluginId_2 = `${plugin.name}@${marketplace_2.name}`, {
            scope: scope_4
          } = getPluginInstallationFromV2(pluginId_2), pluginState = {
            plugin,
            marketplace: marketplace_2.name,
            scope: scope_4,
            pendingEnable: void 0,
            pendingUpdate: !1
          };
          setSelectedPlugin(pluginState), setViewState("plugin-details"), pendingAutoActionRef.current = action2, hasAutoNavigated.current = !0;
          return;
        }
      }
      let failedItem = unifiedItems.find((item_6) => item_6.type === "failed-plugin" && item_6.name === targetName);
      if (failedItem && failedItem.type === "failed-plugin")
        setViewState({
          type: "failed-plugin-details",
          plugin: {
            id: failedItem.id,
            name: failedItem.name,
            marketplace: failedItem.marketplace,
            errors: failedItem.errors,
            scope: failedItem.scope
          }
        }), hasAutoNavigated.current = !0;
      if (!hasAutoNavigated.current && action2)
        hasAutoNavigated.current = !0, setResult(`Plugin "${targetPlugin}" is not installed in this project`);
    }
  }, [targetPlugin, targetMarketplace, marketplaces, loading, unifiedItems, action2, setResult]);
  let handleSingleOperation = async (operation) => {
    if (!selectedPlugin)
      return;
    let pluginScope = selectedPlugin.scope || "user", isBuiltin = pluginScope === "builtin";
    if (isBuiltin && (operation === "update" || operation === "uninstall")) {
      setProcessError("Built-in plugins cannot be updated or uninstalled.");
      return;
    }
    if (!isBuiltin && !isInstallableScope(pluginScope) && operation !== "update") {
      setProcessError("This plugin is managed by your organization. Contact your admin to disable it.");
      return;
    }
    setIsProcessing(!0), setProcessError(null);
    try {
      let pluginId_3 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`, reverseDependents;
      switch (operation) {
        case "enable": {
          let enableResult = await enablePluginOp(pluginId_3);
          if (!enableResult.success)
            throw Error(enableResult.message);
          break;
        }
        case "disable": {
          let disableResult = await disablePluginOp(pluginId_3);
          if (!disableResult.success)
            throw Error(disableResult.message);
          reverseDependents = disableResult.reverseDependents;
          break;
        }
        case "uninstall": {
          if (isBuiltin)
            break;
          if (!isInstallableScope(pluginScope))
            break;
          if (isPluginEnabledAtProjectScope(pluginId_3)) {
            setIsProcessing(!1), setViewState("confirm-project-uninstall");
            return;
          }
          let installs = loadInstalledPluginsV2().plugins[pluginId_3], dataSize = !installs || installs.length <= 1 ? await getPluginDataDirSize(pluginId_3) : null;
          if (dataSize) {
            setIsProcessing(!1), setViewState({
              type: "confirm-data-cleanup",
              size: dataSize
            });
            return;
          }
          let result_0 = await uninstallPluginOp(pluginId_3, pluginScope);
          if (!result_0.success)
            throw Error(result_0.message);
          reverseDependents = result_0.reverseDependents;
          break;
        }
        case "update": {
          if (isBuiltin)
            break;
          let result = await updatePluginOp(pluginId_3, pluginScope);
          if (!result.success)
            throw Error(result.message);
          if (result.alreadyUpToDate) {
            if (setResult(`${selectedPlugin.plugin.name} is already at the latest version (${result.newVersion}).`), onManageComplete)
              await onManageComplete();
            setParentViewState({
              type: "menu"
            });
            return;
          }
          break;
        }
      }
      clearAllCaches();
      let pluginIdNow = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`;
      if (getSettings_DEPRECATED()?.enabledPlugins?.[pluginIdNow] !== !1) {
        setIsProcessing(!1), setViewState({
          type: "plugin-options"
        });
        return;
      }
      let operationName = operation === "enable" ? "Enabled" : operation === "disable" ? "Disabled" : operation === "update" ? "Updated" : "Uninstalled", depWarn = reverseDependents && reverseDependents.length > 0 ? ` \xB7 required by ${reverseDependents.join(", ")}` : "", message = `\u2713 ${operationName} ${selectedPlugin.plugin.name}${depWarn}. Run /reload-plugins to apply.`;
      if (setResult(message), onManageComplete)
        await onManageComplete();
      setParentViewState({
        type: "menu"
      });
    } catch (error_0) {
      setIsProcessing(!1);
      let errorMessage3 = error_0 instanceof Error ? error_0.message : String(error_0);
      setProcessError(`Failed to ${operation}: ${errorMessage3}`), logError2(toError(error_0));
    }
  }, handleSingleOperationRef = import_react137.useRef(handleSingleOperation);
  handleSingleOperationRef.current = handleSingleOperation, import_react137.useEffect(() => {
    if (viewState === "plugin-details" && selectedPlugin && pendingAutoActionRef.current) {
      let pending = pendingAutoActionRef.current;
      pendingAutoActionRef.current = void 0, handleSingleOperationRef.current(pending);
    }
  }, [viewState, selectedPlugin]);
  let handleToggle = React77.useCallback(() => {
    if (selectedIndex >= filteredItems.length)
      return;
    let item_7 = filteredItems[selectedIndex];
    if (item_7?.type === "flagged-plugin")
      return;
    if (item_7?.type === "plugin") {
      let pluginId_4 = `${item_7.plugin.name}@${item_7.marketplace}`, mergedSettings_0 = getSettings_DEPRECATED(), currentPending = pendingToggles.get(pluginId_4), isEnabled_0 = mergedSettings_0?.enabledPlugins?.[pluginId_4] !== !1, pluginScope_0 = item_7.scope;
      if (pluginScope_0 === "builtin" || isInstallableScope(pluginScope_0)) {
        let newPending = new Map(pendingToggles);
        if (currentPending)
          newPending.delete(pluginId_4), (async () => {
            try {
              if (currentPending === "will-disable")
                await enablePluginOp(pluginId_4);
              else
                await disablePluginOp(pluginId_4);
              clearAllCaches();
            } catch (err_0) {
              logError2(err_0);
            }
          })();
        else
          newPending.set(pluginId_4, isEnabled_0 ? "will-disable" : "will-enable"), (async () => {
            try {
              if (isEnabled_0)
                await disablePluginOp(pluginId_4);
              else
                await enablePluginOp(pluginId_4);
              clearAllCaches();
            } catch (err_1) {
              logError2(err_1);
            }
          })();
        setPendingToggles(newPending);
      }
    } else if (item_7?.type === "mcp")
      toggleMcpServer(item_7.client.name);
  }, [selectedIndex, filteredItems, pendingToggles, pluginStates, toggleMcpServer]), handleAccept = React77.useCallback(() => {
    if (selectedIndex >= filteredItems.length)
      return;
    let item_8 = filteredItems[selectedIndex];
    if (item_8?.type === "plugin") {
      let state_0 = pluginStates.find((s_4) => s_4.plugin.name === item_8.plugin.name && s_4.marketplace === item_8.marketplace);
      if (state_0)
        setSelectedPlugin(state_0), setViewState("plugin-details"), setDetailsMenuIndex(0), setProcessError(null);
    } else if (item_8?.type === "flagged-plugin")
      setViewState({
        type: "flagged-detail",
        plugin: {
          id: item_8.id,
          name: item_8.name,
          marketplace: item_8.marketplace,
          reason: item_8.reason,
          text: item_8.text,
          flaggedAt: item_8.flaggedAt
        }
      }), setProcessError(null);
    else if (item_8?.type === "failed-plugin")
      setViewState({
        type: "failed-plugin-details",
        plugin: {
          id: item_8.id,
          name: item_8.name,
          marketplace: item_8.marketplace,
          errors: item_8.errors,
          scope: item_8.scope
        }
      }), setDetailsMenuIndex(0), setProcessError(null);
    else if (item_8?.type === "mcp")
      setViewState({
        type: "mcp-detail",
        client: item_8.client
      }), setProcessError(null);
  }, [selectedIndex, filteredItems, pluginStates]);
  useKeybindings({
    "select:previous": () => {
      if (selectedIndex === 0)
        setIsSearchMode(!0);
      else
        pagination9.handleSelectionChange(selectedIndex - 1, setSelectedIndex);
    },
    "select:next": () => {
      if (selectedIndex < filteredItems.length - 1)
        pagination9.handleSelectionChange(selectedIndex + 1, setSelectedIndex);
    },
    "select:accept": handleAccept
  }, {
    context: "Select",
    isActive: viewState === "plugin-list" && !isSearchMode
  }), useKeybindings({
    "plugin:toggle": handleToggle
  }, {
    context: "Plugin",
    isActive: viewState === "plugin-list" && !isSearchMode
  });
  let handleFlaggedDismiss = React77.useCallback(() => {
    if (typeof viewState !== "object" || viewState.type !== "flagged-detail")
      return;
    removeFlaggedPlugin(viewState.plugin.id), setViewState("plugin-list");
  }, [viewState]);
  useKeybindings({
    "select:accept": handleFlaggedDismiss
  }, {
    context: "Select",
    isActive: typeof viewState === "object" && viewState.type === "flagged-detail"
  });
  let detailsMenuItems = React77.useMemo(() => {
    if (viewState !== "plugin-details" || !selectedPlugin)
      return [];
    let mergedSettings_1 = getSettings_DEPRECATED(), pluginId_5 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`, isEnabled_1 = mergedSettings_1?.enabledPlugins?.[pluginId_5] !== !1, isBuiltin_1 = selectedPlugin.marketplace === "builtin", menuItems = [];
    if (menuItems.push({
      label: isEnabled_1 ? "Disable plugin" : "Enable plugin",
      action: () => void handleSingleOperation(isEnabled_1 ? "disable" : "enable")
    }), !isBuiltin_1) {
      if (menuItems.push({
        label: selectedPlugin.pendingUpdate ? "Unmark for update" : "Mark for update",
        action: async () => {
          try {
            let localError = await checkIfLocalPlugin(selectedPlugin.plugin.name, selectedPlugin.marketplace);
            if (localError) {
              setProcessError(localError);
              return;
            }
            let newStates = [...pluginStates], index = newStates.findIndex((s_5) => s_5.plugin.name === selectedPlugin.plugin.name && s_5.marketplace === selectedPlugin.marketplace);
            if (index !== -1)
              newStates[index].pendingUpdate = !selectedPlugin.pendingUpdate, setPluginStates(newStates), setSelectedPlugin({
                ...selectedPlugin,
                pendingUpdate: !selectedPlugin.pendingUpdate
              });
          } catch (error_1) {
            setProcessError(error_1 instanceof Error ? error_1.message : "Failed to check plugin update availability");
          }
        }
      }), selectedPluginHasMcpb)
        menuItems.push({
          label: "Configure",
          action: async () => {
            setIsLoadingConfig(!0);
            try {
              let mcpServersSpec_0 = selectedPlugin.plugin.manifest.mcpServers, mcpbPath = null;
              if (typeof mcpServersSpec_0 === "string" && isMcpbSource(mcpServersSpec_0))
                mcpbPath = mcpServersSpec_0;
              else if (Array.isArray(mcpServersSpec_0)) {
                for (let spec_0 of mcpServersSpec_0)
                  if (typeof spec_0 === "string" && isMcpbSource(spec_0)) {
                    mcpbPath = spec_0;
                    break;
                  }
              }
              if (!mcpbPath) {
                setProcessError("No MCPB file found in plugin"), setIsLoadingConfig(!1);
                return;
              }
              let pluginId_6 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`, result_1 = await loadMcpbFile(mcpbPath, selectedPlugin.plugin.path, pluginId_6, void 0, void 0, !0);
              if ("status" in result_1 && result_1.status === "needs-config")
                setConfigNeeded(result_1), setViewState("configuring");
              else
                setProcessError("Failed to load MCPB for configuration");
            } catch (err_2) {
              let errorMsg = errorMessage(err_2);
              setProcessError(`Failed to load configuration: ${errorMsg}`);
            } finally {
              setIsLoadingConfig(!1);
            }
          }
        });
      if (selectedPlugin.plugin.manifest.userConfig && Object.keys(selectedPlugin.plugin.manifest.userConfig).length > 0)
        menuItems.push({
          label: "Configure options",
          action: () => {
            setViewState({
              type: "configuring-options",
              schema: selectedPlugin.plugin.manifest.userConfig
            });
          }
        });
      menuItems.push({
        label: "Update now",
        action: () => void handleSingleOperation("update")
      }), menuItems.push({
        label: "Uninstall",
        action: () => void handleSingleOperation("uninstall")
      });
    }
    if (selectedPlugin.plugin.manifest.homepage)
      menuItems.push({
        label: "Open homepage",
        action: () => void openBrowser(selectedPlugin.plugin.manifest.homepage)
      });
    if (selectedPlugin.plugin.manifest.repository)
      menuItems.push({
        label: "View repository",
        action: () => void openBrowser(selectedPlugin.plugin.manifest.repository)
      });
    return menuItems.push({
      label: "Back to plugin list",
      action: () => {
        setViewState("plugin-list"), setSelectedPlugin(null), setProcessError(null);
      }
    }), menuItems;
  }, [viewState, selectedPlugin, selectedPluginHasMcpb, pluginStates]);
  if (useKeybindings({
    "select:previous": () => {
      if (detailsMenuIndex > 0)
        setDetailsMenuIndex(detailsMenuIndex - 1);
    },
    "select:next": () => {
      if (detailsMenuIndex < detailsMenuItems.length - 1)
        setDetailsMenuIndex(detailsMenuIndex + 1);
    },
    "select:accept": () => {
      if (detailsMenuItems[detailsMenuIndex])
        detailsMenuItems[detailsMenuIndex].action();
    }
  }, {
    context: "Select",
    isActive: viewState === "plugin-details" && !!selectedPlugin
  }), useKeybindings({
    "select:accept": () => {
      if (typeof viewState === "object" && viewState.type === "failed-plugin-details")
        (async () => {
          setIsProcessing(!0), setProcessError(null);
          let pluginId_7 = viewState.plugin.id, pluginScope_1 = viewState.plugin.scope, result_2 = isInstallableScope(pluginScope_1) ? await uninstallPluginOp(pluginId_7, pluginScope_1, !1) : await uninstallPluginOp(pluginId_7, "user", !1), success2 = result_2.success;
          if (!success2) {
            let editableSources = ["userSettings", "projectSettings", "localSettings"];
            for (let source of editableSources) {
              let settings = getSettingsForSource(source);
              if (settings?.enabledPlugins?.[pluginId_7] !== void 0)
                updateSettingsForSource(source, {
                  enabledPlugins: {
                    ...settings.enabledPlugins,
                    [pluginId_7]: void 0
                  }
                }), success2 = !0;
            }
            clearAllCaches();
          }
          if (success2) {
            if (onManageComplete)
              await onManageComplete();
            setIsProcessing(!1), setViewState("plugin-list");
          } else
            setIsProcessing(!1), setProcessError(result_2.message);
        })();
    }
  }, {
    context: "Select",
    isActive: typeof viewState === "object" && viewState.type === "failed-plugin-details" && viewState.plugin.scope !== "managed"
  }), useKeybindings({
    "confirm:yes": () => {
      if (!selectedPlugin)
        return;
      setIsProcessing(!0), setProcessError(null);
      let pluginId_8 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`, {
        error: error_2
      } = updateSettingsForSource("localSettings", {
        enabledPlugins: {
          ...getSettingsForSource("localSettings")?.enabledPlugins,
          [pluginId_8]: !1
        }
      });
      if (error_2) {
        setIsProcessing(!1), setProcessError(`Failed to write settings: ${error_2.message}`);
        return;
      }
      if (clearAllCaches(), setResult(`\u2713 Disabled ${selectedPlugin.plugin.name} in .claude/settings.local.json. Run /reload-plugins to apply.`), onManageComplete)
        onManageComplete();
      setParentViewState({
        type: "menu"
      });
    },
    "confirm:no": () => {
      setViewState("plugin-details"), setProcessError(null);
    }
  }, {
    context: "Confirmation",
    isActive: viewState === "confirm-project-uninstall" && !!selectedPlugin && !isProcessing
  }), use_input_default((input, key3) => {
    if (!selectedPlugin)
      return;
    let pluginId_9 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`, pluginScope_2 = selectedPlugin.scope;
    if (!pluginScope_2 || pluginScope_2 === "builtin" || !isInstallableScope(pluginScope_2))
      return;
    let doUninstall = async (deleteDataDir) => {
      setIsProcessing(!0), setProcessError(null);
      try {
        let result_3 = await uninstallPluginOp(pluginId_9, pluginScope_2, deleteDataDir);
        if (!result_3.success)
          throw Error(result_3.message);
        clearAllCaches();
        let suffix = deleteDataDir ? "" : " \xB7 data preserved";
        if (setResult(`${figures_default.tick} ${result_3.message}${suffix}`), onManageComplete)
          onManageComplete();
        setParentViewState({
          type: "menu"
        });
      } catch (e_0) {
        setIsProcessing(!1), setProcessError(e_0 instanceof Error ? e_0.message : String(e_0));
      }
    };
    if (input === "y" || input === "Y")
      doUninstall(!0);
    else if (input === "n" || input === "N")
      doUninstall(!1);
    else if (key3.escape)
      setViewState("plugin-details"), setProcessError(null);
  }, {
    isActive: typeof viewState === "object" && viewState.type === "confirm-data-cleanup" && !!selectedPlugin && !isProcessing
  }), React77.useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]), use_input_default((input_0, key_0) => {
    let keyIsNotCtrlOrMeta = !key_0.ctrl && !key_0.meta;
    if (isSearchMode)
      return;
    if (input_0 === "/" && keyIsNotCtrlOrMeta)
      setIsSearchMode(!0), setSearchQuery(""), setSelectedIndex(0);
    else if (keyIsNotCtrlOrMeta && input_0.length > 0 && !/^\s+$/.test(input_0) && input_0 !== "j" && input_0 !== "k" && input_0 !== " ")
      setIsSearchMode(!0), setSearchQuery(input_0), setSelectedIndex(0);
  }, {
    isActive: viewState === "plugin-list"
  }), loading)
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
      children: "Loading installed plugins\u2026"
    }, void 0, !1, void 0, this);
  if (unifiedItems.length === 0)
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            bold: !0,
            children: "Manage plugins"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          children: "No plugins or MCP servers installed."
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Esc to go back"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (typeof viewState === "object" && viewState.type === "plugin-options" && selectedPlugin) {
    let finish = function(msg) {
      if (setResult(msg), onManageComplete)
        onManageComplete();
      setParentViewState({
        type: "menu"
      });
    }, pluginId_10 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`;
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(PluginOptionsFlow, {
      plugin: selectedPlugin.plugin,
      pluginId: pluginId_10,
      onDone: (outcome, detail) => {
        switch (outcome) {
          case "configured":
            finish(`\u2713 Enabled and configured ${selectedPlugin.plugin.name}. Run /reload-plugins to apply.`);
            break;
          case "skipped":
            finish(`\u2713 Enabled ${selectedPlugin.plugin.name}. Run /reload-plugins to apply.`);
            break;
          case "error":
            finish(`Failed to save configuration: ${detail}`);
            break;
        }
      }
    }, void 0, !1, void 0, this);
  }
  if (typeof viewState === "object" && viewState.type === "configuring-options" && selectedPlugin) {
    let pluginId_11 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`;
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(PluginOptionsDialog, {
      title: `Configure ${selectedPlugin.plugin.name}`,
      subtitle: "Plugin options",
      configSchema: viewState.schema,
      initialValues: loadPluginOptions(pluginId_11),
      onSave: (values3) => {
        try {
          savePluginOptions(pluginId_11, values3, viewState.schema), clearAllCaches(), setResult("Configuration saved. Run /reload-plugins for changes to take effect.");
        } catch (err_3) {
          setProcessError(`Failed to save configuration: ${errorMessage(err_3)}`);
        }
        setViewState("plugin-details");
      },
      onCancel: () => setViewState("plugin-details")
    }, void 0, !1, void 0, this);
  }
  if (viewState === "configuring" && configNeeded && selectedPlugin) {
    let handleCancel = function() {
      setConfigNeeded(null), setViewState("plugin-details");
    }, pluginId_12 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`;
    async function handleSave(config11) {
      if (!configNeeded || !selectedPlugin)
        return;
      try {
        let mcpServersSpec_1 = selectedPlugin.plugin.manifest.mcpServers, mcpbPath_0 = null;
        if (typeof mcpServersSpec_1 === "string" && isMcpbSource(mcpServersSpec_1))
          mcpbPath_0 = mcpServersSpec_1;
        else if (Array.isArray(mcpServersSpec_1)) {
          for (let spec_1 of mcpServersSpec_1)
            if (typeof spec_1 === "string" && isMcpbSource(spec_1)) {
              mcpbPath_0 = spec_1;
              break;
            }
        }
        if (!mcpbPath_0) {
          setProcessError("No MCPB file found"), setViewState("plugin-details");
          return;
        }
        await loadMcpbFile(mcpbPath_0, selectedPlugin.plugin.path, pluginId_12, void 0, config11), setProcessError(null), setConfigNeeded(null), setViewState("plugin-details"), setResult("Configuration saved. Run /reload-plugins for changes to take effect.");
      } catch (err_4) {
        let errorMsg_0 = errorMessage(err_4);
        setProcessError(`Failed to save configuration: ${errorMsg_0}`), setViewState("plugin-details");
      }
    }
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(PluginOptionsDialog, {
      title: `Configure ${configNeeded.manifest.name}`,
      subtitle: `Plugin: ${selectedPlugin.plugin.name}`,
      configSchema: configNeeded.configSchema,
      initialValues: configNeeded.existingConfig,
      onSave: handleSave,
      onCancel: handleCancel
    }, void 0, !1, void 0, this);
  }
  if (typeof viewState === "object" && viewState.type === "flagged-detail") {
    let fp = viewState.plugin;
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            bold: !0,
            children: [
              fp.name,
              " @ ",
              fp.marketplace
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Status: "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              color: "error",
              children: "Removed"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              color: "error",
              children: [
                "Removed from marketplace \xB7 reason: ",
                fp.reason
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              children: fp.text
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Flagged on ",
                new Date(fp.flaggedAt).toLocaleDateString()
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                children: [
                  figures_default.pointer,
                  " "
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                color: "suggestion",
                children: "Dismiss"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(Byline, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
              action: "select:accept",
              context: "Select",
              fallback: "Enter",
              description: "dismiss"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "back"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  if (viewState === "confirm-project-uninstall" && selectedPlugin)
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          bold: !0,
          color: "warning",
          children: [
            selectedPlugin.plugin.name,
            " is enabled in .claude/settings.json (shared with your team)"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              children: "Disable it just for you in .claude/settings.local.json?"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "This has the same effect as uninstalling, without affecting other contributors."
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        processError && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            color: "error",
            children: processError
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: isProcessing ? /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Disabling\u2026"
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:yes",
                context: "Confirmation",
                fallback: "y",
                description: "disable"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (typeof viewState === "object" && viewState.type === "confirm-data-cleanup" && selectedPlugin)
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          bold: !0,
          children: [
            selectedPlugin.plugin.name,
            " has ",
            viewState.size.human,
            " of persistent data"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              children: "Delete it along with the plugin?"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: pluginDataDirPath(`${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        processError && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            color: "error",
            children: processError
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: isProcessing ? /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Uninstalling\u2026"
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                bold: !0,
                children: "y"
              }, void 0, !1, void 0, this),
              " to delete \xB7 ",
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                bold: !0,
                children: "n"
              }, void 0, !1, void 0, this),
              " to keep \xB7",
              " ",
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                bold: !0,
                children: "esc"
              }, void 0, !1, void 0, this),
              " to cancel"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (viewState === "plugin-details" && selectedPlugin) {
    let mergedSettings_2 = getSettings_DEPRECATED(), pluginId_13 = `${selectedPlugin.plugin.name}@${selectedPlugin.marketplace}`, isEnabled_2 = mergedSettings_2?.enabledPlugins?.[pluginId_13] !== !1, filteredPluginErrors = pluginErrors.filter((e_1) => ("plugin" in e_1) && e_1.plugin === selectedPlugin.plugin.name || e_1.source === pluginId_13 || e_1.source.startsWith(`${selectedPlugin.plugin.name}@`)), pluginErrorsSection = filteredPluginErrors.length === 0 ? null : /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          bold: !0,
          color: "error",
          children: [
            filteredPluginErrors.length,
            " ",
            plural(filteredPluginErrors.length, "error"),
            ":"
          ]
        }, void 0, !0, void 0, this),
        filteredPluginErrors.map((error_3, i_0) => {
          let guidance = getErrorGuidance(error_3);
          return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            marginLeft: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                color: "error",
                children: formatErrorMessage(error_3)
              }, void 0, !1, void 0, this),
              guidance && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                dimColor: !0,
                italic: !0,
                children: [
                  figures_default.arrowRight,
                  " ",
                  guidance
                ]
              }, void 0, !0, void 0, this)
            ]
          }, i_0, !0, void 0, this);
        })
      ]
    }, void 0, !0, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            bold: !0,
            children: [
              selectedPlugin.plugin.name,
              " @ ",
              selectedPlugin.marketplace
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Scope: "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              children: selectedPlugin.scope || "user"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        selectedPlugin.plugin.manifest.version && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Version: "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              children: selectedPlugin.plugin.manifest.version
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        selectedPlugin.plugin.manifest.description && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            children: selectedPlugin.plugin.manifest.description
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        selectedPlugin.plugin.manifest.author && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Author: "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              children: selectedPlugin.plugin.manifest.author.name
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Status: "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              color: isEnabled_2 ? "success" : "warning",
              children: isEnabled_2 ? "Enabled" : "Disabled"
            }, void 0, !1, void 0, this),
            selectedPlugin.pendingUpdate && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              color: "suggestion",
              children: " \xB7 Marked for update"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(PluginComponentsDisplay, {
          plugin: selectedPlugin.plugin,
          marketplace: selectedPlugin.marketplace
        }, void 0, !1, void 0, this),
        pluginErrorsSection,
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: detailsMenuItems.map((item_9, index_0) => {
            let isSelected = index_0 === detailsMenuIndex;
            return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
              children: [
                isSelected && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                  children: [
                    figures_default.pointer,
                    " "
                  ]
                }, void 0, !0, void 0, this),
                !isSelected && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                  children: "  "
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                  bold: isSelected,
                  color: item_9.label.includes("Uninstall") ? "error" : item_9.label.includes("Update") ? "suggestion" : void 0,
                  children: item_9.label
                }, void 0, !1, void 0, this)
              ]
            }, index_0, !0, void 0, this);
          })
        }, void 0, !1, void 0, this),
        isProcessing && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            children: "Processing\u2026"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        processError && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            color: "error",
            children: processError
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(Byline, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                  action: "select:previous",
                  context: "Select",
                  fallback: "\u2191",
                  description: "navigate"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                  action: "select:accept",
                  context: "Select",
                  fallback: "Enter",
                  description: "select"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                  action: "confirm:no",
                  context: "Confirmation",
                  fallback: "Esc",
                  description: "back"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  if (typeof viewState === "object" && viewState.type === "failed-plugin-details") {
    let failedPlugin_0 = viewState.plugin, firstError = failedPlugin_0.errors[0], errorMessage_0 = firstError ? formatErrorMessage(firstError) : "Failed to load";
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              bold: !0,
              children: failedPlugin_0.name
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                " @ ",
                failedPlugin_0.marketplace
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                " (",
                failedPlugin_0.scope,
                ")"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          color: "error",
          children: errorMessage_0
        }, void 0, !1, void 0, this),
        failedPlugin_0.scope === "managed" ? /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Managed by your organization \u2014 contact your admin"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              color: "suggestion",
              children: [
                figures_default.pointer,
                " "
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
              bold: !0,
              children: "Remove"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        isProcessing && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          children: "Processing\u2026"
        }, void 0, !1, void 0, this),
        processError && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          color: "error",
          children: processError
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(Byline, {
              children: [
                failedPlugin_0.scope !== "managed" && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                  action: "select:accept",
                  context: "Select",
                  fallback: "Enter",
                  description: "remove"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                  action: "confirm:no",
                  context: "Confirmation",
                  fallback: "Esc",
                  description: "back"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  if (typeof viewState === "object" && viewState.type === "mcp-detail") {
    let client_3 = viewState.client, serverToolsCount = filterToolsByServer(mcpTools, client_3.name).length, handleMcpViewTools = () => {
      setViewState({
        type: "mcp-tools",
        client: client_3
      });
    }, handleMcpCancel = () => {
      setViewState("plugin-list");
    }, handleMcpComplete = (result_4) => {
      if (result_4)
        setResult(result_4);
      setViewState("plugin-list");
    }, scope_5 = client_3.config.scope, configType = client_3.config.type;
    if (configType === "stdio") {
      let server = {
        name: client_3.name,
        client: client_3,
        scope: scope_5,
        transport: "stdio",
        config: client_3.config
      };
      return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(MCPStdioServerMenu, {
        server,
        serverToolsCount,
        onViewTools: handleMcpViewTools,
        onCancel: handleMcpCancel,
        onComplete: handleMcpComplete,
        borderless: !0
      }, void 0, !1, void 0, this);
    } else if (configType === "sse") {
      let server_0 = {
        name: client_3.name,
        client: client_3,
        scope: scope_5,
        transport: "sse",
        isAuthenticated: void 0,
        config: client_3.config
      };
      return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(MCPRemoteServerMenu, {
        server: server_0,
        serverToolsCount,
        onViewTools: handleMcpViewTools,
        onCancel: handleMcpCancel,
        onComplete: handleMcpComplete,
        borderless: !0
      }, void 0, !1, void 0, this);
    } else if (configType === "http") {
      let server_1 = {
        name: client_3.name,
        client: client_3,
        scope: scope_5,
        transport: "http",
        isAuthenticated: void 0,
        config: client_3.config
      };
      return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(MCPRemoteServerMenu, {
        server: server_1,
        serverToolsCount,
        onViewTools: handleMcpViewTools,
        onCancel: handleMcpCancel,
        onComplete: handleMcpComplete,
        borderless: !0
      }, void 0, !1, void 0, this);
    } else if (configType === "claudeai-proxy") {
      let server_2 = {
        name: client_3.name,
        client: client_3,
        scope: scope_5,
        transport: "claudeai-proxy",
        isAuthenticated: void 0,
        config: client_3.config
      };
      return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(MCPRemoteServerMenu, {
        server: server_2,
        serverToolsCount,
        onViewTools: handleMcpViewTools,
        onCancel: handleMcpCancel,
        onComplete: handleMcpComplete,
        borderless: !0
      }, void 0, !1, void 0, this);
    }
    return setViewState("plugin-list"), null;
  }
  if (typeof viewState === "object" && viewState.type === "mcp-tools") {
    let client_4 = viewState.client, scope_6 = client_4.config.scope, configType_0 = client_4.config.type, server_3;
    if (configType_0 === "stdio")
      server_3 = {
        name: client_4.name,
        client: client_4,
        scope: scope_6,
        transport: "stdio",
        config: client_4.config
      };
    else if (configType_0 === "sse")
      server_3 = {
        name: client_4.name,
        client: client_4,
        scope: scope_6,
        transport: "sse",
        isAuthenticated: void 0,
        config: client_4.config
      };
    else if (configType_0 === "http")
      server_3 = {
        name: client_4.name,
        client: client_4,
        scope: scope_6,
        transport: "http",
        isAuthenticated: void 0,
        config: client_4.config
      };
    else
      server_3 = {
        name: client_4.name,
        client: client_4,
        scope: scope_6,
        transport: "claudeai-proxy",
        isAuthenticated: void 0,
        config: client_4.config
      };
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(MCPToolListView, {
      server: server_3,
      onSelectTool: (tool) => {
        setViewState({
          type: "mcp-tool-detail",
          client: client_4,
          tool
        });
      },
      onBack: () => setViewState({
        type: "mcp-detail",
        client: client_4
      })
    }, void 0, !1, void 0, this);
  }
  if (typeof viewState === "object" && viewState.type === "mcp-tool-detail") {
    let {
      client: client_5,
      tool: tool_0
    } = viewState, scope_7 = client_5.config.scope, configType_1 = client_5.config.type, server_4;
    if (configType_1 === "stdio")
      server_4 = {
        name: client_5.name,
        client: client_5,
        scope: scope_7,
        transport: "stdio",
        config: client_5.config
      };
    else if (configType_1 === "sse")
      server_4 = {
        name: client_5.name,
        client: client_5,
        scope: scope_7,
        transport: "sse",
        isAuthenticated: void 0,
        config: client_5.config
      };
    else if (configType_1 === "http")
      server_4 = {
        name: client_5.name,
        client: client_5,
        scope: scope_7,
        transport: "http",
        isAuthenticated: void 0,
        config: client_5.config
      };
    else
      server_4 = {
        name: client_5.name,
        client: client_5,
        scope: scope_7,
        transport: "claudeai-proxy",
        isAuthenticated: void 0,
        config: client_5.config
      };
    return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(MCPToolDetailView, {
      tool: tool_0,
      server: server_4,
      onBack: () => setViewState({
        type: "mcp-tools",
        client: client_5
      })
    }, void 0, !1, void 0, this);
  }
  let visibleItems = pagination9.getVisibleItems(filteredItems);
  return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(SearchBox, {
          query: searchQuery,
          isFocused: isSearchMode,
          isTerminalFocused,
          width: terminalWidth - 4,
          cursorOffset: searchCursorOffset
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      filteredItems.length === 0 && searchQuery && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            'No items match "',
            searchQuery,
            '"'
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      pagination9.scrollPosition.canScrollUp && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            figures_default.arrowUp,
            " more above"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      visibleItems.map((item_10, visibleIndex) => {
        let isSelected_0 = pagination9.toActualIndex(visibleIndex) === selectedIndex && !isSearchMode, prevItem = visibleIndex > 0 ? visibleItems[visibleIndex - 1] : null, showScopeHeader = !prevItem || prevItem.scope !== item_10.scope, getScopeLabel2 = (scope_8) => {
          switch (scope_8) {
            case "flagged":
              return "Flagged";
            case "project":
              return "Project";
            case "local":
              return "Local";
            case "user":
              return "User";
            case "enterprise":
              return "Enterprise";
            case "managed":
              return "Managed";
            case "builtin":
              return "Built-in";
            case "dynamic":
              return "Built-in";
            default:
              return scope_8;
          }
        };
        return /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(React77.Fragment, {
          children: [
            showScopeHeader && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
              marginTop: visibleIndex > 0 ? 1 : 0,
              paddingLeft: 2,
              children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                dimColor: item_10.scope !== "flagged",
                color: item_10.scope === "flagged" ? "warning" : void 0,
                bold: item_10.scope === "flagged",
                children: getScopeLabel2(item_10.scope)
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(UnifiedInstalledCell, {
              item: item_10,
              isSelected: isSelected_0
            }, void 0, !1, void 0, this)
          ]
        }, item_10.id, !0, void 0, this);
      }),
      pagination9.scrollPosition.canScrollDown && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            figures_default.arrowDown,
            " more below"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        marginLeft: 1,
        children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
                children: "type to search"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                action: "plugin:toggle",
                context: "Plugin",
                fallback: "Space",
                description: "toggle"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                action: "select:accept",
                context: "Select",
                fallback: "Enter",
                description: "details"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "back"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      pendingToggles.size > 0 && /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedBox_default, {
        marginLeft: 1,
        children: /* @__PURE__ */ jsx_dev_runtime242.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: "Run /reload-plugins to apply changes"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
