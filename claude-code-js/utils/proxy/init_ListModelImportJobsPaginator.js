// var: init_ListModelImportJobsPaginator
var init_ListModelImportJobsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListModelImportJobsCommand();
  import_core26 = __toESM(require_dist_cjs37(), 1), paginateListModelImportJobs = import_core26.createPaginator(BedrockClient, ListModelImportJobsCommand, "nextToken", "nextToken", "maxResults");
});
