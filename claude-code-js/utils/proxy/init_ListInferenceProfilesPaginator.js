// var: init_ListInferenceProfilesPaginator
var init_ListInferenceProfilesPaginator = __esm(() => {
  init_BedrockClient();
  init_ListInferenceProfilesCommand();
  import_core22 = __toESM(require_dist_cjs37(), 1), paginateListInferenceProfiles = import_core22.createPaginator(BedrockClient, ListInferenceProfilesCommand, "nextToken", "nextToken", "maxResults");
});
