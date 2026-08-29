// Original: src/utils/effort.ts
function modelSupportsEffort(model) {
  let m4 = model.toLowerCase();
  if (isEnvTruthy(process.env.CLAUDE_CODE_ALWAYS_ENABLE_EFFORT))
    return !0;
  let supported3P = get3PModelCapabilityOverride(model, "effort");
  if (supported3P !== void 0)
    return supported3P;
  if (m4.includes("opus-4-6") || m4.includes("sonnet-4-6"))
    return !0;
  if (m4.includes("haiku") || m4.includes("sonnet") || m4.includes("opus"))
    return !1;
  return getAPIProvider() === "firstParty";
}
function modelSupportsMaxEffort(model) {
  let supported3P = get3PModelCapabilityOverride(model, "max_effort");
  if (supported3P !== void 0)
    return supported3P;
  if (model.toLowerCase().includes("opus-4-6"))
    return !0;
  return !1;
}
function isEffortLevel(value) {
  return EFFORT_LEVELS.includes(value);
}
function parseEffortValue(value) {
  if (value === void 0 || value === null || value === "")
    return;
  if (typeof value === "number" && isValidNumericEffort(value))
    return value;
  let str = String(value).toLowerCase();
  if (isEffortLevel(str))
    return str;
  let numericValue = parseInt(str, 10);
  if (!isNaN(numericValue) && isValidNumericEffort(numericValue))
    return numericValue;
  return;
}
function toPersistableEffort(value) {
  if (value === "low" || value === "medium" || value === "high")
    return value;
  return;
}
function getInitialEffortSetting() {
  return toPersistableEffort(getInitialSettings().effortLevel);
}
function resolvePickerEffortPersistence(picked, modelDefault, priorPersisted, toggledInPicker) {
  return priorPersisted !== void 0 || toggledInPicker || picked !== modelDefault ? picked : void 0;
}
function getEffortEnvOverride() {
  let envOverride = process.env.CLAUDE_CODE_EFFORT_LEVEL;
  return envOverride?.toLowerCase() === "unset" || envOverride?.toLowerCase() === "auto" ? null : parseEffortValue(envOverride);
}
function resolveAppliedEffort(model, appStateEffortValue) {
  let envOverride = getEffortEnvOverride();
  if (envOverride === null)
    return;
  let resolved = envOverride ?? appStateEffortValue ?? getDefaultEffortForModel(model);
  if (resolved === "max" && !modelSupportsMaxEffort(model))
    return "high";
  return resolved;
}
function getDisplayedEffortLevel(model, appStateEffort) {
  let resolved = resolveAppliedEffort(model, appStateEffort) ?? "high";
  return convertEffortValueToLevel(resolved);
}
function getEffortSuffix(model, effortValue) {
  if (effortValue === void 0)
    return "";
  let resolved = resolveAppliedEffort(model, effortValue);
  if (resolved === void 0)
    return "";
  return ` with ${convertEffortValueToLevel(resolved)} effort`;
}
function isValidNumericEffort(value) {
  return Number.isInteger(value);
}
function convertEffortValueToLevel(value) {
  if (typeof value === "string")
    return isEffortLevel(value) ? value : "high";
  return "high";
}
function getEffortLevelDescription(level) {
  switch (level) {
    case "low":
      return "Quick, straightforward implementation with minimal overhead";
    case "medium":
      return "Balanced approach with standard implementation and testing";
    case "high":
      return "Comprehensive implementation with extensive testing and documentation";
    case "max":
      return "Maximum capability with deepest reasoning (Opus 4.6 only)";
  }
}
function getEffortValueDescription(value) {
  if (typeof value === "string")
    return getEffortLevelDescription(value);
  return "Balanced approach with standard implementation and testing";
}
function getOpusDefaultEffortConfig() {
  return { ...OPUS_DEFAULT_EFFORT_CONFIG_DEFAULT };
}
function getDefaultEffortForModel(model) {
  if (model.toLowerCase().includes("opus-4-6")) {
    if (isProSubscriber())
      return "medium";
    if (getOpusDefaultEffortConfig().enabled && (isMaxSubscriber() || isTeamSubscriber()))
      return "medium";
  }
  if (isUltrathinkEnabled() && modelSupportsEffort(model))
    return "medium";
  return;
}
var EFFORT_LEVELS, OPUS_DEFAULT_EFFORT_CONFIG_DEFAULT;
var init_effort = __esm(() => {
  init_thinking();
  init_settings2();
  init_auth14();
  init_providers();
  init_modelSupportOverrides();
  init_envUtils();
  EFFORT_LEVELS = [
    "low",
    "medium",
    "high",
    "max"
  ];
  OPUS_DEFAULT_EFFORT_CONFIG_DEFAULT = {
    enabled: !0,
    dialogTitle: "We recommend medium effort for Opus",
    dialogDescription: "Effort determines how long Claude thinks for when completing your task. We recommend medium effort for most tasks to balance speed and intelligence and maximize rate limits. Use ultrathink to trigger high effort when needed."
  };
});
