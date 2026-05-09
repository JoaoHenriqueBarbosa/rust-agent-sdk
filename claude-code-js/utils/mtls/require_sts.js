// var: require_sts
var require_sts = __commonJS((exports) => {
  var STSClient = require_STSClient(), smithyClient = require_dist_cjs71(), middlewareEndpoint = require_dist_cjs65(), EndpointParameters = require_EndpointParameters(), schemas_0 = require_schemas_03(), errors3 = require_errors3(), client3 = require_client(), regionConfigResolver = require_dist_cjs87(), STSServiceException = require_STSServiceException();

  class AssumeRoleCommand extends smithyClient.Command.classBuilder().ep(EndpointParameters.commonParams).m(function(Command2, cs, config3, o2) {
    return [middlewareEndpoint.getEndpointPlugin(config3, Command2.getEndpointParameterInstructions())];
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(schemas_0.AssumeRole$).build() {
  }

  class AssumeRoleWithWebIdentityCommand extends smithyClient.Command.classBuilder().ep(EndpointParameters.commonParams).m(function(Command2, cs, config3, o2) {
    return [middlewareEndpoint.getEndpointPlugin(config3, Command2.getEndpointParameterInstructions())];
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(schemas_0.AssumeRoleWithWebIdentity$).build() {
  }
  var commands = {
    AssumeRoleCommand,
    AssumeRoleWithWebIdentityCommand
  };

  class STS extends STSClient.STSClient {
  }
  smithyClient.createAggregatedClient(commands, STS);
  var getAccountIdFromAssumedRoleUser = (assumedRoleUser) => {
    if (typeof assumedRoleUser?.Arn === "string") {
      let arnComponents = assumedRoleUser.Arn.split(":");
      if (arnComponents.length > 4 && arnComponents[4] !== "")
        return arnComponents[4];
    }
    return;
  }, resolveRegion = async (_region, _parentRegion, credentialProviderLogger, loaderConfig = {}) => {
    let region = typeof _region === "function" ? await _region() : _region, parentRegion = typeof _parentRegion === "function" ? await _parentRegion() : _parentRegion, stsDefaultRegion = "", resolvedRegion = region ?? parentRegion ?? (stsDefaultRegion = await regionConfigResolver.stsRegionDefaultResolver(loaderConfig)());
    return credentialProviderLogger?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${region} (credential provider clientConfig)`, `${parentRegion} (contextual client)`, `${stsDefaultRegion} (STS default: AWS_REGION, profile region, or us-east-1)`), resolvedRegion;
  }, getDefaultRoleAssumer$1 = (stsOptions, STSClient2) => {
    let stsClient, closureSourceCreds;
    return async (sourceCreds, params) => {
      if (closureSourceCreds = sourceCreds, !stsClient) {
        let { logger: logger2 = stsOptions?.parentClientConfig?.logger, profile: profile2 = stsOptions?.parentClientConfig?.profile, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, userAgentAppId = stsOptions?.parentClientConfig?.userAgentAppId } = stsOptions, resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger, {
          logger: logger2,
          profile: profile2
        }), isCompatibleRequestHandler = !isH2(requestHandler);
        stsClient = new STSClient2({
          ...stsOptions,
          userAgentAppId,
          profile: profile2,
          credentialDefaultProvider: () => async () => closureSourceCreds,
          region: resolvedRegion,
          requestHandler: isCompatibleRequestHandler ? requestHandler : void 0,
          logger: logger2
        });
      }
      let { Credentials, AssumedRoleUser } = await stsClient.send(new AssumeRoleCommand(params));
      if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey)
        throw Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
      let accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser), credentials = {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
        expiration: Credentials.Expiration,
        ...Credentials.CredentialScope && { credentialScope: Credentials.CredentialScope },
        ...accountId && { accountId }
      };
      return client3.setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE", "i"), credentials;
    };
  }, getDefaultRoleAssumerWithWebIdentity$1 = (stsOptions, STSClient2) => {
    let stsClient;
    return async (params) => {
      if (!stsClient) {
        let { logger: logger2 = stsOptions?.parentClientConfig?.logger, profile: profile2 = stsOptions?.parentClientConfig?.profile, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, userAgentAppId = stsOptions?.parentClientConfig?.userAgentAppId } = stsOptions, resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger, {
          logger: logger2,
          profile: profile2
        }), isCompatibleRequestHandler = !isH2(requestHandler);
        stsClient = new STSClient2({
          ...stsOptions,
          userAgentAppId,
          profile: profile2,
          region: resolvedRegion,
          requestHandler: isCompatibleRequestHandler ? requestHandler : void 0,
          logger: logger2
        });
      }
      let { Credentials, AssumedRoleUser } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));
      if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey)
        throw Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
      let accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser), credentials = {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
        expiration: Credentials.Expiration,
        ...Credentials.CredentialScope && { credentialScope: Credentials.CredentialScope },
        ...accountId && { accountId }
      };
      if (accountId)
        client3.setCredentialFeature(credentials, "RESOLVED_ACCOUNT_ID", "T");
      return client3.setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), credentials;
    };
  }, isH2 = (requestHandler) => {
    return requestHandler?.metadata?.handlerProtocol === "h2";
  }, getCustomizableStsClientCtor = (baseCtor, customizations) => {
    if (!customizations)
      return baseCtor;
    else
      return class extends baseCtor {
        constructor(config3) {
          super(config3);
          for (let customization of customizations)
            this.middlewareStack.use(customization);
        }
      };
  }, getDefaultRoleAssumer = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumer$1(stsOptions, getCustomizableStsClientCtor(STSClient.STSClient, stsPlugins)), getDefaultRoleAssumerWithWebIdentity = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumerWithWebIdentity$1(stsOptions, getCustomizableStsClientCtor(STSClient.STSClient, stsPlugins)), decorateDefaultCredentialProvider = (provider) => (input) => provider({
    roleAssumer: getDefaultRoleAssumer(input),
    roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(input),
    ...input
  });
  exports.$Command = smithyClient.Command;
  exports.STSServiceException = STSServiceException.STSServiceException;
  exports.AssumeRoleCommand = AssumeRoleCommand;
  exports.AssumeRoleWithWebIdentityCommand = AssumeRoleWithWebIdentityCommand;
  exports.STS = STS;
  exports.decorateDefaultCredentialProvider = decorateDefaultCredentialProvider;
  exports.getDefaultRoleAssumer = getDefaultRoleAssumer;
  exports.getDefaultRoleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity;
  Object.prototype.hasOwnProperty.call(STSClient, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: STSClient.__proto__
  });
  Object.keys(STSClient).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = STSClient[k];
  });
  Object.prototype.hasOwnProperty.call(schemas_0, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: schemas_0.__proto__
  });
  Object.keys(schemas_0).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = schemas_0[k];
  });
  Object.prototype.hasOwnProperty.call(errors3, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: errors3.__proto__
  });
  Object.keys(errors3).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = errors3[k];
  });
});
