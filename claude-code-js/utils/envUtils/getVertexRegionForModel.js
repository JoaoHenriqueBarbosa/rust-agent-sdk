// function: getVertexRegionForModel
function getVertexRegionForModel(model) {
  if (model) {
    let match = VERTEX_REGION_OVERRIDES.find(([prefix]) => model.startsWith(prefix));
    if (match)
      return process.env[match[1]] || getDefaultVertexRegion();
  }
  return getDefaultVertexRegion();
}
