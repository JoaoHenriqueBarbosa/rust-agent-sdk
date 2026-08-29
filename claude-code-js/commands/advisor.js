// Original: src/commands/advisor.ts
var call57 = async (args, context7) => {
  let arg = args.trim().toLowerCase(), baseModel = parseUserSpecifiedModel(context7.getAppState().mainLoopModel ?? getDefaultMainLoopModelSetting());
  if (!arg) {
    let current = context7.getAppState().advisorModel;
    if (!current)
      return {
        type: "text",
        value: `Advisor: not set
Use "/advisor <model>" to enable (e.g. "/advisor opus").`
      };
    if (!modelSupportsAdvisor(baseModel))
      return {
        type: "text",
        value: `Advisor: ${current} (inactive)
The current model (${baseModel}) does not support advisors.`
      };
    return {
      type: "text",
      value: `Advisor: ${current}
Use "/advisor unset" to disable or "/advisor <model>" to change.`
    };
  }
  if (arg === "unset" || arg === "off") {
    let prev = context7.getAppState().advisorModel;
    return context7.setAppState((s2) => {
      if (s2.advisorModel === void 0)
        return s2;
      return { ...s2, advisorModel: void 0 };
    }), updateSettingsForSource("userSettings", { advisorModel: void 0 }), {
      type: "text",
      value: prev ? `Advisor disabled (was ${prev}).` : "Advisor already unset."
    };
  }
  let normalizedModel = normalizeModelStringForAPI(arg), resolvedModel = parseUserSpecifiedModel(arg), { valid, error: error44 } = await validateModel(resolvedModel);
  if (!valid)
    return {
      type: "text",
      value: error44 ? `Invalid advisor model: ${error44}` : `Unknown model: ${arg} (${resolvedModel})`
    };
  if (!isValidAdvisorModel(resolvedModel))
    return {
      type: "text",
      value: `The model ${arg} (${resolvedModel}) cannot be used as an advisor`
    };
  if (context7.setAppState((s2) => {
    if (s2.advisorModel === normalizedModel)
      return s2;
    return { ...s2, advisorModel: normalizedModel };
  }), updateSettingsForSource("userSettings", { advisorModel: normalizedModel }), !modelSupportsAdvisor(baseModel))
    return {
      type: "text",
      value: `Advisor set to ${normalizedModel}.
Note: Your current model (${baseModel}) does not support advisors. Switch to a supported model to use the advisor.`
    };
  return {
    type: "text",
    value: `Advisor set to ${normalizedModel}.`
  };
}, advisor, advisor_default;
var init_advisor2 = __esm(() => {
  init_advisor();
  init_model();
  init_validateModel();
  init_settings2();
  advisor = {
    type: "local",
    name: "advisor",
    description: "Configure the advisor model",
    argumentHint: "[<model>|off]",
    isEnabled: () => canUserConfigureAdvisor(),
    get isHidden() {
      return !canUserConfigureAdvisor();
    },
    supportsNonInteractive: !0,
    load: () => Promise.resolve({ call: call57 })
  }, advisor_default = advisor;
});
