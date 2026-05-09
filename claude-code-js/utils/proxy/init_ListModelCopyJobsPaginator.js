// var: init_ListModelCopyJobsPaginator
var init_ListModelCopyJobsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListModelCopyJobsCommand();
  import_core24 = __toESM(require_dist_cjs37(), 1), paginateListModelCopyJobs = import_core24.createPaginator(BedrockClient, ListModelCopyJobsCommand, "nextToken", "nextToken", "maxResults");
});
