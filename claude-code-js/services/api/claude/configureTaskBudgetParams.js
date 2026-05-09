// function: configureTaskBudgetParams
function configureTaskBudgetParams(taskBudget, outputConfig, betas) {
  if (!taskBudget || "task_budget" in outputConfig || !shouldIncludeFirstPartyOnlyBetas())
    return;
  if (outputConfig.task_budget = {
    type: "tokens",
    total: taskBudget.total,
    ...taskBudget.remaining !== void 0 && {
      remaining: taskBudget.remaining
    }
  }, !betas.includes(TASK_BUDGETS_BETA_HEADER))
    betas.push(TASK_BUDGETS_BETA_HEADER);
}
