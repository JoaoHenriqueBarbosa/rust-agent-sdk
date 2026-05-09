// Original: src/components/LogoV2/Opus1mMergeNotice.tsx
function shouldShowOpus1mMergeNotice() {
  return isOpus1mMergeEnabled() && (getGlobalConfig().opus1mMergeNoticeSeenCount ?? 0) < MAX_SHOW_COUNT;
}
function Opus1mMergeNotice() {
  let $3 = import_compiler_runtime202.c(4), [show] = import_react147.useState(shouldShowOpus1mMergeNotice), t0, t1;
  if ($3[0] !== show)
    t0 = () => {
      if (!show)
        return;
      let newCount = (getGlobalConfig().opus1mMergeNoticeSeenCount ?? 0) + 1;
      saveGlobalConfig((prev) => {
        if ((prev.opus1mMergeNoticeSeenCount ?? 0) >= newCount)
          return prev;
        return {
          ...prev,
          opus1mMergeNoticeSeenCount: newCount
        };
      });
    }, t1 = [show], $3[0] = show, $3[1] = t0, $3[2] = t1;
  else
    t0 = $3[1], t1 = $3[2];
  if (import_react147.useEffect(t0, t1), !show)
    return null;
  let t2;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime256.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: [
        /* @__PURE__ */ jsx_dev_runtime256.jsxDEV(AnimatedAsterisk, {
          char: UP_ARROW
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime256.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            "Opus now defaults to 1M context \xB7 5x more room, same pricing"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[3] = t2;
  else
    t2 = $3[3];
  return t2;
}
var import_compiler_runtime202, import_react147, jsx_dev_runtime256, MAX_SHOW_COUNT = 6;
var init_Opus1mMergeNotice = __esm(() => {
  init_figures2();
  init_ink2();
  init_config4();
  init_model();
  init_AnimatedAsterisk();
  import_compiler_runtime202 = __toESM(require_react_compiler_runtime_development(), 1), import_react147 = __toESM(require_react_development(), 1), jsx_dev_runtime256 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
