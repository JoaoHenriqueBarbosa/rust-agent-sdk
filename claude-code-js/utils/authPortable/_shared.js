// Shared module state and imports
// Original: src/utils/authPortable.ts

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/client.js
var import_middleware_stack7;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/collect-stream-body.js
var import_protocols12;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/abort.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/auth/auth.js
var HttpAuthLocation4;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/auth/HttpApiKeyAuth.js
var HttpApiKeyAuthLocation4;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/auth/HttpAuthScheme.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/auth/HttpAuthSchemeProvider.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/auth/HttpSigner.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/auth/IdentityProviderConfig.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/auth/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/blob/blob-payload-input-types.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/checksum.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/client.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/command.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/connection/config.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/connection/manager.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/connection/pool.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/connection/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/crypto.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/encode.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme4;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/endpoints/EndpointRuleObject.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/endpoints/ErrorRuleObject.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/endpoints/RuleSetObject.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/endpoints/shared.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/endpoints/TreeRuleObject.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/endpoints/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/eventStream.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId4;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/extensions/defaultClientConfiguration.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/extensions/defaultExtensionConfiguration.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/feature-ids.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/http.js
var FieldPosition4;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/http/httpHandlerInitialization.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/identity/apiKeyIdentity.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/identity/awsCredentialIdentity.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/identity/identity.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/identity/tokenIdentity.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/identity/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/logger.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/middleware.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/profile.js
var IniSectionType4;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/response.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/retry.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/schema/schema.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/schema/traits.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/schema/schema-deprecated.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/schema/sentinels.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/schema/static-schemas.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/serde.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/shapes.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/signature.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/stream.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-common-types.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-input-types.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-output-types.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/transfer.js
var RequestHandlerProtocol4;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/transform/client-payload-blob-type-narrow.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/transform/mutable.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/transform/no-undefined.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/transform/type-transform.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/uri.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/util.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/waiter.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/types/dist-es/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/schemaLogFilter.js
var import_schema8, SENSITIVE_STRING7 = "***SensitiveInformation***";

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/command.js

var import_middleware_stack8;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/constants.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/exceptions.js
var ServiceException4, decorateServiceException4 = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v]) => v !== void 0).forEach(([k3, v]) => {
    if (exception[k3] == null || exception[k3] === "")
      exception[k3] = v;
  });
  let message = exception.message || exception.Message || "UnknownError";
  return exception.message = message, delete exception.Message, exception;
};

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/default-error-handler.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/defaults-mode.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/extended-encode-uri-component.js
var import_protocols13;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js
var knownAlgorithms4, getChecksumConfiguration4 = (runtimeConfig) => {
  let checksumAlgorithms = [];
  for (let id in AlgorithmId4) {
    let algorithmId = AlgorithmId4[id];
    if (runtimeConfig[algorithmId] === void 0)
      continue;
    checksumAlgorithms.push({
      algorithmId: () => algorithmId,
      checksumConstructor: () => runtimeConfig[algorithmId]
    });
  }
  for (let [id, ChecksumCtor] of Object.entries(runtimeConfig.checksumAlgorithms ?? {}))
    checksumAlgorithms.push({
      algorithmId: () => id,
      checksumConstructor: () => ChecksumCtor
    });
  return {
    addChecksumAlgorithm(algo) {
      runtimeConfig.checksumAlgorithms = runtimeConfig.checksumAlgorithms ?? {};
      let id = algo.algorithmId(), ctor = algo.checksumConstructor();
      if (knownAlgorithms4.includes(id))
        runtimeConfig.checksumAlgorithms[id.toUpperCase()] = ctor;
      else
        runtimeConfig.checksumAlgorithms[id] = ctor;
      checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return checksumAlgorithms;
    }
  };
}, resolveChecksumRuntimeConfig4 = (clientConfig) => {
  let runtimeConfig = {};
  return clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    let id = checksumAlgorithm.algorithmId();
    if (knownAlgorithms4.includes(id))
      runtimeConfig[id] = checksumAlgorithm.checksumConstructor();
  }), runtimeConfig;
};

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/extensions/retry.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/get-array-if-single-item.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/is-serializable-header-value.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/object-mapping.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/resolve-path.js
var import_protocols14;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/ser-utils.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/serde-json.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/index.js
__export(exports_dist_es14, {
  withBaseException: () => withBaseException4,
  throwDefaultError: () => throwDefaultError4,
  take: () => take4,
  serializeFloat: () => serializeFloat4,
  serializeDateTime: () => serializeDateTime4,
  resolvedPath: () => import_protocols14.resolvedPath,
  resolveDefaultRuntimeConfig: () => resolveDefaultRuntimeConfig4,
  map: () => map5,
  loadConfigsForDefaultMode: () => loadConfigsForDefaultMode4,
  isSerializableHeaderValue: () => isSerializableHeaderValue4,
  getValueFromTextNode: () => getValueFromTextNode4,
  getDefaultExtensionConfiguration: () => getDefaultExtensionConfiguration4,
  getDefaultClientConfiguration: () => getDefaultClientConfiguration4,
  getArrayIfSingleItem: () => getArrayIfSingleItem4,
  extendedEncodeURIComponent: () => import_protocols13.extendedEncodeURIComponent,
  emitWarningIfUnsupportedVersion: () => emitWarningIfUnsupportedVersion7,
  decorateServiceException: () => decorateServiceException4,
  createAggregatedClient: () => createAggregatedClient4,
  convertMap: () => convertMap4,
  collectBody: () => import_protocols12.collectBody,
  _json: () => _json4,
  ServiceException: () => ServiceException4,
  SENSITIVE_STRING: () => SENSITIVE_STRING8,
  NoOpLogger: () => NoOpLogger7,
  Command: () => Command4,
  Client: () => Client4
});

