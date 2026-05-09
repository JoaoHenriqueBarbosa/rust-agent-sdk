// Original: src/components/permissions/rules/RecentDenialsTab.tsx
function RecentDenialsTab(t0) {
  let $3 = import_compiler_runtime234.c(30), {
    onHeaderFocusChange,
    onStateChange
  } = t0, {
    headerFocused,
    focusHeader
  } = useTabHeaderFocus(), t1, t2;
  if ($3[0] !== headerFocused || $3[1] !== onHeaderFocusChange)
    t1 = () => {
      onHeaderFocusChange?.(headerFocused);
    }, t2 = [headerFocused, onHeaderFocusChange], $3[0] = headerFocused, $3[1] = onHeaderFocusChange, $3[2] = t1, $3[3] = t2;
  else
    t1 = $3[2], t2 = $3[3];
  import_react167.useEffect(t1, t2);
  let [denials] = import_react167.useState(_temp143), [approved, setApproved] = import_react167.useState(_temp257), [retry8, setRetry] = import_react167.useState(_temp335), [focusedIdx, setFocusedIdx] = import_react167.useState(0), t3, t4;
  if ($3[4] !== approved || $3[5] !== denials || $3[6] !== onStateChange || $3[7] !== retry8)
    t3 = () => {
      onStateChange({
        approved,
        retry: retry8,
        denials
      });
    }, t4 = [approved, retry8, denials, onStateChange], $3[4] = approved, $3[5] = denials, $3[6] = onStateChange, $3[7] = retry8, $3[8] = t3, $3[9] = t4;
  else
    t3 = $3[8], t4 = $3[9];
  import_react167.useEffect(t3, t4);
  let t5;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t5 = (value) => {
      let idx = Number(value);
      setApproved((prev) => {
        let next2 = new Set(prev);
        if (next2.has(idx))
          next2.delete(idx);
        else
          next2.add(idx);
        return next2;
      });
    }, $3[10] = t5;
  else
    t5 = $3[10];
  let handleSelect = t5, t6;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t6 = (value_0) => {
      setFocusedIdx(Number(value_0));
    }, $3[11] = t6;
  else
    t6 = $3[11];
  let handleFocus = t6, t7;
  if ($3[12] !== focusedIdx)
    t7 = (input, _key) => {
      if (input === "r")
        setRetry((prev_0) => {
          let next_0 = new Set(prev_0);
          if (next_0.has(focusedIdx))
            next_0.delete(focusedIdx);
          else
            next_0.add(focusedIdx);
          return next_0;
        }), setApproved((prev_1) => {
          if (prev_1.has(focusedIdx))
            return prev_1;
          let next_1 = new Set(prev_1);
          return next_1.add(focusedIdx), next_1;
        });
    }, $3[12] = focusedIdx, $3[13] = t7;
  else
    t7 = $3[13];
  let t8 = denials.length > 0, t9;
  if ($3[14] !== t8)
    t9 = {
      isActive: t8
    }, $3[14] = t8, $3[15] = t9;
  else
    t9 = $3[15];
  if (use_input_default(t7, t9), denials.length === 0) {
    let t102;
    if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
      t102 = /* @__PURE__ */ jsx_dev_runtime296.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "No recent denials. Commands denied by the auto mode classifier will appear here."
      }, void 0, !1, void 0, this), $3[16] = t102;
    else
      t102 = $3[16];
    return t102;
  }
  let t10;
  if ($3[17] !== approved || $3[18] !== denials || $3[19] !== retry8) {
    let t112;
    if ($3[21] !== approved || $3[22] !== retry8)
      t112 = (d, idx_0) => {
        let isApproved = approved.has(idx_0), suffix = retry8.has(idx_0) ? " (retry)" : "";
        return {
          label: /* @__PURE__ */ jsx_dev_runtime296.jsxDEV(ThemedText, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime296.jsxDEV(StatusIcon, {
                status: isApproved ? "success" : "error",
                withSpace: !0
              }, void 0, !1, void 0, this),
              d.display,
              /* @__PURE__ */ jsx_dev_runtime296.jsxDEV(ThemedText, {
                dimColor: !0,
                children: suffix
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          value: String(idx_0)
        };
      }, $3[21] = approved, $3[22] = retry8, $3[23] = t112;
    else
      t112 = $3[23];
    t10 = denials.map(t112), $3[17] = approved, $3[18] = denials, $3[19] = retry8, $3[20] = t10;
  } else
    t10 = $3[20];
  let options2 = t10, t11;
  if ($3[24] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime296.jsxDEV(ThemedText, {
      children: "Commands recently denied by the auto mode classifier."
    }, void 0, !1, void 0, this), $3[24] = t11;
  else
    t11 = $3[24];
  let t12 = Math.min(10, options2.length), t13;
  if ($3[25] !== focusHeader || $3[26] !== headerFocused || $3[27] !== options2 || $3[28] !== t12)
    t13 = /* @__PURE__ */ jsx_dev_runtime296.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t11,
        /* @__PURE__ */ jsx_dev_runtime296.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime296.jsxDEV(Select, {
            options: options2,
            onChange: handleSelect,
            onFocus: handleFocus,
            visibleOptionCount: t12,
            isDisabled: headerFocused,
            onUpFromFirstItem: focusHeader
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[25] = focusHeader, $3[26] = headerFocused, $3[27] = options2, $3[28] = t12, $3[29] = t13;
  else
    t13 = $3[29];
  return t13;
}
function _temp335() {
  return /* @__PURE__ */ new Set;
}
function _temp257() {
  return /* @__PURE__ */ new Set;
}
function _temp143() {
  return getAutoModeDenials();
}
var import_compiler_runtime234, import_react167, jsx_dev_runtime296;
var init_RecentDenialsTab = __esm(() => {
  init_ink2();
  init_autoModeDenials();
  init_select();
  init_StatusIcon();
  init_Tabs();
  import_compiler_runtime234 = __toESM(require_react_compiler_runtime_development(), 1), import_react167 = __toESM(require_react_development(), 1), jsx_dev_runtime296 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
