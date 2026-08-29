// var: ARC_API_VERSION
var ARC_API_VERSION = "2019-11-01", DEFAULT_AZURE_ARC_IDENTITY_ENDPOINT = "http://127.0.0.1:40342/metadata/identity/oauth2/token", HIMDS_EXECUTABLE_HELPER_STRING = "N/A: himds executable exists", SUPPORTED_AZURE_ARC_PLATFORMS, AZURE_ARC_FILE_DETECTION, AzureArc;
var init_AzureArc = __esm(() => {
  init_index_node();
  init_ManagedIdentityRequestParameters();
  init_BaseManagedIdentitySource();
  init_ManagedIdentityError();
  init_Constants2();
  init_ManagedIdentityErrorCodes();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  SUPPORTED_AZURE_ARC_PLATFORMS = {
    win32: `${process.env.ProgramData}\\AzureConnectedMachineAgent\\Tokens\\`,
    linux: "/var/opt/azcmagent/tokens/"
  }, AZURE_ARC_FILE_DETECTION = {
    win32: `${process.env.ProgramFiles}\\AzureConnectedMachineAgent\\himds.exe`,
    linux: "/opt/azcmagent/bin/himds"
  };
  AzureArc = class AzureArc extends BaseManagedIdentitySource {
    constructor(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, identityEndpoint) {
      super(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries);
      this.identityEndpoint = identityEndpoint;
    }
    static getEnvironmentVariables() {
      let identityEndpoint = process.env[ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT], imdsEndpoint = process.env[ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT];
      if (!identityEndpoint || !imdsEndpoint) {
        let fileDetectionPath = AZURE_ARC_FILE_DETECTION[process.platform];
        try {
          accessSync(fileDetectionPath, constants9.F_OK | constants9.R_OK), identityEndpoint = DEFAULT_AZURE_ARC_IDENTITY_ENDPOINT, imdsEndpoint = HIMDS_EXECUTABLE_HELPER_STRING;
        } catch (err) {}
      }
      return [identityEndpoint, imdsEndpoint];
    }
    static tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, managedIdentityId) {
      let [identityEndpoint, imdsEndpoint] = AzureArc.getEnvironmentVariables();
      if (!identityEndpoint || !imdsEndpoint)
        return logger10.info(`[Managed Identity] ${ManagedIdentitySourceNames.AZURE_ARC} managed identity is unavailable through environment variables because one or both of '${ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT}' and '${ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT}' are not defined. ${ManagedIdentitySourceNames.AZURE_ARC} managed identity is also unavailable through file detection.`, ""), null;
      if (imdsEndpoint === HIMDS_EXECUTABLE_HELPER_STRING)
        logger10.info(`[Managed Identity] ${ManagedIdentitySourceNames.AZURE_ARC} managed identity is available through file detection. Defaulting to known ${ManagedIdentitySourceNames.AZURE_ARC} endpoint: ${DEFAULT_AZURE_ARC_IDENTITY_ENDPOINT}. Creating ${ManagedIdentitySourceNames.AZURE_ARC} managed identity.`, "");
      else {
        let validatedIdentityEndpoint = AzureArc.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT, identityEndpoint, ManagedIdentitySourceNames.AZURE_ARC, logger10);
        validatedIdentityEndpoint.endsWith("/") && validatedIdentityEndpoint.slice(0, -1), AzureArc.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.IMDS_ENDPOINT, imdsEndpoint, ManagedIdentitySourceNames.AZURE_ARC, logger10), logger10.info(`[Managed Identity] Environment variables validation passed for ${ManagedIdentitySourceNames.AZURE_ARC} managed identity. Endpoint URI: ${validatedIdentityEndpoint}. Creating ${ManagedIdentitySourceNames.AZURE_ARC} managed identity.`, "");
      }
      if (managedIdentityId.idType !== ManagedIdentityIdType.SYSTEM_ASSIGNED)
        throw createManagedIdentityError(unableToCreateAzureArc);
      return new AzureArc(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, identityEndpoint);
    }
    createRequest(resource) {
      let request2 = new ManagedIdentityRequestParameters(HttpMethod2.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
      return request2.headers[ManagedIdentityHeaders.METADATA_HEADER_NAME] = "true", request2.queryParameters[ManagedIdentityQueryParameters.API_VERSION] = ARC_API_VERSION, request2.queryParameters[ManagedIdentityQueryParameters.RESOURCE] = resource, request2;
    }
    async getServerTokenResponseAsync(originalResponse, networkClient, networkRequest, networkRequestOptions) {
      let retryResponse;
      if (originalResponse.status === exports_Constants.HTTP_UNAUTHORIZED) {
        let wwwAuthHeader = originalResponse.headers["www-authenticate"];
        if (!wwwAuthHeader)
          throw createManagedIdentityError(wwwAuthenticateHeaderMissing);
        if (!wwwAuthHeader.includes("Basic realm="))
          throw createManagedIdentityError(wwwAuthenticateHeaderUnsupportedFormat);
        let secretFilePath = wwwAuthHeader.split("Basic realm=")[1];
        if (!SUPPORTED_AZURE_ARC_PLATFORMS.hasOwnProperty(process.platform))
          throw createManagedIdentityError(platformNotSupported);
        let expectedSecretFilePath = SUPPORTED_AZURE_ARC_PLATFORMS[process.platform], fileName = path10.basename(secretFilePath);
        if (!fileName.endsWith(".key"))
          throw createManagedIdentityError(invalidFileExtension);
        if (expectedSecretFilePath + fileName !== secretFilePath)
          throw createManagedIdentityError(invalidFilePath);
        let secretFileSize;
        try {
          secretFileSize = await statSync4(secretFilePath).size;
        } catch (e) {
          throw createManagedIdentityError(unableToReadSecretFile);
        }
        if (secretFileSize > AZURE_ARC_SECRET_FILE_MAX_SIZE_BYTES)
          throw createManagedIdentityError(invalidSecret);
        let secret;
        try {
          secret = readFileSync7(secretFilePath, exports_Constants.EncodingTypes.UTF8);
        } catch (e) {
          throw createManagedIdentityError(unableToReadSecretFile);
        }
        let authHeaderValue = `Basic ${secret}`;
        this.logger.info("[Managed Identity] Adding authorization header to the request.", ""), networkRequest.headers[ManagedIdentityHeaders.AUTHORIZATION_HEADER_NAME] = authHeaderValue;
        try {
          retryResponse = await networkClient.sendGetRequestAsync(networkRequest.computeUri(), networkRequestOptions);
        } catch (error43) {
          if (error43 instanceof AuthError)
            throw error43;
          else
            throw createClientAuthError(exports_ClientAuthErrorCodes.networkError);
        }
      }
      return this.getServerTokenResponse(retryResponse || originalResponse);
    }
  };
});
