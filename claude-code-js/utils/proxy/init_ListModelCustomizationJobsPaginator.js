// var: init_ListModelCustomizationJobsPaginator
var init_ListModelCustomizationJobsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListModelCustomizationJobsCommand();
  import_core25 = __toESM(require_dist_cjs37(), 1), paginateListModelCustomizationJobs = import_core25.createPaginator(BedrockClient, ListModelCustomizationJobsCommand, "nextToken", "nextToken", "maxResults");
});
