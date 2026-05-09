// function: is1PApiCustomer
function is1PApiCustomer() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) || isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) || isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY))
    return !1;
  if (isClaudeAISubscriber())
    return !1;
  return !0;
}
