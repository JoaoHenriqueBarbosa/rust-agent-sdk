// Original: src/components/ui/OrderedListItem.tsx
function OrderedListItem(t0) {
  let $3 = import_compiler_runtime367.c(7), {
    children
  } = t0, {
    marker
  } = import_react306.useContext(OrderedListItemContext), t1;
  if ($3[0] !== marker)
    t1 = /* @__PURE__ */ jsx_dev_runtime467.jsxDEV(ThemedText, {
      dimColor: !0,
      children: marker
    }, void 0, !1, void 0, this), $3[0] = marker, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== children)
    t2 = /* @__PURE__ */ jsx_dev_runtime467.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children
    }, void 0, !1, void 0, this), $3[2] = children, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== t1 || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime467.jsxDEV(ThemedBox_default, {
      gap: 1,
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[4] = t1, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  return t3;
}
var import_compiler_runtime367, import_react306, jsx_dev_runtime467, OrderedListItemContext;
var init_OrderedListItem = __esm(() => {
  init_ink2();
  import_compiler_runtime367 = __toESM(require_react_compiler_runtime_development(), 1), import_react306 = __toESM(require_react_development(), 1), jsx_dev_runtime467 = __toESM(require_react_jsx_dev_runtime_development(), 1), OrderedListItemContext = import_react306.createContext({
    marker: ""
  });
});
