// function: isConsumerSubscriber
function isConsumerSubscriber() {
  let subscriptionType = getSubscriptionType();
  return isClaudeAISubscriber() && subscriptionType !== null && isConsumerPlan(subscriptionType);
}
