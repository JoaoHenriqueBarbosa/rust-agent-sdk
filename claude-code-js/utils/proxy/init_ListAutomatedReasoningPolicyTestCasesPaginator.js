// var: init_ListAutomatedReasoningPolicyTestCasesPaginator
var init_ListAutomatedReasoningPolicyTestCasesPaginator = __esm(() => {
  init_BedrockClient();
  init_ListAutomatedReasoningPolicyTestCasesCommand();
  import_core14 = __toESM(require_dist_cjs37(), 1), paginateListAutomatedReasoningPolicyTestCases = import_core14.createPaginator(BedrockClient, ListAutomatedReasoningPolicyTestCasesCommand, "nextToken", "nextToken", "maxResults");
});
