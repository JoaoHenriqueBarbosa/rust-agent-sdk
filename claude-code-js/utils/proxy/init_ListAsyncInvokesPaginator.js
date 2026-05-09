// var: init_ListAsyncInvokesPaginator
var init_ListAsyncInvokesPaginator = __esm(() => {
  init_BedrockRuntimeClient();
  init_ListAsyncInvokesCommand();
  import_core34 = __toESM(require_dist_cjs37(), 1), paginateListAsyncInvokes = import_core34.createPaginator(BedrockRuntimeClient, ListAsyncInvokesCommand, "nextToken", "nextToken", "maxResults");
});
