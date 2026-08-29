// function: getDefaultBasicInfo
function getDefaultBasicInfo(packageData, resolvedPath5) {
  let name3 = packageData.name || basename7(resolvedPath5), authorName = getDefaultAuthorName(packageData) || "Unknown Author", displayName = name3, version5 = packageData.version || "1.0.0", description = packageData.description || "A MCPB bundle";
  return { name: name3, authorName, displayName, version: version5, description };
}
