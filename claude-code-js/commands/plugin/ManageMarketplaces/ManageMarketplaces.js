// function: ManageMarketplaces
function ManageMarketplaces({
  setViewState,
  error: error44,
  setError,
  setResult,
  exitState,
  onManageComplete,
  targetMarketplace,
  action: action2
}) {
  let [marketplaceStates, setMarketplaceStates] = import_react136.useState([]), [loading, setLoading] = import_react136.useState(!0), [selectedIndex, setSelectedIndex] = import_react136.useState(0), [isProcessing, setIsProcessing] = import_react136.useState(!1), [processError, setProcessError] = import_react136.useState(null), [successMessage, setSuccessMessage] = import_react136.useState(null), [progressMessage, setProgressMessage] = import_react136.useState(null), [internalView, setInternalView] = import_react136.useState("list"), [selectedMarketplace, setSelectedMarketplace] = import_react136.useState(null), [detailsMenuIndex, setDetailsMenuIndex] = import_react136.useState(0), hasAttemptedAutoAction = import_react136.useRef(!1);
  import_react136.useEffect(() => {
    async function loadMarketplaces() {
      try {
        let config11 = await loadKnownMarketplacesConfig(), {
          enabled: enabled2,
          disabled
        } = await loadAllPlugins(), allPlugins = [...enabled2, ...disabled], {
          marketplaces,
          failures
        } = await loadMarketplacesWithGracefulDegradation(config11), states = [];
        for (let {
          name: name3,
          config: entry,
          data: marketplace
        } of marketplaces) {
          let installedFromMarketplace = allPlugins.filter((plugin) => plugin.source.endsWith(`@${name3}`));
          states.push({
            name: name3,
            source: getMarketplaceSourceDisplay(entry.source),
            lastUpdated: entry.lastUpdated,
            pluginCount: marketplace?.plugins.length,
            installedPlugins: installedFromMarketplace,
            pendingUpdate: !1,
            pendingRemove: !1,
            autoUpdate: isMarketplaceAutoUpdate(name3, entry)
          });
        }
        states.sort((a2, b) => {
          if (a2.name === "claude-plugin-directory")
            return -1;
          if (b.name === "claude-plugin-directory")
            return 1;
          return a2.name.localeCompare(b.name);
        }), setMarketplaceStates(states);
        let successCount = count2(marketplaces, (m4) => m4.data !== null), errorResult = formatMarketplaceLoadingErrors(failures, successCount);
        if (errorResult)
          if (errorResult.type === "warning")
            setProcessError(errorResult.message);
          else
            throw Error(errorResult.message);
        if (targetMarketplace && !hasAttemptedAutoAction.current && !error44) {
          hasAttemptedAutoAction.current = !0;
          let targetIndex = states.findIndex((s2) => s2.name === targetMarketplace);
          if (targetIndex >= 0) {
            let targetState = states[targetIndex];
            if (action2) {
              setSelectedIndex(targetIndex + 1);
              let newStates = [...states];
              if (action2 === "update")
                newStates[targetIndex].pendingUpdate = !0;
              else if (action2 === "remove")
                newStates[targetIndex].pendingRemove = !0;
              setMarketplaceStates(newStates), setTimeout(applyChanges, 100, newStates);
            } else if (targetState)
              setSelectedIndex(targetIndex + 1), setSelectedMarketplace(targetState), setInternalView("details");
          } else if (setError)
            setError(`Marketplace not found: ${targetMarketplace}`);
        }
      } catch (err2) {
        if (setError)
          setError(err2 instanceof Error ? err2.message : "Failed to load marketplaces");
        setProcessError(err2 instanceof Error ? err2.message : "Failed to load marketplaces");
      } finally {
        setLoading(!1);
      }
    }
    loadMarketplaces();
  }, [targetMarketplace, action2, error44]);
  let hasPendingChanges = () => {
    return marketplaceStates.some((state3) => state3.pendingUpdate || state3.pendingRemove);
  }, getPendingCounts = () => {
    let updateCount2 = count2(marketplaceStates, (s2) => s2.pendingUpdate), removeCount2 = count2(marketplaceStates, (s2) => s2.pendingRemove);
    return {
      updateCount: updateCount2,
      removeCount: removeCount2
    };
  }, applyChanges = async (states) => {
    let statesToProcess = states || marketplaceStates, wasInDetailsView = internalView === "details";
    setIsProcessing(!0), setProcessError(null), setSuccessMessage(null), setProgressMessage(null);
    try {
      let settings = getSettingsForSource("userSettings"), updatedCount = 0, removedCount = 0, refreshedMarketplaces = /* @__PURE__ */ new Set;
      for (let state3 of statesToProcess) {
        if (state3.pendingRemove) {
          if (state3.installedPlugins && state3.installedPlugins.length > 0) {
            let newEnabledPlugins = {
              ...settings?.enabledPlugins
            };
            for (let plugin of state3.installedPlugins) {
              let pluginId = createPluginId(plugin.name, state3.name);
              newEnabledPlugins[pluginId] = !1;
            }
            updateSettingsForSource("userSettings", {
              enabledPlugins: newEnabledPlugins
            });
          }
          await removeMarketplaceSource(state3.name), removedCount++, logEvent("tengu_marketplace_removed", {
            marketplace_name: state3.name,
            plugins_uninstalled: state3.installedPlugins?.length || 0
          });
          continue;
        }
        if (state3.pendingUpdate)
          await refreshMarketplace(state3.name, (message) => {
            setProgressMessage(message);
          }), updatedCount++, refreshedMarketplaces.add(state3.name.toLowerCase()), logEvent("tengu_marketplace_updated", {
            marketplace_name: state3.name
          });
      }
      let updatedPluginCount = 0;
      if (refreshedMarketplaces.size > 0)
        updatedPluginCount = (await updatePluginsForMarketplaces(refreshedMarketplaces)).length;
      if (clearAllCaches(), onManageComplete)
        await onManageComplete();
      let config11 = await loadKnownMarketplacesConfig(), {
        enabled: enabled2,
        disabled
      } = await loadAllPlugins(), allPlugins = [...enabled2, ...disabled], {
        marketplaces
      } = await loadMarketplacesWithGracefulDegradation(config11), newStates = [];
      for (let {
        name: name3,
        config: entry,
        data: marketplace
      } of marketplaces) {
        let installedFromMarketplace = allPlugins.filter((plugin) => plugin.source.endsWith(`@${name3}`));
        newStates.push({
          name: name3,
          source: getMarketplaceSourceDisplay(entry.source),
          lastUpdated: entry.lastUpdated,
          pluginCount: marketplace?.plugins.length,
          installedPlugins: installedFromMarketplace,
          pendingUpdate: !1,
          pendingRemove: !1,
          autoUpdate: isMarketplaceAutoUpdate(name3, entry)
        });
      }
      if (newStates.sort((a2, b) => {
        if (a2.name === "claude-plugin-directory")
          return -1;
        if (b.name === "claude-plugin-directory")
          return 1;
        return a2.name.localeCompare(b.name);
      }), setMarketplaceStates(newStates), wasInDetailsView && selectedMarketplace) {
        let updatedMarketplace = newStates.find((s2) => s2.name === selectedMarketplace.name);
        if (updatedMarketplace)
          setSelectedMarketplace(updatedMarketplace);
      }
      let actions = [];
      if (updatedCount > 0) {
        let pluginPart = updatedPluginCount > 0 ? ` (${updatedPluginCount} ${plural(updatedPluginCount, "plugin")} bumped)` : "";
        actions.push(`Updated ${updatedCount} ${plural(updatedCount, "marketplace")}${pluginPart}`);
      }
      if (removedCount > 0)
        actions.push(`Removed ${removedCount} ${plural(removedCount, "marketplace")}`);
      if (actions.length > 0) {
        let successMsg = `${figures_default.tick} ${actions.join(", ")}`;
        if (wasInDetailsView)
          setSuccessMessage(successMsg);
        else
          setResult(successMsg), setTimeout(setViewState, 2000, {
            type: "menu"
          });
      } else if (!wasInDetailsView)
        setViewState({
          type: "menu"
        });
    } catch (err2) {
      let errorMsg = errorMessage(err2);
      if (setProcessError(errorMsg), setError)
        setError(errorMsg);
    } finally {
      setIsProcessing(!1), setProgressMessage(null);
    }
  }, confirmRemove = async () => {
    if (!selectedMarketplace)
      return;
    let newStates = marketplaceStates.map((state3) => state3.name === selectedMarketplace.name ? {
      ...state3,
      pendingRemove: !0
    } : state3);
    setMarketplaceStates(newStates), await applyChanges(newStates);
  }, buildDetailsMenuOptions = (marketplace) => {
    if (!marketplace)
      return [];
    let options2 = [{
      label: `Browse plugins (${marketplace.pluginCount ?? 0})`,
      value: "browse"
    }, {
      label: "Update marketplace",
      secondaryLabel: marketplace.lastUpdated ? `(last updated ${new Date(marketplace.lastUpdated).toLocaleDateString()})` : void 0,
      value: "update"
    }];
    if (!shouldSkipPluginAutoupdate())
      options2.push({
        label: marketplace.autoUpdate ? "Disable auto-update" : "Enable auto-update",
        value: "toggle-auto-update"
      });
    return options2.push({
      label: "Remove marketplace",
      value: "remove"
    }), options2;
  }, handleToggleAutoUpdate = async (marketplace) => {
    let newAutoUpdate = !marketplace.autoUpdate;
    try {
      await setMarketplaceAutoUpdate(marketplace.name, newAutoUpdate), setMarketplaceStates((prev) => prev.map((state3) => state3.name === marketplace.name ? {
        ...state3,
        autoUpdate: newAutoUpdate
      } : state3)), setSelectedMarketplace((prev) => prev ? {
        ...prev,
        autoUpdate: newAutoUpdate
      } : prev);
    } catch (err2) {
      setProcessError(err2 instanceof Error ? err2.message : "Failed to update setting");
    }
  };
  if (useKeybinding("confirm:no", () => {
    setInternalView("list"), setDetailsMenuIndex(0);
  }, {
    context: "Confirmation",
    isActive: !isProcessing && (internalView === "details" || internalView === "confirm-remove")
  }), useKeybinding("confirm:no", () => {
    setMarketplaceStates((prev) => prev.map((state3) => ({
      ...state3,
      pendingUpdate: !1,
      pendingRemove: !1
    }))), setSelectedIndex(0);
  }, {
    context: "Confirmation",
    isActive: !isProcessing && internalView === "list" && hasPendingChanges()
  }), useKeybinding("confirm:no", () => {
    setViewState({
      type: "menu"
    });
  }, {
    context: "Confirmation",
    isActive: !isProcessing && internalView === "list" && !hasPendingChanges()
  }), useKeybindings({
    "select:previous": () => setSelectedIndex((prev) => Math.max(0, prev - 1)),
    "select:next": () => {
      let totalItems = marketplaceStates.length + 1;
      setSelectedIndex((prev) => Math.min(totalItems - 1, prev + 1));
    },
    "select:accept": () => {
      let marketplaceIndex = selectedIndex - 1;
      if (selectedIndex === 0)
        setViewState({
          type: "add-marketplace"
        });
      else if (hasPendingChanges())
        applyChanges();
      else {
        let marketplace = marketplaceStates[marketplaceIndex];
        if (marketplace)
          setSelectedMarketplace(marketplace), setInternalView("details"), setDetailsMenuIndex(0);
      }
    }
  }, {
    context: "Select",
    isActive: !isProcessing && internalView === "list"
  }), use_input_default((input) => {
    let marketplaceIndex = selectedIndex - 1;
    if ((input === "u" || input === "U") && marketplaceIndex >= 0)
      setMarketplaceStates((prev) => prev.map((state3, idx) => idx === marketplaceIndex ? {
        ...state3,
        pendingUpdate: !state3.pendingUpdate,
        pendingRemove: state3.pendingUpdate ? state3.pendingRemove : !1
      } : state3));
    else if ((input === "r" || input === "R") && marketplaceIndex >= 0) {
      let marketplace = marketplaceStates[marketplaceIndex];
      if (marketplace)
        setSelectedMarketplace(marketplace), setInternalView("confirm-remove");
    }
  }, {
    isActive: !isProcessing && internalView === "list"
  }), useKeybindings({
    "select:previous": () => setDetailsMenuIndex((prev) => Math.max(0, prev - 1)),
    "select:next": () => {
      let menuOptions = buildDetailsMenuOptions(selectedMarketplace);
      setDetailsMenuIndex((prev) => Math.min(menuOptions.length - 1, prev + 1));
    },
    "select:accept": () => {
      if (!selectedMarketplace)
        return;
      let selectedOption = buildDetailsMenuOptions(selectedMarketplace)[detailsMenuIndex];
      if (selectedOption?.value === "browse")
        setViewState({
          type: "browse-marketplace",
          targetMarketplace: selectedMarketplace.name
        });
      else if (selectedOption?.value === "update") {
        let newStates = marketplaceStates.map((state3) => state3.name === selectedMarketplace.name ? {
          ...state3,
          pendingUpdate: !0
        } : state3);
        setMarketplaceStates(newStates), applyChanges(newStates);
      } else if (selectedOption?.value === "toggle-auto-update")
        handleToggleAutoUpdate(selectedMarketplace);
      else if (selectedOption?.value === "remove")
        setInternalView("confirm-remove");
    }
  }, {
    context: "Select",
    isActive: !isProcessing && internalView === "details"
  }), use_input_default((input) => {
    if (input === "y" || input === "Y")
      confirmRemove();
    else if (input === "n" || input === "N")
      setInternalView("list"), setSelectedMarketplace(null);
  }, {
    isActive: !isProcessing && internalView === "confirm-remove"
  }), loading)
    return /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
      children: "Loading marketplaces\u2026"
    }, void 0, !1, void 0, this);
  if (marketplaceStates.length === 0)
    return /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            bold: !0,
            children: "Manage marketplaces"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          gap: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
              color: "suggestion",
              children: [
                figures_default.pointer,
                " +"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
              bold: !0,
              color: "suggestion",
              children: "Add Marketplace"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          marginLeft: 3,
          children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(jsx_dev_runtime240.Fragment, {
              children: [
                "Press ",
                exitState.keyName,
                " again to go back"
              ]
            }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(Byline, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ConfigurableShortcutHint, {
                  action: "select:accept",
                  context: "Select",
                  fallback: "Enter",
                  description: "select"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ConfigurableShortcutHint, {
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
  if (internalView === "confirm-remove" && selectedMarketplace) {
    let pluginCount = selectedMarketplace.installedPlugins?.length || 0;
    return /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
          bold: !0,
          color: "warning",
          children: [
            "Remove marketplace ",
            /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
              italic: !0,
              children: selectedMarketplace.name
            }, void 0, !1, void 0, this),
            "?"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            pluginCount > 0 && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
              marginTop: 1,
              children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                color: "warning",
                children: [
                  "This will also uninstall ",
                  pluginCount,
                  " ",
                  plural(pluginCount, "plugin"),
                  " from this marketplace:"
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this),
            selectedMarketplace.installedPlugins && selectedMarketplace.installedPlugins.length > 0 && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              marginTop: 1,
              marginLeft: 2,
              children: selectedMarketplace.installedPlugins.map((plugin) => /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "\u2022 ",
                  plugin.name
                ]
              }, plugin.name, !0, void 0, this))
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
              marginTop: 1,
              children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                children: [
                  "Press ",
                  /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "y"
                  }, void 0, !1, void 0, this),
                  " to confirm or ",
                  /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "n"
                  }, void 0, !1, void 0, this),
                  " to cancel"
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  if (internalView === "details" && selectedMarketplace) {
    let isUpdating = selectedMarketplace.pendingUpdate || isProcessing, menuOptions = buildDetailsMenuOptions(selectedMarketplace);
    return /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
          bold: !0,
          children: selectedMarketplace.name
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
          dimColor: !0,
          children: selectedMarketplace.source
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            children: [
              selectedMarketplace.pluginCount || 0,
              " available",
              " ",
              plural(selectedMarketplace.pluginCount || 0, "plugin")
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        selectedMarketplace.installedPlugins && selectedMarketplace.installedPlugins.length > 0 && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
              bold: !0,
              children: [
                "Installed plugins (",
                selectedMarketplace.installedPlugins.length,
                "):"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              marginLeft: 1,
              children: selectedMarketplace.installedPlugins.map((plugin) => /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
                flexDirection: "row",
                gap: 1,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                    children: figures_default.bullet
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
                    flexDirection: "column",
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                        children: plugin.name
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                        dimColor: !0,
                        children: plugin.manifest.description
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, plugin.name, !0, void 0, this))
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        isUpdating && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
              color: "claude",
              children: "Updating marketplace\u2026"
            }, void 0, !1, void 0, this),
            progressMessage && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
              dimColor: !0,
              children: progressMessage
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        !isUpdating && successMessage && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            color: "claude",
            children: successMessage
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        !isUpdating && processError && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            color: "error",
            children: processError
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        !isUpdating && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: menuOptions.map((option, idx) => {
            if (!option)
              return null;
            let isSelected = idx === detailsMenuIndex;
            return /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                  color: isSelected ? "suggestion" : void 0,
                  children: [
                    isSelected ? figures_default.pointer : " ",
                    " ",
                    option.label
                  ]
                }, void 0, !0, void 0, this),
                option.secondaryLabel && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: [
                    " ",
                    option.secondaryLabel
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, option.value, !0, void 0, this);
          })
        }, void 0, !1, void 0, this),
        !isUpdating && !shouldSkipPluginAutoupdate() && selectedMarketplace.autoUpdate && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Auto-update enabled. Claude Code will automatically update this marketplace and its installed plugins."
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
          marginLeft: 3,
          children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            dimColor: !0,
            italic: !0,
            children: isUpdating ? /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(jsx_dev_runtime240.Fragment, {
              children: "Please wait\u2026"
            }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(Byline, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ConfigurableShortcutHint, {
                  action: "select:accept",
                  context: "Select",
                  fallback: "Enter",
                  description: "select"
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ConfigurableShortcutHint, {
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
  let {
    updateCount,
    removeCount
  } = getPendingCounts();
  return /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
          bold: !0,
          children: "Manage marketplaces"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 1,
        marginBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            color: selectedIndex === 0 ? "suggestion" : void 0,
            children: [
              selectedIndex === 0 ? figures_default.pointer : " ",
              " +"
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            bold: !0,
            color: selectedIndex === 0 ? "suggestion" : void 0,
            children: "Add Marketplace"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: marketplaceStates.map((state3, idx) => {
          let isSelected = idx + 1 === selectedIndex, indicators = [];
          if (state3.pendingUpdate)
            indicators.push("UPDATE");
          if (state3.pendingRemove)
            indicators.push("REMOVE");
          return /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            gap: 1,
            marginBottom: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                color: isSelected ? "suggestion" : void 0,
                children: [
                  isSelected ? figures_default.pointer : " ",
                  " ",
                  state3.pendingRemove ? figures_default.cross : figures_default.bullet
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                flexGrow: 1,
                children: [
                  /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
                    flexDirection: "row",
                    gap: 1,
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                        bold: !0,
                        strikethrough: state3.pendingRemove,
                        dimColor: state3.pendingRemove,
                        children: [
                          state3.name === "claude-plugins-official" && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                            color: "claude",
                            children: "\u273B "
                          }, void 0, !1, void 0, this),
                          state3.name,
                          state3.name === "claude-plugins-official" && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                            color: "claude",
                            children: " \u273B"
                          }, void 0, !1, void 0, this)
                        ]
                      }, void 0, !0, void 0, this),
                      indicators.length > 0 && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                        color: "warning",
                        children: [
                          "[",
                          indicators.join(", "),
                          "]"
                        ]
                      }, void 0, !0, void 0, this)
                    ]
                  }, void 0, !0, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: state3.source
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      state3.pluginCount !== void 0 && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(jsx_dev_runtime240.Fragment, {
                        children: [
                          state3.pluginCount,
                          " available"
                        ]
                      }, void 0, !0, void 0, this),
                      state3.installedPlugins && state3.installedPlugins.length > 0 && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(jsx_dev_runtime240.Fragment, {
                        children: [
                          " \u2022 ",
                          state3.installedPlugins.length,
                          " installed"
                        ]
                      }, void 0, !0, void 0, this),
                      state3.lastUpdated && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(jsx_dev_runtime240.Fragment, {
                        children: [
                          " ",
                          "\u2022 Updated",
                          " ",
                          new Date(state3.lastUpdated).toLocaleDateString()
                        ]
                      }, void 0, !0, void 0, this)
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this)
            ]
          }, state3.name, !0, void 0, this);
        })
      }, void 0, !1, void 0, this),
      hasPendingChanges() && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                bold: !0,
                children: "Pending changes:"
              }, void 0, !1, void 0, this),
              " ",
              /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Enter to apply"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          updateCount > 0 && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            children: [
              "\u2022 Update ",
              updateCount,
              " ",
              plural(updateCount, "marketplace")
            ]
          }, void 0, !0, void 0, this),
          removeCount > 0 && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
            color: "warning",
            children: [
              "\u2022 Remove ",
              removeCount,
              " ",
              plural(removeCount, "marketplace")
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      isProcessing && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
          color: "claude",
          children: "Processing changes\u2026"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      processError && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
          color: "error",
          children: processError
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ManageMarketplacesKeyHints, {
        exitState,
        hasPendingActions: hasPendingChanges()
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
