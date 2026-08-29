// function: getCloudDiscoveryMetadataFromNetworkResponse
function getCloudDiscoveryMetadataFromNetworkResponse(response7, authorityHost) {
  for (let i4 = 0;i4 < response7.length; i4++) {
    let metadata = response7[i4];
    if (metadata.aliases.includes(authorityHost))
      return metadata;
  }
  return null;
}
