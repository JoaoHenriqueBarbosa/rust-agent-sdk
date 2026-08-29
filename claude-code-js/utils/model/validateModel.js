// Original: src/utils/model/validateModel.ts
async function validateModel(model) {
  let normalizedModel = model.trim();
  if (!normalizedModel)
    return { valid: !1, error: "Model name cannot be empty" };
  if (!isModelAllowed(normalizedModel))
    return {
      valid: !1,
      error: `Model '${normalizedModel}' is not in the list of available models`
    };
  let lowerModel = normalizedModel.toLowerCase();
  if (MODEL_ALIASES.includes(lowerModel))
    return { valid: !0 };
  if (normalizedModel === process.env.ANTHROPIC_CUSTOM_MODEL_OPTION)
    return { valid: !0 };
  if (validModelCache.has(normalizedModel))
    return { valid: !0 };
  try {
    return await sideQuery({
      model: normalizedModel,
      max_tokens: 1,
      maxRetries: 0,
      querySource: "model_validation",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Hi",
              cache_control: { type: "ephemeral" }
            }
          ]
        }
      ]
    }), validModelCache.set(normalizedModel, !0), { valid: !0 };
  } catch (error44) {
    return handleValidationError(error44, normalizedModel);
  }
}
function handleValidationError(error44, modelName) {
  if (error44 instanceof NotFoundError) {
    let fallback = get3PFallbackSuggestion(modelName), suggestion = fallback ? `. Try '${fallback}' instead` : "";
    return {
      valid: !1,
      error: `Model '${modelName}' not found${suggestion}`
    };
  }
  if (error44 instanceof APIError) {
    if (error44 instanceof AuthenticationError)
      return {
        valid: !1,
        error: "Authentication failed. Please check your API credentials."
      };
    if (error44 instanceof APIConnectionError)
      return {
        valid: !1,
        error: "Network error. Please check your internet connection."
      };
    let errorBody = error44.error;
    if (errorBody && typeof errorBody === "object" && "type" in errorBody && errorBody.type === "not_found_error" && "message" in errorBody && typeof errorBody.message === "string" && errorBody.message.includes("model:"))
      return { valid: !1, error: `Model '${modelName}' not found` };
    return { valid: !1, error: `API error: ${error44.message}` };
  }
  return {
    valid: !1,
    error: `Unable to validate model: ${error44 instanceof Error ? error44.message : String(error44)}`
  };
}
function get3PFallbackSuggestion(model) {
  if (getAPIProvider() === "firstParty")
    return;
  let lowerModel = model.toLowerCase();
  if (lowerModel.includes("opus-4-6") || lowerModel.includes("opus_4_6"))
    return getModelStrings2().opus41;
  if (lowerModel.includes("sonnet-4-6") || lowerModel.includes("sonnet_4_6"))
    return getModelStrings2().sonnet45;
  if (lowerModel.includes("sonnet-4-5") || lowerModel.includes("sonnet_4_5"))
    return getModelStrings2().sonnet40;
  return;
}
var validModelCache;
var init_validateModel = __esm(() => {
  init_aliases();
  init_modelAllowlist();
  init_providers();
  init_sideQuery();
  init_sdk();
  init_modelStrings();
  validModelCache = /* @__PURE__ */ new Map;
});
