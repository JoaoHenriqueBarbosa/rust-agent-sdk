// Original: src/components/StatusNotices.tsx
function StatusNotices(t0) {
  let $3 = import_compiler_runtime209.c(4), {
    agentDefinitions
  } = t0 === void 0 ? {} : t0, t1 = getGlobalConfig(), t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getMemoryFiles(), $3[0] = t2;
  else
    t2 = $3[0];
  let context7 = {
    config: t1,
    agentDefinitions,
    memoryFiles: import_react151.use(t2)
  }, activeNotices = getActiveNotices(context7);
  if (activeNotices.length === 0)
    return null;
  let T0 = ThemedBox_default, t3 = "column", t4 = 1, t5 = activeNotices.map((notice) => /* @__PURE__ */ jsx_dev_runtime264.jsxDEV(React81.Fragment, {
    children: notice.render(context7)
  }, notice.id, !1, void 0, this)), t6;
  if ($3[1] !== T0 || $3[2] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime264.jsxDEV(T0, {
      flexDirection: t3,
      paddingLeft: t4,
      children: t5
    }, void 0, !1, void 0, this), $3[1] = T0, $3[2] = t5, $3[3] = t6;
  else
    t6 = $3[3];
  return t6;
}
var import_compiler_runtime209, React81, import_react151, jsx_dev_runtime264;
var init_StatusNotices = __esm(() => {
  init_ink2();
  init_claudemd();
  init_config4();
  init_statusNoticeDefinitions();
  import_compiler_runtime209 = __toESM(require_react_compiler_runtime_development(), 1), React81 = __toESM(require_react_development(), 1), import_react151 = __toESM(require_react_development(), 1), jsx_dev_runtime264 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
