// Original: src/components/agents/ColorPicker.tsx
function ColorPicker(t0) {
  let $3 = import_compiler_runtime248.c(17), {
    agentName,
    currentColor: t1,
    onConfirm
  } = t0, currentColor = t1 === void 0 ? "automatic" : t1, t2;
  if ($3[0] !== currentColor)
    t2 = COLOR_OPTIONS.findIndex((opt) => opt === currentColor), $3[0] = currentColor, $3[1] = t2;
  else
    t2 = $3[1];
  let [selectedIndex, setSelectedIndex] = import_react175.useState(Math.max(0, t2)), t3;
  if ($3[2] !== onConfirm || $3[3] !== selectedIndex)
    t3 = (e) => {
      if (e.key === "up")
        e.preventDefault(), setSelectedIndex(_temp155);
      else if (e.key === "down")
        e.preventDefault(), setSelectedIndex(_temp265);
      else if (e.key === "return") {
        e.preventDefault();
        let selected = COLOR_OPTIONS[selectedIndex];
        onConfirm(selected === "automatic" ? void 0 : selected);
      }
    }, $3[2] = onConfirm, $3[3] = selectedIndex, $3[4] = t3;
  else
    t3 = $3[4];
  let handleKeyDown = t3, selectedValue = COLOR_OPTIONS[selectedIndex], t4;
  if ($3[5] !== selectedIndex)
    t4 = COLOR_OPTIONS.map((option, index) => {
      let isSelected = index === selectedIndex;
      return /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedText, {
            color: isSelected ? "suggestion" : void 0,
            children: isSelected ? figures_default.pointer : " "
          }, void 0, !1, void 0, this),
          option === "automatic" ? /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedText, {
            bold: isSelected,
            children: "Automatic color"
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedBox_default, {
            gap: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedText, {
                backgroundColor: AGENT_COLOR_TO_THEME_COLOR[option],
                color: "inverseText",
                children: " "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedText, {
                bold: isSelected,
                children: capitalize(option)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, option, !0, void 0, this);
    }), $3[5] = selectedIndex, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: t4
    }, void 0, !1, void 0, this), $3[7] = t4, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedText, {
      children: "Preview: "
    }, void 0, !1, void 0, this), $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] !== agentName || $3[11] !== selectedValue)
    t7 = /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: [
        t6,
        selectedValue === void 0 || selectedValue === "automatic" ? /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedText, {
          inverse: !0,
          bold: !0,
          children: [
            " ",
            "@",
            agentName,
            " "
          ]
        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedText, {
          backgroundColor: AGENT_COLOR_TO_THEME_COLOR[selectedValue],
          color: "inverseText",
          bold: !0,
          children: [
            " ",
            "@",
            agentName,
            " "
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[10] = agentName, $3[11] = selectedValue, $3[12] = t7;
  else
    t7 = $3[12];
  let t8;
  if ($3[13] !== handleKeyDown || $3[14] !== t5 || $3[15] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime315.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: [
        t5,
        t7
      ]
    }, void 0, !0, void 0, this), $3[13] = handleKeyDown, $3[14] = t5, $3[15] = t7, $3[16] = t8;
  else
    t8 = $3[16];
  return t8;
}
function _temp265(prev_0) {
  return prev_0 < COLOR_OPTIONS.length - 1 ? prev_0 + 1 : 0;
}
function _temp155(prev) {
  return prev > 0 ? prev - 1 : COLOR_OPTIONS.length - 1;
}
var import_compiler_runtime248, import_react175, jsx_dev_runtime315, COLOR_OPTIONS;
var init_ColorPicker = __esm(() => {
  init_figures();
  init_ink2();
  init_agentColorManager();
  import_compiler_runtime248 = __toESM(require_react_compiler_runtime_development(), 1), import_react175 = __toESM(require_react_development(), 1), jsx_dev_runtime315 = __toESM(require_react_jsx_dev_runtime_development(), 1), COLOR_OPTIONS = ["automatic", ...AGENT_COLORS];
});
