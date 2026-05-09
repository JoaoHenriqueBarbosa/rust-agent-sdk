// function: createResource
function createResource(resource, encoder) {
  let result = {
    attributes: toAttributes(resource.attributes, encoder),
    droppedAttributesCount: 0
  }, schemaUrl = resource.schemaUrl;
  if (schemaUrl && schemaUrl !== "")
    result.schemaUrl = schemaUrl;
  return result;
}
