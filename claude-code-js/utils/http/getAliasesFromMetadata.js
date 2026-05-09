// function: getAliasesFromMetadata
function getAliasesFromMetadata(logger10, correlationId, authorityHost, cloudDiscoveryMetadata, source) {
  if (logger10.trace(`getAliasesFromMetadata called with source: '${source}'`, correlationId), authorityHost && cloudDiscoveryMetadata) {
    let metadata = getCloudDiscoveryMetadataFromNetworkResponse(cloudDiscoveryMetadata, authorityHost);
    if (metadata)
      return logger10.trace(`getAliasesFromMetadata: found cloud discovery metadata in '${source}', returning aliases`, correlationId), metadata.aliases;
    else
      logger10.trace(`getAliasesFromMetadata: did not find cloud discovery metadata in '${source}'`, correlationId);
  }
  return null;
}
