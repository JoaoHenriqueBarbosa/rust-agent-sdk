// Original: src/components/RemoteEnvironmentDialog.tsx
function RemoteEnvironmentDialog(t0) {
  let $3 = import_compiler_runtime275.c(27), {
    onDone
  } = t0, [loadingState, setLoadingState] = import_react190.useState("loading"), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  let [environments, setEnvironments] = import_react190.useState(t1), [selectedEnvironment, setSelectedEnvironment] = import_react190.useState(null), [selectedEnvironmentSource, setSelectedEnvironmentSource] = import_react190.useState(null), [error44, setError] = import_react190.useState(null), t2, t3;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => {
      let cancelled = !1;
      return async function() {
        try {
          let result = await getEnvironmentSelectionInfo();
          if (cancelled)
            return;
          setEnvironments(result.availableEnvironments), setSelectedEnvironment(result.selectedEnvironment), setSelectedEnvironmentSource(result.selectedEnvironmentSource), setLoadingState(null);
        } catch (t42) {
          let err2 = t42;
          if (cancelled)
            return;
          let fetchError = toError(err2);
          logError2(fetchError), setError(fetchError.message), setLoadingState(null);
        }
      }(), () => {
        cancelled = !0;
      };
    }, t3 = [], $3[1] = t2, $3[2] = t3;
  else
    t2 = $3[1], t3 = $3[2];
  import_react190.useEffect(t2, t3);
  let t4;
  if ($3[3] !== environments || $3[4] !== onDone)
    t4 = function(value) {
      if (value === "cancel") {
        onDone();
        return;
      }
      setLoadingState("updating");
      let selectedEnv = environments.find((env5) => env5.environment_id === value);
      if (!selectedEnv) {
        onDone("Error: Selected environment not found");
        return;
      }
      updateSettingsForSource("localSettings", {
        remote: {
          defaultEnvironmentId: selectedEnv.environment_id
        }
      }), onDone(`Set default remote environment to ${source_default.bold(selectedEnv.name)} (${selectedEnv.environment_id})`);
    }, $3[3] = environments, $3[4] = onDone, $3[5] = t4;
  else
    t4 = $3[5];
  let handleSelect = t4;
  if (loadingState === "loading") {
    let t52;
    if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(LoadingState, {
        message: "Loading environments\u2026"
      }, void 0, !1, void 0, this), $3[6] = t52;
    else
      t52 = $3[6];
    let t6;
    if ($3[7] !== onDone)
      t6 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(Dialog, {
        title: DIALOG_TITLE,
        onCancel: onDone,
        hideInputGuide: !0,
        children: t52
      }, void 0, !1, void 0, this), $3[7] = onDone, $3[8] = t6;
    else
      t6 = $3[8];
    return t6;
  }
  if (error44) {
    let t52;
    if ($3[9] !== error44)
      t52 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
        color: "error",
        children: [
          "Error: ",
          error44
        ]
      }, void 0, !0, void 0, this), $3[9] = error44, $3[10] = t52;
    else
      t52 = $3[10];
    let t6;
    if ($3[11] !== onDone || $3[12] !== t52)
      t6 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(Dialog, {
        title: DIALOG_TITLE,
        onCancel: onDone,
        children: t52
      }, void 0, !1, void 0, this), $3[11] = onDone, $3[12] = t52, $3[13] = t6;
    else
      t6 = $3[13];
    return t6;
  }
  if (!selectedEnvironment) {
    let t52;
    if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
        children: "No remote environments available."
      }, void 0, !1, void 0, this), $3[14] = t52;
    else
      t52 = $3[14];
    let t6;
    if ($3[15] !== onDone)
      t6 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(Dialog, {
        title: DIALOG_TITLE,
        subtitle: SETUP_HINT,
        onCancel: onDone,
        children: t52
      }, void 0, !1, void 0, this), $3[15] = onDone, $3[16] = t6;
    else
      t6 = $3[16];
    return t6;
  }
  if (environments.length === 1) {
    let t52;
    if ($3[17] !== onDone || $3[18] !== selectedEnvironment)
      t52 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(SingleEnvironmentContent, {
        environment: selectedEnvironment,
        onDone
      }, void 0, !1, void 0, this), $3[17] = onDone, $3[18] = selectedEnvironment, $3[19] = t52;
    else
      t52 = $3[19];
    return t52;
  }
  let t5;
  if ($3[20] !== environments || $3[21] !== handleSelect || $3[22] !== loadingState || $3[23] !== onDone || $3[24] !== selectedEnvironment || $3[25] !== selectedEnvironmentSource)
    t5 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(MultipleEnvironmentsContent, {
      environments,
      selectedEnvironment,
      selectedEnvironmentSource,
      loadingState,
      onSelect: handleSelect,
      onCancel: onDone
    }, void 0, !1, void 0, this), $3[20] = environments, $3[21] = handleSelect, $3[22] = loadingState, $3[23] = onDone, $3[24] = selectedEnvironment, $3[25] = selectedEnvironmentSource, $3[26] = t5;
  else
    t5 = $3[26];
  return t5;
}
function EnvironmentLabel(t0) {
  let $3 = import_compiler_runtime275.c(7), {
    environment
  } = t0, t1;
  if ($3[0] !== environment.name)
    t1 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
      bold: !0,
      children: environment.name
    }, void 0, !1, void 0, this), $3[0] = environment.name, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== environment.environment_id)
    t2 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "(",
        environment.environment_id,
        ")"
      ]
    }, void 0, !0, void 0, this), $3[2] = environment.environment_id, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== t1 || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
      children: [
        figures_default.tick,
        " Using ",
        t1,
        " ",
        t2
      ]
    }, void 0, !0, void 0, this), $3[4] = t1, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  return t3;
}
function SingleEnvironmentContent(t0) {
  let $3 = import_compiler_runtime275.c(6), {
    environment,
    onDone
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Confirmation"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:yes", onDone, t1);
  let t2;
  if ($3[1] !== environment)
    t2 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(EnvironmentLabel, {
      environment
    }, void 0, !1, void 0, this), $3[1] = environment, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== onDone || $3[4] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(Dialog, {
      title: DIALOG_TITLE,
      subtitle: SETUP_HINT,
      onCancel: onDone,
      children: t2
    }, void 0, !1, void 0, this), $3[3] = onDone, $3[4] = t2, $3[5] = t3;
  else
    t3 = $3[5];
  return t3;
}
function MultipleEnvironmentsContent(t0) {
  let $3 = import_compiler_runtime275.c(18), {
    environments,
    selectedEnvironment,
    selectedEnvironmentSource,
    loadingState,
    onSelect,
    onCancel
  } = t0, t1;
  if ($3[0] !== selectedEnvironmentSource)
    t1 = selectedEnvironmentSource && selectedEnvironmentSource !== "localSettings" ? ` (from ${getSettingSourceName(selectedEnvironmentSource)} settings)` : "", $3[0] = selectedEnvironmentSource, $3[1] = t1;
  else
    t1 = $3[1];
  let sourceSuffix = t1, t2;
  if ($3[2] !== selectedEnvironment.name)
    t2 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
      bold: !0,
      children: selectedEnvironment.name
    }, void 0, !1, void 0, this), $3[2] = selectedEnvironment.name, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== sourceSuffix || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
      children: [
        "Currently using: ",
        t2,
        sourceSuffix
      ]
    }, void 0, !0, void 0, this), $3[4] = sourceSuffix, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  let subtitle = t3, t4;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
      dimColor: !0,
      children: SETUP_HINT
    }, void 0, !1, void 0, this), $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== environments || $3[9] !== loadingState || $3[10] !== onSelect || $3[11] !== selectedEnvironment.environment_id)
    t5 = loadingState === "updating" ? /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(LoadingState, {
      message: "Updating\u2026"
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(Select, {
      options: environments.map(_temp168),
      defaultValue: selectedEnvironment.environment_id,
      onChange: onSelect,
      onCancel: () => onSelect("cancel"),
      layout: "compact-vertical"
    }, void 0, !1, void 0, this), $3[8] = environments, $3[9] = loadingState, $3[10] = onSelect, $3[11] = selectedEnvironment.environment_id, $3[12] = t5;
  else
    t5 = $3[12];
  let t6;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
      dimColor: !0,
      children: /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Enter",
            action: "select"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ConfigurableShortcutHint, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = t6;
  else
    t6 = $3[13];
  let t7;
  if ($3[14] !== onCancel || $3[15] !== subtitle || $3[16] !== t5)
    t7 = /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(Dialog, {
      title: DIALOG_TITLE,
      subtitle,
      onCancel,
      hideInputGuide: !0,
      children: [
        t4,
        t5,
        t6
      ]
    }, void 0, !0, void 0, this), $3[14] = onCancel, $3[15] = subtitle, $3[16] = t5, $3[17] = t7;
  else
    t7 = $3[17];
  return t7;
}
function _temp168(env5) {
  return {
    label: /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
      children: [
        env5.name,
        " ",
        /* @__PURE__ */ jsx_dev_runtime354.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "(",
            env5.environment_id,
            ")"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this),
    value: env5.environment_id
  };
}
var import_compiler_runtime275, import_react190, jsx_dev_runtime354, DIALOG_TITLE = "Select Remote Environment", SETUP_HINT = "Configure environments at: https://claude.ai/code";
var init_RemoteEnvironmentDialog = __esm(() => {
  init_source();
  init_figures();
  init_ink2();
  init_useKeybinding();
  init_errors();
  init_log3();
  init_constants2();
  init_settings2();
  init_environmentSelection();
  init_ConfigurableShortcutHint();
  init_select();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  init_LoadingState();
  import_compiler_runtime275 = __toESM(require_react_compiler_runtime_development(), 1), import_react190 = __toESM(require_react_development(), 1), jsx_dev_runtime354 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
