// Original: src/components/FastIcon.tsx
function FastIcon(t0) {
  let $3 = import_compiler_runtime239.c(2), {
    cooldown
  } = t0;
  if (cooldown) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime302.jsxDEV(ThemedText, {
        color: "promptBorder",
        dimColor: !0,
        children: LIGHTNING_BOLT
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  let t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime302.jsxDEV(ThemedText, {
      color: "fastMode",
      children: LIGHTNING_BOLT
    }, void 0, !1, void 0, this), $3[1] = t1;
  else
    t1 = $3[1];
  return t1;
}
function getFastIconString(applyColor2 = !0, cooldown = !1) {
  if (!applyColor2)
    return LIGHTNING_BOLT;
  let themeName = resolveThemeSetting(getGlobalConfig().theme);
  if (cooldown)
    return source_default.dim(color("promptBorder", themeName)(LIGHTNING_BOLT));
  return color("fastMode", themeName)(LIGHTNING_BOLT);
}
var import_compiler_runtime239, jsx_dev_runtime302;
var init_FastIcon = __esm(() => {
  init_source();
  init_figures2();
  init_ink2();
  init_config4();
  init_color();
  import_compiler_runtime239 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime302 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
