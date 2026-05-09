// Original: src/components/ContextSuggestions.tsx
function ContextSuggestions(t0) {
  let $3 = import_compiler_runtime147.c(5), {
    suggestions
  } = t0;
  if (suggestions.length === 0)
    return null;
  let t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(ThemedText, {
      bold: !0,
      children: "Suggestions"
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== suggestions)
    t2 = suggestions.map(_temp76), $3[1] = suggestions, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
function _temp76(suggestion, i5) {
  return /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: i5 === 0 ? 0 : 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(StatusIcon, {
            status: suggestion.severity,
            withSpace: !0
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(ThemedText, {
            bold: !0,
            children: suggestion.title
          }, void 0, !1, void 0, this),
          suggestion.savingsTokens ? /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " ",
              figures_default.arrowRight,
              " save ~",
              formatTokens(suggestion.savingsTokens)
            ]
          }, void 0, !0, void 0, this) : null
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(ThemedBox_default, {
        marginLeft: 2,
        children: /* @__PURE__ */ jsx_dev_runtime185.jsxDEV(ThemedText, {
          dimColor: !0,
          children: suggestion.detail
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, i5, !0, void 0, this);
}
var import_compiler_runtime147, jsx_dev_runtime185;
var init_ContextSuggestions = __esm(() => {
  init_figures();
  init_ink2();
  init_format();
  init_StatusIcon();
  import_compiler_runtime147 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime185 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
