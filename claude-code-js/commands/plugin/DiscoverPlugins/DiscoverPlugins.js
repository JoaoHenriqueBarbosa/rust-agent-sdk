// function: DiscoverPlugins
function DiscoverPlugins({
  error: error44,
  setError,
  result: _result,
  setResult,
  setViewState: setParentViewState,
  onInstallComplete,
  onSearchModeChange,
  targetPlugin
}) {
  let [viewState, setViewState] = import_react135.useState("plugin-list"), [selectedPlugin, setSelectedPlugin] = import_react135.useState(null), [availablePlugins, setAvailablePlugins] = import_react135.useState([]), [loading, setLoading] = import_react135.useState(!0), [installCounts, setInstallCounts] = import_react135.useState(null), [isSearchMode, setIsSearchModeRaw] = import_react135.useState(!1), setIsSearchMode = import_react135.useCallback((active) => {
    setIsSearchModeRaw(active), onSearchModeChange?.(active);
  }, [onSearchModeChange]), {
    query: searchQuery,
    setQuery: setSearchQuery,
    cursorOffset: searchCursorOffset
  } = useSearchInput({
    isActive: viewState === "plugin-list" && isSearchMode && !loading,
    onExit: () => {
      setIsSearchMode(!1);
    }
  }), isTerminalFocused = useTerminalFocus(), {
    columns: terminalWidth
  } = useTerminalSize(), filteredPlugins = import_react135.useMemo(() => {
    if (!searchQuery)
      return availablePlugins;
    let lowerQuery = searchQuery.toLowerCase();
    return availablePlugins.filter((plugin) => plugin.entry.name.toLowerCase().includes(lowerQuery) || plugin.entry.description?.toLowerCase().includes(lowerQuery) || plugin.marketplaceName.toLowerCase().includes(lowerQuery));
  }, [availablePlugins, searchQuery]), [selectedIndex, setSelectedIndex] = import_react135.useState(0), [selectedForInstall, setSelectedForInstall] = import_react135.useState(/* @__PURE__ */ new Set), [installingPlugins, setInstallingPlugins] = import_react135.useState(/* @__PURE__ */ new Set), pagination9 = usePagination2({
    totalItems: filteredPlugins.length,
    selectedIndex
  });
  import_react135.useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);
  let [detailsMenuIndex, setDetailsMenuIndex] = import_react135.useState(0), [isInstalling, setIsInstalling] = import_react135.useState(!1), [installError, setInstallError] = import_react135.useState(null), [warning, setWarning] = import_react135.useState(null), [emptyReason, setEmptyReason] = import_react135.useState(null);
  import_react135.useEffect(() => {
    async function loadAllPlugins2() {
      try {
        let config11 = await loadKnownMarketplacesConfig(), {
          marketplaces,
          failures
        } = await loadMarketplacesWithGracefulDegradation(config11), allPlugins = [];
        for (let {
          name: name3,
          data: marketplace
        } of marketplaces)
          if (marketplace)
            for (let entry of marketplace.plugins) {
              let pluginId = createPluginId(entry.name, name3);
              allPlugins.push({
                entry,
                marketplaceName: name3,
                pluginId,
                isInstalled: isPluginGloballyInstalled(pluginId)
              });
            }
        let uninstalledPlugins = allPlugins.filter((p4) => !p4.isInstalled && !isPluginBlockedByPolicy(p4.pluginId));
        try {
          let counts = await getInstallCounts();
          if (setInstallCounts(counts), counts)
            uninstalledPlugins.sort((a_0, b_0) => {
              let countA = counts.get(a_0.pluginId) ?? 0, countB = counts.get(b_0.pluginId) ?? 0;
              if (countA !== countB)
                return countB - countA;
              return a_0.entry.name.localeCompare(b_0.entry.name);
            });
          else
            uninstalledPlugins.sort((a_1, b_1) => a_1.entry.name.localeCompare(b_1.entry.name));
        } catch (error_0) {
          logForDebugging(`Failed to fetch install counts: ${errorMessage(error_0)}`), uninstalledPlugins.sort((a2, b) => a2.entry.name.localeCompare(b.entry.name));
        }
        setAvailablePlugins(uninstalledPlugins);
        let configuredCount = Object.keys(config11).length;
        if (uninstalledPlugins.length === 0) {
          let reason = await detectEmptyMarketplaceReason({
            configuredMarketplaceCount: configuredCount,
            failedMarketplaceCount: failures.length
          });
          setEmptyReason(reason);
        }
        let successCount = count2(marketplaces, (m4) => m4.data !== null), errorResult = formatMarketplaceLoadingErrors(failures, successCount);
        if (errorResult)
          if (errorResult.type === "warning")
            setWarning(errorResult.message + ". Showing available plugins.");
          else
            throw Error(errorResult.message);
        if (targetPlugin) {
          let foundPlugin = allPlugins.find((p_0) => p_0.entry.name === targetPlugin);
          if (foundPlugin)
            if (foundPlugin.isInstalled)
              setError(`Plugin '${foundPlugin.pluginId}' is already installed. Use '/plugin' to manage existing plugins.`);
            else
              setSelectedPlugin(foundPlugin), setViewState("plugin-details");
          else
            setError(`Plugin "${targetPlugin}" not found in any marketplace`);
        }
      } catch (err2) {
        setError(err2 instanceof Error ? err2.message : "Failed to load plugins");
      } finally {
        setLoading(!1);
      }
    }
    loadAllPlugins2();
  }, [setError, targetPlugin]);
  let installSelectedPlugins2 = async () => {
    if (selectedForInstall.size === 0)
      return;
    let pluginsToInstall = availablePlugins.filter((p_1) => selectedForInstall.has(p_1.pluginId));
    setInstallingPlugins(new Set(pluginsToInstall.map((p_2) => p_2.pluginId)));
    let successCount_0 = 0, failureCount = 0, newFailedPlugins = [];
    for (let plugin_0 of pluginsToInstall) {
      let result = await installPluginFromMarketplace({
        pluginId: plugin_0.pluginId,
        entry: plugin_0.entry,
        marketplaceName: plugin_0.marketplaceName,
        scope: "user"
      });
      if (result.success)
        successCount_0++;
      else
        failureCount++, newFailedPlugins.push({
          name: plugin_0.entry.name,
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
  }, handleSinglePluginInstall = async (plugin_1, scope = "user") => {
    setIsInstalling(!0), setInstallError(null);
    let result_0 = await installPluginFromMarketplace({
      pluginId: plugin_1.pluginId,
      entry: plugin_1.entry,
      marketplaceName: plugin_1.marketplaceName,
      scope
    });
    if (result_0.success) {
      let loaded = await findPluginOptionsTarget(plugin_1.pluginId);
      if (loaded) {
        setIsInstalling(!1), setViewState({
          type: "plugin-options",
          plugin: loaded,
          pluginId: plugin_1.pluginId
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
  import_react135.useEffect(() => {
    if (error44)
      setResult(error44);
  }, [error44, setResult]), useKeybinding("confirm:no", () => {
    setViewState("plugin-list"), setSelectedPlugin(null);
  }, {
    context: "Confirmation",
    isActive: viewState === "plugin-details"
  }), useKeybinding("confirm:no", () => {
    setParentViewState({
      type: "menu"
    });
  }, {
    context: "Confirmation",
    isActive: viewState === "plugin-list" && !isSearchMode
  }), use_input_default((input, _key) => {
    let keyIsNotCtrlOrMeta = !_key.ctrl && !_key.meta;
    if (!isSearchMode) {
      if (input === "/" && keyIsNotCtrlOrMeta)
        setIsSearchMode(!0), setSearchQuery("");
      else if (keyIsNotCtrlOrMeta && input.length > 0 && !/^\s+$/.test(input) && input !== "j" && input !== "k" && input !== "i")
        setIsSearchMode(!0), setSearchQuery(input);
    }
  }, {
    isActive: viewState === "plugin-list" && !loading
  }), useKeybindings({
    "select:previous": () => {
      if (selectedIndex === 0)
        setIsSearchMode(!0);
      else
        pagination9.handleSelectionChange(selectedIndex - 1, setSelectedIndex);
    },
    "select:next": () => {
      if (selectedIndex < filteredPlugins.length - 1)
        pagination9.handleSelectionChange(selectedIndex + 1, setSelectedIndex);
    },
    "select:accept": () => {
      if (selectedIndex === filteredPlugins.length && selectedForInstall.size > 0)
        installSelectedPlugins2();
      else if (selectedIndex < filteredPlugins.length) {
        let plugin_2 = filteredPlugins[selectedIndex];
        if (plugin_2)
          if (plugin_2.isInstalled)
            setParentViewState({
              type: "manage-plugins",
              targetPlugin: plugin_2.entry.name,
              targetMarketplace: plugin_2.marketplaceName
            });
          else
            setSelectedPlugin(plugin_2), setViewState("plugin-details"), setDetailsMenuIndex(0), setInstallError(null);
      }
    }
  }, {
    context: "Select",
    isActive: viewState === "plugin-list" && !isSearchMode
  }), useKeybindings({
    "plugin:toggle": () => {
      if (selectedIndex < filteredPlugins.length) {
        let plugin_3 = filteredPlugins[selectedIndex];
        if (plugin_3 && !plugin_3.isInstalled) {
          let newSelection = new Set(selectedForInstall);
          if (newSelection.has(plugin_3.pluginId))
            newSelection.delete(plugin_3.pluginId);
          else
            newSelection.add(plugin_3.pluginId);
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
    isActive: viewState === "plugin-list" && !isSearchMode
  });
  let detailsMenuOptions = React76.useMemo(() => {
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
      plugin: plugin_4,
      pluginId: pluginId_0
    } = viewState;
    return /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(PluginOptionsFlow, {
      plugin: plugin_4,
      pluginId: pluginId_0,
      onDone: (outcome, detail) => {
        switch (outcome) {
          case "configured":
            finish(`\u2713 Installed and configured ${plugin_4.name}. Run /reload-plugins to apply.`);
            break;
          case "skipped":
            finish(`\u2713 Installed ${plugin_4.name}. Run /reload-plugins to apply.`);
            break;
          case "error":
            finish(`Installed but failed to save config: ${detail}`);
            break;
        }
      }
    }, void 0, !1, void 0, this);
  }
  if (loading)
    return /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
      children: "Loading\u2026"
    }, void 0, !1, void 0, this);
  if (error44)
    return /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
      color: "error",
      children: error44
    }, void 0, !1, void 0, this);
  if (viewState === "plugin-details" && selectedPlugin) {
    let hasHomepage_1 = selectedPlugin.entry.homepage, githubRepo_1 = extractGitHubRepo(selectedPlugin), menuOptions = buildPluginDetailsMenuOptions(hasHomepage_1, githubRepo_1);
    return /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
            bold: !0,
            children: "Plugin details"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginBottom: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              bold: !0,
              children: selectedPlugin.entry.name
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "from ",
                selectedPlugin.marketplaceName
              ]
            }, void 0, !0, void 0, this),
            selectedPlugin.entry.version && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Version: ",
                selectedPlugin.entry.version
              ]
            }, void 0, !0, void 0, this),
            selectedPlugin.entry.description && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
              marginTop: 1,
              children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                children: selectedPlugin.entry.description
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            selectedPlugin.entry.author && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
              marginTop: 1,
              children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
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
        /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(PluginTrustWarning, {}, void 0, !1, void 0, this),
        installError && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
            color: "error",
            children: [
              "Error: ",
              installError
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: menuOptions.map((option, index) => /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
            children: [
              detailsMenuIndex === index && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                children: "> "
              }, void 0, !1, void 0, this),
              detailsMenuIndex !== index && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                children: "  "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                bold: detailsMenuIndex === index,
                children: isInstalling && option.action.startsWith("install-") ? "Installing\u2026" : option.label
              }, void 0, !1, void 0, this)
            ]
          }, option.action, !0, void 0, this))
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
            dimColor: !0,
            children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(Byline, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ConfigurableShortcutHint, {
                  action: "select:accept",
                  context: "Select",
                  fallback: "Enter",
                  description: "select"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ConfigurableShortcutHint, {
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
    return /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
            bold: !0,
            children: "Discover plugins"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(EmptyStateMessage, {
          reason: emptyReason
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: "Esc to go back"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  let visiblePlugins = pagination9.getVisibleItems(filteredPlugins);
  return /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
            bold: !0,
            children: "Discover plugins"
          }, void 0, !1, void 0, this),
          pagination9.needsPagination && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " ",
              "(",
              pagination9.scrollPosition.current,
              "/",
              pagination9.scrollPosition.total,
              ")"
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(SearchBox, {
          query: searchQuery,
          isFocused: isSearchMode,
          isTerminalFocused,
          width: terminalWidth - 4,
          cursorOffset: searchCursorOffset
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      warning && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
          color: "warning",
          children: [
            figures_default.warning,
            " ",
            warning
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      filteredPlugins.length === 0 && searchQuery && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            'No plugins match "',
            searchQuery,
            '"'
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      pagination9.scrollPosition.canScrollUp && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            figures_default.arrowUp,
            " more above"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      visiblePlugins.map((plugin_5, visibleIndex) => {
        let actualIndex = pagination9.toActualIndex(visibleIndex), isSelected = selectedIndex === actualIndex, isSelectedForInstall = selectedForInstall.has(plugin_5.pluginId), isInstallingThis = installingPlugins.has(plugin_5.pluginId), isLast = visibleIndex === visiblePlugins.length - 1;
        return /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginBottom: isLast && !error44 ? 0 : 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                  color: isSelected && !isSearchMode ? "suggestion" : void 0,
                  children: [
                    isSelected && !isSearchMode ? figures_default.pointer : " ",
                    " "
                  ]
                }, void 0, !0, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                  children: [
                    isInstallingThis ? figures_default.ellipsis : isSelectedForInstall ? figures_default.radioOn : figures_default.radioOff,
                    " ",
                    plugin_5.entry.name,
                    /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: [
                        " \xB7 ",
                        plugin_5.marketplaceName
                      ]
                    }, void 0, !0, void 0, this),
                    plugin_5.entry.tags?.includes("community-managed") && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: " [Community Managed]"
                    }, void 0, !1, void 0, this),
                    installCounts && plugin_5.marketplaceName === OFFICIAL_MARKETPLACE_NAME && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: [
                        " \xB7 ",
                        formatInstallCount(installCounts.get(plugin_5.pluginId) ?? 0),
                        " ",
                        "installs"
                      ]
                    }, void 0, !0, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            plugin_5.entry.description && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
              marginLeft: 4,
              children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
                dimColor: !0,
                children: truncateToWidth(plugin_5.entry.description, 60)
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, `${pagination9.startIndex}-${plugin_5.pluginId}`, !0, void 0, this);
      }),
      pagination9.scrollPosition.canScrollDown && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            figures_default.arrowDown,
            " more below"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      error44 && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
          color: "error",
          children: [
            figures_default.cross,
            " ",
            error44
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(DiscoverPluginsKeyHint, {
        hasSelection: selectedForInstall.size > 0,
        canToggle: selectedIndex < filteredPlugins.length && !filteredPlugins[selectedIndex]?.isInstalled
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
