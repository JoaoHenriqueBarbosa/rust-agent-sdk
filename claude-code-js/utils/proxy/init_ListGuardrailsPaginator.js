// var: init_ListGuardrailsPaginator
var init_ListGuardrailsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListGuardrailsCommand();
  import_core20 = __toESM(require_dist_cjs37(), 1), paginateListGuardrails = import_core20.createPaginator(BedrockClient, ListGuardrailsCommand, "nextToken", "nextToken", "maxResults");
});
