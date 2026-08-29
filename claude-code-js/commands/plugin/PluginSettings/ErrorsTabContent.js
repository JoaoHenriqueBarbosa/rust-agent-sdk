// function: ErrorsTabContent
function ErrorsTabContent(t0) {
  let $3 = import_compiler_runtime193.c(26), {
    setViewState,
    setActiveTab,
    markPluginsChanged
  } = t0, errors8 = useAppState(_temp239), installationStatus = useAppState(_temp327), setAppState = useSetAppState(), [selectedIndex, setSelectedIndex] = import_react139.useState(0), [actionMessage, setActionMessage] = import_react139.useState(null), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  let [marketplaceLoadFailures, setMarketplaceLoadFailures] = import_react139.useState(t1), t2, t3;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => {
      (async () => {
        try {
          let config11 = await loadKnownMarketplacesConfig(), {
            failures
          } = await loadMarketplacesWithGracefulDegradation(config11);
          setMarketplaceLoadFailures(failures);
        } catch {}
      })();
    }, t3 = [], $3[1] = t2, $3[2] = t3;
  else
    t2 = $3[1], t3 = $3[2];
  import_react139.useEffect(t2, t3);
  let failedMarketplaces = installationStatus.marketplaces.filter(_temp423), failedMarketplaceNames = new Set(failedMarketplaces.map(_temp517)), transientErrors = errors8.filter(isTransientError), extraMarketplaceErrors = errors8.filter((e) => (e.type === "marketplace-not-found" || e.type === "marketplace-load-failed" || e.type === "marketplace-blocked-by-policy") && !failedMarketplaceNames.has(e.marketplace)), pluginLoadingErrors = errors8.filter(_temp614), otherErrors = errors8.filter(_temp713), pluginScopes = getPluginEditableScopes(), rows = buildErrorRows(failedMarketplaces, extraMarketplaceErrors, pluginLoadingErrors, otherErrors, marketplaceLoadFailures, transientErrors, pluginScopes), t4;
  if ($3[3] !== setViewState)
    t4 = () => {
      setViewState({
        type: "menu"
      });
    }, $3[3] = setViewState, $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t5 = {
      context: "Confirmation"
    }, $3[5] = t5;
  else
    t5 = $3[5];
  useKeybinding("confirm:no", t4, t5);
  let handleSelect = () => {
    let row = rows[selectedIndex];
    if (!row)
      return;
    let {
      action: action2
    } = row;
    bb77:
      switch (action2.kind) {
        case "navigate": {
          setActiveTab(action2.tab), setViewState(action2.viewState);
          break bb77;
        }
        case "remove-extra-marketplace": {
          let scopes = action2.sources.map(_temp811).join(", ");
          removeExtraMarketplace(action2.name, action2.sources), clearAllCaches(), setAppState((prev_0) => ({
            ...prev_0,
            plugins: {
              ...prev_0.plugins,
              errors: prev_0.plugins.errors.filter((e_2) => !(("marketplace" in e_2) && e_2.marketplace === action2.name)),
              installationStatus: {
                ...prev_0.plugins.installationStatus,
                marketplaces: prev_0.plugins.installationStatus.marketplaces.filter((m_1) => m_1.name !== action2.name)
              }
            }
          })), setActionMessage(`${figures_default.tick} Removed "${action2.name}" from ${scopes} settings`), markPluginsChanged();
          break bb77;
        }
        case "remove-installed-marketplace": {
          (async () => {
            try {
              await removeMarketplaceSource(action2.name), clearAllCaches(), setMarketplaceLoadFailures((prev) => prev.filter((f) => f.name !== action2.name)), setActionMessage(`${figures_default.tick} Removed marketplace "${action2.name}"`), markPluginsChanged();
            } catch (t6) {
              let err2 = t6;
              setActionMessage(`Failed to remove "${action2.name}": ${err2 instanceof Error ? err2.message : String(err2)}`);
            }
          })();
          break bb77;
        }
        case "managed-only":
          break bb77;
        case "none":
      }
  }, t7;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t7 = () => setSelectedIndex(_temp95), $3[6] = t7;
  else
    t7 = $3[6];
  let t8 = rows.length > 0, t9;
  if ($3[7] !== t8)
    t9 = {
      context: "Select",
      isActive: t8
    }, $3[7] = t8, $3[8] = t9;
  else
    t9 = $3[8];
  useKeybindings({
    "select:previous": t7,
    "select:next": () => setSelectedIndex((prev_2) => Math.min(rows.length - 1, prev_2 + 1)),
    "select:accept": handleSelect
  }, t9);
  let clampedIndex = Math.min(selectedIndex, Math.max(0, rows.length - 1));
  if (clampedIndex !== selectedIndex)
    setSelectedIndex(clampedIndex);
  let selectedAction = rows[clampedIndex]?.action, hasAction = selectedAction && selectedAction.kind !== "none" && selectedAction.kind !== "managed-only";
  if (rows.length === 0) {
    let t102;
    if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
      t102 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
        marginLeft: 1,
        children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "No plugin errors"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[9] = t102;
    else
      t102 = $3[9];
    let t112;
    if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
      t112 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t102,
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
              dimColor: !0,
              italic: !0,
              children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "back"
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[10] = t112;
    else
      t112 = $3[10];
    return t112;
  }
  let T0 = ThemedBox_default, t10 = "column", t11;
  if ($3[11] !== clampedIndex)
    t11 = (row_0, idx) => {
      let isSelected = idx === clampedIndex;
      return /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
        marginLeft: 1,
        flexDirection: "column",
        marginBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
                color: isSelected ? "suggestion" : "error",
                children: [
                  isSelected ? figures_default.pointer : figures_default.cross,
                  " "
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
                bold: isSelected,
                children: row_0.label
              }, void 0, !1, void 0, this),
              row_0.scope && /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  " (",
                  row_0.scope,
                  ")"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
            marginLeft: 3,
            children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
              color: "error",
              children: row_0.message
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          row_0.guidance && /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
            marginLeft: 3,
            children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
              dimColor: !0,
              italic: !0,
              children: row_0.guidance
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, idx, !0, void 0, this);
    }, $3[11] = clampedIndex, $3[12] = t11;
  else
    t11 = $3[12];
  let t12 = rows.map(t11), t13;
  if ($3[13] !== actionMessage)
    t13 = actionMessage && /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      marginLeft: 1,
      children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
        color: "claude",
        children: actionMessage
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = actionMessage, $3[14] = t13;
  else
    t13 = $3[14];
  let t14;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t14 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ConfigurableShortcutHint, {
      action: "select:previous",
      context: "Select",
      fallback: "\u2191",
      description: "navigate"
    }, void 0, !1, void 0, this), $3[15] = t14;
  else
    t14 = $3[15];
  let t15;
  if ($3[16] !== hasAction)
    t15 = hasAction && /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ConfigurableShortcutHint, {
      action: "select:accept",
      context: "Select",
      fallback: "Enter",
      description: "resolve"
    }, void 0, !1, void 0, this), $3[16] = hasAction, $3[17] = t15;
  else
    t15 = $3[17];
  let t16;
  if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
    t16 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ConfigurableShortcutHint, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "back"
    }, void 0, !1, void 0, this), $3[18] = t16;
  else
    t16 = $3[18];
  let t17;
  if ($3[19] !== t15)
    t17 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(Byline, {
          children: [
            t14,
            t15,
            t16
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[19] = t15, $3[20] = t17;
  else
    t17 = $3[20];
  let t18;
  if ($3[21] !== T0 || $3[22] !== t12 || $3[23] !== t13 || $3[24] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime244.jsxDEV(T0, {
      flexDirection: t10,
      children: [
        t12,
        t13,
        t17
      ]
    }, void 0, !0, void 0, this), $3[21] = T0, $3[22] = t12, $3[23] = t13, $3[24] = t17, $3[25] = t18;
  else
    t18 = $3[25];
  return t18;
}
