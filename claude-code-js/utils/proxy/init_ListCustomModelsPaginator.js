// var: init_ListCustomModelsPaginator
var init_ListCustomModelsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListCustomModelsCommand();
  import_core17 = __toESM(require_dist_cjs37(), 1), paginateListCustomModels = import_core17.createPaginator(BedrockClient, ListCustomModelsCommand, "nextToken", "nextToken", "maxResults");
});
