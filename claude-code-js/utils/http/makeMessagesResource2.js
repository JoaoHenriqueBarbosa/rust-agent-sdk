// function: makeMessagesResource2
function makeMessagesResource2(client13) {
  let resource = new Messages2(client13);
  return delete resource.batches, resource;
}
