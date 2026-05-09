// function: getContextUsedPercent
function getContextUsedPercent(usage, permissionMode) {
  if (!usage)
    return null;
  let runtimeModel = getRuntimeMainLoopModel({
    permissionMode,
    mainLoopModel: getMainLoopModel(),
    exceeds200kTokens: !1
  }), contextWindowSize = getContextWindowForModel(runtimeModel, getSdkBetas()), {
    used
  } = calculateContextPercentages({
    input_tokens: usage.input_tokens,
    cache_creation_input_tokens: usage.cache_creation_input_tokens ?? 0,
    cache_read_input_tokens: usage.cache_read_input_tokens ?? 0
  }, contextWindowSize);
  return used;
}
