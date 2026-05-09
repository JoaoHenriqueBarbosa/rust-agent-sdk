// function: toResourceMetrics
function toResourceMetrics(resourceMetrics, encoder) {
  let processedResource = createResource(resourceMetrics.resource, encoder);
  return {
    resource: processedResource,
    schemaUrl: processedResource.schemaUrl,
    scopeMetrics: toScopeMetrics(resourceMetrics.scopeMetrics, encoder)
  };
}
