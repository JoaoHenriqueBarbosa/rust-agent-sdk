// function: getTokenUsageAttachment
function getTokenUsageAttachment(messages, model) {
  if (!isEnvTruthy(process.env.CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT))
    return [];
  let contextWindow = getEffectiveContextWindowSize(model), usedTokens = tokenCountFromLastAPIResponse(messages);
  return [
    {
      type: "token_usage",
      used: usedTokens,
      total: contextWindow,
      remaining: contextWindow - usedTokens
    }
  ];
}
