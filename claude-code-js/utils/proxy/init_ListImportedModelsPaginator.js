// var: init_ListImportedModelsPaginator
var init_ListImportedModelsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListImportedModelsCommand();
  import_core21 = __toESM(require_dist_cjs37(), 1), paginateListImportedModels = import_core21.createPaginator(BedrockClient, ListImportedModelsCommand, "nextToken", "nextToken", "maxResults");
});
