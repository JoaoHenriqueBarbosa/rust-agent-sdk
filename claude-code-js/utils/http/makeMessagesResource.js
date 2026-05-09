// function: makeMessagesResource
function makeMessagesResource(client12) {
  let resource = new Messages2(client12);
  return delete resource.batches, delete resource.countTokens, resource;
}
