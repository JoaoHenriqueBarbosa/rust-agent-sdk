// Original: src/components/ConfigurableShortcutHint.tsx
function ConfigurableShortcutHint(t0) {
  let $3 = import_compiler_runtime27.c(5), {
    action: action2,
    context: context3,
    fallback,
    description,
    parens,
    bold: bold2
  } = t0, shortcut = useShortcutDisplay(action2, context3, fallback), t1;
  if ($3[0] !== bold2 || $3[1] !== description || $3[2] !== parens || $3[3] !== shortcut)
    t1 = /* @__PURE__ */ jsx_dev_runtime32.jsxDEV(KeyboardShortcutHint, {
      shortcut,
      action: description,
      parens,
      bold: bold2
    }, void 0, !1, void 0, this), $3[0] = bold2, $3[1] = description, $3[2] = parens, $3[3] = shortcut, $3[4] = t1;
  else
    t1 = $3[4];
  return t1;
}
var import_compiler_runtime27, jsx_dev_runtime32;
var init_ConfigurableShortcutHint = __esm(() => {
  init_useShortcutDisplay();
  init_KeyboardShortcutHint();
  import_compiler_runtime27 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime32 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
