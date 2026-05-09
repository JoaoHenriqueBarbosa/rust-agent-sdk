// function: buildStaticAuthorityOptions
function buildStaticAuthorityOptions(authOptions) {
  let rawCloudDiscoveryMetadata = authOptions.cloudDiscoveryMetadata, cloudDiscoveryMetadata = void 0;
  if (rawCloudDiscoveryMetadata)
    try {
      cloudDiscoveryMetadata = JSON.parse(rawCloudDiscoveryMetadata);
    } catch (e) {
      throw createClientConfigurationError(invalidCloudDiscoveryMetadata);
    }
  return {
    canonicalAuthority: authOptions.authority ? formatAuthorityUri(authOptions.authority) : void 0,
    knownAuthorities: authOptions.knownAuthorities,
    cloudDiscoveryMetadata
  };
}
