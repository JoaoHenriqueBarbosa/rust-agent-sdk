// var: init_ListAutomatedReasoningPolicyTestResultsPaginator
var init_ListAutomatedReasoningPolicyTestResultsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListAutomatedReasoningPolicyTestResultsCommand();
  import_core15 = __toESM(require_dist_cjs37(), 1), paginateListAutomatedReasoningPolicyTestResults = import_core15.createPaginator(BedrockClient, ListAutomatedReasoningPolicyTestResultsCommand, "nextToken", "nextToken", "maxResults");
});
