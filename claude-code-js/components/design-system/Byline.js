// Original: src/components/design-system/Byline.tsx
function Byline(t0) {
  let $3 = import_compiler_runtime28.c(5), {
    children
  } = t0, t1, t2;
  if ($3[0] !== children) {
    t2 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let validChildren = import_react39.Children.toArray(children);
      if (validChildren.length === 0) {
        t2 = null;
        break bb0;
      }
      t1 = validChildren.map(_temp5);
    }
    $3[0] = children, $3[1] = t1, $3[2] = t2;
  } else
    t1 = $3[1], t2 = $3[2];
  if (t2 !== Symbol.for("react.early_return_sentinel"))
    return t2;
  let t3;
  if ($3[3] !== t1)
    t3 = /* @__PURE__ */ jsx_dev_runtime33.jsxDEV(jsx_dev_runtime33.Fragment, {
      children: t1
    }, void 0, !1, void 0, this), $3[3] = t1, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
function _temp5(child, index) {
  return /* @__PURE__ */ jsx_dev_runtime33.jsxDEV(import_react39.default.Fragment, {
    children: [
      index > 0 && /* @__PURE__ */ jsx_dev_runtime33.jsxDEV(ThemedText, {
        dimColor: !0,
        children: " \xB7 "
      }, void 0, !1, void 0, this),
      child
    ]
  }, import_react39.isValidElement(child) ? child.key ?? index : index, !0, void 0, this);
}
var import_compiler_runtime28, import_react39, jsx_dev_runtime33;
var init_Byline = __esm(() => {
  init_ink2();
  import_compiler_runtime28 = __toESM(require_react_compiler_runtime_development(), 1), import_react39 = __toESM(require_react_development(), 1), jsx_dev_runtime33 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
