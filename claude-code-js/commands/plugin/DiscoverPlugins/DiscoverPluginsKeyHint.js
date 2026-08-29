// function: DiscoverPluginsKeyHint
function DiscoverPluginsKeyHint(t0) {
  let $3 = import_compiler_runtime189.c(10), {
    hasSelection: hasSelection2,
    canToggle
  } = t0, t1;
  if ($3[0] !== hasSelection2)
    t1 = hasSelection2 && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ConfigurableShortcutHint, {
      action: "plugin:install",
      context: "Plugin",
      fallback: "i",
      description: "install",
      bold: !0
    }, void 0, !1, void 0, this), $3[0] = hasSelection2, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
      children: "type to search"
    }, void 0, !1, void 0, this), $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== canToggle)
    t3 = canToggle && /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ConfigurableShortcutHint, {
      action: "plugin:toggle",
      context: "Plugin",
      fallback: "Space",
      description: "toggle"
    }, void 0, !1, void 0, this), $3[3] = canToggle, $3[4] = t3;
  else
    t3 = $3[4];
  let t4, t5;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ConfigurableShortcutHint, {
      action: "select:accept",
      context: "Select",
      fallback: "Enter",
      description: "details"
    }, void 0, !1, void 0, this), t5 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ConfigurableShortcutHint, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "back"
    }, void 0, !1, void 0, this), $3[5] = t4, $3[6] = t5;
  else
    t4 = $3[5], t5 = $3[6];
  let t6;
  if ($3[7] !== t1 || $3[8] !== t3)
    t6 = /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: /* @__PURE__ */ jsx_dev_runtime239.jsxDEV(Byline, {
          children: [
            t1,
            t2,
            t3,
            t4,
            t5
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = t1, $3[8] = t3, $3[9] = t6;
  else
    t6 = $3[9];
  return t6;
}
