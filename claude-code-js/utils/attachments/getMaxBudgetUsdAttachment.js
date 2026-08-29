// function: getMaxBudgetUsdAttachment
function getMaxBudgetUsdAttachment(maxBudgetUsd) {
  if (maxBudgetUsd === void 0)
    return [];
  let usedCost = getTotalCostUSD(), remainingBudget = maxBudgetUsd - usedCost;
  return [
    {
      type: "budget_usd",
      used: usedCost,
      total: maxBudgetUsd,
      remaining: remainingBudget
    }
  ];
}
