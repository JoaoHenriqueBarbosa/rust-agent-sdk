// var: init_ListProvisionedModelThroughputsPaginator
var init_ListProvisionedModelThroughputsPaginator = __esm(() => {
  init_BedrockClient();
  init_ListProvisionedModelThroughputsCommand();
  import_core29 = __toESM(require_dist_cjs37(), 1), paginateListProvisionedModelThroughputs = import_core29.createPaginator(BedrockClient, ListProvisionedModelThroughputsCommand, "nextToken", "nextToken", "maxResults");
});
