// var: init_ListPromptRoutersPaginator
var init_ListPromptRoutersPaginator = __esm(() => {
  init_BedrockClient();
  init_ListPromptRoutersCommand();
  import_core28 = __toESM(require_dist_cjs37(), 1), paginateListPromptRouters = import_core28.createPaginator(BedrockClient, ListPromptRoutersCommand, "nextToken", "nextToken", "maxResults");
});
