// var: init_ListCustomModelDeploymentsPaginator
var init_ListCustomModelDeploymentsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListCustomModelDeploymentsCommand();
  import_core16 = __toESM(require_dist_cjs37(), 1), paginateListCustomModelDeployments = import_core16.createPaginator(BedrockClient, ListCustomModelDeploymentsCommand, "nextToken", "nextToken", "maxResults");
});
