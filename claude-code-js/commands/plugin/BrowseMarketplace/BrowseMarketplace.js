// function: BrowseMarketplace
function BrowseMarketplace({
  error: error44,
  setError,
  result: _result,
  setResult,
  setViewState: setParentViewState,
  onInstallComplete,
  targetMarketplace,
  targetPlugin
}) {
  let [viewState, setViewState] = import_react134.useState("marketplace-list"), [selectedMarketplace, setSelectedMarketplace] = import_react134.useState(null), [selectedPlugin, setSelectedPlugin] = import_react134.useState(null), [marketplaces, setMarketplaces] = import_react134.useState([]), [availablePlugins, setAvailablePlugins] = import_react134.useState([]), [loading, setLoading] = import_react134.useState(!0), [installCounts, setInstallCounts] = import_react134.useState(null), [selectedIndex, setSelectedIndex] = import_react134.useState(0), [selectedForInstall, setSelectedForInstall] = import_react134.useState(/* @__PURE__ */ new Set), [installingPlugins, setInstallingPlugins] = import_react134.useState(/* @__PURE__ */ new Set), pagination9 = usePagination2({
    totalItems: availablePlugins.length,
    selectedIndex
  }), [detailsMenuIndex, setDetailsMenuIndex] = import_react134.useState(0), [isInstalling, setIsInstalling] = import_react134.useState(!1), [installError, setInstallError] = import_react134.useState(null), [warning, setWarning] = import_react134.useState(null), handleBack = React75.useCallback(() => {
    if (viewState === "plugin-list")
      if (targetMarketplace)
        setParentViewState({
          type: "manage-marketplaces",
          targetMarketplace
        });
      else if (marketplaces.length === 1)
        setParentViewState({
          type: "menu"
        });
      else
        setViewState("marketplace-list"), setSelectedMarketplace(null), setSelectedForInstall(/* @__PURE__ */ new Set);
    else if (viewState === "plugin-details")
      setViewState("plugin-list"), setSelectedPlugin(null);
    else
      setParentViewState({
        type: "menu"
      });
  }, [viewState, targetMarketplace, setParentViewState, marketplaces.length]);
  useKeybinding("confirm:no", handleBack, {
    context: "Confirmation"
  }), import_react134.useEffect(() => {
    async function loadMarketplaceData() {
      try {
        let config11 = await loadKnownMarketplacesConfig(), {
          marketplaces: marketplaces_0,
          failures
        } = await loadMarketplacesWithGracefulDegradation(config11), marketplaceInfos = [];
        for (let {
          name: name3,
          config: marketplaceConfig,
          data: marketplace
        } of marketplaces_0)
          if (marketplace) {
            let installedFromThisMarketplace = count2(marketplace.plugins, (plugin) => isPluginInstalled(createPluginId(plugin.name, name3)));
            marketplaceInfos.push({
              name: name3,
              totalPlugins: marketplace.plugins.length,
              installedCount: installedFromThisMarketplace,
              source: getMarketplaceSourceDisplay(marketplaceConfig.source)
            });
          }
        marketplaceInfos.sort((a2, b) => {
          if (a2.name === "claude-plugin-directory")
            return -1;
          if (b.name === "claude-plugin-directory")
            return 1;
          return 0;
        }), setMarketplaces(marketplaceInfos);
        let successCount = count2(marketplaces_0, (m4) => m4.data !== null), errorResult = formatMarketplaceLoadingErrors(failures, successCount);
        if (errorResult)
          if (errorResult.type === "warning")
            setWarning(errorResult.message + ". Showing available marketplaces.");
          else
            throw Error(errorResult.message);
        if (marketplaceInfos.length === 1 && !targetMarketplace && !targetPlugin) {
          let singleMarketplace = marketplaceInfos[0];
          if (singleMarketplace)
            setSelectedMarketplace(singleMarketplace.name), setViewState("plugin-list");
        }
        if (targetPlugin) {
          let foundPlugin = null, foundMarketplace = null;
          for (let [name_0] of Object.entries(config11)) {
            let marketplace_0 = await getMarketplace(name_0);
            if (marketplace_0) {
              let plugin_0 = marketplace_0.plugins.find((p4) => p4.name === targetPlugin);
              if (plugin_0) {
                let pluginId = createPluginId(plugin_0.name, name_0);
                foundPlugin = {
                  entry: plugin_0,
                  marketplaceName: name_0,
                  pluginId,
                  isInstalled: isPluginGloballyInstalled(pluginId)
                }, foundMarketplace = name_0;
                break;
              }
            }
          }
          if (foundPlugin && foundMarketplace) {
            let pluginId_0 = foundPlugin.pluginId;
            if (isPluginGloballyInstalled(pluginId_0))
              setError(`Plugin '${pluginId_0}' is already installed globally. Use '/plugin' to manage existing plugins.`);
            else
              setSelectedMarketplace(foundMarketplace), setSelectedPlugin(foundPlugin), setViewState("plugin-details");
          } else
            setError(`Plugin "${targetPlugin}" not found in any marketplace`);
        } else if (targetMarketplace)
          if (marketplaceInfos.some((m_0) => m_0.name === targetMarketplace))
            setSelectedMarketplace(targetMarketplace), setViewState("plugin-list");
          else
            setError(`Marketplace "${targetMarketplace}" not found`);
      } catch (err2) {
        setError(err2 instanceof Error ? err2.message : "Failed to load marketplaces");
      } finally {
        setLoading(!1);
      }
    }
    loadMarketplaceData();
  }, [setError, targetMarketplace, targetPlugin]), import_react134.useEffect(() => {
    if (!selectedMarketplace)
      return;
    let cancelled = !1;
    async function loadPluginsForMarketplace(marketplaceName) {
      setLoading(!0);
      try {
        let marketplace_1 = await getMarketplace(marketplaceName);
        if (cancelled)
          return;
        if (!marketplace_1)
          throw Error(`Failed to load marketplace: ${marketplaceName}`);
        let installablePlugins = [];
        for (let entry of marketplace_1.plugins) {
          let pluginId_1 = createPluginId(entry.name, marketplaceName);
          if (isPluginBlockedByPolicy(pluginId_1))
            continue;
          installablePlugins.push({
            entry,
            marketplaceName,
            pluginId: pluginId_1,
            isInstalled: isPluginGloballyInstalled(pluginId_1)
          });
        }
        try {
          let counts = await getInstallCounts();
          if (cancelled)
            return;
          if (setInstallCounts(counts), counts)
            installablePlugins.sort((a_1, b_1) => {
              let countA = counts.get(a_1.pluginId) ?? 0, countB = counts.get(b_1.pluginId) ?? 0;
              if (countA !== countB)
                return countB - countA;
              return a_1.entry.name.localeCompare(b_1.entry.name);
            });
          else
            installablePlugins.sort((a_2, b_2) => a_2.entry.name.localeCompare(b_2.entry.name));
        } catch (error_0) {
          if (cancelled)
            return;
          logForDebugging(`Failed to fetch install counts: ${errorMessage(error_0)}`), installablePlugins.sort((a_0, b_0) => a_0.entry.name.localeCompare(b_0.entry.name));
        }
        setAvailablePlugins(installablePlugins), setSelectedIndex(0), setSelectedForInstall(/* @__PURE__ */ new Set);
      } catch (err_0) {
        if (cancelled)
          return;
        setError(err_0 instanceof Error ? err_0.message : "Failed to load plugins");
      } finally {
        setLoading(!1);
      }
    }
    return loadPluginsForMarketplace(selectedMarketplace), () => {
      cancelled = !0;
    };
  }, [selectedMarketplace, setError]);
  let installSelectedPlugins2 = async () => {
    if (selectedForInstall.size === 0)
      return;
    let pluginsToInstall = availablePlugins.filter((p_0) => selectedForInstall.has(p_0.pluginId));
    setInstallingPlugins(new Set(pluginsToInstall.map((p_1) => p_1.pluginId)));
    let successCount_0 = 0, failureCount = 0, newFailedPlugins = [];
    for (let plugin_1 of pluginsToInstall) {
      let result = await installPluginFromMarketplace({
        pluginId: plugin_1.pluginId,
        entry: plugin_1.entry,
        marketplaceName: plugin_1.marketplaceName,
        scope: "user"
      });
      if (result.success)
        successCount_0++;
      else
        failureCount++, newFailedPlugins.push({
          name: plugin_1.entry.name,
          reason: result.error
        });
    }
    if (setInstallingPlugins(/* @__PURE__ */ new Set), setSelectedForInstall(/* @__PURE__ */ new Set), clearAllCaches(), failureCount === 0) {
      let message = `\u2713 Installed ${successCount_0} ${plural(successCount_0, "plugin")}. Run /reload-plugins to activate.`;
      setResult(message);
    } else if (successCount_0 === 0)
      setError(`Failed to install: ${formatFailureDetails(newFailedPlugins, !0)}`);
    else {
      let message_0 = `\u2713 Installed ${successCount_0} of ${successCount_0 + failureCount} plugins. Failed: ${formatFailureDetails(newFailedPlugins, !1)}. Run /reload-plugins to activate successfully installed plugins.`;
      setResult(message_0);
    }
    if (successCount_0 > 0) {
      if (onInstallComplete)
        await onInstallComplete();
    }
    setParentViewState({
      type: "menu"
    });
  }, handleSinglePluginInstall = async (plugin_2, scope = "user") => {
    setIsInstalling(!0), setInstallError(null);
    let result_0 = await installPluginFromMarketplace({
      pluginId: plugin_2.pluginId,
      entry: plugin_2.entry,
      marketplaceName: plugin_2.marketplaceName,
      scope
    });
    if (result_0.success) {
      let loaded = await findPluginOptionsTarget(plugin_2.pluginId);
      if (loaded) {
        setIsInstalling(!1), setViewState({
          type: "plugin-options",
          plugin: loaded,
          pluginId: plugin_2.pluginId
        });
        return;
      }
      if (setResult(result_0.message), onInstallComplete)
        await onInstallComplete();
      setParentViewState({
        type: "menu"
      });
    } else
      setIsInstalling(!1), setInstallError(result_0.error);
  };
  import_react134.useEffect(() => {
    if (error44)
      setResult(error44);
  }, [error44, setResult]), useKeybindings({
    "select:previous": () => {
      if (selectedIndex > 0)
        setSelectedIndex(selectedIndex - 1);
    },
    "select:next": () => {
      if (selectedIndex < marketplaces.length - 1)
        setSelectedIndex(selectedIndex + 1);
    },
    "select:accept": () => {
      let marketplace_2 = marketplaces[selectedIndex];
      if (marketplace_2)
        setSelectedMarketplace(marketplace_2.name), setViewState("plugin-list");
    }
  }, {
    context: "Select",
    isActive: viewState === "marketplace-list"
  }), useKeybindings({
    "select:previous": () => {
      if (selectedIndex > 0)
        pagination9.handleSelectionChange(selectedIndex - 1, setSelectedIndex);
    },
    "select:next": () => {
      if (selectedIndex < availablePlugins.length - 1)
        pagination9.handleSelectionChange(selectedIndex + 1, setSelectedIndex);
    },
    "select:accept": () => {
      if (selectedIndex === availablePlugins.length && selectedForInstall.size > 0)
        installSelectedPlugins2();
      else if (selectedIndex < availablePlugins.length) {
        let plugin_3 = availablePlugins[selectedIndex];
        if (plugin_3)
          if (plugin_3.isInstalled)
            setParentViewState({
              type: "manage-plugins",
              targetPlugin: plugin_3.entry.name,
              targetMarketplace: plugin_3.marketplaceName
            });
          else
            setSelectedPlugin(plugin_3), setViewState("plugin-details"), setDetailsMenuIndex(0), setInstallError(null);
      }
    }
  }, {
    context: "Select",
    isActive: viewState === "plugin-list"
  }), useKeybindings({
    "plugin:toggle": () => {
      if (selectedIndex < availablePlugins.length) {
        let plugin_4 = availablePlugins[selectedIndex];
        if (plugin_4 && !plugin_4.isInstalled) {
          let newSelection = new Set(selectedForInstall);
          if (newSelection.has(plugin_4.pluginId))
            newSelection.delete(plugin_4.pluginId);
          else
            newSelection.add(plugin_4.pluginId);
          setSelectedForInstall(newSelection);
        }
      }
    },
    "plugin:install": () => {
      if (selectedForInstall.size > 0)
        installSelectedPlugins2();
    }
  }, {
    context: "Plugin",
    isActive: viewState === "plugin-list"
  });
  let detailsMenuOptions = React75.useMemo(() => {
    if (!selectedPlugin)
      return [];
    let hasHomepage = selectedPlugin.entry.homepage, githubRepo = extractGitHubRepo(selectedPlugin);
    return buildPluginDetailsMenuOptions(hasHomepage, githubRepo);
  }, [selectedPlugin]);
  if (useKeybindings({
    "select:previous": () => {
      if (detailsMenuIndex > 0)
        setDetailsMenuIndex(detailsMenuIndex - 1);
    },
    "select:next": () => {
      if (detailsMenuIndex < detailsMenuOptions.length - 1)
        setDetailsMenuIndex(detailsMenuIndex + 1);
    },
    "select:accept": () => {
      if (!selectedPlugin)
        return;
      let action2 = detailsMenuOptions[detailsMenuIndex]?.action, hasHomepage_0 = selectedPlugin.entry.homepage, githubRepo_0 = extractGitHubRepo(selectedPlugin);
      if (action2 === "install-user")
        handleSinglePluginInstall(selectedPlugin, "user");
      else if (action2 === "install-project")
        handleSinglePluginInstall(selectedPlugin, "project");
      else if (action2 === "install-local")
        handleSinglePluginInstall(selectedPlugin, "local");
      else if (action2 === "homepage" && hasHomepage_0)
        openBrowser(hasHomepage_0);
      else if (action2 === "github" && githubRepo_0)
        openBrowser(`https://github.com/${githubRepo_0}`);
      else if (action2 === "back")
        setViewState("plugin-list"), setSelectedPlugin(null);
    }
  }, {
    context: "Select",
    isActive: viewState === "plugin-details" && !!selectedPlugin
  }), typeof viewState === "object" && viewState.type === "plugin-options") {
    let finish = function(msg) {
      if (setResult(msg), onInstallComplete)
        onInstallComplete();
      setParentViewState({
        type: "menu"
      });
    }, {
      plugin: plugin_5,
      pluginId: pluginId_2
    } = viewState;
    return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(PluginOptionsFlow, {
      plugin: plugin_5,
      pluginId: pluginId_2,
      onDone: (outcome, detail) => {
        switch (outcome) {
          case "configured":
            finish(`\u2713 Installed and configured ${plugin_5.name}. Run /reload-plugins to apply.`);
            break;
          case "skipped":
            finish(`\u2713 Installed ${plugin_5.name}. Run /reload-plugins to apply.`);
            break;
          case "error":
            finish(`Installed but failed to save config: ${detail}`);
            break;
        }
      }
    }, void 0, !1, void 0, this);
  }
  if (loading)
    return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
      children: "Loading\u2026"
    }, void 0, !1, void 0, this);
  if (error44)
    return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
      color: "error",
      children: error44
    }, void 0, !1, void 0, this);
  if (viewState === "marketplace-list") {
    if (marketplaces.length === 0)
      return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
            marginBottom: 1,
            children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              bold: !0,
              children: "Select marketplace"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            children: "No marketplaces configured."
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Add a marketplace first using ",
              "'Add marketplace'",
              "."
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            paddingLeft: 1,
            children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              dimColor: !0,
              children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "go back"
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            bold: !0,
            children: "Select marketplace"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        warning && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          flexDirection: "column",
          children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            color: "warning",
            children: [
              figures_default.warning,
              " ",
              warning
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        marketplaces.map((marketplace_3, index) => /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginBottom: index < marketplaces.length - 1 ? 1 : 0,
          children: [
            /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
              children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                color: selectedIndex === index ? "suggestion" : void 0,
                children: [
                  selectedIndex === index ? figures_default.pointer : " ",
                  " ",
                  marketplace_3.name
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
              marginLeft: 2,
              children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  marketplace_3.totalPlugins,
                  " ",
                  plural(marketplace_3.totalPlugins, "plugin"),
                  " available",
                  marketplace_3.installedCount > 0 && ` \xB7 ${marketplace_3.installedCount} already installed`,
                  marketplace_3.source && ` \xB7 ${marketplace_3.source}`
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, marketplace_3.name, !0, void 0, this)),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(Byline, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ConfigurableShortcutHint, {
                  action: "select:accept",
                  context: "Select",
                  fallback: "Enter",
                  description: "select"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ConfigurableShortcutHint, {
                  action: "confirm:no",
                  context: "Confirmation",
                  fallback: "Esc",
                  description: "go back"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  if (viewState === "plugin-details" && selectedPlugin) {
    let hasHomepage_1 = selectedPlugin.entry.homepage, githubRepo_1 = extractGitHubRepo(selectedPlugin), menuOptions = buildPluginDetailsMenuOptions(hasHomepage_1, githubRepo_1);
    return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            bold: !0,
            children: "Plugin Details"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginBottom: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              bold: !0,
              children: selectedPlugin.entry.name
            }, void 0, !1, void 0, this),
            selectedPlugin.entry.version && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Version: ",
                selectedPlugin.entry.version
              ]
            }, void 0, !0, void 0, this),
            selectedPlugin.entry.description && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
              marginTop: 1,
              children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                children: selectedPlugin.entry.description
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            selectedPlugin.entry.author && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
              marginTop: 1,
              children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "By:",
                  " ",
                  typeof selectedPlugin.entry.author === "string" ? selectedPlugin.entry.author : selectedPlugin.entry.author.name
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginBottom: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              bold: !0,
              children: "Will install:"
            }, void 0, !1, void 0, this),
            selectedPlugin.entry.commands && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "\xB7 Commands:",
                " ",
                Array.isArray(selectedPlugin.entry.commands) ? selectedPlugin.entry.commands.join(", ") : Object.keys(selectedPlugin.entry.commands).join(", ")
              ]
            }, void 0, !0, void 0, this),
            selectedPlugin.entry.agents && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "\xB7 Agents:",
                " ",
                Array.isArray(selectedPlugin.entry.agents) ? selectedPlugin.entry.agents.join(", ") : Object.keys(selectedPlugin.entry.agents).join(", ")
              ]
            }, void 0, !0, void 0, this),
            selectedPlugin.entry.hooks && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "\xB7 Hooks: ",
                Object.keys(selectedPlugin.entry.hooks).join(", ")
              ]
            }, void 0, !0, void 0, this),
            selectedPlugin.entry.mcpServers && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "\xB7 MCP Servers:",
                " ",
                Array.isArray(selectedPlugin.entry.mcpServers) ? selectedPlugin.entry.mcpServers.join(", ") : typeof selectedPlugin.entry.mcpServers === "object" ? Object.keys(selectedPlugin.entry.mcpServers).join(", ") : "configured"
              ]
            }, void 0, !0, void 0, this),
            !selectedPlugin.entry.commands && !selectedPlugin.entry.agents && !selectedPlugin.entry.hooks && !selectedPlugin.entry.mcpServers && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(jsx_dev_runtime238.Fragment, {
              children: typeof selectedPlugin.entry.source === "object" && "source" in selectedPlugin.entry.source && (selectedPlugin.entry.source.source === "github" || selectedPlugin.entry.source.source === "url" || selectedPlugin.entry.source.source === "npm" || selectedPlugin.entry.source.source === "pip") ? /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "\xB7 Component summary not available for remote plugin"
              }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "\xB7 Components will be discovered at installation"
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(PluginTrustWarning, {}, void 0, !1, void 0, this),
        installError && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            color: "error",
            children: [
              "Error: ",
              installError
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: menuOptions.map((option, index_0) => /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
            children: [
              detailsMenuIndex === index_0 && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                children: "> "
              }, void 0, !1, void 0, this),
              detailsMenuIndex !== index_0 && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                children: "  "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                bold: detailsMenuIndex === index_0,
                children: isInstalling && option.action === "install" ? "Installing\u2026" : option.label
              }, void 0, !1, void 0, this)
            ]
          }, option.action, !0, void 0, this))
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          paddingLeft: 1,
          children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            dimColor: !0,
            children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(Byline, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ConfigurableShortcutHint, {
                  action: "select:accept",
                  context: "Select",
                  fallback: "Enter",
                  description: "select"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ConfigurableShortcutHint, {
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
  if (availablePlugins.length === 0)
    return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            bold: !0,
            children: "Install plugins"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "No new plugins available to install."
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "All plugins from this marketplace are already installed."
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          marginLeft: 3,
          children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "go back"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  let visiblePlugins = pagination9.getVisibleItems(availablePlugins);
  return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
          bold: !0,
          children: "Install Plugins"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      pagination9.scrollPosition.canScrollUp && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            figures_default.arrowUp,
            " more above"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      visiblePlugins.map((plugin_6, visibleIndex) => {
        let actualIndex = pagination9.toActualIndex(visibleIndex), isSelected = selectedIndex === actualIndex, isSelectedForInstall = selectedForInstall.has(plugin_6.pluginId), isInstalling_0 = installingPlugins.has(plugin_6.pluginId), isLast = visibleIndex === visiblePlugins.length - 1;
        return /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginBottom: isLast && !error44 ? 0 : 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                  color: isSelected ? "suggestion" : void 0,
                  children: [
                    isSelected ? figures_default.pointer : " ",
                    " "
                  ]
                }, void 0, !0, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                  color: plugin_6.isInstalled ? "success" : void 0,
                  children: [
                    plugin_6.isInstalled ? figures_default.tick : isInstalling_0 ? figures_default.ellipsis : isSelectedForInstall ? figures_default.radioOn : figures_default.radioOff,
                    " ",
                    plugin_6.entry.name,
                    plugin_6.entry.category && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: [
                        " [",
                        plugin_6.entry.category,
                        "]"
                      ]
                    }, void 0, !0, void 0, this),
                    plugin_6.entry.tags?.includes("community-managed") && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: " [Community Managed]"
                    }, void 0, !1, void 0, this),
                    plugin_6.isInstalled && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: " (installed)"
                    }, void 0, !1, void 0, this),
                    installCounts && selectedMarketplace === OFFICIAL_MARKETPLACE_NAME && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: [
                        " \xB7 ",
                        formatInstallCount(installCounts.get(plugin_6.pluginId) ?? 0),
                        " ",
                        "installs"
                      ]
                    }, void 0, !0, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            plugin_6.entry.description && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
              marginLeft: 4,
              children: [
                /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: truncateToWidth(plugin_6.entry.description, 60)
                }, void 0, !1, void 0, this),
                plugin_6.entry.version && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: [
                    " \xB7 v",
                    plugin_6.entry.version
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, plugin_6.pluginId, !0, void 0, this);
      }),
      pagination9.scrollPosition.canScrollDown && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            figures_default.arrowDown,
            " more below"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      error44 && /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(ThemedText, {
          color: "error",
          children: [
            figures_default.cross,
            " ",
            error44
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime238.jsxDEV(PluginSelectionKeyHint, {
        hasSelection: selectedForInstall.size > 0
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
