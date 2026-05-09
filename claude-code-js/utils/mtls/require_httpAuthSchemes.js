// var: require_httpAuthSchemes
var require_httpAuthSchemes = __commonJS((exports) => {
  var protocolHttp = require_dist_cjs36(), core2 = require_dist_cjs37(), propertyProvider = require_dist_cjs6(), client3 = require_client(), signatureV4 = require_dist_cjs41(), getDateHeader = (response2) => protocolHttp.HttpResponse.isInstance(response2) ? response2.headers?.date ?? response2.headers?.Date : void 0, getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset), isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 300000, getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
    let clockTimeInMs = Date.parse(clockTime);
    if (isClockSkewed(clockTimeInMs, currentSystemClockOffset))
      return clockTimeInMs - Date.now();
    return currentSystemClockOffset;
  }, throwSigningPropertyError = (name, property2) => {
    if (!property2)
      throw Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
    return property2;
  }, validateSigningProperties = async (signingProperties) => {
    let context = throwSigningPropertyError("context", signingProperties.context), config3 = throwSigningPropertyError("config", signingProperties.config), authScheme = context.endpointV2?.properties?.authSchemes?.[0], signer = await throwSigningPropertyError("signer", config3.signer)(authScheme), signingRegion = signingProperties?.signingRegion, signingRegionSet = signingProperties?.signingRegionSet, signingName = signingProperties?.signingName;
    return {
      config: config3,
      signer,
      signingRegion,
      signingRegionSet,
      signingName
    };
  };

  class AwsSdkSigV4Signer {
    async sign(httpRequest3, identity6, signingProperties) {
      if (!protocolHttp.HttpRequest.isInstance(httpRequest3))
        throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
      let validatedProps = await validateSigningProperties(signingProperties), { config: config3, signer } = validatedProps, { signingRegion, signingName } = validatedProps, handlerExecutionContext = signingProperties.context;
      if (handlerExecutionContext?.authSchemes?.length ?? !1) {
        let [first, second] = handlerExecutionContext.authSchemes;
        if (first?.name === "sigv4a" && second?.name === "sigv4")
          signingRegion = second?.signingRegion ?? signingRegion, signingName = second?.signingName ?? signingName;
      }
      return await signer.sign(httpRequest3, {
        signingDate: getSkewCorrectedDate(config3.systemClockOffset),
        signingRegion,
        signingService: signingName
      });
    }
    errorHandler(signingProperties) {
      return (error41) => {
        let serverTime = error41.ServerTime ?? getDateHeader(error41.$response);
        if (serverTime) {
          let config3 = throwSigningPropertyError("config", signingProperties.config), initialSystemClockOffset = config3.systemClockOffset;
          if (config3.systemClockOffset = getUpdatedSystemClockOffset(serverTime, config3.systemClockOffset), config3.systemClockOffset !== initialSystemClockOffset && error41.$metadata)
            error41.$metadata.clockSkewCorrected = !0;
        }
        throw error41;
      };
    }
    successHandler(httpResponse2, signingProperties) {
      let dateHeader = getDateHeader(httpResponse2);
      if (dateHeader) {
        let config3 = throwSigningPropertyError("config", signingProperties.config);
        config3.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config3.systemClockOffset);
      }
    }
  }
  var AWSSDKSigV4Signer = AwsSdkSigV4Signer;

  class AwsSdkSigV4ASigner extends AwsSdkSigV4Signer {
    async sign(httpRequest3, identity6, signingProperties) {
      if (!protocolHttp.HttpRequest.isInstance(httpRequest3))
        throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
      let { config: config3, signer, signingRegion, signingRegionSet, signingName } = await validateSigningProperties(signingProperties), multiRegionOverride = (await config3.sigv4aSigningRegionSet?.() ?? signingRegionSet ?? [signingRegion]).join(",");
      return await signer.sign(httpRequest3, {
        signingDate: getSkewCorrectedDate(config3.systemClockOffset),
        signingRegion: multiRegionOverride,
        signingService: signingName
      });
    }
  }
  var getArrayForCommaSeparatedString = (str) => typeof str === "string" && str.length > 0 ? str.split(",").map((item) => item.trim()) : [], getBearerTokenEnvKey = (signingName) => `AWS_BEARER_TOKEN_${signingName.replace(/[\s-]/g, "_").toUpperCase()}`, NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY = "AWS_AUTH_SCHEME_PREFERENCE", NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY = "auth_scheme_preference", NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = {
    environmentVariableSelector: (env4, options) => {
      if (options?.signingName) {
        if (getBearerTokenEnvKey(options.signingName) in env4)
          return ["httpBearerAuth"];
      }
      if (!(NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY in env4))
        return;
      return getArrayForCommaSeparatedString(env4[NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY]);
    },
    configFileSelector: (profile2) => {
      if (!(NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY in profile2))
        return;
      return getArrayForCommaSeparatedString(profile2[NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY]);
    },
    default: []
  }, resolveAwsSdkSigV4AConfig = (config3) => {
    return config3.sigv4aSigningRegionSet = core2.normalizeProvider(config3.sigv4aSigningRegionSet), config3;
  }, NODE_SIGV4A_CONFIG_OPTIONS = {
    environmentVariableSelector(env4) {
      if (env4.AWS_SIGV4A_SIGNING_REGION_SET)
        return env4.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((_) => _.trim());
      throw new propertyProvider.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
        tryNextLink: !0
      });
    },
    configFileSelector(profile2) {
      if (profile2.sigv4a_signing_region_set)
        return (profile2.sigv4a_signing_region_set ?? "").split(",").map((_) => _.trim());
      throw new propertyProvider.ProviderError("sigv4a_signing_region_set not set in profile.", {
        tryNextLink: !0
      });
    },
    default: void 0
  }, resolveAwsSdkSigV4Config = (config3) => {
    let inputCredentials = config3.credentials, isUserSupplied = !!config3.credentials, resolvedCredentials = void 0;
    Object.defineProperty(config3, "credentials", {
      set(credentials) {
        if (credentials && credentials !== inputCredentials && credentials !== resolvedCredentials)
          isUserSupplied = !0;
        inputCredentials = credentials;
        let memoizedProvider = normalizeCredentialProvider(config3, {
          credentials: inputCredentials,
          credentialDefaultProvider: config3.credentialDefaultProvider
        }), boundProvider = bindCallerConfig(config3, memoizedProvider);
        if (isUserSupplied && !boundProvider.attributed) {
          let isCredentialObject = typeof inputCredentials === "object" && inputCredentials !== null;
          resolvedCredentials = async (options) => {
            let attributedCreds = await boundProvider(options);
            if (isCredentialObject && (!attributedCreds.$source || Object.keys(attributedCreds.$source).length === 0))
              return client3.setCredentialFeature(attributedCreds, "CREDENTIALS_CODE", "e");
            return attributedCreds;
          }, resolvedCredentials.memoized = boundProvider.memoized, resolvedCredentials.configBound = boundProvider.configBound, resolvedCredentials.attributed = !0;
        } else
          resolvedCredentials = boundProvider;
      },
      get() {
        return resolvedCredentials;
      },
      enumerable: !0,
      configurable: !0
    }), config3.credentials = inputCredentials;
    let { signingEscapePath = !0, systemClockOffset = config3.systemClockOffset || 0, sha256 } = config3, signer;
    if (config3.signer)
      signer = core2.normalizeProvider(config3.signer);
    else if (config3.regionInfoProvider)
      signer = () => core2.normalizeProvider(config3.region)().then(async (region) => [
        await config3.regionInfoProvider(region, {
          useFipsEndpoint: await config3.useFipsEndpoint(),
          useDualstackEndpoint: await config3.useDualstackEndpoint()
        }) || {},
        region
      ]).then(([regionInfo, region]) => {
        let { signingRegion, signingService } = regionInfo;
        config3.signingRegion = config3.signingRegion || signingRegion || region, config3.signingName = config3.signingName || signingService || config3.serviceId;
        let params = {
          ...config3,
          credentials: config3.credentials,
          region: config3.signingRegion,
          service: config3.signingName,
          sha256,
          uriEscapePath: signingEscapePath
        };
        return new (config3.signerConstructor || signatureV4.SignatureV4)(params);
      });
    else
      signer = async (authScheme) => {
        authScheme = Object.assign({}, {
          name: "sigv4",
          signingName: config3.signingName || config3.defaultSigningName,
          signingRegion: await core2.normalizeProvider(config3.region)(),
          properties: {}
        }, authScheme);
        let { signingRegion, signingName: signingService } = authScheme;
        config3.signingRegion = config3.signingRegion || signingRegion, config3.signingName = config3.signingName || signingService || config3.serviceId;
        let params = {
          ...config3,
          credentials: config3.credentials,
          region: config3.signingRegion,
          service: config3.signingName,
          sha256,
          uriEscapePath: signingEscapePath
        };
        return new (config3.signerConstructor || signatureV4.SignatureV4)(params);
      };
    return Object.assign(config3, {
      systemClockOffset,
      signingEscapePath,
      signer
    });
  }, resolveAWSSDKSigV4Config = resolveAwsSdkSigV4Config;
  function normalizeCredentialProvider(config3, { credentials, credentialDefaultProvider }) {
    let credentialsProvider;
    if (credentials)
      if (!credentials?.memoized)
        credentialsProvider = core2.memoizeIdentityProvider(credentials, core2.isIdentityExpired, core2.doesIdentityRequireRefresh);
      else
        credentialsProvider = credentials;
    else if (credentialDefaultProvider)
      credentialsProvider = core2.normalizeProvider(credentialDefaultProvider(Object.assign({}, config3, {
        parentClientConfig: config3
      })));
    else
      credentialsProvider = async () => {
        throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
      };
    return credentialsProvider.memoized = !0, credentialsProvider;
  }
  function bindCallerConfig(config3, credentialsProvider) {
    if (credentialsProvider.configBound)
      return credentialsProvider;
    let fn = async (options) => credentialsProvider({ ...options, callerClientConfig: config3 });
    return fn.memoized = credentialsProvider.memoized, fn.configBound = !0, fn;
  }
  exports.AWSSDKSigV4Signer = AWSSDKSigV4Signer;
  exports.AwsSdkSigV4ASigner = AwsSdkSigV4ASigner;
  exports.AwsSdkSigV4Signer = AwsSdkSigV4Signer;
  exports.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = NODE_AUTH_SCHEME_PREFERENCE_OPTIONS;
  exports.NODE_SIGV4A_CONFIG_OPTIONS = NODE_SIGV4A_CONFIG_OPTIONS;
  exports.getBearerTokenEnvKey = getBearerTokenEnvKey;
  exports.resolveAWSSDKSigV4Config = resolveAWSSDKSigV4Config;
  exports.resolveAwsSdkSigV4AConfig = resolveAwsSdkSigV4AConfig;
  exports.resolveAwsSdkSigV4Config = resolveAwsSdkSigV4Config;
  exports.validateSigningProperties = validateSigningProperties;
});
