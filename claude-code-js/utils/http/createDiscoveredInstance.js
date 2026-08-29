// function: createDiscoveredInstance
async function createDiscoveredInstance(authorityUri, networkClient, cacheManager, authorityOptions, logger10, correlationId, performanceClient) {
  let authorityUriFinal = Authority.transformCIAMAuthority(formatAuthorityUri(authorityUri)), acquireTokenAuthority = new Authority(authorityUriFinal, networkClient, cacheManager, authorityOptions, logger10, correlationId, performanceClient);
  try {
    return await invokeAsync(acquireTokenAuthority.resolveEndpointsAsync.bind(acquireTokenAuthority), AuthorityResolveEndpointsAsync, logger10, performanceClient, correlationId)(), acquireTokenAuthority;
  } catch (e) {
    throw createClientAuthError(endpointResolutionError);
  }
}
