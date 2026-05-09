// class: RegionDiscovery
class RegionDiscovery {
  constructor(networkInterface, logger10, performanceClient, correlationId) {
    this.networkInterface = networkInterface, this.logger = logger10, this.performanceClient = performanceClient, this.correlationId = correlationId;
  }
  async detectRegion(environmentRegion, regionDiscoveryMetadata) {
    let autodetectedRegionName = environmentRegion;
    if (!autodetectedRegionName) {
      let options = RegionDiscovery.IMDS_OPTIONS;
      try {
        let localIMDSVersionResponse = await invokeAsync(this.getRegionFromIMDS.bind(this), RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(IMDS_VERSION, options);
        if (localIMDSVersionResponse.status === HTTP_SUCCESS)
          autodetectedRegionName = localIMDSVersionResponse.body, regionDiscoveryMetadata.region_source = RegionDiscoverySources.IMDS;
        if (localIMDSVersionResponse.status === HTTP_BAD_REQUEST) {
          let currentIMDSVersion = await invokeAsync(this.getCurrentVersion.bind(this), RegionDiscoveryGetCurrentVersion, this.logger, this.performanceClient, this.correlationId)(options);
          if (!currentIMDSVersion)
            return regionDiscoveryMetadata.region_source = RegionDiscoverySources.FAILED_AUTO_DETECTION, null;
          let currentIMDSVersionResponse = await invokeAsync(this.getRegionFromIMDS.bind(this), RegionDiscoveryGetRegionFromIMDS, this.logger, this.performanceClient, this.correlationId)(currentIMDSVersion, options);
          if (currentIMDSVersionResponse.status === HTTP_SUCCESS)
            autodetectedRegionName = currentIMDSVersionResponse.body, regionDiscoveryMetadata.region_source = RegionDiscoverySources.IMDS;
        }
      } catch (e) {
        return regionDiscoveryMetadata.region_source = RegionDiscoverySources.FAILED_AUTO_DETECTION, null;
      }
    } else
      regionDiscoveryMetadata.region_source = RegionDiscoverySources.ENVIRONMENT_VARIABLE;
    if (!autodetectedRegionName)
      regionDiscoveryMetadata.region_source = RegionDiscoverySources.FAILED_AUTO_DETECTION;
    return autodetectedRegionName || null;
  }
  async getRegionFromIMDS(version3, options) {
    return this.networkInterface.sendGetRequestAsync(`${IMDS_ENDPOINT}?api-version=${version3}&format=text`, options, IMDS_TIMEOUT);
  }
  async getCurrentVersion(options) {
    try {
      let response7 = await this.networkInterface.sendGetRequestAsync(`${IMDS_ENDPOINT}?format=json`, options);
      if (response7.status === HTTP_BAD_REQUEST && response7.body && response7.body["newest-versions"] && response7.body["newest-versions"].length > 0)
        return response7.body["newest-versions"][0];
      return null;
    } catch (e) {
      return null;
    }
  }
}
