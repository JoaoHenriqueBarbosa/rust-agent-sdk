// var: init_ListEvaluationJobsPaginator
var init_ListEvaluationJobsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListEvaluationJobsCommand();
  import_core19 = __toESM(require_dist_cjs37(), 1), paginateListEvaluationJobs = import_core19.createPaginator(BedrockClient, ListEvaluationJobsCommand, "nextToken", "nextToken", "maxResults");
});
