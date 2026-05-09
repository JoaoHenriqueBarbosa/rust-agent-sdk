// Original: src/components/hooks/SelectMatcherMode.tsx
function SelectMatcherMode(t0) {
  let $3 = import_compiler_runtime244.c(25), {
    selectedEvent,
    matchersForSelectedEvent,
    hooksByEventAndMatcher,
    eventDescription,
    onSelect,
    onCancel
  } = t0, t1;
  if ($3[0] !== hooksByEventAndMatcher || $3[1] !== matchersForSelectedEvent || $3[2] !== selectedEvent) {
    let t22;
    if ($3[4] !== hooksByEventAndMatcher || $3[5] !== selectedEvent)
      t22 = (matcher) => {
        let hooks = hooksByEventAndMatcher[selectedEvent]?.[matcher] || [], sources = Array.from(new Set(hooks.map(_temp150)));
        return {
          matcher,
          sources,
          hookCount: hooks.length
        };
      }, $3[4] = hooksByEventAndMatcher, $3[5] = selectedEvent, $3[6] = t22;
    else
      t22 = $3[6];
    t1 = matchersForSelectedEvent.map(t22), $3[0] = hooksByEventAndMatcher, $3[1] = matchersForSelectedEvent, $3[2] = selectedEvent, $3[3] = t1;
  } else
    t1 = $3[3];
  let matchersWithSources = t1;
  if (matchersForSelectedEvent.length === 0) {
    let t22 = `${selectedEvent} - Matchers`, t32;
    if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime310.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime310.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "No hooks configured for this event."
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime310.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "To add hooks, edit settings.json directly or ask Claude."
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[7] = t32;
    else
      t32 = $3[7];
    let t42;
    if ($3[8] !== eventDescription || $3[9] !== onCancel || $3[10] !== t22)
      t42 = /* @__PURE__ */ jsx_dev_runtime310.jsxDEV(Dialog, {
        title: t22,
        subtitle: eventDescription,
        onCancel,
        inputGuide: _temp263,
        children: t32
      }, void 0, !1, void 0, this), $3[8] = eventDescription, $3[9] = onCancel, $3[10] = t22, $3[11] = t42;
    else
      t42 = $3[11];
    return t42;
  }
  let t2 = `${selectedEvent} - Matchers`, t3;
  if ($3[12] !== matchersWithSources)
    t3 = matchersWithSources.map(_temp338), $3[12] = matchersWithSources, $3[13] = t3;
  else
    t3 = $3[13];
  let t4;
  if ($3[14] !== onSelect)
    t4 = (value) => {
      onSelect(value);
    }, $3[14] = onSelect, $3[15] = t4;
  else
    t4 = $3[15];
  let t5;
  if ($3[16] !== onCancel || $3[17] !== t3 || $3[18] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime310.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime310.jsxDEV(Select, {
        options: t3,
        onChange: t4,
        onCancel
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[16] = onCancel, $3[17] = t3, $3[18] = t4, $3[19] = t5;
  else
    t5 = $3[19];
  let t6;
  if ($3[20] !== eventDescription || $3[21] !== onCancel || $3[22] !== t2 || $3[23] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime310.jsxDEV(Dialog, {
      title: t2,
      subtitle: eventDescription,
      onCancel,
      children: t5
    }, void 0, !1, void 0, this), $3[20] = eventDescription, $3[21] = onCancel, $3[22] = t2, $3[23] = t5, $3[24] = t6;
  else
    t6 = $3[24];
  return t6;
}
function _temp338(item) {
  let sourceText = item.sources.map(hookSourceInlineDisplayString).join(", "), matcherLabel = item.matcher || "(all)";
  return {
    label: `[${sourceText}] ${matcherLabel}`,
    value: item.matcher,
    description: `${item.hookCount} ${plural(item.hookCount, "hook")}`
  };
}
function _temp263() {
  return /* @__PURE__ */ jsx_dev_runtime310.jsxDEV(ThemedText, {
    children: "Esc to go back"
  }, void 0, !1, void 0, this);
}
function _temp150(h4) {
  return h4.source;
}
var import_compiler_runtime244, jsx_dev_runtime310;
var init_SelectMatcherMode = __esm(() => {
  init_ink2();
  init_hooksSettings();
  init_select();
  init_Dialog();
  import_compiler_runtime244 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime310 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
