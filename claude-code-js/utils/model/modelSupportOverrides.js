// Original: src/utils/model/modelSupportOverrides.ts
var TIERS, get3PModelCapabilityOverride;
var init_modelSupportOverrides = __esm(() => {
  init_memoize();
  init_providers();
  TIERS = [
    {
      modelEnvVar: "ANTHROPIC_DEFAULT_OPUS_MODEL",
      capabilitiesEnvVar: "ANTHROPIC_DEFAULT_OPUS_MODEL_SUPPORTED_CAPABILITIES"
    },
    {
      modelEnvVar: "ANTHROPIC_DEFAULT_SONNET_MODEL",
      capabilitiesEnvVar: "ANTHROPIC_DEFAULT_SONNET_MODEL_SUPPORTED_CAPABILITIES"
    },
    {
      modelEnvVar: "ANTHROPIC_DEFAULT_HAIKU_MODEL",
      capabilitiesEnvVar: "ANTHROPIC_DEFAULT_HAIKU_MODEL_SUPPORTED_CAPABILITIES"
    }
  ], get3PModelCapabilityOverride = memoize_default((model, capability) => {
    if (getAPIProvider() === "firstParty")
      return;
    let m4 = model.toLowerCase();
    for (let tier of TIERS) {
      let pinned = process.env[tier.modelEnvVar], capabilities = process.env[tier.capabilitiesEnvVar];
      if (!pinned || capabilities === void 0)
        continue;
      if (m4 !== pinned.toLowerCase())
        continue;
      return capabilities.toLowerCase().split(",").map((s2) => s2.trim()).includes(capability);
    }
    return;
  }, (model, capability) => `${model.toLowerCase()}:${capability}`);
});
