// Original: src/utils/model/modelOptions.ts
function getDefaultOptionForUser(fastMode = !1) {
  if (isClaudeAISubscriber())
    return {
      value: null,
      label: "Default (recommended)",
      description: getClaudeAiUserDefaultModelDescription(fastMode)
    };
  let is3P = getAPIProvider() !== "firstParty";
  return {
    value: null,
    label: "Default (recommended)",
    description: `Use the default model (currently ${renderDefaultModelSetting(getDefaultMainLoopModelSetting())})${is3P ? "" : ` \xB7 ${formatModelPricing(COST_TIER_3_15)}`}`
  };
}
function getCustomSonnetOption() {
  let is3P = getAPIProvider() !== "firstParty", customSonnetModel = process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
  if (is3P && customSonnetModel) {
    let is1m = has1mContext(customSonnetModel);
    return {
      value: "sonnet",
      label: process.env.ANTHROPIC_DEFAULT_SONNET_MODEL_NAME ?? customSonnetModel,
      description: process.env.ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION ?? `Custom Sonnet model${is1m ? " (1M context)" : ""}`,
      descriptionForModel: `${process.env.ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION ?? `Custom Sonnet model${is1m ? " with 1M context" : ""}`} (${customSonnetModel})`
    };
  }
}
function getSonnet46Option() {
  let is3P = getAPIProvider() !== "firstParty";
  return {
    value: is3P ? getModelStrings2().sonnet46 : "sonnet",
    label: "Sonnet",
    description: `Sonnet 4.6 \xB7 Best for everyday tasks${is3P ? "" : ` \xB7 ${formatModelPricing(COST_TIER_3_15)}`}`,
    descriptionForModel: "Sonnet 4.6 - best for everyday tasks. Generally recommended for most coding tasks"
  };
}
function getCustomOpusOption() {
  let is3P = getAPIProvider() !== "firstParty", customOpusModel = process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
  if (is3P && customOpusModel) {
    let is1m = has1mContext(customOpusModel);
    return {
      value: "opus",
      label: process.env.ANTHROPIC_DEFAULT_OPUS_MODEL_NAME ?? customOpusModel,
      description: process.env.ANTHROPIC_DEFAULT_OPUS_MODEL_DESCRIPTION ?? `Custom Opus model${is1m ? " (1M context)" : ""}`,
      descriptionForModel: `${process.env.ANTHROPIC_DEFAULT_OPUS_MODEL_DESCRIPTION ?? `Custom Opus model${is1m ? " with 1M context" : ""}`} (${customOpusModel})`
    };
  }
}
function getOpus41Option() {
  return {
    value: "opus",
    label: "Opus 4.1",
    description: "Opus 4.1 \xB7 Legacy",
    descriptionForModel: "Opus 4.1 - legacy version"
  };
}
function getOpus46Option(fastMode = !1) {
  return {
    value: getAPIProvider() !== "firstParty" ? getModelStrings2().opus46 : "opus",
    label: "Opus",
    description: `Opus 4.6 \xB7 Most capable for complex work${getOpus46PricingSuffix(fastMode)}`,
    descriptionForModel: "Opus 4.6 - most capable for complex work"
  };
}
function getSonnet46_1MOption() {
  let is3P = getAPIProvider() !== "firstParty";
  return {
    value: is3P ? getModelStrings2().sonnet46 + "[1m]" : "sonnet[1m]",
    label: "Sonnet (1M context)",
    description: `Sonnet 4.6 for long sessions${is3P ? "" : ` \xB7 ${formatModelPricing(COST_TIER_3_15)}`}`,
    descriptionForModel: "Sonnet 4.6 with 1M context window - for long sessions with large codebases"
  };
}
function getOpus46_1MOption(fastMode = !1) {
  return {
    value: getAPIProvider() !== "firstParty" ? getModelStrings2().opus46 + "[1m]" : "opus[1m]",
    label: "Opus (1M context)",
    description: `Opus 4.6 for long sessions${getOpus46PricingSuffix(fastMode)}`,
    descriptionForModel: "Opus 4.6 with 1M context window - for long sessions with large codebases"
  };
}
function getCustomHaikuOption() {
  let is3P = getAPIProvider() !== "firstParty", customHaikuModel = process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  if (is3P && customHaikuModel)
    return {
      value: "haiku",
      label: process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME ?? customHaikuModel,
      description: process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION ?? "Custom Haiku model",
      descriptionForModel: `${process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION ?? "Custom Haiku model"} (${customHaikuModel})`
    };
}
function getHaiku45Option() {
  return {
    value: "haiku",
    label: "Haiku",
    description: `Haiku 4.5 \xB7 Fastest for quick answers${getAPIProvider() !== "firstParty" ? "" : ` \xB7 ${formatModelPricing(COST_HAIKU_45)}`}`,
    descriptionForModel: "Haiku 4.5 - fastest for quick answers. Lower cost but less capable than Sonnet 4.6."
  };
}
function getHaiku35Option() {
  return {
    value: "haiku",
    label: "Haiku",
    description: `Haiku 3.5 for simple tasks${getAPIProvider() !== "firstParty" ? "" : ` \xB7 ${formatModelPricing(COST_HAIKU_35)}`}`,
    descriptionForModel: "Haiku 3.5 - faster and lower cost, but less capable than Sonnet. Use for simple tasks."
  };
}
function getHaikuOption() {
  return getDefaultHaikuModel() === getModelStrings2().haiku45 ? getHaiku45Option() : getHaiku35Option();
}
function getMaxOpusOption(fastMode = !1) {
  return {
    value: "opus",
    label: "Opus",
    description: `Opus 4.6 \xB7 Most capable for complex work${fastMode ? getOpus46PricingSuffix(!0) : ""}`
  };
}
function getMaxSonnet46_1MOption() {
  let is3P = getAPIProvider() !== "firstParty";
  return {
    value: "sonnet[1m]",
    label: "Sonnet (1M context)",
    description: `Sonnet 4.6 with 1M context${isClaudeAISubscriber() ? " \xB7 Billed as extra usage" : ""}${is3P ? "" : ` \xB7 ${formatModelPricing(COST_TIER_3_15)}`}`
  };
}
function getMaxOpus46_1MOption(fastMode = !1) {
  return {
    value: "opus[1m]",
    label: "Opus (1M context)",
    description: `Opus 4.6 with 1M context${isClaudeAISubscriber() ? " \xB7 Billed as extra usage" : ""}${getOpus46PricingSuffix(fastMode)}`
  };
}
function getMergedOpus1MOption(fastMode = !1) {
  let is3P = getAPIProvider() !== "firstParty";
  return {
    value: is3P ? getModelStrings2().opus46 + "[1m]" : "opus[1m]",
    label: "Opus (1M context)",
    description: `Opus 4.6 with 1M context \xB7 Most capable for complex work${!is3P && fastMode ? getOpus46PricingSuffix(fastMode) : ""}`,
    descriptionForModel: "Opus 4.6 with 1M context - most capable for complex work"
  };
}
function getOpusPlanOption() {
  return {
    value: "opusplan",
    label: "Opus Plan Mode",
    description: "Use Opus 4.6 in plan mode, Sonnet 4.6 otherwise"
  };
}
function getModelOptionsBase(fastMode = !1) {
  if (isClaudeAISubscriber()) {
    if (isMaxSubscriber() || isTeamPremiumSubscriber()) {
      let premiumOptions = [getDefaultOptionForUser(fastMode)];
      if (!isOpus1mMergeEnabled() && checkOpus1mAccess())
        premiumOptions.push(getMaxOpus46_1MOption(fastMode));
      if (premiumOptions.push(MaxSonnet46Option), checkSonnet1mAccess())
        premiumOptions.push(getMaxSonnet46_1MOption());
      return premiumOptions.push(MaxHaiku45Option), premiumOptions;
    }
    let standardOptions = [getDefaultOptionForUser(fastMode)];
    if (checkSonnet1mAccess())
      standardOptions.push(getMaxSonnet46_1MOption());
    if (isOpus1mMergeEnabled())
      standardOptions.push(getMergedOpus1MOption(fastMode));
    else if (standardOptions.push(getMaxOpusOption(fastMode)), checkOpus1mAccess())
      standardOptions.push(getMaxOpus46_1MOption(fastMode));
    return standardOptions.push(MaxHaiku45Option), standardOptions;
  }
  if (getAPIProvider() === "firstParty") {
    let payg1POptions = [getDefaultOptionForUser(fastMode)];
    if (checkSonnet1mAccess())
      payg1POptions.push(getSonnet46_1MOption());
    if (isOpus1mMergeEnabled())
      payg1POptions.push(getMergedOpus1MOption(fastMode));
    else if (payg1POptions.push(getOpus46Option(fastMode)), checkOpus1mAccess())
      payg1POptions.push(getOpus46_1MOption(fastMode));
    return payg1POptions.push(getHaiku45Option()), payg1POptions;
  }
  let payg3pOptions = [getDefaultOptionForUser(fastMode)], customSonnet = getCustomSonnetOption();
  if (customSonnet !== void 0)
    payg3pOptions.push(customSonnet);
  else if (payg3pOptions.push(getSonnet46Option()), checkSonnet1mAccess())
    payg3pOptions.push(getSonnet46_1MOption());
  let customOpus = getCustomOpusOption();
  if (customOpus !== void 0)
    payg3pOptions.push(customOpus);
  else if (payg3pOptions.push(getOpus41Option()), payg3pOptions.push(getOpus46Option(fastMode)), checkOpus1mAccess())
    payg3pOptions.push(getOpus46_1MOption(fastMode));
  let customHaiku = getCustomHaikuOption();
  if (customHaiku !== void 0)
    payg3pOptions.push(customHaiku);
  else
    payg3pOptions.push(getHaikuOption());
  return payg3pOptions;
}
function getModelFamilyInfo(model) {
  let canonical = getCanonicalName(model);
  if (canonical.includes("claude-sonnet-4-6") || canonical.includes("claude-sonnet-4-5") || canonical.includes("claude-sonnet-4-") || canonical.includes("claude-3-7-sonnet") || canonical.includes("claude-3-5-sonnet")) {
    let currentName = getMarketingNameForModel(getDefaultSonnetModel());
    if (currentName)
      return { alias: "Sonnet", currentVersionName: currentName };
  }
  if (canonical.includes("claude-opus-4")) {
    let currentName = getMarketingNameForModel(getDefaultOpusModel());
    if (currentName)
      return { alias: "Opus", currentVersionName: currentName };
  }
  if (canonical.includes("claude-haiku") || canonical.includes("claude-3-5-haiku")) {
    let currentName = getMarketingNameForModel(getDefaultHaikuModel());
    if (currentName)
      return { alias: "Haiku", currentVersionName: currentName };
  }
  return null;
}
function getKnownModelOption(model) {
  let marketingName = getMarketingNameForModel(model);
  if (!marketingName)
    return null;
  let familyInfo = getModelFamilyInfo(model);
  if (!familyInfo)
    return {
      value: model,
      label: marketingName,
      description: model
    };
  if (marketingName !== familyInfo.currentVersionName)
    return {
      value: model,
      label: marketingName,
      description: `Newer version available \xB7 select ${familyInfo.alias} for ${familyInfo.currentVersionName}`
    };
  return {
    value: model,
    label: marketingName,
    description: model
  };
}
function getModelOptions(fastMode = !1) {
  let options2 = getModelOptionsBase(fastMode), envCustomModel = process.env.ANTHROPIC_CUSTOM_MODEL_OPTION;
  if (envCustomModel && !options2.some((existing) => existing.value === envCustomModel))
    options2.push({
      value: envCustomModel,
      label: process.env.ANTHROPIC_CUSTOM_MODEL_OPTION_NAME ?? envCustomModel,
      description: process.env.ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION ?? `Custom model (${envCustomModel})`
    });
  for (let opt of getGlobalConfig().additionalModelOptionsCache ?? [])
    if (!options2.some((existing) => existing.value === opt.value))
      options2.push(opt);
  let customModel = null, currentMainLoopModel = getUserSpecifiedModelSetting(), initialMainLoopModel = getInitialMainLoopModel();
  if (currentMainLoopModel !== void 0 && currentMainLoopModel !== null)
    customModel = currentMainLoopModel;
  else if (initialMainLoopModel !== null)
    customModel = initialMainLoopModel;
  if (customModel === null || options2.some((opt) => opt.value === customModel))
    return filterModelOptionsByAllowlist(options2);
  else if (customModel === "opusplan")
    return filterModelOptionsByAllowlist([...options2, getOpusPlanOption()]);
  else if (customModel === "opus" && getAPIProvider() === "firstParty")
    return filterModelOptionsByAllowlist([
      ...options2,
      getMaxOpusOption(fastMode)
    ]);
  else if (customModel === "opus[1m]" && getAPIProvider() === "firstParty")
    return filterModelOptionsByAllowlist([
      ...options2,
      getMergedOpus1MOption(fastMode)
    ]);
  else {
    let knownOption = getKnownModelOption(customModel);
    if (knownOption)
      options2.push(knownOption);
    else
      options2.push({
        value: customModel,
        label: customModel,
        description: "Custom model"
      });
    return filterModelOptionsByAllowlist(options2);
  }
}
function filterModelOptionsByAllowlist(options2) {
  if (!(getSettings_DEPRECATED() || {}).availableModels)
    return options2;
  return options2.filter((opt) => opt.value === null || opt.value !== null && isModelAllowed(opt.value));
}
var MaxSonnet46Option, MaxHaiku45Option;
var init_modelOptions = __esm(() => {
  init_state();
  init_auth14();
  init_modelStrings();
  init_modelCost();
  init_settings2();
  init_check1mAccess();
  init_providers();
  init_modelAllowlist();
  init_model();
  init_context();
  init_config4();
  MaxSonnet46Option = {
    value: "sonnet",
    label: "Sonnet",
    description: "Sonnet 4.6 \xB7 Best for everyday tasks"
  }, MaxHaiku45Option = {
    value: "haiku",
    label: "Haiku",
    description: "Haiku 4.5 \xB7 Fastest for quick answers"
  };
});
