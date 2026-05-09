// Original: src/components/shell/ExpandShellOutputContext.tsx
function ExpandShellOutputProvider(t0) {
  let $3 = import_compiler_runtime23.c(2), {
    children
  } = t0, t1;
  if ($3[0] !== children)
    t1 = /* @__PURE__ */ jsx_dev_runtime26.jsxDEV(ExpandShellOutputContext.Provider, {
      value: !0,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = t1;
  else
    t1 = $3[1];
  return t1;
}
function useExpandShellOutput() {
  return import_react36.useContext(ExpandShellOutputContext);
}
var import_compiler_runtime23, React15, import_react36, jsx_dev_runtime26, ExpandShellOutputContext;
var init_ExpandShellOutputContext = __esm(() => {
  import_compiler_runtime23 = __toESM(require_react_compiler_runtime_development(), 1), React15 = __toESM(require_react_development(), 1), import_react36 = __toESM(require_react_development(), 1), jsx_dev_runtime26 = __toESM(require_react_jsx_dev_runtime_development(), 1), ExpandShellOutputContext = React15.createContext(!1);
});
