// Original: src/components/PromptInput/SandboxPromptFooterHint.tsx
function SandboxPromptFooterHint() {
  let $3 = import_compiler_runtime318.c(6), [recentViolationCount, setRecentViolationCount] = import_react232.useState(0), timerRef = import_react232.useRef(null), detailsShortcut = useShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o"), t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = () => {
      if (!SandboxManager2.isSandboxingEnabled())
        return;
      let store = SandboxManager2.getSandboxViolationStore(), lastCount = store.getTotalCount(), unsubscribe2 = store.subscribe(() => {
        let currentCount = store.getTotalCount(), newViolations = currentCount - lastCount;
        if (newViolations > 0) {
          if (setRecentViolationCount(newViolations), lastCount = currentCount, timerRef.current)
            clearTimeout(timerRef.current);
          timerRef.current = setTimeout(setRecentViolationCount, 5000, 0);
        }
      });
      return () => {
        if (unsubscribe2(), timerRef.current)
          clearTimeout(timerRef.current);
      };
    }, t1 = [], $3[0] = t0, $3[1] = t1;
  else
    t0 = $3[0], t1 = $3[1];
  if (import_react232.useEffect(t0, t1), !SandboxManager2.isSandboxingEnabled() || recentViolationCount === 0)
    return null;
  let t2 = recentViolationCount === 1 ? "operation" : "operations", t3;
  if ($3[2] !== detailsShortcut || $3[3] !== recentViolationCount || $3[4] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime410.jsxDEV(ThemedBox_default, {
      paddingX: 0,
      paddingY: 0,
      children: /* @__PURE__ */ jsx_dev_runtime410.jsxDEV(ThemedText, {
        color: "inactive",
        wrap: "truncate",
        children: [
          "\u29C8 Sandbox blocked ",
          recentViolationCount,
          " ",
          t2,
          " \xB7",
          " ",
          detailsShortcut,
          " for details \xB7 /sandbox to disable"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = detailsShortcut, $3[3] = recentViolationCount, $3[4] = t2, $3[5] = t3;
  else
    t3 = $3[5];
  return t3;
}
var import_compiler_runtime318, import_react232, jsx_dev_runtime410;
var init_SandboxPromptFooterHint = __esm(() => {
  init_ink2();
  init_useShortcutDisplay();
  init_sandbox_adapter();
  import_compiler_runtime318 = __toESM(require_react_compiler_runtime_development(), 1), import_react232 = __toESM(require_react_development(), 1), jsx_dev_runtime410 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
