// Original: src/components/OffscreenFreeze.tsx
function OffscreenFreeze({
  children
}) {
  let inVirtualList = import_react73.useContext(InVirtualListContext), [ref, {
    isVisible
  }] = useTerminalViewport(), cached3 = import_react73.useRef(children);
  if (isVisible || inVirtualList)
    cached3.current = children;
  return /* @__PURE__ */ jsx_dev_runtime114.jsxDEV(ThemedBox_default, {
    ref,
    children: cached3.current
  }, void 0, !1, void 0, this);
}
var import_react73, jsx_dev_runtime114;
var init_OffscreenFreeze = __esm(() => {
  init_use_terminal_viewport();
  init_ink2();
  init_messageActions();
  import_react73 = __toESM(require_react_development(), 1), jsx_dev_runtime114 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
