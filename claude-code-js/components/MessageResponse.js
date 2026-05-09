// Original: src/components/MessageResponse.tsx
function MessageResponse(t0) {
  let $3 = import_compiler_runtime16.c(8), {
    children,
    height
  } = t0;
  if (import_react27.useContext(MessageResponseContext))
    return children;
  let t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(NoSelect, {
      fromLeftEdge: !0,
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  ",
          "\u23BF \xA0"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== children)
    t2 = /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(ThemedBox_default, {
      flexShrink: 1,
      flexGrow: 1,
      children
    }, void 0, !1, void 0, this), $3[1] = children, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== height || $3[4] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(MessageResponseProvider, {
      children: /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        height,
        overflowY: "hidden",
        children: [
          t1,
          t2
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = height, $3[4] = t2, $3[5] = t3;
  else
    t3 = $3[5];
  let content = t3;
  if (height !== void 0)
    return content;
  let t4;
  if ($3[6] !== content)
    t4 = /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(Ratchet, {
      lock: "offscreen",
      children: content
    }, void 0, !1, void 0, this), $3[6] = content, $3[7] = t4;
  else
    t4 = $3[7];
  return t4;
}
function MessageResponseProvider(t0) {
  let $3 = import_compiler_runtime16.c(2), {
    children
  } = t0, t1;
  if ($3[0] !== children)
    t1 = /* @__PURE__ */ jsx_dev_runtime19.jsxDEV(MessageResponseContext.Provider, {
      value: !0,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = t1;
  else
    t1 = $3[1];
  return t1;
}
var import_compiler_runtime16, React9, import_react27, jsx_dev_runtime19, MessageResponseContext;
var init_MessageResponse = __esm(() => {
  init_ink2();
  init_Ratchet();
  import_compiler_runtime16 = __toESM(require_react_compiler_runtime_development(), 1), React9 = __toESM(require_react_development(), 1), import_react27 = __toESM(require_react_development(), 1), jsx_dev_runtime19 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  MessageResponseContext = React9.createContext(!1);
});
