// Original: src/components/ui/OrderedList.tsx
function OrderedListComponent(t0) {
  let $3 = import_compiler_runtime368.c(9), {
    children
  } = t0, {
    marker: parentMarker
  } = import_react307.useContext(OrderedListContext), numberOfItems = 0;
  for (let child of import_react307.default.Children.toArray(children)) {
    if (!import_react307.isValidElement(child) || child.type !== OrderedListItem)
      continue;
    numberOfItems++;
  }
  let maxMarkerWidth = String(numberOfItems).length, t1;
  if ($3[0] !== children || $3[1] !== maxMarkerWidth || $3[2] !== parentMarker) {
    let t22;
    if ($3[4] !== maxMarkerWidth || $3[5] !== parentMarker)
      t22 = (child_0, index2) => {
        if (!import_react307.isValidElement(child_0) || child_0.type !== OrderedListItem)
          return child_0;
        let paddedMarker = `${String(index2 + 1).padStart(maxMarkerWidth)}.`, marker = `${parentMarker}${paddedMarker}`;
        return /* @__PURE__ */ jsx_dev_runtime468.jsxDEV(OrderedListContext.Provider, {
          value: {
            marker
          },
          children: /* @__PURE__ */ jsx_dev_runtime468.jsxDEV(OrderedListItemContext.Provider, {
            value: {
              marker
            },
            children: child_0
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this);
      }, $3[4] = maxMarkerWidth, $3[5] = parentMarker, $3[6] = t22;
    else
      t22 = $3[6];
    t1 = import_react307.default.Children.map(children, t22), $3[0] = children, $3[1] = maxMarkerWidth, $3[2] = parentMarker, $3[3] = t1;
  } else
    t1 = $3[3];
  let t2;
  if ($3[7] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime468.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: t1
    }, void 0, !1, void 0, this), $3[7] = t1, $3[8] = t2;
  else
    t2 = $3[8];
  return t2;
}
var import_compiler_runtime368, import_react307, jsx_dev_runtime468, OrderedListContext, OrderedList;
var init_OrderedList = __esm(() => {
  init_ink2();
  init_OrderedListItem();
  import_compiler_runtime368 = __toESM(require_react_compiler_runtime_development(), 1), import_react307 = __toESM(require_react_development(), 1), jsx_dev_runtime468 = __toESM(require_react_jsx_dev_runtime_development(), 1), OrderedListContext = import_react307.createContext({
    marker: ""
  });
  OrderedListComponent.Item = OrderedListItem;
  OrderedList = OrderedListComponent;
});
