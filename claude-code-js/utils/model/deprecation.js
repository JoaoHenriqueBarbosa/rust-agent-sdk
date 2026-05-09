// Original: src/utils/model/deprecation.ts
function getDeprecatedModelInfo(modelId) {
  let lowercaseModelId = modelId.toLowerCase(), provider5 = getAPIProvider();
  for (let [key3, value] of Object.entries(DEPRECATED_MODELS3)) {
    let retirementDate = value.retirementDates[provider5];
    if (!lowercaseModelId.includes(key3) || !retirementDate)
      continue;
    return {
      isDeprecated: !0,
      modelName: value.modelName,
      retirementDate
    };
  }
  return { isDeprecated: !1 };
}
function getModelDeprecationWarning(modelId) {
  if (!modelId)
    return null;
  let info = getDeprecatedModelInfo(modelId);
  if (!info.isDeprecated)
    return null;
  return `\u26A0 ${info.modelName} will be retired on ${info.retirementDate}. Consider switching to a newer model.`;
}
var DEPRECATED_MODELS3;
var init_deprecation = __esm(() => {
  init_providers();
  DEPRECATED_MODELS3 = {
    "claude-3-opus": {
      modelName: "Claude 3 Opus",
      retirementDates: {
        firstParty: "January 5, 2026",
        bedrock: "January 15, 2026",
        vertex: "January 5, 2026",
        foundry: "January 5, 2026"
      }
    },
    "claude-3-7-sonnet": {
      modelName: "Claude 3.7 Sonnet",
      retirementDates: {
        firstParty: "February 19, 2026",
        bedrock: "April 28, 2026",
        vertex: "May 11, 2026",
        foundry: "February 19, 2026"
      }
    },
    "claude-3-5-haiku": {
      modelName: "Claude 3.5 Haiku",
      retirementDates: {
        firstParty: "February 19, 2026",
        bedrock: null,
        vertex: null,
        foundry: null
      }
    }
  };
});
