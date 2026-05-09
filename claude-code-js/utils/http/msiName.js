// var: msiName
var msiName = "ManagedIdentityCredential - IMDS", logger18, imdsHost = "http://169.254.169.254", imdsEndpointPath = "/metadata/identity/oauth2/token", imdsMsi;
var init_imdsMsi = __esm(() => {
  init_esm6();
  init_esm4();
  init_logging();
  init_tracing();
  logger18 = credentialLogger(msiName);
  imdsMsi = {
    name: "imdsMsi",
    async isAvailable(options) {
      let { scopes, identityClient, getTokenOptions } = options, resource = mapScopesToResource(scopes);
      if (!resource)
        return logger18.info(`${msiName}: Unavailable. Multiple scopes are not supported.`), !1;
      if (process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST)
        return !0;
      if (!identityClient)
        throw Error("Missing IdentityClient");
      let requestOptions = prepareInvalidRequestOptions(resource);
      return tracingClient.withSpan("ManagedIdentityCredential-pingImdsEndpoint", getTokenOptions ?? {}, async (updatedOptions) => {
        requestOptions.tracingOptions = updatedOptions.tracingOptions;
        let request2 = createPipelineRequest2(requestOptions);
        request2.timeout = updatedOptions.requestOptions?.timeout || 1000, request2.allowInsecureConnection = !0;
        let response7;
        try {
          logger18.info(`${msiName}: Pinging the Azure IMDS endpoint`), response7 = await identityClient.sendRequest(request2);
        } catch (err) {
          if (isError2(err))
            logger18.verbose(`${msiName}: Caught error ${err.name}: ${err.message}`);
          return logger18.info(`${msiName}: The Azure IMDS endpoint is unavailable`), !1;
        }
        if (response7.status === 403) {
          if (response7.bodyAsText?.includes("unreachable"))
            return logger18.info(`${msiName}: The Azure IMDS endpoint is unavailable`), logger18.info(`${msiName}: ${response7.bodyAsText}`), !1;
        }
        return logger18.info(`${msiName}: The Azure IMDS endpoint is available`), !0;
      });
    }
  };
});
