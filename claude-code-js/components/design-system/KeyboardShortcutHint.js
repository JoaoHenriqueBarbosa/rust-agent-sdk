// Original: src/components/design-system/KeyboardShortcutHint.tsx
function KeyboardShortcutHint(t0) {
  let $3 = import_compiler_runtime20.c(9), {
    shortcut,
    action,
    parens: t1,
    bold: t2
  } = t0, parens = t1 === void 0 ? !1 : t1, bold2 = t2 === void 0 ? !1 : t2, t3;
  if ($3[0] !== bold2 || $3[1] !== shortcut)
    t3 = bold2 ? /* @__PURE__ */ jsx_dev_runtime23.jsxDEV(Text, {
      bold: !0,
      children: shortcut
    }, void 0, !1, void 0, this) : shortcut, $3[0] = bold2, $3[1] = shortcut, $3[2] = t3;
  else
    t3 = $3[2];
  let shortcutText = t3;
  if (parens) {
    let t42;
    if ($3[3] !== action || $3[4] !== shortcutText)
      t42 = /* @__PURE__ */ jsx_dev_runtime23.jsxDEV(Text, {
        children: [
          "(",
          shortcutText,
          " to ",
          action,
          ")"
        ]
      }, void 0, !0, void 0, this), $3[3] = action, $3[4] = shortcutText, $3[5] = t42;
    else
      t42 = $3[5];
    return t42;
  }
  let t4;
  if ($3[6] !== action || $3[7] !== shortcutText)
    t4 = /* @__PURE__ */ jsx_dev_runtime23.jsxDEV(Text, {
      children: [
        shortcutText,
        " to ",
        action
      ]
    }, void 0, !0, void 0, this), $3[6] = action, $3[7] = shortcutText, $3[8] = t4;
  else
    t4 = $3[8];
  return t4;
}
var import_compiler_runtime20, jsx_dev_runtime23;
var init_KeyboardShortcutHint = __esm(() => {
  init_Text();
  import_compiler_runtime20 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime23 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
