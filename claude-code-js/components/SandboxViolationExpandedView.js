// Original: src/components/SandboxViolationExpandedView.tsx
function formatTime(date6) {
  let h4 = date6.getHours() % 12 || 12, m4 = String(date6.getMinutes()).padStart(2, "0"), s2 = String(date6.getSeconds()).padStart(2, "0"), ampm = date6.getHours() < 12 ? "am" : "pm";
  return `${h4}:${m4}:${s2}${ampm}`;
}
function SandboxViolationExpandedView() {
  let $3 = import_compiler_runtime344.c(15), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = [], $3[0] = t0;
  else
    t0 = $3[0];
  let [violations, setViolations] = import_react285.useState(t0), [totalCount, setTotalCount] = import_react285.useState(0), t1, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => {
      let store = SandboxManager2.getSandboxViolationStore();
      return store.subscribe((allViolations) => {
        setViolations(allViolations.slice(-10)), setTotalCount(store.getTotalCount());
      });
    }, t2 = [], $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  if (import_react285.useEffect(t1, t2), !SandboxManager2.isSandboxingEnabled() || getPlatform() === "linux")
    return null;
  if (totalCount === 0)
    return null;
  let t3 = totalCount === 1 ? "operation" : "operations", t4;
  if ($3[3] !== t3 || $3[4] !== totalCount)
    t4 = /* @__PURE__ */ jsx_dev_runtime443.jsxDEV(ThemedBox_default, {
      marginLeft: 0,
      children: /* @__PURE__ */ jsx_dev_runtime443.jsxDEV(ThemedText, {
        color: "permission",
        children: [
          "\u29C8 Sandbox blocked ",
          totalCount,
          " total",
          " ",
          t3
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = t3, $3[4] = totalCount, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== violations)
    t5 = violations.map(_temp208), $3[6] = violations, $3[7] = t5;
  else
    t5 = $3[7];
  let t6 = Math.min(10, violations.length), t7;
  if ($3[8] !== t6 || $3[9] !== totalCount)
    t7 = /* @__PURE__ */ jsx_dev_runtime443.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime443.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "\u2026 showing last ",
          t6,
          " of ",
          totalCount
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = t6, $3[9] = totalCount, $3[10] = t7;
  else
    t7 = $3[10];
  let t8;
  if ($3[11] !== t4 || $3[12] !== t5 || $3[13] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime443.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t4,
        t5,
        t7
      ]
    }, void 0, !0, void 0, this), $3[11] = t4, $3[12] = t5, $3[13] = t7, $3[14] = t8;
  else
    t8 = $3[14];
  return t8;
}
function _temp208(v2, i5) {
  return /* @__PURE__ */ jsx_dev_runtime443.jsxDEV(ThemedBox_default, {
    paddingLeft: 2,
    children: /* @__PURE__ */ jsx_dev_runtime443.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        formatTime(v2.timestamp),
        v2.command ? ` ${v2.command}:` : "",
        " ",
        v2.line
      ]
    }, void 0, !0, void 0, this)
  }, `${v2.timestamp.getTime()}-${i5}`, !1, void 0, this);
}
var import_compiler_runtime344, import_react285, jsx_dev_runtime443;
var init_SandboxViolationExpandedView = __esm(() => {
  init_ink2();
  init_sandbox_adapter();
  init_platform();
  import_compiler_runtime344 = __toESM(require_react_compiler_runtime_development(), 1), import_react285 = __toESM(require_react_development(), 1), jsx_dev_runtime443 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
