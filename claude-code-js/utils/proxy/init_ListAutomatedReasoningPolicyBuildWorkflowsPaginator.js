// var: init_ListAutomatedReasoningPolicyBuildWorkflowsPaginator
var init_ListAutomatedReasoningPolicyBuildWorkflowsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListAutomatedReasoningPolicyBuildWorkflowsCommand();
  import_core13 = __toESM(require_dist_cjs37(), 1), paginateListAutomatedReasoningPolicyBuildWorkflows = import_core13.createPaginator(BedrockClient, ListAutomatedReasoningPolicyBuildWorkflowsCommand, "nextToken", "nextToken", "maxResults");
});
