// class: Authority
class Authority {
  constructor(authority, networkInterface, cacheManager, authorityOptions, logger10, correlationId, performanceClient, managedIdentity) {
    this.canonicalAuthority = authority, this._canonicalAuthority.validateAsUri(), this.networkInterface = networkInterface, this.cacheManager = cacheManager, this.authorityOptions = authorityOptions, this.regionDiscoveryMetadata = {
      region_used: void 0,
      region_source: void 0,
      region_outcome: void 0
    }, this.logger = logger10, this.performanceClient = performanceClient, this.correlationId = correlationId, this.managedIdentity = managedIdentity || !1, this.regionDiscovery = new RegionDiscovery(networkInterface, this.logger, this.performanceClient, this.correlationId);
  }
  getAuthorityType(authorityUri) {
    if (authorityUri.HostNameAndPort.endsWith(CIAM_AUTH_URL))
      return AuthorityType.Ciam;
    let pathSegments = authorityUri.PathSegments;
    if (pathSegments.length)
      switch (pathSegments[0].toLowerCase()) {
        case ADFS:
          return AuthorityType.Adfs;
        case DSTS:
          return AuthorityType.Dsts;
      }
    return AuthorityType.Default;
  }
  get authorityType() {
    return this.getAuthorityType(this.canonicalAuthorityUrlComponents);
  }
  get protocolMode() {
    return this.authorityOptions.protocolMode;
  }
  get options() {
    return this.authorityOptions;
  }
  get canonicalAuthority() {
    return this._canonicalAuthority.urlString;
  }
  set canonicalAuthority(url3) {
    this._canonicalAuthority = new UrlString(url3), this._canonicalAuthority.validateAsUri(), this._canonicalAuthorityUrlComponents = null;
  }
  get canonicalAuthorityUrlComponents() {
    if (!this._canonicalAuthorityUrlComponents)
      this._canonicalAuthorityUrlComponents = this._canonicalAuthority.getUrlComponents();
    return this._canonicalAuthorityUrlComponents;
  }
  get hostnameAndPort() {
    return this.canonicalAuthorityUrlComponents.HostNameAndPort.toLowerCase();
  }
  get tenant() {
    return this.canonicalAuthorityUrlComponents.PathSegments[0];
  }
  get authorizationEndpoint() {
    if (this.discoveryComplete())
      return this.replacePath(this.metadata.authorization_endpoint);
    else
      throw createClientAuthError(endpointResolutionError);
  }
  get tokenEndpoint() {
    if (this.discoveryComplete())
      return this.replacePath(this.metadata.token_endpoint);
    else
      throw createClientAuthError(endpointResolutionError);
  }
  get deviceCodeEndpoint() {
    if (this.discoveryComplete())
      return this.replacePath(this.metadata.token_endpoint.replace("/token", "/devicecode"));
    else
      throw createClientAuthError(endpointResolutionError);
  }
  get endSessionEndpoint() {
    if (this.discoveryComplete()) {
      if (!this.metadata.end_session_endpoint)
        throw createClientAuthError(endSessionEndpointNotSupported);
      return this.replacePath(this.metadata.end_session_endpoint);
    } else
      throw createClientAuthError(endpointResolutionError);
  }
  get selfSignedJwtAudience() {
    if (this.discoveryComplete())
      return this.replacePath(this.metadata.issuer);
    else
      throw createClientAuthError(endpointResolutionError);
  }
  get jwksUri() {
    if (this.discoveryComplete())
      return this.replacePath(this.metadata.jwks_uri);
    else
      throw createClientAuthError(endpointResolutionError);
  }
  canReplaceTenant(authorityUri) {
    return authorityUri.PathSegments.length === 1 && !Authority.reservedTenantDomains.has(authorityUri.PathSegments[0]) && this.getAuthorityType(authorityUri) === AuthorityType.Default && this.protocolMode !== ProtocolMode.OIDC;
  }
  replaceTenant(urlString) {
    return urlString.replace(/{tenant}|{tenantid}/g, this.tenant);
  }
  replacePath(urlString) {
    let endpoint7 = urlString, cachedAuthorityUrlComponents = new UrlString(this.metadata.canonical_authority).getUrlComponents(), cachedAuthorityParts = cachedAuthorityUrlComponents.PathSegments;
    return this.canonicalAuthorityUrlComponents.PathSegments.forEach((currentPart, index) => {
      let cachedPart = cachedAuthorityParts[index];
      if (index === 0 && this.canReplaceTenant(cachedAuthorityUrlComponents)) {
        let tenantId = new UrlString(this.metadata.authorization_endpoint).getUrlComponents().PathSegments[0];
        if (cachedPart !== tenantId)
          this.logger.verbose(`Replacing tenant domain name '${cachedPart}' with id '${tenantId}'`, this.correlationId), cachedPart = tenantId;
      }
      if (currentPart !== cachedPart)
        endpoint7 = endpoint7.replace(`/${cachedPart}/`, `/${currentPart}/`);
    }), this.replaceTenant(endpoint7);
  }
  get defaultOpenIdConfigurationEndpoint() {
    let canonicalAuthorityHost = this.hostnameAndPort;
    if (this.canonicalAuthority.endsWith("v2.0/") || this.authorityType === AuthorityType.Adfs || this.protocolMode === ProtocolMode.OIDC && !this.isAliasOfKnownMicrosoftAuthority(canonicalAuthorityHost))
      return `${this.canonicalAuthority}.well-known/openid-configuration`;
    return `${this.canonicalAuthority}v2.0/.well-known/openid-configuration`;
  }
  discoveryComplete() {
    return !!this.metadata;
  }
  async resolveEndpointsAsync() {
    let metadataEntity = this.getCurrentMetadataEntity(), cloudDiscoverySource = await invokeAsync(this.updateCloudDiscoveryMetadata.bind(this), AuthorityUpdateCloudDiscoveryMetadata, this.logger, this.performanceClient, this.correlationId)(metadataEntity);
    this.canonicalAuthority = this.canonicalAuthority.replace(this.hostnameAndPort, metadataEntity.preferred_network);
    let endpointSource = await invokeAsync(this.updateEndpointMetadata.bind(this), AuthorityUpdateEndpointMetadata, this.logger, this.performanceClient, this.correlationId)(metadataEntity);
    this.updateCachedMetadata(metadataEntity, cloudDiscoverySource, {
      source: endpointSource
    }), this.performanceClient?.addFields({
      cloudDiscoverySource,
      authorityEndpointSource: endpointSource
    }, this.correlationId);
  }
  getCurrentMetadataEntity() {
    let metadataEntity = this.cacheManager.getAuthorityMetadataByAlias(this.hostnameAndPort, this.correlationId);
    if (!metadataEntity)
      metadataEntity = {
        aliases: [],
        preferred_cache: this.hostnameAndPort,
        preferred_network: this.hostnameAndPort,
        canonical_authority: this.canonicalAuthority,
        authorization_endpoint: "",
        token_endpoint: "",
        end_session_endpoint: "",
        issuer: "",
        aliasesFromNetwork: !1,
        endpointsFromNetwork: !1,
        expiresAt: generateAuthorityMetadataExpiresAt(),
        jwks_uri: ""
      };
    return metadataEntity;
  }
  updateCachedMetadata(metadataEntity, cloudDiscoverySource, endpointMetadataResult) {
    if (cloudDiscoverySource !== AuthorityMetadataSource.CACHE && endpointMetadataResult?.source !== AuthorityMetadataSource.CACHE)
      metadataEntity.expiresAt = generateAuthorityMetadataExpiresAt(), metadataEntity.canonical_authority = this.canonicalAuthority;
    let cacheKey = this.cacheManager.generateAuthorityMetadataCacheKey(metadataEntity.preferred_cache, this.correlationId);
    this.cacheManager.setAuthorityMetadata(cacheKey, metadataEntity, this.correlationId), this.metadata = metadataEntity;
  }
  async updateEndpointMetadata(metadataEntity) {
    let localMetadata = this.updateEndpointMetadataFromLocalSources(metadataEntity);
    if (localMetadata) {
      if (localMetadata.source === AuthorityMetadataSource.HARDCODED_VALUES) {
        if (this.authorityOptions.azureRegionConfiguration?.azureRegion) {
          if (localMetadata.metadata) {
            let hardcodedMetadata = await invokeAsync(this.updateMetadataWithRegionalInformation.bind(this), AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(localMetadata.metadata);
            updateAuthorityEndpointMetadata(metadataEntity, hardcodedMetadata, !1), metadataEntity.canonical_authority = this.canonicalAuthority;
          }
        }
      }
      return localMetadata.source;
    }
    let metadata = await invokeAsync(this.getEndpointMetadataFromNetwork.bind(this), AuthorityGetEndpointMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
    if (metadata) {
      if (this.authorityOptions.azureRegionConfiguration?.azureRegion)
        metadata = await invokeAsync(this.updateMetadataWithRegionalInformation.bind(this), AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(metadata);
      return updateAuthorityEndpointMetadata(metadataEntity, metadata, !0), AuthorityMetadataSource.NETWORK;
    } else
      throw createClientAuthError(openIdConfigError, this.defaultOpenIdConfigurationEndpoint);
  }
  updateEndpointMetadataFromLocalSources(metadataEntity) {
    this.logger.verbose("Attempting to get endpoint metadata from authority configuration", this.correlationId);
    let configMetadata = this.getEndpointMetadataFromConfig();
    if (configMetadata)
      return this.logger.verbose("Found endpoint metadata in authority configuration", this.correlationId), updateAuthorityEndpointMetadata(metadataEntity, configMetadata, !1), {
        source: AuthorityMetadataSource.CONFIG
      };
    this.logger.verbose("Did not find endpoint metadata in the config... Attempting to get endpoint metadata from the hardcoded values.", this.correlationId);
    let hardcodedMetadata = this.getEndpointMetadataFromHardcodedValues();
    if (hardcodedMetadata)
      return updateAuthorityEndpointMetadata(metadataEntity, hardcodedMetadata, !1), {
        source: AuthorityMetadataSource.HARDCODED_VALUES,
        metadata: hardcodedMetadata
      };
    else
      this.logger.verbose("Did not find endpoint metadata in hardcoded values... Attempting to get endpoint metadata from the network metadata cache.", this.correlationId);
    let metadataEntityExpired = isAuthorityMetadataExpired(metadataEntity);
    if (this.isAuthoritySameType(metadataEntity) && metadataEntity.endpointsFromNetwork && !metadataEntityExpired)
      return this.logger.verbose("Found endpoint metadata in the cache.", ""), { source: AuthorityMetadataSource.CACHE };
    else if (metadataEntityExpired)
      this.logger.verbose("The metadata entity is expired.", "");
    return null;
  }
  isAuthoritySameType(metadataEntity) {
    return new UrlString(metadataEntity.canonical_authority).getUrlComponents().PathSegments.length === this.canonicalAuthorityUrlComponents.PathSegments.length;
  }
  getEndpointMetadataFromConfig() {
    if (this.authorityOptions.authorityMetadata)
      try {
        return JSON.parse(this.authorityOptions.authorityMetadata);
      } catch (e) {
        throw createClientConfigurationError(invalidAuthorityMetadata);
      }
    return null;
  }
  async getEndpointMetadataFromNetwork() {
    let options = {}, openIdConfigurationEndpoint = this.defaultOpenIdConfigurationEndpoint;
    this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: attempting to retrieve OAuth endpoints from '${openIdConfigurationEndpoint}'`, this.correlationId);
    try {
      let response7 = await this.networkInterface.sendGetRequestAsync(openIdConfigurationEndpoint, options);
      if (isOpenIdConfigResponse(response7.body))
        return response7.body;
      else
        return this.logger.verbose("Authority.getEndpointMetadataFromNetwork: could not parse response as OpenID configuration", this.correlationId), null;
    } catch (e) {
      return this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: '${e}'`, this.correlationId), null;
    }
  }
  getEndpointMetadataFromHardcodedValues() {
    if (this.hostnameAndPort in EndpointMetadata)
      return EndpointMetadata[this.hostnameAndPort];
    return null;
  }
  async updateMetadataWithRegionalInformation(metadata) {
    let userConfiguredAzureRegion = this.authorityOptions.azureRegionConfiguration?.azureRegion;
    if (userConfiguredAzureRegion) {
      if (userConfiguredAzureRegion !== AZURE_REGION_AUTO_DISCOVER_FLAG)
        return this.regionDiscoveryMetadata.region_outcome = RegionDiscoveryOutcomes.CONFIGURED_NO_AUTO_DETECTION, this.regionDiscoveryMetadata.region_used = userConfiguredAzureRegion, Authority.replaceWithRegionalInformation(metadata, userConfiguredAzureRegion);
      let autodetectedRegionName = await invokeAsync(this.regionDiscovery.detectRegion.bind(this.regionDiscovery), RegionDiscoveryDetectRegion, this.logger, this.performanceClient, this.correlationId)(this.authorityOptions.azureRegionConfiguration?.environmentRegion, this.regionDiscoveryMetadata);
      if (autodetectedRegionName)
        return this.regionDiscoveryMetadata.region_outcome = RegionDiscoveryOutcomes.AUTO_DETECTION_REQUESTED_SUCCESSFUL, this.regionDiscoveryMetadata.region_used = autodetectedRegionName, Authority.replaceWithRegionalInformation(metadata, autodetectedRegionName);
      this.regionDiscoveryMetadata.region_outcome = RegionDiscoveryOutcomes.AUTO_DETECTION_REQUESTED_FAILED;
    }
    return metadata;
  }
  async updateCloudDiscoveryMetadata(metadataEntity) {
    let localMetadataSource = this.updateCloudDiscoveryMetadataFromLocalSources(metadataEntity);
    if (localMetadataSource)
      return localMetadataSource;
    let metadata = await invokeAsync(this.getCloudDiscoveryMetadataFromNetwork.bind(this), AuthorityGetCloudDiscoveryMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
    if (metadata)
      return updateCloudDiscoveryMetadata(metadataEntity, metadata, !0), AuthorityMetadataSource.NETWORK;
    throw createClientConfigurationError(untrustedAuthority);
  }
  updateCloudDiscoveryMetadataFromLocalSources(metadataEntity) {
    this.logger.verbose("Attempting to get cloud discovery metadata  from authority configuration", this.correlationId), this.logger.verbosePii(`Known Authorities: '${this.authorityOptions.knownAuthorities || NOT_APPLICABLE}'`, this.correlationId), this.logger.verbosePii(`Authority Metadata: '${this.authorityOptions.authorityMetadata || NOT_APPLICABLE}'`, this.correlationId), this.logger.verbosePii(`Canonical Authority: '${metadataEntity.canonical_authority || NOT_APPLICABLE}'`, this.correlationId);
    let metadata = this.getCloudDiscoveryMetadataFromConfig();
    if (metadata)
      return this.logger.verbose("Found cloud discovery metadata in authority configuration", this.correlationId), updateCloudDiscoveryMetadata(metadataEntity, metadata, !1), AuthorityMetadataSource.CONFIG;
    this.logger.verbose("Did not find cloud discovery metadata in the config... Attempting to get cloud discovery metadata from the hardcoded values.", this.correlationId);
    let hardcodedMetadata = getCloudDiscoveryMetadataFromHardcodedValues(this.hostnameAndPort);
    if (hardcodedMetadata)
      return this.logger.verbose("Found cloud discovery metadata from hardcoded values.", this.correlationId), updateCloudDiscoveryMetadata(metadataEntity, hardcodedMetadata, !1), AuthorityMetadataSource.HARDCODED_VALUES;
    this.logger.verbose("Did not find cloud discovery metadata in hardcoded values... Attempting to get cloud discovery metadata from the network metadata cache.", this.correlationId);
    let metadataEntityExpired = isAuthorityMetadataExpired(metadataEntity);
    if (this.isAuthoritySameType(metadataEntity) && metadataEntity.aliasesFromNetwork && !metadataEntityExpired)
      return this.logger.verbose("Found cloud discovery metadata in the cache.", ""), AuthorityMetadataSource.CACHE;
    else if (metadataEntityExpired)
      this.logger.verbose("The metadata entity is expired.", "");
    return null;
  }
  getCloudDiscoveryMetadataFromConfig() {
    if (this.authorityType === AuthorityType.Ciam)
      return this.logger.verbose("CIAM authorities do not support cloud discovery metadata, generate the aliases from authority host.", this.correlationId), Authority.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    if (this.authorityOptions.cloudDiscoveryMetadata) {
      this.logger.verbose("The cloud discovery metadata has been provided as a network response, in the config.", this.correlationId);
      try {
        this.logger.verbose("Attempting to parse the cloud discovery metadata.", this.correlationId);
        let parsedResponse = JSON.parse(this.authorityOptions.cloudDiscoveryMetadata), metadata = getCloudDiscoveryMetadataFromNetworkResponse(parsedResponse.metadata, this.hostnameAndPort);
        if (this.logger.verbose("Parsed the cloud discovery metadata.", ""), metadata)
          return this.logger.verbose("There is returnable metadata attached to the parsed cloud discovery metadata.", this.correlationId), metadata;
        else
          this.logger.verbose("There is no metadata attached to the parsed cloud discovery metadata.", this.correlationId);
      } catch (e) {
        throw this.logger.verbose("Unable to parse the cloud discovery metadata. Throwing Invalid Cloud Discovery Metadata Error.", this.correlationId), createClientConfigurationError(invalidCloudDiscoveryMetadata);
      }
    }
    if (this.isInKnownAuthorities())
      return this.logger.verbose("The host is included in knownAuthorities. Creating new cloud discovery metadata from the host.", this.correlationId), Authority.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    return null;
  }
  async getCloudDiscoveryMetadataFromNetwork() {
    let instanceDiscoveryEndpoint = `${AAD_INSTANCE_DISCOVERY_ENDPT}${this.canonicalAuthority}oauth2/v2.0/authorize`, options = {}, match = null;
    try {
      let response7 = await this.networkInterface.sendGetRequestAsync(instanceDiscoveryEndpoint, options), typedResponseBody, metadata;
      if (isCloudInstanceDiscoveryResponse(response7.body))
        typedResponseBody = response7.body, metadata = typedResponseBody.metadata, this.logger.verbosePii(`tenant_discovery_endpoint is: '${typedResponseBody.tenant_discovery_endpoint}'`, this.correlationId);
      else if (isCloudInstanceDiscoveryErrorResponse(response7.body)) {
        if (this.logger.warning(`A CloudInstanceDiscoveryErrorResponse was returned. The cloud instance discovery network request's status code is: '${response7.status}'`, this.correlationId), typedResponseBody = response7.body, typedResponseBody.error === INVALID_INSTANCE)
          return this.logger.error("The CloudInstanceDiscoveryErrorResponse error is invalid_instance.", this.correlationId), null;
        this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error is '${typedResponseBody.error}'`, this.correlationId), this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error description is '${typedResponseBody.error_description}'`, this.correlationId), this.logger.warning("Setting the value of the CloudInstanceDiscoveryMetadata (returned from the network, correlationId) to []", this.correlationId), metadata = [];
      } else
        return this.logger.error("AAD did not return a CloudInstanceDiscoveryResponse or CloudInstanceDiscoveryErrorResponse", this.correlationId), null;
      this.logger.verbose("Attempting to find a match between the developer's authority and the CloudInstanceDiscoveryMetadata returned from the network request.", this.correlationId), match = getCloudDiscoveryMetadataFromNetworkResponse(metadata, this.hostnameAndPort);
    } catch (error43) {
      if (error43 instanceof AuthError)
        this.logger.error(`There was a network error while attempting to get the cloud discovery instance metadata.
Error: '${error43.errorCode}'
Error Description: '${error43.errorMessage}'`, this.correlationId);
      else {
        let typedError = error43;
        this.logger.error(`A non-MSALJS error was thrown while attempting to get the cloud instance discovery metadata.
Error: '${typedError.name}'
Error Description: '${typedError.message}'`, this.correlationId);
      }
      return null;
    }
    if (!match)
      this.logger.warning("The developer's authority was not found within the CloudInstanceDiscoveryMetadata returned from the network request.", this.correlationId), this.logger.verbose("Creating custom Authority for custom domain scenario.", this.correlationId), match = Authority.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    return match;
  }
  isInKnownAuthorities() {
    return this.authorityOptions.knownAuthorities.filter((authority) => {
      return authority && UrlString.getDomainFromUrl(authority).toLowerCase() === this.hostnameAndPort;
    }).length > 0;
  }
  static generateAuthority(authorityString, azureCloudOptions) {
    let authorityAzureCloudInstance;
    if (azureCloudOptions && azureCloudOptions.azureCloudInstance !== AzureCloudInstance.None) {
      let tenant = azureCloudOptions.tenant ? azureCloudOptions.tenant : DEFAULT_COMMON_TENANT;
      authorityAzureCloudInstance = `${azureCloudOptions.azureCloudInstance}/${tenant}/`;
    }
    return authorityAzureCloudInstance ? authorityAzureCloudInstance : authorityString;
  }
  static createCloudDiscoveryMetadataFromHost(host) {
    return {
      preferred_network: host,
      preferred_cache: host,
      aliases: [host]
    };
  }
  getPreferredCache() {
    if (this.managedIdentity)
      return DEFAULT_AUTHORITY_HOST;
    else if (this.discoveryComplete())
      return this.metadata.preferred_cache;
    else
      throw createClientAuthError(endpointResolutionError);
  }
  isAlias(host) {
    return this.metadata.aliases.indexOf(host) > -1;
  }
  isAliasOfKnownMicrosoftAuthority(host) {
    return InstanceDiscoveryMetadataAliases.has(host);
  }
  static isPublicCloudAuthority(host) {
    return KNOWN_PUBLIC_CLOUDS.indexOf(host) >= 0;
  }
  static buildRegionalAuthorityString(host, region, queryString) {
    let authorityUrlInstance = new UrlString(host);
    authorityUrlInstance.validateAsUri();
    let authorityUrlParts = authorityUrlInstance.getUrlComponents(), hostNameAndPort = `${region}.${authorityUrlParts.HostNameAndPort}`;
    if (this.isPublicCloudAuthority(authorityUrlParts.HostNameAndPort))
      hostNameAndPort = `${region}.${REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX}`;
    let url3 = UrlString.constructAuthorityUriFromObject({
      ...authorityUrlInstance.getUrlComponents(),
      HostNameAndPort: hostNameAndPort
    }).urlString;
    if (queryString)
      return `${url3}?${queryString}`;
    return url3;
  }
  static replaceWithRegionalInformation(metadata, azureRegion) {
    let regionalMetadata = { ...metadata };
    if (regionalMetadata.authorization_endpoint = Authority.buildRegionalAuthorityString(regionalMetadata.authorization_endpoint, azureRegion), regionalMetadata.token_endpoint = Authority.buildRegionalAuthorityString(regionalMetadata.token_endpoint, azureRegion), regionalMetadata.end_session_endpoint)
      regionalMetadata.end_session_endpoint = Authority.buildRegionalAuthorityString(regionalMetadata.end_session_endpoint, azureRegion);
    return regionalMetadata;
  }
  static transformCIAMAuthority(authority) {
    let ciamAuthority = authority, authorityUrlComponents = new UrlString(authority).getUrlComponents();
    if (authorityUrlComponents.PathSegments.length === 0 && authorityUrlComponents.HostNameAndPort.endsWith(CIAM_AUTH_URL)) {
      let tenantIdOrDomain = authorityUrlComponents.HostNameAndPort.split(".")[0];
      ciamAuthority = `${ciamAuthority}${tenantIdOrDomain}${AAD_TENANT_DOMAIN_SUFFIX}`;
    }
    return ciamAuthority;
  }
}
