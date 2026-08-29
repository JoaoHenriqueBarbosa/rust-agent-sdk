// var: init_ListAutomatedReasoningPoliciesPaginator
var init_ListAutomatedReasoningPoliciesPaginator = __esm(() => {
  init_BedrockClient();
  init_ListAutomatedReasoningPoliciesCommand();
  import_core12 = __toESM(require_dist_cjs37(), 1), paginateListAutomatedReasoningPolicies = import_core12.createPaginator(BedrockClient, ListAutomatedReasoningPoliciesCommand, "nextToken", "nextToken", "maxResults");
});
