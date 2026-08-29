// function: getPromptCachingEnabled
function getPromptCachingEnabled(model) {
  if (isEnvTruthy(process.env.DISABLE_PROMPT_CACHING))
    return !1;
  if (isEnvTruthy(process.env.DISABLE_PROMPT_CACHING_HAIKU)) {
    let smallFastModel = getSmallFastModel();
    if (model === smallFastModel)
      return !1;
  }
  if (isEnvTruthy(process.env.DISABLE_PROMPT_CACHING_SONNET)) {
    let defaultSonnet = getDefaultSonnetModel();
    if (model === defaultSonnet)
      return !1;
  }
  if (isEnvTruthy(process.env.DISABLE_PROMPT_CACHING_OPUS)) {
    let defaultOpus = getDefaultOpusModel();
    if (model === defaultOpus)
      return !1;
  }
  return !0;
}
