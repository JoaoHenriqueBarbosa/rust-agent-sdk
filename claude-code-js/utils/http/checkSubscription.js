// function: checkSubscription
function checkSubscription(logger24, subscription) {
  if (!subscription.match(/^[0-9a-zA-Z-._ ]+$/)) {
    let error43 = Error(`Subscription '${subscription}' contains invalid characters. If this is the name of a subscription, use its ID instead. You can locate your subscription by following the instructions listed here: https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id`);
    throw logger24.info(formatError2("", error43)), error43;
  }
}
