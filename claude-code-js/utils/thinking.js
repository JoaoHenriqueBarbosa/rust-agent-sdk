// Original: src/utils/thinking.ts
function isUltrathinkEnabled() {
  return !1;
}
function hasUltrathinkKeyword(text2) {
  return /\bultrathink\b/i.test(text2);
}
function findThinkingTriggerPositions(text2) {
  let positions = [], matches = text2.matchAll(/\bultrathink\b/gi);
  for (let match of matches)
    if (match.index !== void 0)
      positions.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
  return positions;
}
function getRainbowColor(charIndex, shimmer = !1) {
  let colors = shimmer ? RAINBOW_SHIMMER_COLORS : RAINBOW_COLORS;
  return colors[charIndex % colors.length];
}
function modelSupportsThinking(model) {
  let supported3P = get3PModelCapabilityOverride(model, "thinking");
  if (supported3P !== void 0)
    return supported3P;
  let canonical = getCanonicalName(model), provider5 = getAPIProvider();
  if (provider5 === "foundry" || provider5 === "firstParty")
    return !canonical.includes("claude-3-");
  return canonical.includes("sonnet-4") || canonical.includes("opus-4");
}
function modelSupportsAdaptiveThinking(model) {
  let supported3P = get3PModelCapabilityOverride(model, "adaptive_thinking");
  if (supported3P !== void 0)
    return supported3P;
  let canonical = getCanonicalName(model);
  if (canonical.includes("opus-4-6") || canonical.includes("sonnet-4-6"))
    return !0;
  if (canonical.includes("opus") || canonical.includes("sonnet") || canonical.includes("haiku"))
    return !1;
  let provider5 = getAPIProvider();
  return provider5 === "firstParty" || provider5 === "foundry";
}
function shouldEnableThinkingByDefault() {
  if (process.env.MAX_THINKING_TOKENS)
    return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  let { settings } = getSettingsWithErrors();
  if (settings.alwaysThinkingEnabled === !1)
    return !1;
  return !0;
}
var RAINBOW_COLORS, RAINBOW_SHIMMER_COLORS;
var init_thinking = __esm(() => {
  init_model();
  init_modelSupportOverrides();
  init_providers();
  init_settings2();
  RAINBOW_COLORS = [
    "rainbow_red",
    "rainbow_orange",
    "rainbow_yellow",
    "rainbow_green",
    "rainbow_blue",
    "rainbow_indigo",
    "rainbow_violet"
  ], RAINBOW_SHIMMER_COLORS = [
    "rainbow_red_shimmer",
    "rainbow_orange_shimmer",
    "rainbow_yellow_shimmer",
    "rainbow_green_shimmer",
    "rainbow_blue_shimmer",
    "rainbow_indigo_shimmer",
    "rainbow_violet_shimmer"
  ];
});
