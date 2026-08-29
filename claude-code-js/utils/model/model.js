// Original: src/utils/model/model.ts
function getSmallFastModel() {
  return process.env.ANTHROPIC_SMALL_FAST_MODEL || getDefaultHaikuModel();
}
function isNonCustomOpusModel(model) {
  return model === getModelStrings2().opus40 || model === getModelStrings2().opus41 || model === getModelStrings2().opus45 || model === getModelStrings2().opus46;
}
function getUserSpecifiedModelSetting() {
  let specifiedModel, modelOverride = getMainLoopModelOverride();
  if (modelOverride !== void 0)
    specifiedModel = modelOverride;
  else {
    let settings = getSettings_DEPRECATED() || {};
    specifiedModel = process.env.ANTHROPIC_MODEL || settings.model || void 0;
  }
  if (specifiedModel && !isModelAllowed(specifiedModel))
    return;
  return specifiedModel;
}
function getMainLoopModel() {
  let model = getUserSpecifiedModelSetting();
  if (model !== void 0 && model !== null)
    return parseUserSpecifiedModel(model);
  return getDefaultMainLoopModel();
}
function getBestModel() {
  return getDefaultOpusModel();
}
function getDefaultOpusModel() {
  if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL)
    return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  if (getAPIProvider() !== "firstParty")
    return getModelStrings2().opus46;
  return getModelStrings2().opus46;
}
function getDefaultSonnetModel() {
  if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL)
    return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  if (getAPIProvider() !== "firstParty")
    return getModelStrings2().sonnet45;
  return getModelStrings2().sonnet46;
}
function getDefaultHaikuModel() {
  if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL)
    return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  return getModelStrings2().haiku45;
}
function getRuntimeMainLoopModel(params) {
  let { permissionMode, mainLoopModel, exceeds200kTokens = !1 } = params;
  if (getUserSpecifiedModelSetting() === "opusplan" && permissionMode === "plan" && !exceeds200kTokens)
    return getDefaultOpusModel();
  if (getUserSpecifiedModelSetting() === "haiku" && permissionMode === "plan")
    return getDefaultSonnetModel();
  return mainLoopModel;
}
function getDefaultMainLoopModelSetting() {
  if (isMaxSubscriber())
    return getDefaultOpusModel() + (isOpus1mMergeEnabled() ? "[1m]" : "");
  if (isTeamPremiumSubscriber())
    return getDefaultOpusModel() + (isOpus1mMergeEnabled() ? "[1m]" : "");
  return getDefaultSonnetModel();
}
function getDefaultMainLoopModel() {
  return parseUserSpecifiedModel(getDefaultMainLoopModelSetting());
}
function firstPartyNameToCanonical(name) {
  if (name = name.toLowerCase(), name.includes("claude-opus-4-6"))
    return "claude-opus-4-6";
  if (name.includes("claude-opus-4-5"))
    return "claude-opus-4-5";
  if (name.includes("claude-opus-4-1"))
    return "claude-opus-4-1";
  if (name.includes("claude-opus-4"))
    return "claude-opus-4";
  if (name.includes("claude-sonnet-4-6"))
    return "claude-sonnet-4-6";
  if (name.includes("claude-sonnet-4-5"))
    return "claude-sonnet-4-5";
  if (name.includes("claude-sonnet-4"))
    return "claude-sonnet-4";
  if (name.includes("claude-haiku-4-5"))
    return "claude-haiku-4-5";
  if (name.includes("claude-3-7-sonnet"))
    return "claude-3-7-sonnet";
  if (name.includes("claude-3-5-sonnet"))
    return "claude-3-5-sonnet";
  if (name.includes("claude-3-5-haiku"))
    return "claude-3-5-haiku";
  if (name.includes("claude-3-opus"))
    return "claude-3-opus";
  if (name.includes("claude-3-sonnet"))
    return "claude-3-sonnet";
  if (name.includes("claude-3-haiku"))
    return "claude-3-haiku";
  let match = name.match(/(claude-(\d+-\d+-)?\w+)/);
  if (match && match[1])
    return match[1];
  return name;
}
function getCanonicalName(fullModelName) {
  return firstPartyNameToCanonical(resolveOverriddenModel(fullModelName));
}
function getClaudeAiUserDefaultModelDescription(fastMode = !1) {
  if (isMaxSubscriber() || isTeamPremiumSubscriber()) {
    if (isOpus1mMergeEnabled())
      return `Opus 4.6 with 1M context \xB7 Most capable for complex work${fastMode ? getOpus46PricingSuffix(!0) : ""}`;
    return `Opus 4.6 \xB7 Most capable for complex work${fastMode ? getOpus46PricingSuffix(!0) : ""}`;
  }
  return "Sonnet 4.6 \xB7 Best for everyday tasks";
}
function renderDefaultModelSetting(setting) {
  if (setting === "opusplan")
    return "Opus 4.6 in plan mode, else Sonnet 4.6";
  return renderModelName(parseUserSpecifiedModel(setting));
}
function getOpus46PricingSuffix(fastMode) {
  if (getAPIProvider() !== "firstParty")
    return "";
  let pricing = formatModelPricing(getOpus46CostTier(fastMode));
  return ` \xB7${fastMode ? ` (${LIGHTNING_BOLT})` : ""} ${pricing}`;
}
function isOpus1mMergeEnabled() {
  if (is1mContextDisabled() || isProSubscriber() || getAPIProvider() !== "firstParty")
    return !1;
  if (isClaudeAISubscriber() && getSubscriptionType() === null)
    return !1;
  return !0;
}
function renderModelSetting(setting) {
  if (setting === "opusplan")
    return "Opus Plan";
  if (isModelAlias(setting))
    return capitalize(setting);
  return renderModelName(setting);
}
function getPublicModelDisplayName(model) {
  switch (model) {
    case getModelStrings2().opus46:
      return "Opus 4.6";
    case getModelStrings2().opus46 + "[1m]":
      return "Opus 4.6 (1M context)";
    case getModelStrings2().opus45:
      return "Opus 4.5";
    case getModelStrings2().opus41:
      return "Opus 4.1";
    case getModelStrings2().opus40:
      return "Opus 4";
    case getModelStrings2().sonnet46 + "[1m]":
      return "Sonnet 4.6 (1M context)";
    case getModelStrings2().sonnet46:
      return "Sonnet 4.6";
    case getModelStrings2().sonnet45 + "[1m]":
      return "Sonnet 4.5 (1M context)";
    case getModelStrings2().sonnet45:
      return "Sonnet 4.5";
    case getModelStrings2().sonnet40:
      return "Sonnet 4";
    case getModelStrings2().sonnet40 + "[1m]":
      return "Sonnet 4 (1M context)";
    case getModelStrings2().sonnet37:
      return "Sonnet 3.7";
    case getModelStrings2().sonnet35:
      return "Sonnet 3.5";
    case getModelStrings2().haiku45:
      return "Haiku 4.5";
    case getModelStrings2().haiku35:
      return "Haiku 3.5";
    default:
      return null;
  }
}
function renderModelName(model) {
  let publicName = getPublicModelDisplayName(model);
  if (publicName)
    return publicName;
  {
    let resolved = parseUserSpecifiedModel(model);
    if (resolved !== model)
      return `${model} (${resolved})`;
    return resolved;
  }
  return model;
}
function parseUserSpecifiedModel(modelInput) {
  let modelInputTrimmed = modelInput.trim(), normalizedModel = modelInputTrimmed.toLowerCase(), has1mTag = has1mContext(normalizedModel), modelString = has1mTag ? normalizedModel.replace(/\[1m]$/i, "").trim() : normalizedModel;
  if (isModelAlias(modelString))
    switch (modelString) {
      case "opusplan":
        return getDefaultSonnetModel() + (has1mTag ? "[1m]" : "");
      case "sonnet":
        return getDefaultSonnetModel() + (has1mTag ? "[1m]" : "");
      case "haiku":
        return getDefaultHaikuModel() + (has1mTag ? "[1m]" : "");
      case "opus":
        return getDefaultOpusModel() + (has1mTag ? "[1m]" : "");
      case "best":
        return getBestModel();
      default:
    }
  if (getAPIProvider() === "firstParty" && isLegacyOpusFirstParty(modelString) && isLegacyModelRemapEnabled())
    return getDefaultOpusModel() + (has1mTag ? "[1m]" : "");
  if (has1mTag)
    return modelInputTrimmed.replace(/\[1m\]$/i, "").trim() + "[1m]";
  return modelInputTrimmed;
}
function resolveSkillModelOverride(skillModel, currentModel) {
  if (has1mContext(skillModel) || !has1mContext(currentModel))
    return skillModel;
  if (modelSupports1M(parseUserSpecifiedModel(skillModel)))
    return skillModel + "[1m]";
  return skillModel;
}
function isLegacyOpusFirstParty(model) {
  return LEGACY_OPUS_FIRSTPARTY.includes(model);
}
function isLegacyModelRemapEnabled() {
  return !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP);
}
function modelDisplayString(model) {
  if (model === null) {
    if (isClaudeAISubscriber())
      return `Default (${getClaudeAiUserDefaultModelDescription()})`;
    return `Default (${getDefaultMainLoopModel()})`;
  }
  let resolvedModel = parseUserSpecifiedModel(model);
  return model === resolvedModel ? resolvedModel : `${model} (${resolvedModel})`;
}
function getMarketingNameForModel(modelId) {
  if (getAPIProvider() === "foundry")
    return;
  let has1m = modelId.toLowerCase().includes("[1m]"), canonical = getCanonicalName(modelId);
  if (canonical.includes("claude-opus-4-6"))
    return has1m ? "Opus 4.6 (with 1M context)" : "Opus 4.6";
  if (canonical.includes("claude-opus-4-5"))
    return "Opus 4.5";
  if (canonical.includes("claude-opus-4-1"))
    return "Opus 4.1";
  if (canonical.includes("claude-opus-4"))
    return "Opus 4";
  if (canonical.includes("claude-sonnet-4-6"))
    return has1m ? "Sonnet 4.6 (with 1M context)" : "Sonnet 4.6";
  if (canonical.includes("claude-sonnet-4-5"))
    return has1m ? "Sonnet 4.5 (with 1M context)" : "Sonnet 4.5";
  if (canonical.includes("claude-sonnet-4"))
    return has1m ? "Sonnet 4 (with 1M context)" : "Sonnet 4";
  if (canonical.includes("claude-3-7-sonnet"))
    return "Claude 3.7 Sonnet";
  if (canonical.includes("claude-3-5-sonnet"))
    return "Claude 3.5 Sonnet";
  if (canonical.includes("claude-haiku-4-5"))
    return "Haiku 4.5";
  if (canonical.includes("claude-3-5-haiku"))
    return "Claude 3.5 Haiku";
  return;
}
function normalizeModelStringForAPI(model) {
  return model.replace(/\[(1|2)m\]/gi, "");
}
var LEGACY_OPUS_FIRSTPARTY;
var init_model = __esm(() => {
  init_state();
  init_auth14();
  init_context();
  init_envUtils();
  init_modelStrings();
  init_modelCost();
  init_settings2();
  init_providers();
  init_figures2();
  init_modelAllowlist();
  init_aliases();
  LEGACY_OPUS_FIRSTPARTY = [
    "claude-opus-4-20250514",
    "claude-opus-4-1-20250805",
    "claude-opus-4-0",
    "claude-opus-4-1"
  ];
});

// node_modules/lodash-es/isEqual.js
function isEqual(value, other) {
  return _baseIsEqual_default(value, other);
}
var isEqual_default;
var init_isEqual = __esm(() => {
  init__baseIsEqual();
  isEqual_default = isEqual;
});
