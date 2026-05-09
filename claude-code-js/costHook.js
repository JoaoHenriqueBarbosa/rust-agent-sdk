// Original: src/costHook.ts
function useCostSummary(getFpsMetrics) {
  import_react261.useEffect(() => {
    let f = () => {
      if (hasConsoleBillingAccess())
        process.stdout.write(`
` + formatTotalCost() + `
`);
      saveCurrentSessionCosts(getFpsMetrics?.());
    };
    return process.on("exit", f), () => {
      process.off("exit", f);
    };
  }, []);
}
var import_react261;
var init_costHook = __esm(() => {
  init_cost_tracker();
  init_billing();
  import_react261 = __toESM(require_react_development(), 1);
});
