// function: PrivacySettingsDialog
function PrivacySettingsDialog(t0) {
  let $3 = import_compiler_runtime241.c(17), {
    settings,
    domainExcluded,
    onDone
  } = t0, [groveEnabled, setGroveEnabled] = import_react172.useState(settings.grove_enabled), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  import_react172.default.useEffect(_temp261, t1);
  let t2;
  if ($3[1] !== domainExcluded || $3[2] !== groveEnabled)
    t2 = async (input, key3) => {
      if (!domainExcluded && (key3.tab || key3.return || input === " ")) {
        let newValue = !groveEnabled;
        setGroveEnabled(newValue), await updateGroveSettings(newValue);
      }
    }, $3[1] = domainExcluded, $3[2] = groveEnabled, $3[3] = t2;
  else
    t2 = $3[3];
  use_input_default(t2);
  let t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
      color: "error",
      children: "false"
    }, void 0, !1, void 0, this), $3[4] = t3;
  else
    t3 = $3[4];
  let valueComponent = t3;
  if (domainExcluded) {
    let t42;
    if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
      t42 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
        color: "error",
        children: "false (for emails with your domain)"
      }, void 0, !1, void 0, this), $3[5] = t42;
    else
      t42 = $3[5];
    valueComponent = t42;
  } else if (groveEnabled) {
    let t42;
    if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
      t42 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
        color: "success",
        children: "true"
      }, void 0, !1, void 0, this), $3[6] = t42;
    else
      t42 = $3[6];
    valueComponent = t42;
  }
  let t4;
  if ($3[7] !== domainExcluded)
    t4 = (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : domainExcluded ? /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(KeyboardShortcutHint, {
      shortcut: "Esc",
      action: "cancel"
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter/Tab/Space",
          action: "toggle"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Esc",
          action: "cancel"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[7] = domainExcluded, $3[8] = t4;
  else
    t4 = $3[8];
  let t5;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
      children: [
        "Review and manage your privacy settings at",
        " ",
        /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(Link, {
          url: "https://claude.ai/settings/data-privacy-controls"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[9] = t5;
  else
    t5 = $3[9];
  let t6;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedBox_default, {
      width: 44,
      children: /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedText, {
        bold: !0,
        children: "Help improve Claude"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[10] = t6;
  else
    t6 = $3[10];
  let t7;
  if ($3[11] !== valueComponent)
    t7 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedBox_default, {
      children: [
        t6,
        /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(ThemedBox_default, {
          children: valueComponent
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[11] = valueComponent, $3[12] = t7;
  else
    t7 = $3[12];
  let t8;
  if ($3[13] !== onDone || $3[14] !== t4 || $3[15] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime306.jsxDEV(Dialog, {
      title: "Data Privacy",
      color: "professionalBlue",
      onCancel: onDone,
      inputGuide: t4,
      children: [
        t5,
        t7
      ]
    }, void 0, !0, void 0, this), $3[13] = onDone, $3[14] = t4, $3[15] = t7, $3[16] = t8;
  else
    t8 = $3[16];
  return t8;
}
