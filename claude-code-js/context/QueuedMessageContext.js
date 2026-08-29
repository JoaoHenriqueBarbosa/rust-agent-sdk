// Original: src/context/QueuedMessageContext.tsx
function useQueuedMessage() {
  return React27.useContext(QueuedMessageContext);
}
function QueuedMessageProvider(t0) {
  let $3 = import_compiler_runtime78.c(9), {
    isFirst,
    useBriefLayout,
    children
  } = t0, padding = useBriefLayout ? 0 : PADDING_X, t1 = padding * 2, t2;
  if ($3[0] !== isFirst || $3[1] !== t1)
    t2 = {
      isQueued: !0,
      isFirst,
      paddingWidth: t1
    }, $3[0] = isFirst, $3[1] = t1, $3[2] = t2;
  else
    t2 = $3[2];
  let value = t2, t3;
  if ($3[3] !== children || $3[4] !== padding)
    t3 = /* @__PURE__ */ jsx_dev_runtime88.jsxDEV(ThemedBox_default, {
      paddingX: padding,
      children
    }, void 0, !1, void 0, this), $3[3] = children, $3[4] = padding, $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] !== t3 || $3[7] !== value)
    t4 = /* @__PURE__ */ jsx_dev_runtime88.jsxDEV(QueuedMessageContext.Provider, {
      value,
      children: t3
    }, void 0, !1, void 0, this), $3[6] = t3, $3[7] = value, $3[8] = t4;
  else
    t4 = $3[8];
  return t4;
}
var import_compiler_runtime78, React27, jsx_dev_runtime88, QueuedMessageContext, PADDING_X = 2;
var init_QueuedMessageContext = __esm(() => {
  init_ink2();
  import_compiler_runtime78 = __toESM(require_react_compiler_runtime_development(), 1), React27 = __toESM(require_react_development(), 1), jsx_dev_runtime88 = __toESM(require_react_jsx_dev_runtime_development(), 1), QueuedMessageContext = React27.createContext(void 0);
});
