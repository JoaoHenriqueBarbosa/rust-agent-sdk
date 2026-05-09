// Original: src/ink/components/NoSelect.tsx
function NoSelect(t0) {
  let $3 = import_compiler_runtime12.c(8), boxProps, children, fromLeftEdge;
  if ($3[0] !== t0)
    ({
      children,
      fromLeftEdge,
      ...boxProps
    } = t0), $3[0] = t0, $3[1] = boxProps, $3[2] = children, $3[3] = fromLeftEdge;
  else
    boxProps = $3[1], children = $3[2], fromLeftEdge = $3[3];
  let t1 = fromLeftEdge ? "from-left-edge" : !0, t2;
  if ($3[4] !== boxProps || $3[5] !== children || $3[6] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime15.jsxDEV(Box_default, {
      ...boxProps,
      noSelect: t1,
      children
    }, void 0, !1, void 0, this), $3[4] = boxProps, $3[5] = children, $3[6] = t1, $3[7] = t2;
  else
    t2 = $3[7];
  return t2;
}
var import_compiler_runtime12, jsx_dev_runtime15;
var init_NoSelect = __esm(() => {
  init_Box();
  import_compiler_runtime12 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime15 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
