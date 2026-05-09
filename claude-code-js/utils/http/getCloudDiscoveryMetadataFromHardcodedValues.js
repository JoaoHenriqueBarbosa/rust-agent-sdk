// function: getCloudDiscoveryMetadataFromHardcodedValues
function getCloudDiscoveryMetadataFromHardcodedValues(authorityHost) {
  return getCloudDiscoveryMetadataFromNetworkResponse(InstanceDiscoveryMetadata.metadata, authorityHost);
}
