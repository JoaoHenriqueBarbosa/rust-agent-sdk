// function: hasOpusAccess
function hasOpusAccess() {
  let subscriptionType = getSubscriptionType();
  return subscriptionType === "max" || subscriptionType === "enterprise" || subscriptionType === "team" || subscriptionType === "pro" || subscriptionType === null;
}
