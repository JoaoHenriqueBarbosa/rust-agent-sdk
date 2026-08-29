// function: makeBetaResource
function makeBetaResource(client12) {
  let resource = new Beta(client12);
  return delete resource.promptCaching, delete resource.messages.batches, delete resource.messages.countTokens, resource;
}
