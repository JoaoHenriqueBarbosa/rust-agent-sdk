// Original: src/commands/theme/theme.tsx
var exports_theme = {};
__export(exports_theme, {
  call: () => call38
});
function ThemePickerCommand(t0) {
  let $3 = import_compiler_runtime230.c(8), {
    onDone
  } = t0, [, setTheme] = useTheme(), t1;
  if ($3[0] !== onDone || $3[1] !== setTheme)
    t1 = (setting) => {
      setTheme(setting), onDone(`Theme set to ${setting}`);
    }, $3[0] = onDone, $3[1] = setTheme, $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== onDone)
    t2 = () => {
      onDone("Theme picker dismissed", {
        display: "system"
      });
    }, $3[3] = onDone, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== t1 || $3[6] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime292.jsxDEV(Pane, {
      color: "permission",
      children: /* @__PURE__ */ jsx_dev_runtime292.jsxDEV(ThemePicker, {
        onThemeSelect: t1,
        onCancel: t2,
        skipExitHandling: !0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = t1, $3[6] = t2, $3[7] = t3;
  else
    t3 = $3[7];
  return t3;
}
var import_compiler_runtime230, jsx_dev_runtime292, call38 = async (onDone, _context) => {
  return /* @__PURE__ */ jsx_dev_runtime292.jsxDEV(ThemePickerCommand, {
    onDone
  }, void 0, !1, void 0, this);
};
var init_theme3 = __esm(() => {
  init_Pane();
  init_ThemePicker();
  init_ink2();
  import_compiler_runtime230 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime292 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
