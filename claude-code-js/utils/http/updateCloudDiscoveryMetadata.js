// function: updateCloudDiscoveryMetadata
function updateCloudDiscoveryMetadata(authorityMetadata, updatedValues, fromNetwork) {
  authorityMetadata.aliases = updatedValues.aliases, authorityMetadata.preferred_cache = updatedValues.preferred_cache, authorityMetadata.preferred_network = updatedValues.preferred_network, authorityMetadata.aliasesFromNetwork = fromNetwork;
}
