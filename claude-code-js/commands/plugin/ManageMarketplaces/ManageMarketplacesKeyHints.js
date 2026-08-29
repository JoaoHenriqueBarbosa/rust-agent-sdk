// function: ManageMarketplacesKeyHints
function ManageMarketplacesKeyHints(t0) {
  let $3 = import_compiler_runtime190.c(18), {
    exitState,
    hasPendingActions
  } = t0;
  if (exitState.pending) {
    let t12;
    if ($3[0] !== exitState.keyName)
      t12 = /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: [
            "Press ",
            exitState.keyName,
            " again to go back"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = exitState.keyName, $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  let t1;
  if ($3[2] !== hasPendingActions)
    t1 = hasPendingActions && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ConfigurableShortcutHint, {
      action: "select:accept",
      context: "Select",
      fallback: "Enter",
      description: "apply changes"
    }, void 0, !1, void 0, this), $3[2] = hasPendingActions, $3[3] = t1;
  else
    t1 = $3[3];
  let t2;
  if ($3[4] !== hasPendingActions)
    t2 = !hasPendingActions && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ConfigurableShortcutHint, {
      action: "select:accept",
      context: "Select",
      fallback: "Enter",
      description: "select"
    }, void 0, !1, void 0, this), $3[4] = hasPendingActions, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] !== hasPendingActions)
    t3 = !hasPendingActions && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(KeyboardShortcutHint, {
      shortcut: "u",
      action: "update"
    }, void 0, !1, void 0, this), $3[6] = hasPendingActions, $3[7] = t3;
  else
    t3 = $3[7];
  let t4;
  if ($3[8] !== hasPendingActions)
    t4 = !hasPendingActions && /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(KeyboardShortcutHint, {
      shortcut: "r",
      action: "remove"
    }, void 0, !1, void 0, this), $3[8] = hasPendingActions, $3[9] = t4;
  else
    t4 = $3[9];
  let t5 = hasPendingActions ? "cancel" : "go back", t6;
  if ($3[10] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ConfigurableShortcutHint, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: t5
    }, void 0, !1, void 0, this), $3[10] = t5, $3[11] = t6;
  else
    t6 = $3[11];
  let t7;
  if ($3[12] !== t1 || $3[13] !== t2 || $3[14] !== t3 || $3[15] !== t4 || $3[16] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: /* @__PURE__ */ jsx_dev_runtime240.jsxDEV(Byline, {
          children: [
            t1,
            t2,
            t3,
            t4,
            t6
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[12] = t1, $3[13] = t2, $3[14] = t3, $3[15] = t4, $3[16] = t6, $3[17] = t7;
  else
    t7 = $3[17];
  return t7;
}
