// var: init_ListMarketplaceModelEndpointsPaginator
var init_ListMarketplaceModelEndpointsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListMarketplaceModelEndpointsCommand();
  import_core23 = __toESM(require_dist_cjs37(), 1), paginateListMarketplaceModelEndpoints = import_core23.createPaginator(BedrockClient, ListMarketplaceModelEndpointsCommand, "nextToken", "nextToken", "maxResults");
});
