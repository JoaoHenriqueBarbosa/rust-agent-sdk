// Original: src/utils/ink.ts
function toInkColor(color2) {
  if (!color2)
    return DEFAULT_AGENT_THEME_COLOR;
  let themeColor = AGENT_COLOR_TO_THEME_COLOR[color2];
  if (themeColor)
    return themeColor;
  return `ansi:${color2}`;
}
var DEFAULT_AGENT_THEME_COLOR = "cyan_FOR_SUBAGENTS_ONLY";
var init_ink3 = __esm(() => {
  init_agentColorManager();
});
