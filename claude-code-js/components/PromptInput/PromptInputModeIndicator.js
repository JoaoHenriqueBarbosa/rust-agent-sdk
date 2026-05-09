// Original: src/components/PromptInput/PromptInputModeIndicator.tsx
function getTeammateThemeColor() {
  if (!isAgentSwarmsEnabled())
    return;
  let colorName = getTeammateColor();
  if (!colorName)
    return;
  if (AGENT_COLORS.includes(colorName))
    return AGENT_COLOR_TO_THEME_COLOR[colorName];
  return;
}
function PromptChar(t0) {
  let $3 = import_compiler_runtime333.c(3), {
    isLoading,
    themeColor
  } = t0, color3 = themeColor ?? void 0, t1;
  if ($3[0] !== color3 || $3[1] !== isLoading)
    t1 = /* @__PURE__ */ jsx_dev_runtime431.jsxDEV(ThemedText, {
      color: color3,
      dimColor: isLoading,
      children: [
        figures_default.pointer,
        "\xA0"
      ]
    }, void 0, !0, void 0, this), $3[0] = color3, $3[1] = isLoading, $3[2] = t1;
  else
    t1 = $3[2];
  return t1;
}
function PromptInputModeIndicator(t0) {
  let $3 = import_compiler_runtime333.c(6), {
    mode,
    isLoading,
    viewingAgentName,
    viewingAgentColor
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getTeammateThemeColor(), $3[0] = t1;
  else
    t1 = $3[0];
  let teammateColor = t1, viewedTeammateThemeColor = viewingAgentColor ? AGENT_COLOR_TO_THEME_COLOR[viewingAgentColor] : void 0, t2;
  if ($3[1] !== isLoading || $3[2] !== mode || $3[3] !== viewedTeammateThemeColor || $3[4] !== viewingAgentName)
    t2 = /* @__PURE__ */ jsx_dev_runtime431.jsxDEV(ThemedBox_default, {
      alignItems: "flex-start",
      alignSelf: "flex-start",
      flexWrap: "nowrap",
      justifyContent: "flex-start",
      children: viewingAgentName ? /* @__PURE__ */ jsx_dev_runtime431.jsxDEV(PromptChar, {
        isLoading,
        themeColor: viewedTeammateThemeColor
      }, void 0, !1, void 0, this) : mode === "bash" ? /* @__PURE__ */ jsx_dev_runtime431.jsxDEV(ThemedText, {
        color: "bashBorder",
        dimColor: isLoading,
        children: "!\xA0"
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime431.jsxDEV(PromptChar, {
        isLoading,
        themeColor: isAgentSwarmsEnabled() ? teammateColor : void 0
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[1] = isLoading, $3[2] = mode, $3[3] = viewedTeammateThemeColor, $3[4] = viewingAgentName, $3[5] = t2;
  else
    t2 = $3[5];
  return t2;
}
var import_compiler_runtime333, jsx_dev_runtime431;
var init_PromptInputModeIndicator = __esm(() => {
  init_figures();
  init_ink2();
  init_agentColorManager();
  init_teammate();
  init_agentSwarmsEnabled();
  import_compiler_runtime333 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime431 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
