// Original: src/context/promptOverlayContext.tsx
function PromptOverlayProvider(t0) {
  let $3 = import_compiler_runtime210.c(6), {
    children
  } = t0, [data, setData] = import_react153.useState(null), [dialog, setDialog] = import_react153.useState(null), t1;
  if ($3[0] !== children || $3[1] !== dialog)
    t1 = /* @__PURE__ */ jsx_dev_runtime265.jsxDEV(DialogContext.Provider, {
      value: dialog,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = dialog, $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== data || $3[4] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime265.jsxDEV(SetContext.Provider, {
      value: setData,
      children: /* @__PURE__ */ jsx_dev_runtime265.jsxDEV(SetDialogContext.Provider, {
        value: setDialog,
        children: /* @__PURE__ */ jsx_dev_runtime265.jsxDEV(DataContext.Provider, {
          value: data,
          children: t1
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = data, $3[4] = t1, $3[5] = t2;
  else
    t2 = $3[5];
  return t2;
}
function usePromptOverlay() {
  return import_react153.useContext(DataContext);
}
function usePromptOverlayDialog() {
  return import_react153.useContext(DialogContext);
}
function useSetPromptOverlay(data) {
  let $3 = import_compiler_runtime210.c(4), set3 = import_react153.useContext(SetContext), t0, t1;
  if ($3[0] !== data || $3[1] !== set3)
    t0 = () => {
      if (!set3)
        return;
      return set3(data), () => set3(null);
    }, t1 = [set3, data], $3[0] = data, $3[1] = set3, $3[2] = t0, $3[3] = t1;
  else
    t0 = $3[2], t1 = $3[3];
  import_react153.useEffect(t0, t1);
}
function useSetPromptOverlayDialog(node2) {
  let $3 = import_compiler_runtime210.c(4), set3 = import_react153.useContext(SetDialogContext), t0, t1;
  if ($3[0] !== node2 || $3[1] !== set3)
    t0 = () => {
      if (!set3)
        return;
      return set3(node2), () => set3(null);
    }, t1 = [set3, node2], $3[0] = node2, $3[1] = set3, $3[2] = t0, $3[3] = t1;
  else
    t0 = $3[2], t1 = $3[3];
  import_react153.useEffect(t0, t1);
}
var import_compiler_runtime210, import_react153, jsx_dev_runtime265, DataContext, SetContext, DialogContext, SetDialogContext;
var init_promptOverlayContext = __esm(() => {
  import_compiler_runtime210 = __toESM(require_react_compiler_runtime_development(), 1), import_react153 = __toESM(require_react_development(), 1), jsx_dev_runtime265 = __toESM(require_react_jsx_dev_runtime_development(), 1), DataContext = import_react153.createContext(null), SetContext = import_react153.createContext(null), DialogContext = import_react153.createContext(null), SetDialogContext = import_react153.createContext(null);
});
