// function: isOverageProvisioningAllowed
function isOverageProvisioningAllowed() {
  let billingType = getOauthAccountInfo()?.billingType;
  if (!isClaudeAISubscriber() || !billingType)
    return !1;
  if (billingType !== "stripe_subscription" && billingType !== "stripe_subscription_contracted" && billingType !== "apple_subscription" && billingType !== "google_play_subscription")
    return !1;
  return !0;
}
