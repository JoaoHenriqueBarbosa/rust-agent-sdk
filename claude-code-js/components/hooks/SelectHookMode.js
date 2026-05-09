// Original: src/components/hooks/SelectHookMode.tsx
function SelectHookMode(t0) {
  let $3 = import_compiler_runtime243.c(19), {
    selectedEvent,
    selectedMatcher,
    hooksForSelectedMatcher,
    hookEventMetadata,
    onSelect,
    onCancel
  } = t0, title = hookEventMetadata.matcherMetadata !== void 0 ? `${selectedEvent} - Matcher: ${selectedMatcher || "(all)"}` : selectedEvent;
  if (hooksForSelectedMatcher.length === 0) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime309.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime309.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "No hooks configured for this event."
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime309.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "To add hooks, edit settings.json directly or ask Claude."
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    let t22;
    if ($3[1] !== hookEventMetadata.description || $3[2] !== onCancel || $3[3] !== title)
      t22 = /* @__PURE__ */ jsx_dev_runtime309.jsxDEV(Dialog, {
        title,
        subtitle: hookEventMetadata.description,
        onCancel,
        inputGuide: _temp149,
        children: t12
      }, void 0, !1, void 0, this), $3[1] = hookEventMetadata.description, $3[2] = onCancel, $3[3] = title, $3[4] = t22;
    else
      t22 = $3[4];
    return t22;
  }
  let t1 = hookEventMetadata.description, t2;
  if ($3[5] !== hooksForSelectedMatcher)
    t2 = hooksForSelectedMatcher.map(_temp262), $3[5] = hooksForSelectedMatcher, $3[6] = t2;
  else
    t2 = $3[6];
  let t3;
  if ($3[7] !== hooksForSelectedMatcher || $3[8] !== onSelect)
    t3 = (value) => {
      let index_0 = parseInt(value, 10), hook_0 = hooksForSelectedMatcher[index_0];
      if (hook_0)
        onSelect(hook_0);
    }, $3[7] = hooksForSelectedMatcher, $3[8] = onSelect, $3[9] = t3;
  else
    t3 = $3[9];
  let t4;
  if ($3[10] !== onCancel || $3[11] !== t2 || $3[12] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime309.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime309.jsxDEV(Select, {
        options: t2,
        onChange: t3,
        onCancel
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[10] = onCancel, $3[11] = t2, $3[12] = t3, $3[13] = t4;
  else
    t4 = $3[13];
  let t5;
  if ($3[14] !== hookEventMetadata.description || $3[15] !== onCancel || $3[16] !== t4 || $3[17] !== title)
    t5 = /* @__PURE__ */ jsx_dev_runtime309.jsxDEV(Dialog, {
      title,
      subtitle: t1,
      onCancel,
      children: t4
    }, void 0, !1, void 0, this), $3[14] = hookEventMetadata.description, $3[15] = onCancel, $3[16] = t4, $3[17] = title, $3[18] = t5;
  else
    t5 = $3[18];
  return t5;
}
function _temp262(hook, index) {
  return {
    label: `[${hook.config.type}] ${getHookDisplayText(hook.config)}`,
    value: index.toString(),
    description: hook.source === "pluginHook" && hook.pluginName ? `${hookSourceHeaderDisplayString(hook.source)} (${hook.pluginName})` : hookSourceHeaderDisplayString(hook.source)
  };
}
function _temp149() {
  return /* @__PURE__ */ jsx_dev_runtime309.jsxDEV(ThemedText, {
    children: "Esc to go back"
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime243, jsx_dev_runtime309;
var init_SelectHookMode = __esm(() => {
  init_ink2();
  init_hooksSettings();
  init_select();
  init_Dialog();
  import_compiler_runtime243 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime309 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
