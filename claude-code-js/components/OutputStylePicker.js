// Original: src/components/OutputStylePicker.tsx
function mapConfigsToOptions(styles5) {
  return Object.entries(styles5).map(([style, config10]) => ({
    label: config10?.name ?? DEFAULT_OUTPUT_STYLE_LABEL,
    value: style,
    description: config10?.description ?? DEFAULT_OUTPUT_STYLE_DESCRIPTION
  }));
}
function OutputStylePicker(t0) {
  let $3 = import_compiler_runtime139.c(16), {
    initialStyle,
    onComplete,
    onCancel,
    isStandaloneCommand
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  let [styleOptions, setStyleOptions] = import_react101.useState(t1), [isLoading, setIsLoading] = import_react101.useState(!0), t2, t3;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => {
      getAllOutputStyles(getCwd()).then((allStyles) => {
        let options2 = mapConfigsToOptions(allStyles);
        setStyleOptions(options2), setIsLoading(!1);
      }).catch(() => {
        let builtInOptions = mapConfigsToOptions(OUTPUT_STYLE_CONFIG);
        setStyleOptions(builtInOptions), setIsLoading(!1);
      });
    }, t3 = [], $3[1] = t2, $3[2] = t3;
  else
    t2 = $3[1], t3 = $3[2];
  import_react101.useEffect(t2, t3);
  let t4;
  if ($3[3] !== onComplete)
    t4 = (style) => {
      onComplete(style);
    }, $3[3] = onComplete, $3[4] = t4;
  else
    t4 = $3[4];
  let handleStyleSelect = t4, t5 = !isStandaloneCommand, t6 = !isStandaloneCommand, t7;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime176.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime176.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "This changes how Claude Code communicates with you"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = t7;
  else
    t7 = $3[5];
  let t8;
  if ($3[6] !== handleStyleSelect || $3[7] !== initialStyle || $3[8] !== isLoading || $3[9] !== styleOptions)
    t8 = /* @__PURE__ */ jsx_dev_runtime176.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t7,
        isLoading ? /* @__PURE__ */ jsx_dev_runtime176.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Loading output styles\u2026"
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime176.jsxDEV(Select, {
          options: styleOptions,
          onChange: handleStyleSelect,
          visibleOptionCount: 10,
          defaultValue: initialStyle
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = handleStyleSelect, $3[7] = initialStyle, $3[8] = isLoading, $3[9] = styleOptions, $3[10] = t8;
  else
    t8 = $3[10];
  let t9;
  if ($3[11] !== onCancel || $3[12] !== t5 || $3[13] !== t6 || $3[14] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime176.jsxDEV(Dialog, {
      title: "Preferred output style",
      onCancel,
      hideInputGuide: t5,
      hideBorder: t6,
      children: t8
    }, void 0, !1, void 0, this), $3[11] = onCancel, $3[12] = t5, $3[13] = t6, $3[14] = t8, $3[15] = t9;
  else
    t9 = $3[15];
  return t9;
}
var import_compiler_runtime139, import_react101, jsx_dev_runtime176, DEFAULT_OUTPUT_STYLE_LABEL = "Default", DEFAULT_OUTPUT_STYLE_DESCRIPTION = "Claude completes coding tasks efficiently and provides concise responses";
var init_OutputStylePicker = __esm(() => {
  init_outputStyles();
  init_ink2();
  init_cwd2();
  init_select();
  init_Dialog();
  import_compiler_runtime139 = __toESM(require_react_compiler_runtime_development(), 1), import_react101 = __toESM(require_react_development(), 1), jsx_dev_runtime176 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
