// Original: src/components/ToolUseLoader.tsx
function ToolUseLoader(t0) {
  let $3 = import_compiler_runtime40.c(7), {
    isError: isError3,
    isUnresolved,
    shouldAnimate
  } = t0, [ref, isBlinking] = useBlink(shouldAnimate), color2 = isUnresolved ? void 0 : isError3 ? "error" : "success", t1 = !shouldAnimate || isBlinking || isError3 || !isUnresolved ? BLACK_CIRCLE : " ", t2;
  if ($3[0] !== color2 || $3[1] !== isUnresolved || $3[2] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime46.jsxDEV(ThemedText, {
      color: color2,
      dimColor: isUnresolved,
      children: t1
    }, void 0, !1, void 0, this), $3[0] = color2, $3[1] = isUnresolved, $3[2] = t1, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== ref || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime46.jsxDEV(ThemedBox_default, {
      ref,
      minWidth: 2,
      children: t2
    }, void 0, !1, void 0, this), $3[4] = ref, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  return t3;
}
var import_compiler_runtime40, jsx_dev_runtime46;
var init_ToolUseLoader = __esm(() => {
  init_figures2();
  init_useBlink();
  init_ink2();
  import_compiler_runtime40 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime46 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