// node_modules/@aws-sdk/client-sts/dist-es/auth/httpAuthSchemeProvider.js
var import_httpAuthSchemes8, import_util_middleware3, defaultSTSHttpAuthSchemeParametersProvider = async (config6, context, input) => {
  return {
    operation: import_util_middleware3.getSmithyContext(context).operation,
    region: await import_util_middleware3.normalizeProvider(config6.region)() || (() => {
      throw Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
}, defaultSTSHttpAuthSchemeProvider = (authParameters) => {
  let options = [];
  switch (authParameters.operation) {
    case "AssumeRoleWithSAML": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    case "AssumeRoleWithWebIdentity": {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
      break;
    }
    default:
      options.push(createAwsAuthSigv4HttpAuthOption3(authParameters));
  }
  return options;
}, resolveStsAuthConfig = (input) => Object.assign(input, {
  stsClientCtor: STSClient
}), resolveHttpAuthSchemeConfig3 = (config6) => {
  let config_0 = resolveStsAuthConfig(config6), config_1 = import_httpAuthSchemes8.resolveAwsSdkSigV4Config(config_0);
  return Object.assign(config_1, {
    authSchemePreference: import_util_middleware3.normalizeProvider(config6.authSchemePreference ?? [])
  });
};

// node_modules/@aws-sdk/client-sts/dist-es/endpoint/EndpointParameters.js

// node_modules/@aws-sdk/client-sts/package.json
var package_default3;

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-es/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/util-base64/dist-es/fromBase64.js
var BASE64_REGEX3, fromBase645 = (input) => {
  if (input.length * 3 % 4 !== 0)
    throw TypeError("Incorrect padding on base64 string.");
  if (!BASE64_REGEX3.exec(input))
    throw TypeError("Invalid base64 string.");
  let buffer = fromString4(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/util-base64/dist-es/toBase64.js
var import_util_utf86, toBase645 = (_input) => {
  let input;
  if (typeof _input === "string")
    input = import_util_utf86.fromUtf8(_input);
  else
    input = _input;
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number")
    throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  return fromArrayBuffer4(input.buffer, input.byteOffset, input.byteLength).toString("base64");
};

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/util-base64/dist-es/index.js

// node_modules/@aws-sdk/client-sts/dist-es/endpoint/ruleset.js
var m3, n4, o4, p3, q3, r3, s, t, u4, v, w, x2, y, z, A, B, C2, D, E, _data3, ruleSet3;

// node_modules/@aws-sdk/client-sts/dist-es/endpoint/endpointResolver.js
var import_util_endpoints5, import_util_endpoints6, cache3, defaultEndpointResolver3 = (endpointParams, context = {}) => {
  return cache3.get(endpointParams, () => import_util_endpoints6.resolveEndpoint(ruleSet3, {
    endpointParams,
    logger: context.logger
  }));
};

// node_modules/@aws-sdk/client-sts/dist-es/models/STSServiceException.js
var STSServiceException;

// node_modules/@aws-sdk/client-sts/dist-es/models/errors.js
var ExpiredTokenException, MalformedPolicyDocumentException, PackedPolicyTooLargeException, RegionDisabledException, IDPRejectedClaimException, InvalidIdentityTokenException, IDPCommunicationErrorException, InvalidAuthorizationMessageException, ExpiredTradeInTokenException, JWTPayloadSizeExceededException, OutboundWebIdentityFederationDisabledException, SessionDurationEscalationException;

// node_modules/@aws-sdk/client-sts/dist-es/schemas/schemas_0.js
var import_schema9, _s_registry3, STSServiceException$, n0_registry3, ExpiredTokenException$, ExpiredTradeInTokenException$, IDPCommunicationErrorException$, IDPRejectedClaimException$, InvalidAuthorizationMessageException$, InvalidIdentityTokenException$, JWTPayloadSizeExceededException$, MalformedPolicyDocumentException$, OutboundWebIdentityFederationDisabledException$, PackedPolicyTooLargeException$, RegionDisabledException$, SessionDurationEscalationException$, errorTypeRegistries3, accessKeySecretType, clientTokenType, SAMLAssertionType, tradeInTokenType, webIdentityTokenType, AssumedRoleUser$, AssumeRoleRequest$, AssumeRoleResponse$, AssumeRoleWithSAMLRequest$, AssumeRoleWithSAMLResponse$, AssumeRoleWithWebIdentityRequest$, AssumeRoleWithWebIdentityResponse$, AssumeRootRequest$, AssumeRootResponse$, Credentials$, DecodeAuthorizationMessageRequest$, DecodeAuthorizationMessageResponse$, FederatedUser$, GetAccessKeyInfoRequest$, GetAccessKeyInfoResponse$, GetCallerIdentityRequest$, GetCallerIdentityResponse$, GetDelegatedAccessTokenRequest$, GetDelegatedAccessTokenResponse$, GetFederationTokenRequest$, GetFederationTokenResponse$, GetSessionTokenRequest$, GetSessionTokenResponse$, GetWebIdentityTokenRequest$, GetWebIdentityTokenResponse$, PolicyDescriptorType$, ProvidedContext$, Tag$3, policyDescriptorListType, ProvidedContextsListType, tagListType, AssumeRole$, AssumeRoleWithSAML$, AssumeRoleWithWebIdentity$, AssumeRoot$, DecodeAuthorizationMessage$, GetAccessKeyInfo$, GetCallerIdentity$, GetDelegatedAccessToken$, GetFederationToken$, GetSessionToken$, GetWebIdentityToken$;

// node_modules/@aws-sdk/client-sts/dist-es/runtimeConfig.shared.js
var import_httpAuthSchemes9, import_protocols15, import_core35, import_url_parser4, import_util_utf87, getRuntimeConfig5 = (config6) => {
  return {
    apiVersion: "2011-06-15",
    base64Decoder: config6?.base64Decoder ?? fromBase645,
    base64Encoder: config6?.base64Encoder ?? toBase645,
    disableHostPrefix: config6?.disableHostPrefix ?? !1,
    endpointProvider: config6?.endpointProvider ?? defaultEndpointResolver3,
    extensions: config6?.extensions ?? [],
    httpAuthSchemeProvider: config6?.httpAuthSchemeProvider ?? defaultSTSHttpAuthSchemeProvider,
    httpAuthSchemes: config6?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new import_httpAuthSchemes9.AwsSdkSigV4Signer
      },
      {
        schemeId: "smithy.api#noAuth",
        identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
        signer: new import_core35.NoAuthSigner
      }
    ],
    logger: config6?.logger ?? new NoOpLogger7,
    protocol: config6?.protocol ?? import_protocols15.AwsQueryProtocol,
    protocolSettings: config6?.protocolSettings ?? {
      defaultNamespace: "com.amazonaws.sts",
      errorTypeRegistries: errorTypeRegistries3,
      xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
      version: "2011-06-15",
      serviceTarget: "AWSSecurityTokenServiceV20110615"
    },
    serviceId: config6?.serviceId ?? "STS",
    urlParser: config6?.urlParser ?? import_url_parser4.parseUrl,
    utf8Decoder: config6?.utf8Decoder ?? import_util_utf87.fromUtf8,
    utf8Encoder: config6?.utf8Encoder ?? import_util_utf87.toUtf8
  };
};

// node_modules/@aws-sdk/client-sts/dist-es/runtimeConfig.js
var import_client19, import_httpAuthSchemes10, import_util_user_agent_node3, import_config_resolver5, import_core36, import_hash_node3, import_middleware_retry5, import_node_config_provider5, import_node_http_handler4, import_util_body_length_node3, import_util_defaults_mode_node3, import_util_retry3, getRuntimeConfig6 = (config6) => {
  emitWarningIfUnsupportedVersion7(process.version);
  let defaultsMode = import_util_defaults_mode_node3.resolveDefaultsModeConfig(config6), defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode4), clientSharedValues = getRuntimeConfig5(config6);
  import_client19.emitWarningIfUnsupportedVersion(process.version);
  let loaderConfig = {
    profile: config6?.profile,
    logger: clientSharedValues.logger
  };
  return {
    ...clientSharedValues,
    ...config6,
    runtime: "node",
    defaultsMode,
    authSchemePreference: config6?.authSchemePreference ?? import_node_config_provider5.loadConfig(import_httpAuthSchemes10.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
    bodyLengthChecker: config6?.bodyLengthChecker ?? import_util_body_length_node3.calculateBodyLength,
    credentialDefaultProvider: config6?.credentialDefaultProvider ?? defaultProvider,
    defaultUserAgentProvider: config6?.defaultUserAgentProvider ?? import_util_user_agent_node3.createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: package_default3.version }),
    httpAuthSchemes: config6?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4") || (async (idProps) => await defaultProvider(idProps?.__config || {})()),
        signer: new import_httpAuthSchemes10.AwsSdkSigV4Signer
      },
      {
        schemeId: "smithy.api#noAuth",
        identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
        signer: new import_core36.NoAuthSigner
      }
    ],
    maxAttempts: config6?.maxAttempts ?? import_node_config_provider5.loadConfig(import_middleware_retry5.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config6),
    region: config6?.region ?? import_node_config_provider5.loadConfig(import_config_resolver5.NODE_REGION_CONFIG_OPTIONS, { ...import_config_resolver5.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
    requestHandler: import_node_http_handler4.NodeHttpHandler.create(config6?.requestHandler ?? defaultConfigProvider),
    retryMode: config6?.retryMode ?? import_node_config_provider5.loadConfig({
      ...import_middleware_retry5.NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || import_util_retry3.DEFAULT_RETRY_MODE
    }, config6),
    sha256: config6?.sha256 ?? import_hash_node3.Hash.bind(null, "sha256"),
    streamCollector: config6?.streamCollector ?? import_node_http_handler4.streamCollector,
    useDualstackEndpoint: config6?.useDualstackEndpoint ?? import_node_config_provider5.loadConfig(import_config_resolver5.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    useFipsEndpoint: config6?.useFipsEndpoint ?? import_node_config_provider5.loadConfig(import_config_resolver5.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    userAgentAppId: config6?.userAgentAppId ?? import_node_config_provider5.loadConfig(import_util_user_agent_node3.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
  };
};

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/protocol-http/dist-es/extensions/httpExtensionConfiguration.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/protocol-http/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/protocol-http/dist-es/Field.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/protocol-http/dist-es/httpHandler.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/protocol-http/dist-es/types.js

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/protocol-http/dist-es/index.js

// node_modules/@aws-sdk/client-sts/dist-es/auth/httpAuthExtensionConfiguration.js

// node_modules/@aws-sdk/client-sts/dist-es/runtimeExtensions.js
var import_region_config_resolver3, resolveRuntimeExtensions3 = (runtimeConfig, extensions16) => {
  let extensionConfiguration = Object.assign(import_region_config_resolver3.getAwsRegionExtensionConfiguration(runtimeConfig), getDefaultExtensionConfiguration4(runtimeConfig), getHttpHandlerExtensionConfiguration3(runtimeConfig), getHttpAuthExtensionConfiguration3(runtimeConfig));
  return extensions16.forEach((extension) => extension.configure(extensionConfiguration)), Object.assign(runtimeConfig, import_region_config_resolver3.resolveAwsRegionExtensionConfiguration(extensionConfiguration), resolveDefaultRuntimeConfig4(extensionConfiguration), resolveHttpHandlerRuntimeConfig3(extensionConfiguration), resolveHttpAuthRuntimeConfig3(extensionConfiguration));
};

// node_modules/@aws-sdk/client-sts/dist-es/STSClient.js
var import_middleware_host_header3, import_middleware_logger3, import_middleware_recursion_detection3, import_middleware_user_agent3, import_config_resolver6, import_core37, import_schema10, import_middleware_content_length3, import_middleware_endpoint114, import_middleware_retry6, STSClient;

// node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleCommand.js
var import_middleware_endpoint115, AssumeRoleCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleWithSAMLCommand.js
var import_middleware_endpoint116, AssumeRoleWithSAMLCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleWithWebIdentityCommand.js
var import_middleware_endpoint117, AssumeRoleWithWebIdentityCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRootCommand.js
var import_middleware_endpoint118, AssumeRootCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/DecodeAuthorizationMessageCommand.js
var import_middleware_endpoint119, DecodeAuthorizationMessageCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/GetAccessKeyInfoCommand.js
var import_middleware_endpoint120, GetAccessKeyInfoCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/GetCallerIdentityCommand.js
var import_middleware_endpoint121, GetCallerIdentityCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/GetDelegatedAccessTokenCommand.js
var import_middleware_endpoint122, GetDelegatedAccessTokenCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/GetFederationTokenCommand.js
var import_middleware_endpoint123, GetFederationTokenCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/GetSessionTokenCommand.js
var import_middleware_endpoint124, GetSessionTokenCommand;

// node_modules/@aws-sdk/client-sts/dist-es/commands/GetWebIdentityTokenCommand.js
var import_middleware_endpoint125, GetWebIdentityTokenCommand;

// node_modules/@aws-sdk/client-sts/dist-es/STS.js
var commands5, STS;

// node_modules/@aws-sdk/client-sts/dist-es/commands/index.js

// node_modules/@aws-sdk/client-sts/dist-es/models/models_0.js

// node_modules/@aws-sdk/client-sts/dist-es/defaultStsRoleAssumers.js
var import_client20, import_region_config_resolver4, getAccountIdFromAssumedRoleUser = (assumedRoleUser) => {
  if (typeof assumedRoleUser?.Arn === "string") {
    let arnComponents = assumedRoleUser.Arn.split(":");
    if (arnComponents.length > 4 && arnComponents[4] !== "")
      return arnComponents[4];
  }
  return;
}, resolveRegion = async (_region, _parentRegion, credentialProviderLogger, loaderConfig = {}) => {
  let region = typeof _region === "function" ? await _region() : _region, parentRegion = typeof _parentRegion === "function" ? await _parentRegion() : _parentRegion, stsDefaultRegion = "", resolvedRegion = region ?? parentRegion ?? (stsDefaultRegion = await import_region_config_resolver4.stsRegionDefaultResolver(loaderConfig)());
  return credentialProviderLogger?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${region} (credential provider clientConfig)`, `${parentRegion} (contextual client)`, `${stsDefaultRegion} (STS default: AWS_REGION, profile region, or us-east-1)`), resolvedRegion;
}, getDefaultRoleAssumer = (stsOptions, STSClient2) => {
  let stsClient, closureSourceCreds;
  return async (sourceCreds, params) => {
    if (closureSourceCreds = sourceCreds, !stsClient) {
      let { logger: logger5 = stsOptions?.parentClientConfig?.logger, profile: profile5 = stsOptions?.parentClientConfig?.profile, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, userAgentAppId = stsOptions?.parentClientConfig?.userAgentAppId } = stsOptions, resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger, {
        logger: logger5,
        profile: profile5
      }), isCompatibleRequestHandler = !isH2(requestHandler);
      stsClient = new STSClient2({
        ...stsOptions,
        userAgentAppId,
        profile: profile5,
        credentialDefaultProvider: () => async () => closureSourceCreds,
        region: resolvedRegion,
        requestHandler: isCompatibleRequestHandler ? requestHandler : void 0,
        logger: logger5
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
    return import_client20.setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE", "i"), credentials;
  };
}, getDefaultRoleAssumerWithWebIdentity = (stsOptions, STSClient2) => {
  let stsClient;
  return async (params) => {
    if (!stsClient) {
      let { logger: logger5 = stsOptions?.parentClientConfig?.logger, profile: profile5 = stsOptions?.parentClientConfig?.profile, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, userAgentAppId = stsOptions?.parentClientConfig?.userAgentAppId } = stsOptions, resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger, {
        logger: logger5,
        profile: profile5
      }), isCompatibleRequestHandler = !isH2(requestHandler);
      stsClient = new STSClient2({
        ...stsOptions,
        userAgentAppId,
        profile: profile5,
        region: resolvedRegion,
        requestHandler: isCompatibleRequestHandler ? requestHandler : void 0,
        logger: logger5
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
      import_client20.setCredentialFeature(credentials, "RESOLVED_ACCOUNT_ID", "T");
    return import_client20.setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k"), credentials;
  };
}, isH2 = (requestHandler) => {
  return requestHandler?.metadata?.handlerProtocol === "h2";
};

// node_modules/@aws-sdk/client-sts/dist-es/defaultRoleAssumers.js

// node_modules/@aws-sdk/client-sts/dist-es/index.js
__export(exports_dist_es15, {
  getDefaultRoleAssumerWithWebIdentity: () => getDefaultRoleAssumerWithWebIdentity2,
  getDefaultRoleAssumer: () => getDefaultRoleAssumer2,
  errorTypeRegistries: () => errorTypeRegistries3,
  decorateDefaultCredentialProvider: () => decorateDefaultCredentialProvider,
  __Client: () => Client4,
  Tag$: () => Tag$3,
  SessionDurationEscalationException$: () => SessionDurationEscalationException$,
  SessionDurationEscalationException: () => SessionDurationEscalationException,
  STSServiceException$: () => STSServiceException$,
  STSServiceException: () => STSServiceException,
  STSClient: () => STSClient,
  STS: () => STS,
  RegionDisabledException$: () => RegionDisabledException$,
  RegionDisabledException: () => RegionDisabledException,
  ProvidedContext$: () => ProvidedContext$,
  PolicyDescriptorType$: () => PolicyDescriptorType$,
  PackedPolicyTooLargeException$: () => PackedPolicyTooLargeException$,
  PackedPolicyTooLargeException: () => PackedPolicyTooLargeException,
  OutboundWebIdentityFederationDisabledException$: () => OutboundWebIdentityFederationDisabledException$,
  OutboundWebIdentityFederationDisabledException: () => OutboundWebIdentityFederationDisabledException,
  MalformedPolicyDocumentException$: () => MalformedPolicyDocumentException$,
  MalformedPolicyDocumentException: () => MalformedPolicyDocumentException,
  JWTPayloadSizeExceededException$: () => JWTPayloadSizeExceededException$,
  JWTPayloadSizeExceededException: () => JWTPayloadSizeExceededException,
  InvalidIdentityTokenException$: () => InvalidIdentityTokenException$,
  InvalidIdentityTokenException: () => InvalidIdentityTokenException,
  InvalidAuthorizationMessageException$: () => InvalidAuthorizationMessageException$,
  InvalidAuthorizationMessageException: () => InvalidAuthorizationMessageException,
  IDPRejectedClaimException$: () => IDPRejectedClaimException$,
  IDPRejectedClaimException: () => IDPRejectedClaimException,
  IDPCommunicationErrorException$: () => IDPCommunicationErrorException$,
  IDPCommunicationErrorException: () => IDPCommunicationErrorException,
  GetWebIdentityTokenResponse$: () => GetWebIdentityTokenResponse$,
  GetWebIdentityTokenRequest$: () => GetWebIdentityTokenRequest$,
  GetWebIdentityTokenCommand: () => GetWebIdentityTokenCommand,
  GetWebIdentityToken$: () => GetWebIdentityToken$,
  GetSessionTokenResponse$: () => GetSessionTokenResponse$,
  GetSessionTokenRequest$: () => GetSessionTokenRequest$,
  GetSessionTokenCommand: () => GetSessionTokenCommand,
  GetSessionToken$: () => GetSessionToken$,
  GetFederationTokenResponse$: () => GetFederationTokenResponse$,
  GetFederationTokenRequest$: () => GetFederationTokenRequest$,
  GetFederationTokenCommand: () => GetFederationTokenCommand,
  GetFederationToken$: () => GetFederationToken$,
  GetDelegatedAccessTokenResponse$: () => GetDelegatedAccessTokenResponse$,
  GetDelegatedAccessTokenRequest$: () => GetDelegatedAccessTokenRequest$,
  GetDelegatedAccessTokenCommand: () => GetDelegatedAccessTokenCommand,
  GetDelegatedAccessToken$: () => GetDelegatedAccessToken$,
  GetCallerIdentityResponse$: () => GetCallerIdentityResponse$,
  GetCallerIdentityRequest$: () => GetCallerIdentityRequest$,
  GetCallerIdentityCommand: () => GetCallerIdentityCommand,
  GetCallerIdentity$: () => GetCallerIdentity$,
  GetAccessKeyInfoResponse$: () => GetAccessKeyInfoResponse$,
  GetAccessKeyInfoRequest$: () => GetAccessKeyInfoRequest$,
  GetAccessKeyInfoCommand: () => GetAccessKeyInfoCommand,
  GetAccessKeyInfo$: () => GetAccessKeyInfo$,
  FederatedUser$: () => FederatedUser$,
  ExpiredTradeInTokenException$: () => ExpiredTradeInTokenException$,
  ExpiredTradeInTokenException: () => ExpiredTradeInTokenException,
  ExpiredTokenException$: () => ExpiredTokenException$,
  ExpiredTokenException: () => ExpiredTokenException,
  DecodeAuthorizationMessageResponse$: () => DecodeAuthorizationMessageResponse$,
  DecodeAuthorizationMessageRequest$: () => DecodeAuthorizationMessageRequest$,
  DecodeAuthorizationMessageCommand: () => DecodeAuthorizationMessageCommand,
  DecodeAuthorizationMessage$: () => DecodeAuthorizationMessage$,
  Credentials$: () => Credentials$,
  AssumedRoleUser$: () => AssumedRoleUser$,
  AssumeRootResponse$: () => AssumeRootResponse$,
  AssumeRootRequest$: () => AssumeRootRequest$,
  AssumeRootCommand: () => AssumeRootCommand,
  AssumeRoot$: () => AssumeRoot$,
  AssumeRoleWithWebIdentityResponse$: () => AssumeRoleWithWebIdentityResponse$,
  AssumeRoleWithWebIdentityRequest$: () => AssumeRoleWithWebIdentityRequest$,
  AssumeRoleWithWebIdentityCommand: () => AssumeRoleWithWebIdentityCommand,
  AssumeRoleWithWebIdentity$: () => AssumeRoleWithWebIdentity$,
  AssumeRoleWithSAMLResponse$: () => AssumeRoleWithSAMLResponse$,
  AssumeRoleWithSAMLRequest$: () => AssumeRoleWithSAMLRequest$,
  AssumeRoleWithSAMLCommand: () => AssumeRoleWithSAMLCommand,
  AssumeRoleWithSAML$: () => AssumeRoleWithSAML$,
  AssumeRoleResponse$: () => AssumeRoleResponse$,
  AssumeRoleRequest$: () => AssumeRoleRequest$,
  AssumeRoleCommand: () => AssumeRoleCommand,
  AssumeRole$: () => AssumeRole$,
  $Command: () => Command4
});

// node_modules/@aws-sdk/credential-providers/dist-es/createCredentialChain.js
var import_property_provider29, createCredentialChain = (...credentialProviders) => {
  let expireAfter = -1, withOptions = Object.assign(async (awsIdentityProperties) => {
    let credentials = await propertyProviderChain(...credentialProviders)(awsIdentityProperties);
    if (!credentials.expiration && expireAfter !== -1)
      credentials.expiration = new Date(Date.now() + expireAfter);
    return credentials;
  }, {
    expireAfter(milliseconds) {
      if (milliseconds < 300000)
        throw Error("@aws-sdk/credential-providers - createCredentialChain(...).expireAfter(ms) may not be called with a duration lower than five minutes.");
      return expireAfter = milliseconds, withOptions;
    }
  });
  return withOptions;
}, propertyProviderChain = (...providers) => async (awsIdentityProperties) => {
  if (providers.length === 0)
    throw new import_property_provider29.ProviderError("No providers in chain", { tryNextLink: !1 });
  let lastProviderError;
  for (let provider3 of providers)
    try {
      return await provider3(awsIdentityProperties);
    } catch (err) {
      if (lastProviderError = err, err?.tryNextLink)
        continue;
      throw err;
    }
  throw lastProviderError;
};

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/CognitoProviderParameters.js

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/Logins.js

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/Storage.js

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/resolveLogins.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/auth/httpAuthSchemeProvider.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/endpoint/ruleset.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/endpoint/endpointResolver.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/models/CognitoIdentityServiceException.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/models/errors.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/schemas/schemas_0.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/runtimeConfig.shared.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/runtimeConfig.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/cognito-identity/index.js

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/loadCognitoIdentity.js
__export(exports_loadCognitoIdentity, {
  GetIdCommand: () => import_cognito_identity.GetIdCommand,
  GetCredentialsForIdentityCommand: () => import_cognito_identity.GetCredentialsForIdentityCommand,
  CognitoIdentityClient: () => import_cognito_identity.CognitoIdentityClient
});
var import_cognito_identity;

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/fromCognitoIdentity.js
var import_property_provider30;

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/IndexedDbStorage.js

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/InMemoryStorage.js

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/localStorage.js
var inMemoryStorage;

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/fromCognitoIdentityPool.js
var import_property_provider31;

// node_modules/@aws-sdk/credential-provider-cognito-identity/dist-es/index.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromCognitoIdentity.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromCognitoIdentityPool.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromContainerMetadata.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromEnv.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromIni.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromInstanceMetadata.js
var import_client21, fromInstanceMetadata3 = (init) => {
  return init?.logger?.debug("@smithy/credential-provider-imds", "fromInstanceMetadata"), async () => fromInstanceMetadata(init)().then((creds) => import_client21.setCredentialFeature(creds, "CREDENTIALS_IMDS", "0"));
};

// node_modules/@aws-sdk/credential-providers/dist-es/fromLoginCredentials.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromNodeProviderChain.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromProcess.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromSSO.js

// node_modules/@aws-sdk/credential-providers/dist-es/loadSts.js
__export(exports_loadSts, {
  STSClient: () => import_sts.STSClient,
  AssumeRoleCommand: () => import_sts.AssumeRoleCommand
});
var import_sts;

// node_modules/@aws-sdk/credential-providers/dist-es/fromTemporaryCredentials.base.js
var import_core38, import_property_provider32, ASSUME_ROLE_DEFAULT_REGION = "us-east-1", fromTemporaryCredentials = (options, credentialDefaultProvider, regionProvider) => {
  let stsClient;
  return async (awsIdentityProperties = {}) => {
    let { callerClientConfig } = awsIdentityProperties, profile5 = options.clientConfig?.profile ?? callerClientConfig?.profile, logger5 = options.logger ?? callerClientConfig?.logger;
    logger5?.debug("@aws-sdk/credential-providers - fromTemporaryCredentials (STS)");
    let params = { ...options.params, RoleSessionName: options.params.RoleSessionName ?? "aws-sdk-js-" + Date.now() };
    if (params?.SerialNumber) {
      if (!options.mfaCodeProvider)
        throw new import_property_provider32.CredentialsProviderError("Temporary credential requires multi-factor authentication, but no MFA code callback was provided.", {
          tryNextLink: !1,
          logger: logger5
        });
      params.TokenCode = await options.mfaCodeProvider(params?.SerialNumber);
    }
    let { AssumeRoleCommand: AssumeRoleCommand4, STSClient: STSClient4 } = await Promise.resolve().then(() => (init_loadSts(), exports_loadSts));
    if (!stsClient) {
      let defaultCredentialsOrError = typeof credentialDefaultProvider === "function" ? credentialDefaultProvider() : void 0, credentialSources = [
        options.masterCredentials,
        options.clientConfig?.credentials,
        void callerClientConfig?.credentials,
        callerClientConfig?.credentialDefaultProvider?.(),
        defaultCredentialsOrError
      ], credentialSource = "STS client default credentials";
      if (credentialSources[0])
        credentialSource = "options.masterCredentials";
      else if (credentialSources[1])
        credentialSource = "options.clientConfig.credentials";
      else if (credentialSources[2])
        throw credentialSource = "caller client's credentials", Error("fromTemporaryCredentials recursion in callerClientConfig.credentials");
      else if (credentialSources[3])
        credentialSource = "caller client's credentialDefaultProvider";
      else if (credentialSources[4])
        credentialSource = "AWS SDK default credentials";
      let regionSources = [
        options.clientConfig?.region,
        callerClientConfig?.region,
        await regionProvider?.({
          profile: profile5
        }),
        ASSUME_ROLE_DEFAULT_REGION
      ], regionSource = "default partition's default region";
      if (regionSources[0])
        regionSource = "options.clientConfig.region";
      else if (regionSources[1])
        regionSource = "caller client's region";
      else if (regionSources[2])
        regionSource = "file or env region";
      let requestHandlerSources = [
        filterRequestHandler(options.clientConfig?.requestHandler),
        filterRequestHandler(callerClientConfig?.requestHandler)
      ], requestHandlerSource = "STS default requestHandler";
      if (requestHandlerSources[0])
        requestHandlerSource = "options.clientConfig.requestHandler";
      else if (requestHandlerSources[1])
        requestHandlerSource = "caller client's requestHandler";
      logger5?.debug?.(`@aws-sdk/credential-providers - fromTemporaryCredentials STS client init with ${regionSource}=${await import_core38.normalizeProvider(coalesce(regionSources))()}, ${credentialSource}, ${requestHandlerSource}.`), stsClient = new STSClient4({
        userAgentAppId: callerClientConfig?.userAgentAppId,
        ...options.clientConfig,
        credentials: coalesce(credentialSources),
        logger: logger5,
        profile: profile5,
        region: coalesce(regionSources),
        requestHandler: coalesce(requestHandlerSources)
      });
    }
    if (options.clientPlugins)
      for (let plugin of options.clientPlugins)
        stsClient.middlewareStack.use(plugin);
    let { Credentials } = await stsClient.send(new AssumeRoleCommand4(params));
    if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey)
      throw new import_property_provider32.CredentialsProviderError(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`, {
        logger: logger5
      });
    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration,
      credentialScope: Credentials.CredentialScope
    };
  };
}, filterRequestHandler = (requestHandler) => {
  return requestHandler?.metadata?.handlerProtocol === "h2" ? void 0 : requestHandler;
}, coalesce = (args) => {
  for (let item of args)
    if (item !== void 0)
      return item;
};

// node_modules/@aws-sdk/credential-providers/dist-es/fromTemporaryCredentials.js
var import_config_resolver7, import_node_config_provider6, fromTemporaryCredentials2 = (options) => {
  return fromTemporaryCredentials(options, fromNodeProviderChain, async ({ profile: profile5 = process.env.AWS_PROFILE }) => import_node_config_provider6.loadConfig({
    environmentVariableSelector: (env4) => env4.AWS_REGION,
    configFileSelector: (profileData) => {
      return profileData.region;
    },
    default: () => {
      return;
    }
  }, { ...import_config_resolver7.NODE_REGION_CONFIG_FILE_OPTIONS, profile: profile5 })());
};

// node_modules/@aws-sdk/credential-providers/dist-es/fromTokenFile.js

// node_modules/@aws-sdk/credential-providers/dist-es/fromWebToken.js

// node_modules/@aws-sdk/credential-providers/dist-es/index.js
__export(exports_dist_es16, {
  propertyProviderChain: () => propertyProviderChain,
  fromWebToken: () => fromWebToken3,
  fromTokenFile: () => fromTokenFile3,
  fromTemporaryCredentials: () => fromTemporaryCredentials2,
  fromSSO: () => fromSSO3,
  fromProcess: () => fromProcess3,
  fromNodeProviderChain: () => fromNodeProviderChain,
  fromLoginCredentials: () => fromLoginCredentials3,
  fromInstanceMetadata: () => fromInstanceMetadata3,
  fromIni: () => fromIni3,
  fromHttp: () => fromHttp,
  fromEnv: () => fromEnv3,
  fromContainerMetadata: () => fromContainerMetadata3,
  fromCognitoIdentityPool: () => fromCognitoIdentityPool3,
  fromCognitoIdentity: () => fromCognitoIdentity3,
  createCredentialChain: () => createCredentialChain
});

