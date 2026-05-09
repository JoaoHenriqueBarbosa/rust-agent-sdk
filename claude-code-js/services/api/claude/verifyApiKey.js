// function: verifyApiKey
async function verifyApiKey(apiKey, isNonInteractiveSession) {
  if (isNonInteractiveSession)
    return !0;
  try {
    let model = getSmallFastModel(), betas = getModelBetas(model);
    return await returnValue(withRetry(() => getAnthropicClient({
      apiKey,
      maxRetries: 3,
      model,
      source: "verify_api_key"
    }), async (anthropic) => {
      let messages = [{ role: "user", content: "test" }];
      return await anthropic.beta.messages.create({
        model,
        max_tokens: 1,
        messages,
        temperature: 1,
        ...betas.length > 0 && { betas },
        metadata: getAPIMetadata(),
        ...getExtraBodyParams()
      }), !0;
    }, { maxRetries: 2, model, thinkingConfig: { type: "disabled" } }));
  } catch (errorFromRetry) {
    let error44 = errorFromRetry;
    if (errorFromRetry instanceof CannotRetryError)
      error44 = errorFromRetry.originalError;
    if (logError2(error44), error44 instanceof Error && error44.message.includes('{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}'))
      return !1;
    throw error44;
  }
}
