// var: init_ListModelInvocationJobsPaginator
var init_ListModelInvocationJobsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListModelInvocationJobsCommand();
  import_core27 = __toESM(require_dist_cjs37(), 1), paginateListModelInvocationJobs = import_core27.createPaginator(BedrockClient, ListModelInvocationJobsCommand, "nextToken", "nextToken", "maxResults");
});
