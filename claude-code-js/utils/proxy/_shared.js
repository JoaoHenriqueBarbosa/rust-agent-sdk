// Shared module state and imports
// Original: src/utils/proxy.ts
var import_https_proxy_agent, keepAliveDisabled = !1, getProxyAgent, proxyInterceptorId;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/client.js
var import_middleware_stack3;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/collect-stream-body.js
var import_protocols4;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/abort.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/auth/auth.js
var HttpAuthLocation2;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/auth/HttpApiKeyAuth.js
var HttpApiKeyAuthLocation2;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/auth/HttpAuthScheme.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/auth/HttpAuthSchemeProvider.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/auth/HttpSigner.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/auth/IdentityProviderConfig.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/auth/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/blob/blob-payload-input-types.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/checksum.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/client.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/command.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/connection/config.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/connection/manager.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/connection/pool.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/connection/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/crypto.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/encode.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme2;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/endpoints/EndpointRuleObject.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/endpoints/ErrorRuleObject.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/endpoints/RuleSetObject.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/endpoints/shared.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/endpoints/TreeRuleObject.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/endpoints/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/eventStream.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId2;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/extensions/defaultClientConfiguration.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/extensions/defaultExtensionConfiguration.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/feature-ids.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/http.js
var FieldPosition2;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/http/httpHandlerInitialization.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/identity/apiKeyIdentity.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/identity/awsCredentialIdentity.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/identity/identity.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/identity/tokenIdentity.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/identity/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/logger.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/middleware.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/profile.js
var IniSectionType2;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/response.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/retry.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/schema/schema.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/schema/traits.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/schema/schema-deprecated.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/schema/sentinels.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/schema/static-schemas.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/serde.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/shapes.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/signature.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/stream.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-common-types.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-input-types.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-output-types.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/transfer.js
var RequestHandlerProtocol2;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/transform/client-payload-blob-type-narrow.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/transform/mutable.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/transform/no-undefined.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/transform/type-transform.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/uri.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/util.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/waiter.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/types/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/schemaLogFilter.js
var import_schema2, SENSITIVE_STRING3 = "***SensitiveInformation***";

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/command.js

var import_middleware_stack4;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/constants.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/exceptions.js
var ServiceException2, decorateServiceException2 = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v]) => v !== void 0).forEach(([k, v]) => {
    if (exception[k] == null || exception[k] === "")
      exception[k] = v;
  });
  let message = exception.message || exception.Message || "UnknownError";
  return exception.message = message, delete exception.Message, exception;
};

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/default-error-handler.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/defaults-mode.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/extended-encode-uri-component.js
var import_protocols5;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js
var knownAlgorithms2, getChecksumConfiguration2 = (runtimeConfig) => {
  let checksumAlgorithms = [];
  for (let id in AlgorithmId2) {
    let algorithmId = AlgorithmId2[id];
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
      if (knownAlgorithms2.includes(id))
        runtimeConfig.checksumAlgorithms[id.toUpperCase()] = ctor;
      else
        runtimeConfig.checksumAlgorithms[id] = ctor;
      checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return checksumAlgorithms;
    }
  };
}, resolveChecksumRuntimeConfig2 = (clientConfig) => {
  let runtimeConfig = {};
  return clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    let id = checksumAlgorithm.algorithmId();
    if (knownAlgorithms2.includes(id))
      runtimeConfig[id] = checksumAlgorithm.checksumConstructor();
  }), runtimeConfig;
};

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/extensions/retry.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/get-array-if-single-item.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/is-serializable-header-value.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/object-mapping.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/resolve-path.js
var import_protocols6;

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/ser-utils.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/serde-json.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/index.js
__export(exports_dist_es10, {
  withBaseException: () => withBaseException2,
  throwDefaultError: () => throwDefaultError2,
  take: () => take2,
  serializeFloat: () => serializeFloat2,
  serializeDateTime: () => serializeDateTime2,
  resolvedPath: () => import_protocols6.resolvedPath,
  resolveDefaultRuntimeConfig: () => resolveDefaultRuntimeConfig2,
  map: () => map3,
  loadConfigsForDefaultMode: () => loadConfigsForDefaultMode2,
  isSerializableHeaderValue: () => isSerializableHeaderValue2,
  getValueFromTextNode: () => getValueFromTextNode2,
  getDefaultExtensionConfiguration: () => getDefaultExtensionConfiguration2,
  getDefaultClientConfiguration: () => getDefaultClientConfiguration2,
  getArrayIfSingleItem: () => getArrayIfSingleItem2,
  extendedEncodeURIComponent: () => import_protocols5.extendedEncodeURIComponent,
  emitWarningIfUnsupportedVersion: () => emitWarningIfUnsupportedVersion3,
  decorateServiceException: () => decorateServiceException2,
  createAggregatedClient: () => createAggregatedClient2,
  convertMap: () => convertMap2,
  collectBody: () => import_protocols4.collectBody,
  _json: () => _json2,
  ServiceException: () => ServiceException2,
  SENSITIVE_STRING: () => SENSITIVE_STRING4,
  NoOpLogger: () => NoOpLogger3,
  Command: () => Command2,
  Client: () => Client2
});

// node_modules/@aws-sdk/client-bedrock/dist-es/auth/httpAuthSchemeProvider.js
var import_httpAuthSchemes, import_core8, import_util_middleware, defaultBedrockHttpAuthSchemeParametersProvider = async (config4, context, input) => {
  return {
    operation: import_util_middleware.getSmithyContext(context).operation,
    region: await import_util_middleware.normalizeProvider(config4.region)() || (() => {
      throw Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
}, defaultBedrockHttpAuthSchemeProvider = (authParameters) => {
  let options = [];
  switch (authParameters.operation) {
    default:
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters)), options.push(createSmithyApiHttpBearerAuthHttpAuthOption(authParameters));
  }
  return options;
}, resolveHttpAuthSchemeConfig = (config4) => {
  let token = import_core8.memoizeIdentityProvider(config4.token, import_core8.isIdentityExpired, import_core8.doesIdentityRequireRefresh), config_0 = import_httpAuthSchemes.resolveAwsSdkSigV4Config(config4);
  return Object.assign(config_0, {
    authSchemePreference: import_util_middleware.normalizeProvider(config4.authSchemePreference ?? []),
    token
  });
};

// node_modules/@aws-sdk/client-bedrock/dist-es/endpoint/EndpointParameters.js

// node_modules/@aws-sdk/client-bedrock/package.json
var package_default;

// node_modules/@aws-sdk/token-providers/dist-es/fromEnvSigningName.js
var import_client16, import_httpAuthSchemes2, import_property_provider24, fromEnvSigningName2 = ({ logger: logger3, signingName } = {}) => async () => {
  if (logger3?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !signingName)
    throw new import_property_provider24.TokenProviderError("Please pass 'signingName' to compute environment variable key", { logger: logger3 });
  let bearerTokenKey = import_httpAuthSchemes2.getBearerTokenEnvKey(signingName);
  if (!(bearerTokenKey in process.env))
    throw new import_property_provider24.TokenProviderError(`Token not present in '${bearerTokenKey}' environment variable`, { logger: logger3 });
  let token = { token: process.env[bearerTokenKey] };
  return import_client16.setTokenFeature(token, "BEARER_SERVICE_ENV_VARS", "3"), token;
};

// node_modules/@aws-sdk/token-providers/dist-es/constants.js

// node_modules/@aws-sdk/token-providers/dist-es/getNewSsoOidcToken.js

// node_modules/@aws-sdk/token-providers/dist-es/validateTokenExpiry.js
var import_property_provider25, validateTokenExpiry2 = (token) => {
  if (token.expiration && token.expiration.getTime() < Date.now())
    throw new import_property_provider25.TokenProviderError(`Token is expired. ${REFRESH_MESSAGE2}`, !1);
};

// node_modules/@aws-sdk/token-providers/dist-es/validateTokenKey.js
var import_property_provider26, validateTokenKey2 = (key, value, forRefresh = !1) => {
  if (typeof value > "u")
    throw new import_property_provider26.TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${REFRESH_MESSAGE2}`, !1);
};

// node_modules/@aws-sdk/token-providers/dist-es/writeSSOTokenToFile.js
import { promises as fsPromises2 } from "fs";
var import_shared_ini_file_loader13, writeFile3, writeSSOTokenToFile2 = (id, ssoToken) => {
  let tokenFilepath = import_shared_ini_file_loader13.getSSOTokenFilepath(id), tokenString = JSON.stringify(ssoToken, null, 2);
  return writeFile3(tokenFilepath, tokenString);
};

// node_modules/@aws-sdk/token-providers/dist-es/fromSso.js
var import_property_provider27, import_shared_ini_file_loader14, lastRefreshAttemptTime2, fromSso3 = (init = {}) => async ({ callerClientConfig } = {}) => {
  init.logger?.debug("@aws-sdk/token-providers - fromSso");
  let profiles = await import_shared_ini_file_loader14.parseKnownFiles(init), profileName = import_shared_ini_file_loader14.getProfileName({
    profile: init.profile ?? callerClientConfig?.profile
  }), profile3 = profiles[profileName];
  if (!profile3)
    throw new import_property_provider27.TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, !1);
  else if (!profile3.sso_session)
    throw new import_property_provider27.TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
  let ssoSessionName = profile3.sso_session, ssoSession = (await import_shared_ini_file_loader14.loadSsoSessionData(init))[ssoSessionName];
  if (!ssoSession)
    throw new import_property_provider27.TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, !1);
  for (let ssoSessionRequiredKey of ["sso_start_url", "sso_region"])
    if (!ssoSession[ssoSessionRequiredKey])
      throw new import_property_provider27.TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, !1);
  let { sso_start_url: ssoStartUrl, sso_region: ssoRegion } = ssoSession, ssoToken;
  try {
    ssoToken = await import_shared_ini_file_loader14.getSSOTokenFromFile(ssoSessionName);
  } catch (e) {
    throw new import_property_provider27.TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${REFRESH_MESSAGE2}`, !1);
  }
  validateTokenKey2("accessToken", ssoToken.accessToken), validateTokenKey2("expiresAt", ssoToken.expiresAt);
  let { accessToken, expiresAt } = ssoToken, existingToken = { token: accessToken, expiration: new Date(expiresAt) };
  if (existingToken.expiration.getTime() - Date.now() > EXPIRE_WINDOW_MS2)
    return existingToken;
  if (Date.now() - lastRefreshAttemptTime2.getTime() < 30000)
    return validateTokenExpiry2(existingToken), existingToken;
  validateTokenKey2("clientId", ssoToken.clientId, !0), validateTokenKey2("clientSecret", ssoToken.clientSecret, !0), validateTokenKey2("refreshToken", ssoToken.refreshToken, !0);
  try {
    lastRefreshAttemptTime2.setTime(Date.now());
    let newSsoOidcToken = await getNewSsoOidcToken2(ssoToken, ssoRegion, init, callerClientConfig);
    validateTokenKey2("accessToken", newSsoOidcToken.accessToken), validateTokenKey2("expiresIn", newSsoOidcToken.expiresIn);
    let newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1000);
    try {
      await writeSSOTokenToFile2(ssoSessionName, {
        ...ssoToken,
        accessToken: newSsoOidcToken.accessToken,
        expiresAt: newTokenExpiration.toISOString(),
        refreshToken: newSsoOidcToken.refreshToken
      });
    } catch (error41) {}
    return {
      token: newSsoOidcToken.accessToken,
      expiration: newTokenExpiration
    };
  } catch (error41) {
    return validateTokenExpiry2(existingToken), existingToken;
  }
};

// node_modules/@aws-sdk/token-providers/dist-es/fromStatic.js

// node_modules/@aws-sdk/token-providers/dist-es/nodeProvider.js
var import_property_provider28, nodeProvider2 = (init = {}) => import_property_provider28.memoize(import_property_provider28.chain(fromSso3(init), async () => {
  throw new import_property_provider28.TokenProviderError("Could not load token from any providers", !1);
}), (token) => token.expiration !== void 0 && token.expiration.getTime() - Date.now() < 300000, (token) => token.expiration !== void 0);

// node_modules/@aws-sdk/token-providers/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/util-base64/dist-es/fromBase64.js
var BASE64_REGEX, fromBase64 = (input) => {
  if (input.length * 3 % 4 !== 0)
    throw TypeError("Incorrect padding on base64 string.");
  if (!BASE64_REGEX.exec(input))
    throw TypeError("Invalid base64 string.");
  let buffer = fromString(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/util-base64/dist-es/toBase64.js
var import_util_utf8, toBase64 = (_input) => {
  let input;
  if (typeof _input === "string")
    input = import_util_utf8.fromUtf8(_input);
  else
    input = _input;
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number")
    throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
};

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/util-base64/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock/dist-es/endpoint/ruleset.js
var h2, i2, j2, k, l, m, n2, o2, p, q, r, _data, ruleSet;

// node_modules/@aws-sdk/client-bedrock/dist-es/endpoint/endpointResolver.js
var import_util_endpoints, import_util_endpoints2, cache, defaultEndpointResolver = (endpointParams, context = {}) => {
  return cache.get(endpointParams, () => import_util_endpoints2.resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  }));
};

// node_modules/@aws-sdk/client-bedrock/dist-es/models/BedrockServiceException.js
var BedrockServiceException;

// node_modules/@aws-sdk/client-bedrock/dist-es/models/errors.js
var AccessDeniedException, InternalServerException, ResourceNotFoundException, ThrottlingException, ValidationException, ConflictException, ServiceQuotaExceededException, TooManyTagsException, ResourceInUseException, ServiceUnavailableException;

// node_modules/@aws-sdk/client-bedrock/dist-es/schemas/schemas_0.js
var import_schema3, _s_registry, BedrockServiceException$, n0_registry, AccessDeniedException$, ConflictException$, InternalServerException$, ResourceInUseException$, ResourceNotFoundException$, ServiceQuotaExceededException$, ServiceUnavailableException$, ThrottlingException$, TooManyTagsException$, ValidationException$, errorTypeRegistries, AutomatedReasoningLogicStatementContent, AutomatedReasoningNaturalLanguageStatementContent, AutomatedReasoningPolicyAnnotationFeedbackNaturalLanguage, AutomatedReasoningPolicyAnnotationIngestContent, AutomatedReasoningPolicyAnnotationRuleNaturalLanguage, AutomatedReasoningPolicyBuildDocumentBlob, AutomatedReasoningPolicyBuildDocumentDescription, AutomatedReasoningPolicyBuildDocumentName, AutomatedReasoningPolicyBuildResultAssetName, AutomatedReasoningPolicyDefinitionRuleAlternateExpression, AutomatedReasoningPolicyDefinitionRuleExpression, AutomatedReasoningPolicyDefinitionTypeDescription, AutomatedReasoningPolicyDefinitionTypeName, AutomatedReasoningPolicyDefinitionTypeValueDescription, AutomatedReasoningPolicyDefinitionVariableDescription, AutomatedReasoningPolicyDefinitionVariableName, AutomatedReasoningPolicyDescription, AutomatedReasoningPolicyJustificationText, AutomatedReasoningPolicyLineText, AutomatedReasoningPolicyName, AutomatedReasoningPolicyScenarioAlternateExpression, AutomatedReasoningPolicyScenarioExpression, AutomatedReasoningPolicyStatementText, AutomatedReasoningPolicyTestGuardContent, AutomatedReasoningPolicyTestQueryContent, ByteContentBlob, EvaluationDatasetName, EvaluationJobDescription, EvaluationJobIdentifier, EvaluationMetricDescription, EvaluationMetricName, EvaluationModelInferenceParams, GuardrailBlockedMessaging, GuardrailContentFilterAction, GuardrailContentFiltersTierName, GuardrailContextualGroundingAction, GuardrailDescription, GuardrailFailureRecommendation, GuardrailModality, GuardrailName, GuardrailStatusReason, GuardrailTopicAction, GuardrailTopicDefinition, GuardrailTopicExample, GuardrailTopicName, GuardrailTopicsTierName, GuardrailWordAction, HumanTaskInstructions, Identifier, InferenceProfileDescription, Message, MetricName, PromptRouterDescription, TextPromptTemplate, AccountEnforcedGuardrailInferenceInputConfiguration$, AccountEnforcedGuardrailOutputConfiguration$, AgreementAvailability$, AutomatedEvaluationConfig$, AutomatedEvaluationCustomMetricConfig$, AutomatedReasoningCheckImpossibleFinding$, AutomatedReasoningCheckInputTextReference$, AutomatedReasoningCheckInvalidFinding$, AutomatedReasoningCheckLogicWarning$, AutomatedReasoningCheckNoTranslationsFinding$, AutomatedReasoningCheckRule$, AutomatedReasoningCheckSatisfiableFinding$, AutomatedReasoningCheckScenario$, AutomatedReasoningCheckTooComplexFinding$, AutomatedReasoningCheckTranslation$, AutomatedReasoningCheckTranslationAmbiguousFinding$, AutomatedReasoningCheckTranslationOption$, AutomatedReasoningCheckValidFinding$, AutomatedReasoningLogicStatement$, AutomatedReasoningPolicyAddRuleAnnotation$, AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation$, AutomatedReasoningPolicyAddRuleMutation$, AutomatedReasoningPolicyAddTypeAnnotation$, AutomatedReasoningPolicyAddTypeMutation$, AutomatedReasoningPolicyAddTypeValue$, AutomatedReasoningPolicyAddVariableAnnotation$, AutomatedReasoningPolicyAddVariableMutation$, AutomatedReasoningPolicyAnnotatedChunk$, AutomatedReasoningPolicyAnnotatedLine$, AutomatedReasoningPolicyAtomicStatement$, AutomatedReasoningPolicyBuildLog$, AutomatedReasoningPolicyBuildLogEntry$, AutomatedReasoningPolicyBuildResultAssetManifest$, AutomatedReasoningPolicyBuildResultAssetManifestEntry$, AutomatedReasoningPolicyBuildStep$, AutomatedReasoningPolicyBuildStepMessage$, AutomatedReasoningPolicyBuildWorkflowDocument$, AutomatedReasoningPolicyBuildWorkflowRepairContent$, AutomatedReasoningPolicyBuildWorkflowSource$, AutomatedReasoningPolicyBuildWorkflowSummary$, AutomatedReasoningPolicyDefinition$, AutomatedReasoningPolicyDefinitionQualityReport$, AutomatedReasoningPolicyDefinitionRule$, AutomatedReasoningPolicyDefinitionType$, AutomatedReasoningPolicyDefinitionTypeValue$, AutomatedReasoningPolicyDefinitionTypeValuePair$, AutomatedReasoningPolicyDefinitionVariable$, AutomatedReasoningPolicyDeleteRuleAnnotation$, AutomatedReasoningPolicyDeleteRuleMutation$, AutomatedReasoningPolicyDeleteTypeAnnotation$, AutomatedReasoningPolicyDeleteTypeMutation$, AutomatedReasoningPolicyDeleteTypeValue$, AutomatedReasoningPolicyDeleteVariableAnnotation$, AutomatedReasoningPolicyDeleteVariableMutation$, AutomatedReasoningPolicyDisjointRuleSet$, AutomatedReasoningPolicyFidelityReport$, AutomatedReasoningPolicyGeneratedTestCase$, AutomatedReasoningPolicyGeneratedTestCases$, AutomatedReasoningPolicyIngestContentAnnotation$, AutomatedReasoningPolicyPlanning$, AutomatedReasoningPolicyReportSourceDocument$, AutomatedReasoningPolicyRuleReport$, AutomatedReasoningPolicyScenario$, AutomatedReasoningPolicyScenarios$, AutomatedReasoningPolicySourceDocument$, AutomatedReasoningPolicyStatementLocation$, AutomatedReasoningPolicyStatementReference$, AutomatedReasoningPolicySummary$, AutomatedReasoningPolicyTestCase$, AutomatedReasoningPolicyTestResult$, AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation$, AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation$, AutomatedReasoningPolicyUpdateRuleAnnotation$, AutomatedReasoningPolicyUpdateRuleMutation$, AutomatedReasoningPolicyUpdateTypeAnnotation$, AutomatedReasoningPolicyUpdateTypeMutation$, AutomatedReasoningPolicyUpdateTypeValue$, AutomatedReasoningPolicyUpdateVariableAnnotation$, AutomatedReasoningPolicyUpdateVariableMutation$, AutomatedReasoningPolicyVariableReport$, BatchDeleteEvaluationJobError$, BatchDeleteEvaluationJobItem$, BatchDeleteEvaluationJobRequest$, BatchDeleteEvaluationJobResponse$, BedrockEvaluatorModel$, ByteContentDoc$, CancelAutomatedReasoningPolicyBuildWorkflowRequest$, CancelAutomatedReasoningPolicyBuildWorkflowResponse$, CloudWatchConfig$, CreateAutomatedReasoningPolicyRequest$, CreateAutomatedReasoningPolicyResponse$, CreateAutomatedReasoningPolicyTestCaseRequest$, CreateAutomatedReasoningPolicyTestCaseResponse$, CreateAutomatedReasoningPolicyVersionRequest$, CreateAutomatedReasoningPolicyVersionResponse$, CreateCustomModelDeploymentRequest$, CreateCustomModelDeploymentResponse$, CreateCustomModelRequest$, CreateCustomModelResponse$, CreateEvaluationJobRequest$, CreateEvaluationJobResponse$, CreateFoundationModelAgreementRequest$, CreateFoundationModelAgreementResponse$, CreateGuardrailRequest$, CreateGuardrailResponse$, CreateGuardrailVersionRequest$, CreateGuardrailVersionResponse$, CreateInferenceProfileRequest$, CreateInferenceProfileResponse$, CreateMarketplaceModelEndpointRequest$, CreateMarketplaceModelEndpointResponse$, CreateModelCopyJobRequest$, CreateModelCopyJobResponse$, CreateModelCustomizationJobRequest$, CreateModelCustomizationJobResponse$, CreateModelImportJobRequest$, CreateModelImportJobResponse$, CreateModelInvocationJobRequest$, CreateModelInvocationJobResponse$, CreatePromptRouterRequest$, CreatePromptRouterResponse$, CreateProvisionedModelThroughputRequest$, CreateProvisionedModelThroughputResponse$, CustomMetricBedrockEvaluatorModel$, CustomMetricDefinition$, CustomMetricEvaluatorModelConfig$, CustomModelDeploymentSummary$, CustomModelDeploymentUpdateDetails$, CustomModelSummary$, CustomModelUnits$, DataProcessingDetails$, DeleteAutomatedReasoningPolicyBuildWorkflowRequest$, DeleteAutomatedReasoningPolicyBuildWorkflowResponse$, DeleteAutomatedReasoningPolicyRequest$, DeleteAutomatedReasoningPolicyResponse$, DeleteAutomatedReasoningPolicyTestCaseRequest$, DeleteAutomatedReasoningPolicyTestCaseResponse$, DeleteCustomModelDeploymentRequest$, DeleteCustomModelDeploymentResponse$, DeleteCustomModelRequest$, DeleteCustomModelResponse$, DeleteEnforcedGuardrailConfigurationRequest$, DeleteEnforcedGuardrailConfigurationResponse$, DeleteFoundationModelAgreementRequest$, DeleteFoundationModelAgreementResponse$, DeleteGuardrailRequest$, DeleteGuardrailResponse$, DeleteImportedModelRequest$, DeleteImportedModelResponse$, DeleteInferenceProfileRequest$, DeleteInferenceProfileResponse$, DeleteMarketplaceModelEndpointRequest$, DeleteMarketplaceModelEndpointResponse$, DeleteModelInvocationLoggingConfigurationRequest$, DeleteModelInvocationLoggingConfigurationResponse$, DeletePromptRouterRequest$, DeletePromptRouterResponse$, DeleteProvisionedModelThroughputRequest$, DeleteProvisionedModelThroughputResponse$, DeleteResourcePolicyRequest$, DeleteResourcePolicyResponse$, DeregisterMarketplaceModelEndpointRequest$, DeregisterMarketplaceModelEndpointResponse$, DimensionalPriceRate$, DistillationConfig$, EvaluationBedrockModel$, EvaluationDataset$, EvaluationDatasetMetricConfig$, EvaluationInferenceConfigSummary$, EvaluationModelConfigSummary$, EvaluationOutputDataConfig$, EvaluationPrecomputedInferenceSource$, EvaluationPrecomputedRetrieveAndGenerateSourceConfig$, EvaluationPrecomputedRetrieveSourceConfig$, EvaluationRagConfigSummary$, EvaluationSummary$, ExportAutomatedReasoningPolicyVersionRequest$, ExportAutomatedReasoningPolicyVersionResponse$, ExternalSource$, ExternalSourcesGenerationConfiguration$, ExternalSourcesRetrieveAndGenerateConfiguration$, FieldForReranking$, FilterAttribute$, FoundationModelDetails$, FoundationModelLifecycle$, FoundationModelSummary$, GenerationConfiguration$, GetAutomatedReasoningPolicyAnnotationsRequest$, GetAutomatedReasoningPolicyAnnotationsResponse$, GetAutomatedReasoningPolicyBuildWorkflowRequest$, GetAutomatedReasoningPolicyBuildWorkflowResponse$, GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest$, GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse$, GetAutomatedReasoningPolicyNextScenarioRequest$, GetAutomatedReasoningPolicyNextScenarioResponse$, GetAutomatedReasoningPolicyRequest$, GetAutomatedReasoningPolicyResponse$, GetAutomatedReasoningPolicyTestCaseRequest$, GetAutomatedReasoningPolicyTestCaseResponse$, GetAutomatedReasoningPolicyTestResultRequest$, GetAutomatedReasoningPolicyTestResultResponse$, GetCustomModelDeploymentRequest$, GetCustomModelDeploymentResponse$, GetCustomModelRequest$, GetCustomModelResponse$, GetEvaluationJobRequest$, GetEvaluationJobResponse$, GetFoundationModelAvailabilityRequest$, GetFoundationModelAvailabilityResponse$, GetFoundationModelRequest$, GetFoundationModelResponse$, GetGuardrailRequest$, GetGuardrailResponse$, GetImportedModelRequest$, GetImportedModelResponse$, GetInferenceProfileRequest$, GetInferenceProfileResponse$, GetMarketplaceModelEndpointRequest$, GetMarketplaceModelEndpointResponse$, GetModelCopyJobRequest$, GetModelCopyJobResponse$, GetModelCustomizationJobRequest$, GetModelCustomizationJobResponse$, GetModelImportJobRequest$, GetModelImportJobResponse$, GetModelInvocationJobRequest$, GetModelInvocationJobResponse$, GetModelInvocationLoggingConfigurationRequest$, GetModelInvocationLoggingConfigurationResponse$, GetPromptRouterRequest$, GetPromptRouterResponse$, GetProvisionedModelThroughputRequest$, GetProvisionedModelThroughputResponse$, GetResourcePolicyRequest$, GetResourcePolicyResponse$, GetUseCaseForModelAccessRequest$, GetUseCaseForModelAccessResponse$, GuardrailAutomatedReasoningPolicy$, GuardrailAutomatedReasoningPolicyConfig$, GuardrailConfiguration$, GuardrailContentFilter$, GuardrailContentFilterConfig$, GuardrailContentFiltersTier$, GuardrailContentFiltersTierConfig$, GuardrailContentPolicy$, GuardrailContentPolicyConfig$, GuardrailContextualGroundingFilter$, GuardrailContextualGroundingFilterConfig$, GuardrailContextualGroundingPolicy$, GuardrailContextualGroundingPolicyConfig$, GuardrailCrossRegionConfig$, GuardrailCrossRegionDetails$, GuardrailManagedWords$, GuardrailManagedWordsConfig$, GuardrailPiiEntity$, GuardrailPiiEntityConfig$, GuardrailRegex$, GuardrailRegexConfig$, GuardrailSensitiveInformationPolicy$, GuardrailSensitiveInformationPolicyConfig$, GuardrailSummary$, GuardrailTopic$, GuardrailTopicConfig$, GuardrailTopicPolicy$, GuardrailTopicPolicyConfig$, GuardrailTopicsTier$, GuardrailTopicsTierConfig$, GuardrailWord$, GuardrailWordConfig$, GuardrailWordPolicy$, GuardrailWordPolicyConfig$, HumanEvaluationConfig$, HumanEvaluationCustomMetric$, HumanWorkflowConfig$, ImplicitFilterConfiguration$, ImportedModelSummary$, InferenceProfileModel$, InferenceProfileSummary$, InvocationLogsConfig$, KbInferenceConfig$, KnowledgeBaseRetrievalConfiguration$, KnowledgeBaseRetrieveAndGenerateConfiguration$, KnowledgeBaseVectorSearchConfiguration$, LambdaGraderConfig$, LegalTerm$, ListAutomatedReasoningPoliciesRequest$, ListAutomatedReasoningPoliciesResponse$, ListAutomatedReasoningPolicyBuildWorkflowsRequest$, ListAutomatedReasoningPolicyBuildWorkflowsResponse$, ListAutomatedReasoningPolicyTestCasesRequest$, ListAutomatedReasoningPolicyTestCasesResponse$, ListAutomatedReasoningPolicyTestResultsRequest$, ListAutomatedReasoningPolicyTestResultsResponse$, ListCustomModelDeploymentsRequest$, ListCustomModelDeploymentsResponse$, ListCustomModelsRequest$, ListCustomModelsResponse$, ListEnforcedGuardrailsConfigurationRequest$, ListEnforcedGuardrailsConfigurationResponse$, ListEvaluationJobsRequest$, ListEvaluationJobsResponse$, ListFoundationModelAgreementOffersRequest$, ListFoundationModelAgreementOffersResponse$, ListFoundationModelsRequest$, ListFoundationModelsResponse$, ListGuardrailsRequest$, ListGuardrailsResponse$, ListImportedModelsRequest$, ListImportedModelsResponse$, ListInferenceProfilesRequest$, ListInferenceProfilesResponse$, ListMarketplaceModelEndpointsRequest$, ListMarketplaceModelEndpointsResponse$, ListModelCopyJobsRequest$, ListModelCopyJobsResponse$, ListModelCustomizationJobsRequest$, ListModelCustomizationJobsResponse$, ListModelImportJobsRequest$, ListModelImportJobsResponse$, ListModelInvocationJobsRequest$, ListModelInvocationJobsResponse$, ListPromptRoutersRequest$, ListPromptRoutersResponse$, ListProvisionedModelThroughputsRequest$, ListProvisionedModelThroughputsResponse$, ListTagsForResourceRequest$, ListTagsForResourceResponse$, LoggingConfig$, MarketplaceModelEndpoint$, MarketplaceModelEndpointSummary$, MetadataAttributeSchema$, MetadataConfigurationForReranking$, ModelCopyJobSummary$, ModelCustomizationJobSummary$, ModelEnforcement$, ModelImportJobSummary$, ModelInvocationJobS3InputDataConfig$, ModelInvocationJobS3OutputDataConfig$, ModelInvocationJobSummary$, Offer$, OrchestrationConfiguration$, OutputDataConfig$, PerformanceConfiguration$, PricingTerm$, PromptRouterSummary$, PromptRouterTargetModel$, PromptTemplate$, ProvisionedModelSummary$, PutEnforcedGuardrailConfigurationRequest$, PutEnforcedGuardrailConfigurationResponse$, PutModelInvocationLoggingConfigurationRequest$, PutModelInvocationLoggingConfigurationResponse$, PutResourcePolicyRequest$, PutResourcePolicyResponse$, PutUseCaseForModelAccessRequest$, PutUseCaseForModelAccessResponse$, QueryTransformationConfiguration$, RatingScaleItem$, RegisterMarketplaceModelEndpointRequest$, RegisterMarketplaceModelEndpointResponse$, RequestMetadataBaseFilters$, RetrieveAndGenerateConfiguration$, RetrieveConfig$, RFTConfig$, RFTHyperParameters$, RoutingCriteria$, S3Config$, S3DataSource$, S3ObjectDoc$, SageMakerEndpoint$, SelectiveContentGuarding$, StartAutomatedReasoningPolicyBuildWorkflowRequest$, StartAutomatedReasoningPolicyBuildWorkflowResponse$, StartAutomatedReasoningPolicyTestWorkflowRequest$, StartAutomatedReasoningPolicyTestWorkflowResponse$, StatusDetails$, StopEvaluationJobRequest$, StopEvaluationJobResponse$, StopModelCustomizationJobRequest$, StopModelCustomizationJobResponse$, StopModelInvocationJobRequest$, StopModelInvocationJobResponse$, SupportTerm$, Tag$, TagResourceRequest$, TagResourceResponse$, TeacherModelConfig$, TermDetails$, TextInferenceConfig$, TrainingDataConfig$, TrainingDetails$, TrainingMetrics$, UntagResourceRequest$, UntagResourceResponse$, UpdateAutomatedReasoningPolicyAnnotationsRequest$, UpdateAutomatedReasoningPolicyAnnotationsResponse$, UpdateAutomatedReasoningPolicyRequest$, UpdateAutomatedReasoningPolicyResponse$, UpdateAutomatedReasoningPolicyTestCaseRequest$, UpdateAutomatedReasoningPolicyTestCaseResponse$, UpdateCustomModelDeploymentRequest$, UpdateCustomModelDeploymentResponse$, UpdateGuardrailRequest$, UpdateGuardrailResponse$, UpdateMarketplaceModelEndpointRequest$, UpdateMarketplaceModelEndpointResponse$, UpdateProvisionedModelThroughputRequest$, UpdateProvisionedModelThroughputResponse$, ValidationDataConfig$, ValidationDetails$, Validator$, ValidatorMetric$, ValidityTerm$, VectorSearchBedrockRerankingConfiguration$, VectorSearchBedrockRerankingModelConfiguration$, VectorSearchRerankingConfiguration$, VpcConfig$, AccountEnforcedGuardrailsOutputConfiguration, AutomatedEvaluationCustomMetrics, AutomatedReasoningCheckDifferenceScenarioList, AutomatedReasoningCheckFindingList, AutomatedReasoningCheckInputTextReferenceList, AutomatedReasoningCheckRuleList, AutomatedReasoningCheckTranslationList, AutomatedReasoningCheckTranslationOptionList, AutomatedReasoningLogicStatementList, AutomatedReasoningPolicyAnnotatedChunkList, AutomatedReasoningPolicyAnnotatedContentList, AutomatedReasoningPolicyAnnotationList, AutomatedReasoningPolicyAtomicStatementList, AutomatedReasoningPolicyBuildLogEntryList, AutomatedReasoningPolicyBuildResultAssetManifestList, AutomatedReasoningPolicyBuildStepList, AutomatedReasoningPolicyBuildStepMessageList, AutomatedReasoningPolicyBuildWorkflowDocumentList, AutomatedReasoningPolicyBuildWorkflowSummaries, AutomatedReasoningPolicyDefinitionRuleList, AutomatedReasoningPolicyDefinitionTypeList, AutomatedReasoningPolicyDefinitionTypeNameList, AutomatedReasoningPolicyDefinitionTypeValueList, AutomatedReasoningPolicyDefinitionTypeValuePairList, AutomatedReasoningPolicyDefinitionVariableList, AutomatedReasoningPolicyDefinitionVariableNameList, AutomatedReasoningPolicyDisjointRuleSetList, AutomatedReasoningPolicyGeneratedTestCaseList, AutomatedReasoningPolicyGenerateFidelityReportDocumentList, AutomatedReasoningPolicyJustificationList, AutomatedReasoningPolicyReportSourceDocumentList, AutomatedReasoningPolicyScenarioList, AutomatedReasoningPolicyStatementReferenceList, AutomatedReasoningPolicySummaries, AutomatedReasoningPolicyTestCaseList, AutomatedReasoningPolicyTestList, AutomatedReasoningPolicyTypeValueAnnotationList, BatchDeleteEvaluationJobErrors, BatchDeleteEvaluationJobItems, BedrockEvaluatorModels, CustomMetricBedrockEvaluatorModels, CustomModelDeploymentSummaryList, CustomModelSummaryList, EvaluationDatasetMetricConfigs, EvaluationJobIdentifiers, EvaluationMetricNames, EvaluationModelConfigs, EvaluationSummaries, ExternalSources, FieldsForReranking, FoundationModelSummaryList, GuardrailContentFilters, GuardrailContentFiltersConfig, GuardrailContextualGroundingFilters, GuardrailContextualGroundingFiltersConfig, GuardrailFailureRecommendations, GuardrailManagedWordLists, GuardrailManagedWordListsConfig, GuardrailModalities, GuardrailPiiEntities, GuardrailPiiEntitiesConfig, GuardrailRegexes, GuardrailRegexesConfig, GuardrailStatusReasons, GuardrailSummaries, GuardrailTopicExamples, GuardrailTopics, GuardrailTopicsConfig, GuardrailWords, GuardrailWordsConfig, HumanEvaluationCustomMetrics, ImportedModelSummaryList, InferenceProfileModels, InferenceProfileSummaries, MarketplaceModelEndpointSummaries, MetadataAttributeSchemaList, ModelCopyJobSummaries, ModelCustomizationJobSummaries, ModelImportJobSummaries, ModelInvocationJobSummaries, Offers, PromptRouterSummaries, PromptRouterTargetModels, ProvisionedModelSummaries, RagConfigs, RateCard, RatingScale, RequestMetadataFiltersList, RetrievalFilterList, TagList, ValidationMetrics, Validators, AutomatedReasoningPolicyRuleReportMap, AutomatedReasoningPolicyVariableReportMap, RequestMetadataMap, AutomatedEvaluationCustomMetricSource$, AutomatedReasoningCheckFinding$, AutomatedReasoningPolicyAnnotatedContent$, AutomatedReasoningPolicyAnnotation$, AutomatedReasoningPolicyBuildResultAssets$, AutomatedReasoningPolicyBuildStepContext$, AutomatedReasoningPolicyDefinitionElement$, AutomatedReasoningPolicyGenerateFidelityReportContent$, AutomatedReasoningPolicyMutation$, AutomatedReasoningPolicyTypeValueAnnotation$, AutomatedReasoningPolicyWorkflowTypeContent$, CustomizationConfig$, EndpointConfig$, EvaluationConfig$, EvaluationDatasetLocation$, EvaluationInferenceConfig$, EvaluationModelConfig$, EvaluationPrecomputedRagSourceConfig$, EvaluatorModelConfig$, GraderConfig$, InferenceProfileModelSource$, InvocationLogSource$, KnowledgeBaseConfig$, ModelDataSource$, ModelInvocationJobInputDataConfig$, ModelInvocationJobOutputDataConfig$, RAGConfig$, RatingScaleItemValue$, RequestMetadataFilters$, RerankingMetadataSelectiveModeConfiguration$, RetrievalFilter$, BatchDeleteEvaluationJob$, CancelAutomatedReasoningPolicyBuildWorkflow$, CreateAutomatedReasoningPolicy$, CreateAutomatedReasoningPolicyTestCase$, CreateAutomatedReasoningPolicyVersion$, CreateCustomModel$, CreateCustomModelDeployment$, CreateEvaluationJob$, CreateFoundationModelAgreement$, CreateGuardrail$, CreateGuardrailVersion$, CreateInferenceProfile$, CreateMarketplaceModelEndpoint$, CreateModelCopyJob$, CreateModelCustomizationJob$, CreateModelImportJob$, CreateModelInvocationJob$, CreatePromptRouter$, CreateProvisionedModelThroughput$, DeleteAutomatedReasoningPolicy$, DeleteAutomatedReasoningPolicyBuildWorkflow$, DeleteAutomatedReasoningPolicyTestCase$, DeleteCustomModel$, DeleteCustomModelDeployment$, DeleteEnforcedGuardrailConfiguration$, DeleteFoundationModelAgreement$, DeleteGuardrail$, DeleteImportedModel$, DeleteInferenceProfile$, DeleteMarketplaceModelEndpoint$, DeleteModelInvocationLoggingConfiguration$, DeletePromptRouter$, DeleteProvisionedModelThroughput$, DeleteResourcePolicy$, DeregisterMarketplaceModelEndpoint$, ExportAutomatedReasoningPolicyVersion$, GetAutomatedReasoningPolicy$, GetAutomatedReasoningPolicyAnnotations$, GetAutomatedReasoningPolicyBuildWorkflow$, GetAutomatedReasoningPolicyBuildWorkflowResultAssets$, GetAutomatedReasoningPolicyNextScenario$, GetAutomatedReasoningPolicyTestCase$, GetAutomatedReasoningPolicyTestResult$, GetCustomModel$, GetCustomModelDeployment$, GetEvaluationJob$, GetFoundationModel$, GetFoundationModelAvailability$, GetGuardrail$, GetImportedModel$, GetInferenceProfile$, GetMarketplaceModelEndpoint$, GetModelCopyJob$, GetModelCustomizationJob$, GetModelImportJob$, GetModelInvocationJob$, GetModelInvocationLoggingConfiguration$, GetPromptRouter$, GetProvisionedModelThroughput$, GetResourcePolicy$, GetUseCaseForModelAccess$, ListAutomatedReasoningPolicies$, ListAutomatedReasoningPolicyBuildWorkflows$, ListAutomatedReasoningPolicyTestCases$, ListAutomatedReasoningPolicyTestResults$, ListCustomModelDeployments$, ListCustomModels$, ListEnforcedGuardrailsConfiguration$, ListEvaluationJobs$, ListFoundationModelAgreementOffers$, ListFoundationModels$, ListGuardrails$, ListImportedModels$, ListInferenceProfiles$, ListMarketplaceModelEndpoints$, ListModelCopyJobs$, ListModelCustomizationJobs$, ListModelImportJobs$, ListModelInvocationJobs$, ListPromptRouters$, ListProvisionedModelThroughputs$, ListTagsForResource$, PutEnforcedGuardrailConfiguration$, PutModelInvocationLoggingConfiguration$, PutResourcePolicy$, PutUseCaseForModelAccess$, RegisterMarketplaceModelEndpoint$, StartAutomatedReasoningPolicyBuildWorkflow$, StartAutomatedReasoningPolicyTestWorkflow$, StopEvaluationJob$, StopModelCustomizationJob$, StopModelInvocationJob$, TagResource$, UntagResource$, UpdateAutomatedReasoningPolicy$, UpdateAutomatedReasoningPolicyAnnotations$, UpdateAutomatedReasoningPolicyTestCase$, UpdateCustomModelDeployment$, UpdateGuardrail$, UpdateMarketplaceModelEndpoint$, UpdateProvisionedModelThroughput$;

// node_modules/@aws-sdk/client-bedrock/dist-es/runtimeConfig.shared.js
var import_httpAuthSchemes3, import_protocols7, import_core9, import_url_parser2, import_util_utf82, getRuntimeConfig = (config4) => {
  return {
    apiVersion: "2023-04-20",
    base64Decoder: config4?.base64Decoder ?? fromBase64,
    base64Encoder: config4?.base64Encoder ?? toBase64,
    disableHostPrefix: config4?.disableHostPrefix ?? !1,
    endpointProvider: config4?.endpointProvider ?? defaultEndpointResolver,
    extensions: config4?.extensions ?? [],
    httpAuthSchemeProvider: config4?.httpAuthSchemeProvider ?? defaultBedrockHttpAuthSchemeProvider,
    httpAuthSchemes: config4?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new import_httpAuthSchemes3.AwsSdkSigV4Signer
      },
      {
        schemeId: "smithy.api#httpBearerAuth",
        identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#httpBearerAuth"),
        signer: new import_core9.HttpBearerAuthSigner
      }
    ],
    logger: config4?.logger ?? new NoOpLogger3,
    protocol: config4?.protocol ?? import_protocols7.AwsRestJsonProtocol,
    protocolSettings: config4?.protocolSettings ?? {
      defaultNamespace: "com.amazonaws.bedrock",
      errorTypeRegistries,
      version: "2023-04-20",
      serviceTarget: "AmazonBedrockControlPlaneService"
    },
    serviceId: config4?.serviceId ?? "Bedrock",
    urlParser: config4?.urlParser ?? import_url_parser2.parseUrl,
    utf8Decoder: config4?.utf8Decoder ?? import_util_utf82.fromUtf8,
    utf8Encoder: config4?.utf8Encoder ?? import_util_utf82.toUtf8
  };
};

// node_modules/@aws-sdk/client-bedrock/dist-es/runtimeConfig.js
var import_client17, import_httpAuthSchemes4, import_util_user_agent_node, import_config_resolver, import_core10, import_hash_node, import_middleware_retry, import_node_config_provider3, import_node_http_handler2, import_util_body_length_node, import_util_defaults_mode_node, import_util_retry, getRuntimeConfig2 = (config4) => {
  emitWarningIfUnsupportedVersion3(process.version);
  let defaultsMode = import_util_defaults_mode_node.resolveDefaultsModeConfig(config4), defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode2), clientSharedValues = getRuntimeConfig(config4);
  import_client17.emitWarningIfUnsupportedVersion(process.version);
  let loaderConfig = {
    profile: config4?.profile,
    logger: clientSharedValues.logger,
    signingName: "bedrock"
  };
  return {
    ...clientSharedValues,
    ...config4,
    runtime: "node",
    defaultsMode,
    authSchemePreference: config4?.authSchemePreference ?? import_node_config_provider3.loadConfig(import_httpAuthSchemes4.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
    bodyLengthChecker: config4?.bodyLengthChecker ?? import_util_body_length_node.calculateBodyLength,
    credentialDefaultProvider: config4?.credentialDefaultProvider ?? defaultProvider,
    defaultUserAgentProvider: config4?.defaultUserAgentProvider ?? import_util_user_agent_node.createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
    httpAuthSchemes: config4?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new import_httpAuthSchemes4.AwsSdkSigV4Signer
      },
      {
        schemeId: "smithy.api#httpBearerAuth",
        identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#httpBearerAuth") || (async (idProps) => {
          try {
            return await fromEnvSigningName2({ signingName: "bedrock" })();
          } catch (error41) {
            return await nodeProvider2(idProps)(idProps);
          }
        }),
        signer: new import_core10.HttpBearerAuthSigner
      }
    ],
    maxAttempts: config4?.maxAttempts ?? import_node_config_provider3.loadConfig(import_middleware_retry.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config4),
    region: config4?.region ?? import_node_config_provider3.loadConfig(import_config_resolver.NODE_REGION_CONFIG_OPTIONS, { ...import_config_resolver.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
    requestHandler: import_node_http_handler2.NodeHttpHandler.create(config4?.requestHandler ?? defaultConfigProvider),
    retryMode: config4?.retryMode ?? import_node_config_provider3.loadConfig({
      ...import_middleware_retry.NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || import_util_retry.DEFAULT_RETRY_MODE
    }, config4),
    sha256: config4?.sha256 ?? import_hash_node.Hash.bind(null, "sha256"),
    streamCollector: config4?.streamCollector ?? import_node_http_handler2.streamCollector,
    useDualstackEndpoint: config4?.useDualstackEndpoint ?? import_node_config_provider3.loadConfig(import_config_resolver.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    useFipsEndpoint: config4?.useFipsEndpoint ?? import_node_config_provider3.loadConfig(import_config_resolver.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    userAgentAppId: config4?.userAgentAppId ?? import_node_config_provider3.loadConfig(import_util_user_agent_node.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
  };
};

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/protocol-http/dist-es/extensions/httpExtensionConfiguration.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/protocol-http/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/protocol-http/dist-es/Field.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/protocol-http/dist-es/httpHandler.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/protocol-http/dist-es/types.js

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/protocol-http/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock/dist-es/auth/httpAuthExtensionConfiguration.js

// node_modules/@aws-sdk/client-bedrock/dist-es/runtimeExtensions.js
var import_region_config_resolver, resolveRuntimeExtensions = (runtimeConfig, extensions8) => {
  let extensionConfiguration = Object.assign(import_region_config_resolver.getAwsRegionExtensionConfiguration(runtimeConfig), getDefaultExtensionConfiguration2(runtimeConfig), getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
  return extensions8.forEach((extension) => extension.configure(extensionConfiguration)), Object.assign(runtimeConfig, import_region_config_resolver.resolveAwsRegionExtensionConfiguration(extensionConfiguration), resolveDefaultRuntimeConfig2(extensionConfiguration), resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

// node_modules/@aws-sdk/client-bedrock/dist-es/BedrockClient.js
var import_middleware_host_header, import_middleware_logger, import_middleware_recursion_detection, import_middleware_user_agent, import_config_resolver2, import_core11, import_schema4, import_middleware_content_length, import_middleware_endpoint, import_middleware_retry2, BedrockClient;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/BatchDeleteEvaluationJobCommand.js
var import_middleware_endpoint2, BatchDeleteEvaluationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CancelAutomatedReasoningPolicyBuildWorkflowCommand.js
var import_middleware_endpoint3, CancelAutomatedReasoningPolicyBuildWorkflowCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateAutomatedReasoningPolicyCommand.js
var import_middleware_endpoint4, CreateAutomatedReasoningPolicyCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateAutomatedReasoningPolicyTestCaseCommand.js
var import_middleware_endpoint5, CreateAutomatedReasoningPolicyTestCaseCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateAutomatedReasoningPolicyVersionCommand.js
var import_middleware_endpoint6, CreateAutomatedReasoningPolicyVersionCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateCustomModelCommand.js
var import_middleware_endpoint7, CreateCustomModelCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateCustomModelDeploymentCommand.js
var import_middleware_endpoint8, CreateCustomModelDeploymentCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateEvaluationJobCommand.js
var import_middleware_endpoint9, CreateEvaluationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateFoundationModelAgreementCommand.js
var import_middleware_endpoint10, CreateFoundationModelAgreementCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateGuardrailCommand.js
var import_middleware_endpoint11, CreateGuardrailCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateGuardrailVersionCommand.js
var import_middleware_endpoint12, CreateGuardrailVersionCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateInferenceProfileCommand.js
var import_middleware_endpoint13, CreateInferenceProfileCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateMarketplaceModelEndpointCommand.js
var import_middleware_endpoint14, CreateMarketplaceModelEndpointCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateModelCopyJobCommand.js
var import_middleware_endpoint15, CreateModelCopyJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateModelCustomizationJobCommand.js
var import_middleware_endpoint16, CreateModelCustomizationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateModelImportJobCommand.js
var import_middleware_endpoint17, CreateModelImportJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateModelInvocationJobCommand.js
var import_middleware_endpoint18, CreateModelInvocationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreatePromptRouterCommand.js
var import_middleware_endpoint19, CreatePromptRouterCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/CreateProvisionedModelThroughputCommand.js
var import_middleware_endpoint20, CreateProvisionedModelThroughputCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteAutomatedReasoningPolicyBuildWorkflowCommand.js
var import_middleware_endpoint21, DeleteAutomatedReasoningPolicyBuildWorkflowCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteAutomatedReasoningPolicyCommand.js
var import_middleware_endpoint22, DeleteAutomatedReasoningPolicyCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteAutomatedReasoningPolicyTestCaseCommand.js
var import_middleware_endpoint23, DeleteAutomatedReasoningPolicyTestCaseCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteCustomModelCommand.js
var import_middleware_endpoint24, DeleteCustomModelCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteCustomModelDeploymentCommand.js
var import_middleware_endpoint25, DeleteCustomModelDeploymentCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteEnforcedGuardrailConfigurationCommand.js
var import_middleware_endpoint26, DeleteEnforcedGuardrailConfigurationCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteFoundationModelAgreementCommand.js
var import_middleware_endpoint27, DeleteFoundationModelAgreementCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteGuardrailCommand.js
var import_middleware_endpoint28, DeleteGuardrailCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteImportedModelCommand.js
var import_middleware_endpoint29, DeleteImportedModelCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteInferenceProfileCommand.js
var import_middleware_endpoint30, DeleteInferenceProfileCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteMarketplaceModelEndpointCommand.js
var import_middleware_endpoint31, DeleteMarketplaceModelEndpointCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteModelInvocationLoggingConfigurationCommand.js
var import_middleware_endpoint32, DeleteModelInvocationLoggingConfigurationCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeletePromptRouterCommand.js
var import_middleware_endpoint33, DeletePromptRouterCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteProvisionedModelThroughputCommand.js
var import_middleware_endpoint34, DeleteProvisionedModelThroughputCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeleteResourcePolicyCommand.js
var import_middleware_endpoint35, DeleteResourcePolicyCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/DeregisterMarketplaceModelEndpointCommand.js
var import_middleware_endpoint36, DeregisterMarketplaceModelEndpointCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ExportAutomatedReasoningPolicyVersionCommand.js
var import_middleware_endpoint37, ExportAutomatedReasoningPolicyVersionCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetAutomatedReasoningPolicyAnnotationsCommand.js
var import_middleware_endpoint38, GetAutomatedReasoningPolicyAnnotationsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetAutomatedReasoningPolicyBuildWorkflowCommand.js
var import_middleware_endpoint39, GetAutomatedReasoningPolicyBuildWorkflowCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand.js
var import_middleware_endpoint40, GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetAutomatedReasoningPolicyCommand.js
var import_middleware_endpoint41, GetAutomatedReasoningPolicyCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetAutomatedReasoningPolicyNextScenarioCommand.js
var import_middleware_endpoint42, GetAutomatedReasoningPolicyNextScenarioCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetAutomatedReasoningPolicyTestCaseCommand.js
var import_middleware_endpoint43, GetAutomatedReasoningPolicyTestCaseCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetAutomatedReasoningPolicyTestResultCommand.js
var import_middleware_endpoint44, GetAutomatedReasoningPolicyTestResultCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetCustomModelCommand.js
var import_middleware_endpoint45, GetCustomModelCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetCustomModelDeploymentCommand.js
var import_middleware_endpoint46, GetCustomModelDeploymentCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetEvaluationJobCommand.js
var import_middleware_endpoint47, GetEvaluationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetFoundationModelAvailabilityCommand.js
var import_middleware_endpoint48, GetFoundationModelAvailabilityCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetFoundationModelCommand.js
var import_middleware_endpoint49, GetFoundationModelCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetGuardrailCommand.js
var import_middleware_endpoint50, GetGuardrailCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetImportedModelCommand.js
var import_middleware_endpoint51, GetImportedModelCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetInferenceProfileCommand.js
var import_middleware_endpoint52, GetInferenceProfileCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetMarketplaceModelEndpointCommand.js
var import_middleware_endpoint53, GetMarketplaceModelEndpointCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetModelCopyJobCommand.js
var import_middleware_endpoint54, GetModelCopyJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetModelCustomizationJobCommand.js
var import_middleware_endpoint55, GetModelCustomizationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetModelImportJobCommand.js
var import_middleware_endpoint56, GetModelImportJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetModelInvocationJobCommand.js
var import_middleware_endpoint57, GetModelInvocationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetModelInvocationLoggingConfigurationCommand.js
var import_middleware_endpoint58, GetModelInvocationLoggingConfigurationCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetPromptRouterCommand.js
var import_middleware_endpoint59, GetPromptRouterCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetProvisionedModelThroughputCommand.js
var import_middleware_endpoint60, GetProvisionedModelThroughputCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetResourcePolicyCommand.js
var import_middleware_endpoint61, GetResourcePolicyCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/GetUseCaseForModelAccessCommand.js
var import_middleware_endpoint62, GetUseCaseForModelAccessCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListAutomatedReasoningPoliciesCommand.js
var import_middleware_endpoint63, ListAutomatedReasoningPoliciesCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListAutomatedReasoningPolicyBuildWorkflowsCommand.js
var import_middleware_endpoint64, ListAutomatedReasoningPolicyBuildWorkflowsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListAutomatedReasoningPolicyTestCasesCommand.js
var import_middleware_endpoint65, ListAutomatedReasoningPolicyTestCasesCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListAutomatedReasoningPolicyTestResultsCommand.js
var import_middleware_endpoint66, ListAutomatedReasoningPolicyTestResultsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListCustomModelDeploymentsCommand.js
var import_middleware_endpoint67, ListCustomModelDeploymentsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListCustomModelsCommand.js
var import_middleware_endpoint68, ListCustomModelsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListEnforcedGuardrailsConfigurationCommand.js
var import_middleware_endpoint69, ListEnforcedGuardrailsConfigurationCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListEvaluationJobsCommand.js
var import_middleware_endpoint70, ListEvaluationJobsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListFoundationModelAgreementOffersCommand.js
var import_middleware_endpoint71, ListFoundationModelAgreementOffersCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListFoundationModelsCommand.js
var import_middleware_endpoint72, ListFoundationModelsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListGuardrailsCommand.js
var import_middleware_endpoint73, ListGuardrailsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListImportedModelsCommand.js
var import_middleware_endpoint74, ListImportedModelsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListInferenceProfilesCommand.js
var import_middleware_endpoint75, ListInferenceProfilesCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListMarketplaceModelEndpointsCommand.js
var import_middleware_endpoint76, ListMarketplaceModelEndpointsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListModelCopyJobsCommand.js
var import_middleware_endpoint77, ListModelCopyJobsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListModelCustomizationJobsCommand.js
var import_middleware_endpoint78, ListModelCustomizationJobsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListModelImportJobsCommand.js
var import_middleware_endpoint79, ListModelImportJobsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListModelInvocationJobsCommand.js
var import_middleware_endpoint80, ListModelInvocationJobsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListPromptRoutersCommand.js
var import_middleware_endpoint81, ListPromptRoutersCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListProvisionedModelThroughputsCommand.js
var import_middleware_endpoint82, ListProvisionedModelThroughputsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/ListTagsForResourceCommand.js
var import_middleware_endpoint83, ListTagsForResourceCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/PutEnforcedGuardrailConfigurationCommand.js
var import_middleware_endpoint84, PutEnforcedGuardrailConfigurationCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/PutModelInvocationLoggingConfigurationCommand.js
var import_middleware_endpoint85, PutModelInvocationLoggingConfigurationCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/PutResourcePolicyCommand.js
var import_middleware_endpoint86, PutResourcePolicyCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/PutUseCaseForModelAccessCommand.js
var import_middleware_endpoint87, PutUseCaseForModelAccessCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/RegisterMarketplaceModelEndpointCommand.js
var import_middleware_endpoint88, RegisterMarketplaceModelEndpointCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/StartAutomatedReasoningPolicyBuildWorkflowCommand.js
var import_middleware_endpoint89, StartAutomatedReasoningPolicyBuildWorkflowCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/StartAutomatedReasoningPolicyTestWorkflowCommand.js
var import_middleware_endpoint90, StartAutomatedReasoningPolicyTestWorkflowCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/StopEvaluationJobCommand.js
var import_middleware_endpoint91, StopEvaluationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/StopModelCustomizationJobCommand.js
var import_middleware_endpoint92, StopModelCustomizationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/StopModelInvocationJobCommand.js
var import_middleware_endpoint93, StopModelInvocationJobCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/TagResourceCommand.js
var import_middleware_endpoint94, TagResourceCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/UntagResourceCommand.js
var import_middleware_endpoint95, UntagResourceCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/UpdateAutomatedReasoningPolicyAnnotationsCommand.js
var import_middleware_endpoint96, UpdateAutomatedReasoningPolicyAnnotationsCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/UpdateAutomatedReasoningPolicyCommand.js
var import_middleware_endpoint97, UpdateAutomatedReasoningPolicyCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/UpdateAutomatedReasoningPolicyTestCaseCommand.js
var import_middleware_endpoint98, UpdateAutomatedReasoningPolicyTestCaseCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/UpdateCustomModelDeploymentCommand.js
var import_middleware_endpoint99, UpdateCustomModelDeploymentCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/UpdateGuardrailCommand.js
var import_middleware_endpoint100, UpdateGuardrailCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/UpdateMarketplaceModelEndpointCommand.js
var import_middleware_endpoint101, UpdateMarketplaceModelEndpointCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/UpdateProvisionedModelThroughputCommand.js
var import_middleware_endpoint102, UpdateProvisionedModelThroughputCommand;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListAutomatedReasoningPoliciesPaginator.js
var import_core12, paginateListAutomatedReasoningPolicies;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListAutomatedReasoningPolicyBuildWorkflowsPaginator.js
var import_core13, paginateListAutomatedReasoningPolicyBuildWorkflows;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListAutomatedReasoningPolicyTestCasesPaginator.js
var import_core14, paginateListAutomatedReasoningPolicyTestCases;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListAutomatedReasoningPolicyTestResultsPaginator.js
var import_core15, paginateListAutomatedReasoningPolicyTestResults;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListCustomModelDeploymentsPaginator.js
var import_core16, paginateListCustomModelDeployments;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListCustomModelsPaginator.js
var import_core17, paginateListCustomModels;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListEnforcedGuardrailsConfigurationPaginator.js
var import_core18, paginateListEnforcedGuardrailsConfiguration;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListEvaluationJobsPaginator.js
var import_core19, paginateListEvaluationJobs;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListGuardrailsPaginator.js
var import_core20, paginateListGuardrails;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListImportedModelsPaginator.js
var import_core21, paginateListImportedModels;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListInferenceProfilesPaginator.js
var import_core22, paginateListInferenceProfiles;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListMarketplaceModelEndpointsPaginator.js
var import_core23, paginateListMarketplaceModelEndpoints;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListModelCopyJobsPaginator.js
var import_core24, paginateListModelCopyJobs;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListModelCustomizationJobsPaginator.js
var import_core25, paginateListModelCustomizationJobs;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListModelImportJobsPaginator.js
var import_core26, paginateListModelImportJobs;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListModelInvocationJobsPaginator.js
var import_core27, paginateListModelInvocationJobs;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListPromptRoutersPaginator.js
var import_core28, paginateListPromptRouters;

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/ListProvisionedModelThroughputsPaginator.js
var import_core29, paginateListProvisionedModelThroughputs;

// node_modules/@aws-sdk/client-bedrock/dist-es/Bedrock.js
var commands, paginators, Bedrock;

// node_modules/@aws-sdk/client-bedrock/dist-es/commands/index.js

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/Interfaces.js

// node_modules/@aws-sdk/client-bedrock/dist-es/pagination/index.js

// node_modules/@aws-sdk/client-bedrock/dist-es/models/enums.js
var SelectiveGuardingMode, InputTags, ConfigurationOwner, AgreementStatus, AutomatedReasoningCheckResult, AutomatedReasoningPolicyBuildWorkflowType, AutomatedReasoningPolicyBuildDocumentContentType, AutomatedReasoningPolicyBuildWorkflowStatus, AutomatedReasoningPolicyBuildResultAssetType, AutomatedReasoningPolicyBuildMessageType, AutomatedReasoningPolicyAnnotationStatus, AutomatedReasoningCheckLogicWarningType, AutomatedReasoningPolicyTestRunResult, AutomatedReasoningPolicyTestRunStatus, Status, CustomModelDeploymentStatus, CustomModelDeploymentUpdateStatus, SortModelsBy, SortOrder, ReasoningEffort, CustomizationType, ModelStatus, EvaluationJobStatus, ApplicationType, EvaluationTaskType, PerformanceConfigLatency, ExternalSourceType, QueryTransformationType, AttributeType, SearchType, RerankingMetadataSelectionMode, VectorSearchRerankingConfigurationType, RetrieveAndGenerateType, EvaluationJobType, SortJobsBy, GuardrailContentFilterAction2, GuardrailModality2, GuardrailFilterStrength, GuardrailContentFilterType, GuardrailContentFiltersTierName2, GuardrailContextualGroundingAction2, GuardrailContextualGroundingFilterType, GuardrailSensitiveInformationAction, GuardrailPiiEntityType, GuardrailTopicsTierName2, GuardrailTopicAction2, GuardrailTopicType, GuardrailWordAction2, GuardrailManagedWordsType, GuardrailStatus, InferenceProfileStatus, InferenceProfileType, ModelCopyJobStatus, ModelImportJobStatus, S3InputFormat, ModelInvocationType, ModelInvocationJobStatus, ModelCustomization, InferenceType, ModelModality, FoundationModelLifecycleStatus, PromptRouterStatus, PromptRouterType, CommitmentDuration, ProvisionedModelStatus, SortByProvisionedModels, AuthorizationStatus, EntitlementAvailability, RegionAvailability, OfferType, ModelCustomizationJobStatus, JobStatusDetails, FineTuningJobStatus;

// node_modules/@aws-sdk/client-bedrock/dist-es/models/models_0.js

// node_modules/@aws-sdk/client-bedrock/dist-es/models/models_1.js

// node_modules/@aws-sdk/client-bedrock/dist-es/index.js
__export(exports_dist_es11, {
  paginateListProvisionedModelThroughputs: () => paginateListProvisionedModelThroughputs,
  paginateListPromptRouters: () => paginateListPromptRouters,
  paginateListModelInvocationJobs: () => paginateListModelInvocationJobs,
  paginateListModelImportJobs: () => paginateListModelImportJobs,
  paginateListModelCustomizationJobs: () => paginateListModelCustomizationJobs,
  paginateListModelCopyJobs: () => paginateListModelCopyJobs,
  paginateListMarketplaceModelEndpoints: () => paginateListMarketplaceModelEndpoints,
  paginateListInferenceProfiles: () => paginateListInferenceProfiles,
  paginateListImportedModels: () => paginateListImportedModels,
  paginateListGuardrails: () => paginateListGuardrails,
  paginateListEvaluationJobs: () => paginateListEvaluationJobs,
  paginateListEnforcedGuardrailsConfiguration: () => paginateListEnforcedGuardrailsConfiguration,
  paginateListCustomModels: () => paginateListCustomModels,
  paginateListCustomModelDeployments: () => paginateListCustomModelDeployments,
  paginateListAutomatedReasoningPolicyTestResults: () => paginateListAutomatedReasoningPolicyTestResults,
  paginateListAutomatedReasoningPolicyTestCases: () => paginateListAutomatedReasoningPolicyTestCases,
  paginateListAutomatedReasoningPolicyBuildWorkflows: () => paginateListAutomatedReasoningPolicyBuildWorkflows,
  paginateListAutomatedReasoningPolicies: () => paginateListAutomatedReasoningPolicies,
  errorTypeRegistries: () => errorTypeRegistries,
  __Client: () => Client2,
  VpcConfig$: () => VpcConfig$,
  VectorSearchRerankingConfigurationType: () => VectorSearchRerankingConfigurationType,
  VectorSearchRerankingConfiguration$: () => VectorSearchRerankingConfiguration$,
  VectorSearchBedrockRerankingModelConfiguration$: () => VectorSearchBedrockRerankingModelConfiguration$,
  VectorSearchBedrockRerankingConfiguration$: () => VectorSearchBedrockRerankingConfiguration$,
  ValidityTerm$: () => ValidityTerm$,
  ValidatorMetric$: () => ValidatorMetric$,
  Validator$: () => Validator$,
  ValidationException$: () => ValidationException$,
  ValidationException: () => ValidationException,
  ValidationDetails$: () => ValidationDetails$,
  ValidationDataConfig$: () => ValidationDataConfig$,
  UpdateProvisionedModelThroughputResponse$: () => UpdateProvisionedModelThroughputResponse$,
  UpdateProvisionedModelThroughputRequest$: () => UpdateProvisionedModelThroughputRequest$,
  UpdateProvisionedModelThroughputCommand: () => UpdateProvisionedModelThroughputCommand,
  UpdateProvisionedModelThroughput$: () => UpdateProvisionedModelThroughput$,
  UpdateMarketplaceModelEndpointResponse$: () => UpdateMarketplaceModelEndpointResponse$,
  UpdateMarketplaceModelEndpointRequest$: () => UpdateMarketplaceModelEndpointRequest$,
  UpdateMarketplaceModelEndpointCommand: () => UpdateMarketplaceModelEndpointCommand,
  UpdateMarketplaceModelEndpoint$: () => UpdateMarketplaceModelEndpoint$,
  UpdateGuardrailResponse$: () => UpdateGuardrailResponse$,
  UpdateGuardrailRequest$: () => UpdateGuardrailRequest$,
  UpdateGuardrailCommand: () => UpdateGuardrailCommand,
  UpdateGuardrail$: () => UpdateGuardrail$,
  UpdateCustomModelDeploymentResponse$: () => UpdateCustomModelDeploymentResponse$,
  UpdateCustomModelDeploymentRequest$: () => UpdateCustomModelDeploymentRequest$,
  UpdateCustomModelDeploymentCommand: () => UpdateCustomModelDeploymentCommand,
  UpdateCustomModelDeployment$: () => UpdateCustomModelDeployment$,
  UpdateAutomatedReasoningPolicyTestCaseResponse$: () => UpdateAutomatedReasoningPolicyTestCaseResponse$,
  UpdateAutomatedReasoningPolicyTestCaseRequest$: () => UpdateAutomatedReasoningPolicyTestCaseRequest$,
  UpdateAutomatedReasoningPolicyTestCaseCommand: () => UpdateAutomatedReasoningPolicyTestCaseCommand,
  UpdateAutomatedReasoningPolicyTestCase$: () => UpdateAutomatedReasoningPolicyTestCase$,
  UpdateAutomatedReasoningPolicyResponse$: () => UpdateAutomatedReasoningPolicyResponse$,
  UpdateAutomatedReasoningPolicyRequest$: () => UpdateAutomatedReasoningPolicyRequest$,
  UpdateAutomatedReasoningPolicyCommand: () => UpdateAutomatedReasoningPolicyCommand,
  UpdateAutomatedReasoningPolicyAnnotationsResponse$: () => UpdateAutomatedReasoningPolicyAnnotationsResponse$,
  UpdateAutomatedReasoningPolicyAnnotationsRequest$: () => UpdateAutomatedReasoningPolicyAnnotationsRequest$,
  UpdateAutomatedReasoningPolicyAnnotationsCommand: () => UpdateAutomatedReasoningPolicyAnnotationsCommand,
  UpdateAutomatedReasoningPolicyAnnotations$: () => UpdateAutomatedReasoningPolicyAnnotations$,
  UpdateAutomatedReasoningPolicy$: () => UpdateAutomatedReasoningPolicy$,
  UntagResourceResponse$: () => UntagResourceResponse$,
  UntagResourceRequest$: () => UntagResourceRequest$,
  UntagResourceCommand: () => UntagResourceCommand,
  UntagResource$: () => UntagResource$,
  TrainingMetrics$: () => TrainingMetrics$,
  TrainingDetails$: () => TrainingDetails$,
  TrainingDataConfig$: () => TrainingDataConfig$,
  TooManyTagsException$: () => TooManyTagsException$,
  TooManyTagsException: () => TooManyTagsException,
  ThrottlingException$: () => ThrottlingException$,
  ThrottlingException: () => ThrottlingException,
  TextInferenceConfig$: () => TextInferenceConfig$,
  TermDetails$: () => TermDetails$,
  TeacherModelConfig$: () => TeacherModelConfig$,
  TagResourceResponse$: () => TagResourceResponse$,
  TagResourceRequest$: () => TagResourceRequest$,
  TagResourceCommand: () => TagResourceCommand,
  TagResource$: () => TagResource$,
  Tag$: () => Tag$,
  SupportTerm$: () => SupportTerm$,
  StopModelInvocationJobResponse$: () => StopModelInvocationJobResponse$,
  StopModelInvocationJobRequest$: () => StopModelInvocationJobRequest$,
  StopModelInvocationJobCommand: () => StopModelInvocationJobCommand,
  StopModelInvocationJob$: () => StopModelInvocationJob$,
  StopModelCustomizationJobResponse$: () => StopModelCustomizationJobResponse$,
  StopModelCustomizationJobRequest$: () => StopModelCustomizationJobRequest$,
  StopModelCustomizationJobCommand: () => StopModelCustomizationJobCommand,
  StopModelCustomizationJob$: () => StopModelCustomizationJob$,
  StopEvaluationJobResponse$: () => StopEvaluationJobResponse$,
  StopEvaluationJobRequest$: () => StopEvaluationJobRequest$,
  StopEvaluationJobCommand: () => StopEvaluationJobCommand,
  StopEvaluationJob$: () => StopEvaluationJob$,
  StatusDetails$: () => StatusDetails$,
  Status: () => Status,
  StartAutomatedReasoningPolicyTestWorkflowResponse$: () => StartAutomatedReasoningPolicyTestWorkflowResponse$,
  StartAutomatedReasoningPolicyTestWorkflowRequest$: () => StartAutomatedReasoningPolicyTestWorkflowRequest$,
  StartAutomatedReasoningPolicyTestWorkflowCommand: () => StartAutomatedReasoningPolicyTestWorkflowCommand,
  StartAutomatedReasoningPolicyTestWorkflow$: () => StartAutomatedReasoningPolicyTestWorkflow$,
  StartAutomatedReasoningPolicyBuildWorkflowResponse$: () => StartAutomatedReasoningPolicyBuildWorkflowResponse$,
  StartAutomatedReasoningPolicyBuildWorkflowRequest$: () => StartAutomatedReasoningPolicyBuildWorkflowRequest$,
  StartAutomatedReasoningPolicyBuildWorkflowCommand: () => StartAutomatedReasoningPolicyBuildWorkflowCommand,
  StartAutomatedReasoningPolicyBuildWorkflow$: () => StartAutomatedReasoningPolicyBuildWorkflow$,
  SortOrder: () => SortOrder,
  SortModelsBy: () => SortModelsBy,
  SortJobsBy: () => SortJobsBy,
  SortByProvisionedModels: () => SortByProvisionedModels,
  ServiceUnavailableException$: () => ServiceUnavailableException$,
  ServiceUnavailableException: () => ServiceUnavailableException,
  ServiceQuotaExceededException$: () => ServiceQuotaExceededException$,
  ServiceQuotaExceededException: () => ServiceQuotaExceededException,
  SelectiveGuardingMode: () => SelectiveGuardingMode,
  SelectiveContentGuarding$: () => SelectiveContentGuarding$,
  SearchType: () => SearchType,
  SageMakerEndpoint$: () => SageMakerEndpoint$,
  S3ObjectDoc$: () => S3ObjectDoc$,
  S3InputFormat: () => S3InputFormat,
  S3DataSource$: () => S3DataSource$,
  S3Config$: () => S3Config$,
  RoutingCriteria$: () => RoutingCriteria$,
  RetrieveConfig$: () => RetrieveConfig$,
  RetrieveAndGenerateType: () => RetrieveAndGenerateType,
  RetrieveAndGenerateConfiguration$: () => RetrieveAndGenerateConfiguration$,
  RetrievalFilter$: () => RetrievalFilter$,
  ResourceNotFoundException$: () => ResourceNotFoundException$,
  ResourceNotFoundException: () => ResourceNotFoundException,
  ResourceInUseException$: () => ResourceInUseException$,
  ResourceInUseException: () => ResourceInUseException,
  RerankingMetadataSelectiveModeConfiguration$: () => RerankingMetadataSelectiveModeConfiguration$,
  RerankingMetadataSelectionMode: () => RerankingMetadataSelectionMode,
  RequestMetadataFilters$: () => RequestMetadataFilters$,
  RequestMetadataBaseFilters$: () => RequestMetadataBaseFilters$,
  RegisterMarketplaceModelEndpointResponse$: () => RegisterMarketplaceModelEndpointResponse$,
  RegisterMarketplaceModelEndpointRequest$: () => RegisterMarketplaceModelEndpointRequest$,
  RegisterMarketplaceModelEndpointCommand: () => RegisterMarketplaceModelEndpointCommand,
  RegisterMarketplaceModelEndpoint$: () => RegisterMarketplaceModelEndpoint$,
  RegionAvailability: () => RegionAvailability,
  ReasoningEffort: () => ReasoningEffort,
  RatingScaleItemValue$: () => RatingScaleItemValue$,
  RatingScaleItem$: () => RatingScaleItem$,
  RFTHyperParameters$: () => RFTHyperParameters$,
  RFTConfig$: () => RFTConfig$,
  RAGConfig$: () => RAGConfig$,
  QueryTransformationType: () => QueryTransformationType,
  QueryTransformationConfiguration$: () => QueryTransformationConfiguration$,
  PutUseCaseForModelAccessResponse$: () => PutUseCaseForModelAccessResponse$,
  PutUseCaseForModelAccessRequest$: () => PutUseCaseForModelAccessRequest$,
  PutUseCaseForModelAccessCommand: () => PutUseCaseForModelAccessCommand,
  PutUseCaseForModelAccess$: () => PutUseCaseForModelAccess$,
  PutResourcePolicyResponse$: () => PutResourcePolicyResponse$,
  PutResourcePolicyRequest$: () => PutResourcePolicyRequest$,
  PutResourcePolicyCommand: () => PutResourcePolicyCommand,
  PutResourcePolicy$: () => PutResourcePolicy$,
  PutModelInvocationLoggingConfigurationResponse$: () => PutModelInvocationLoggingConfigurationResponse$,
  PutModelInvocationLoggingConfigurationRequest$: () => PutModelInvocationLoggingConfigurationRequest$,
  PutModelInvocationLoggingConfigurationCommand: () => PutModelInvocationLoggingConfigurationCommand,
  PutModelInvocationLoggingConfiguration$: () => PutModelInvocationLoggingConfiguration$,
  PutEnforcedGuardrailConfigurationResponse$: () => PutEnforcedGuardrailConfigurationResponse$,
  PutEnforcedGuardrailConfigurationRequest$: () => PutEnforcedGuardrailConfigurationRequest$,
  PutEnforcedGuardrailConfigurationCommand: () => PutEnforcedGuardrailConfigurationCommand,
  PutEnforcedGuardrailConfiguration$: () => PutEnforcedGuardrailConfiguration$,
  ProvisionedModelSummary$: () => ProvisionedModelSummary$,
  ProvisionedModelStatus: () => ProvisionedModelStatus,
  PromptTemplate$: () => PromptTemplate$,
  PromptRouterType: () => PromptRouterType,
  PromptRouterTargetModel$: () => PromptRouterTargetModel$,
  PromptRouterSummary$: () => PromptRouterSummary$,
  PromptRouterStatus: () => PromptRouterStatus,
  PricingTerm$: () => PricingTerm$,
  PerformanceConfiguration$: () => PerformanceConfiguration$,
  PerformanceConfigLatency: () => PerformanceConfigLatency,
  OutputDataConfig$: () => OutputDataConfig$,
  OrchestrationConfiguration$: () => OrchestrationConfiguration$,
  OfferType: () => OfferType,
  Offer$: () => Offer$,
  ModelStatus: () => ModelStatus,
  ModelModality: () => ModelModality,
  ModelInvocationType: () => ModelInvocationType,
  ModelInvocationJobSummary$: () => ModelInvocationJobSummary$,
  ModelInvocationJobStatus: () => ModelInvocationJobStatus,
  ModelInvocationJobS3OutputDataConfig$: () => ModelInvocationJobS3OutputDataConfig$,
  ModelInvocationJobS3InputDataConfig$: () => ModelInvocationJobS3InputDataConfig$,
  ModelInvocationJobOutputDataConfig$: () => ModelInvocationJobOutputDataConfig$,
  ModelInvocationJobInputDataConfig$: () => ModelInvocationJobInputDataConfig$,
  ModelImportJobSummary$: () => ModelImportJobSummary$,
  ModelImportJobStatus: () => ModelImportJobStatus,
  ModelEnforcement$: () => ModelEnforcement$,
  ModelDataSource$: () => ModelDataSource$,
  ModelCustomizationJobSummary$: () => ModelCustomizationJobSummary$,
  ModelCustomizationJobStatus: () => ModelCustomizationJobStatus,
  ModelCustomization: () => ModelCustomization,
  ModelCopyJobSummary$: () => ModelCopyJobSummary$,
  ModelCopyJobStatus: () => ModelCopyJobStatus,
  MetadataConfigurationForReranking$: () => MetadataConfigurationForReranking$,
  MetadataAttributeSchema$: () => MetadataAttributeSchema$,
  MarketplaceModelEndpointSummary$: () => MarketplaceModelEndpointSummary$,
  MarketplaceModelEndpoint$: () => MarketplaceModelEndpoint$,
  LoggingConfig$: () => LoggingConfig$,
  ListTagsForResourceResponse$: () => ListTagsForResourceResponse$,
  ListTagsForResourceRequest$: () => ListTagsForResourceRequest$,
  ListTagsForResourceCommand: () => ListTagsForResourceCommand,
  ListTagsForResource$: () => ListTagsForResource$,
  ListProvisionedModelThroughputsResponse$: () => ListProvisionedModelThroughputsResponse$,
  ListProvisionedModelThroughputsRequest$: () => ListProvisionedModelThroughputsRequest$,
  ListProvisionedModelThroughputsCommand: () => ListProvisionedModelThroughputsCommand,
  ListProvisionedModelThroughputs$: () => ListProvisionedModelThroughputs$,
  ListPromptRoutersResponse$: () => ListPromptRoutersResponse$,
  ListPromptRoutersRequest$: () => ListPromptRoutersRequest$,
  ListPromptRoutersCommand: () => ListPromptRoutersCommand,
  ListPromptRouters$: () => ListPromptRouters$,
  ListModelInvocationJobsResponse$: () => ListModelInvocationJobsResponse$,
  ListModelInvocationJobsRequest$: () => ListModelInvocationJobsRequest$,
  ListModelInvocationJobsCommand: () => ListModelInvocationJobsCommand,
  ListModelInvocationJobs$: () => ListModelInvocationJobs$,
  ListModelImportJobsResponse$: () => ListModelImportJobsResponse$,
  ListModelImportJobsRequest$: () => ListModelImportJobsRequest$,
  ListModelImportJobsCommand: () => ListModelImportJobsCommand,
  ListModelImportJobs$: () => ListModelImportJobs$,
  ListModelCustomizationJobsResponse$: () => ListModelCustomizationJobsResponse$,
  ListModelCustomizationJobsRequest$: () => ListModelCustomizationJobsRequest$,
  ListModelCustomizationJobsCommand: () => ListModelCustomizationJobsCommand,
  ListModelCustomizationJobs$: () => ListModelCustomizationJobs$,
  ListModelCopyJobsResponse$: () => ListModelCopyJobsResponse$,
  ListModelCopyJobsRequest$: () => ListModelCopyJobsRequest$,
  ListModelCopyJobsCommand: () => ListModelCopyJobsCommand,
  ListModelCopyJobs$: () => ListModelCopyJobs$,
  ListMarketplaceModelEndpointsResponse$: () => ListMarketplaceModelEndpointsResponse$,
  ListMarketplaceModelEndpointsRequest$: () => ListMarketplaceModelEndpointsRequest$,
  ListMarketplaceModelEndpointsCommand: () => ListMarketplaceModelEndpointsCommand,
  ListMarketplaceModelEndpoints$: () => ListMarketplaceModelEndpoints$,
  ListInferenceProfilesResponse$: () => ListInferenceProfilesResponse$,
  ListInferenceProfilesRequest$: () => ListInferenceProfilesRequest$,
  ListInferenceProfilesCommand: () => ListInferenceProfilesCommand,
  ListInferenceProfiles$: () => ListInferenceProfiles$,
  ListImportedModelsResponse$: () => ListImportedModelsResponse$,
  ListImportedModelsRequest$: () => ListImportedModelsRequest$,
  ListImportedModelsCommand: () => ListImportedModelsCommand,
  ListImportedModels$: () => ListImportedModels$,
  ListGuardrailsResponse$: () => ListGuardrailsResponse$,
  ListGuardrailsRequest$: () => ListGuardrailsRequest$,
  ListGuardrailsCommand: () => ListGuardrailsCommand,
  ListGuardrails$: () => ListGuardrails$,
  ListFoundationModelsResponse$: () => ListFoundationModelsResponse$,
  ListFoundationModelsRequest$: () => ListFoundationModelsRequest$,
  ListFoundationModelsCommand: () => ListFoundationModelsCommand,
  ListFoundationModels$: () => ListFoundationModels$,
  ListFoundationModelAgreementOffersResponse$: () => ListFoundationModelAgreementOffersResponse$,
  ListFoundationModelAgreementOffersRequest$: () => ListFoundationModelAgreementOffersRequest$,
  ListFoundationModelAgreementOffersCommand: () => ListFoundationModelAgreementOffersCommand,
  ListFoundationModelAgreementOffers$: () => ListFoundationModelAgreementOffers$,
  ListEvaluationJobsResponse$: () => ListEvaluationJobsResponse$,
  ListEvaluationJobsRequest$: () => ListEvaluationJobsRequest$,
  ListEvaluationJobsCommand: () => ListEvaluationJobsCommand,
  ListEvaluationJobs$: () => ListEvaluationJobs$,
  ListEnforcedGuardrailsConfigurationResponse$: () => ListEnforcedGuardrailsConfigurationResponse$,
  ListEnforcedGuardrailsConfigurationRequest$: () => ListEnforcedGuardrailsConfigurationRequest$,
  ListEnforcedGuardrailsConfigurationCommand: () => ListEnforcedGuardrailsConfigurationCommand,
  ListEnforcedGuardrailsConfiguration$: () => ListEnforcedGuardrailsConfiguration$,
  ListCustomModelsResponse$: () => ListCustomModelsResponse$,
  ListCustomModelsRequest$: () => ListCustomModelsRequest$,
  ListCustomModelsCommand: () => ListCustomModelsCommand,
  ListCustomModels$: () => ListCustomModels$,
  ListCustomModelDeploymentsResponse$: () => ListCustomModelDeploymentsResponse$,
  ListCustomModelDeploymentsRequest$: () => ListCustomModelDeploymentsRequest$,
  ListCustomModelDeploymentsCommand: () => ListCustomModelDeploymentsCommand,
  ListCustomModelDeployments$: () => ListCustomModelDeployments$,
  ListAutomatedReasoningPolicyTestResultsResponse$: () => ListAutomatedReasoningPolicyTestResultsResponse$,
  ListAutomatedReasoningPolicyTestResultsRequest$: () => ListAutomatedReasoningPolicyTestResultsRequest$,
  ListAutomatedReasoningPolicyTestResultsCommand: () => ListAutomatedReasoningPolicyTestResultsCommand,
  ListAutomatedReasoningPolicyTestResults$: () => ListAutomatedReasoningPolicyTestResults$,
  ListAutomatedReasoningPolicyTestCasesResponse$: () => ListAutomatedReasoningPolicyTestCasesResponse$,
  ListAutomatedReasoningPolicyTestCasesRequest$: () => ListAutomatedReasoningPolicyTestCasesRequest$,
  ListAutomatedReasoningPolicyTestCasesCommand: () => ListAutomatedReasoningPolicyTestCasesCommand,
  ListAutomatedReasoningPolicyTestCases$: () => ListAutomatedReasoningPolicyTestCases$,
  ListAutomatedReasoningPolicyBuildWorkflowsResponse$: () => ListAutomatedReasoningPolicyBuildWorkflowsResponse$,
  ListAutomatedReasoningPolicyBuildWorkflowsRequest$: () => ListAutomatedReasoningPolicyBuildWorkflowsRequest$,
  ListAutomatedReasoningPolicyBuildWorkflowsCommand: () => ListAutomatedReasoningPolicyBuildWorkflowsCommand,
  ListAutomatedReasoningPolicyBuildWorkflows$: () => ListAutomatedReasoningPolicyBuildWorkflows$,
  ListAutomatedReasoningPoliciesResponse$: () => ListAutomatedReasoningPoliciesResponse$,
  ListAutomatedReasoningPoliciesRequest$: () => ListAutomatedReasoningPoliciesRequest$,
  ListAutomatedReasoningPoliciesCommand: () => ListAutomatedReasoningPoliciesCommand,
  ListAutomatedReasoningPolicies$: () => ListAutomatedReasoningPolicies$,
  LegalTerm$: () => LegalTerm$,
  LambdaGraderConfig$: () => LambdaGraderConfig$,
  KnowledgeBaseVectorSearchConfiguration$: () => KnowledgeBaseVectorSearchConfiguration$,
  KnowledgeBaseRetrieveAndGenerateConfiguration$: () => KnowledgeBaseRetrieveAndGenerateConfiguration$,
  KnowledgeBaseRetrievalConfiguration$: () => KnowledgeBaseRetrievalConfiguration$,
  KnowledgeBaseConfig$: () => KnowledgeBaseConfig$,
  KbInferenceConfig$: () => KbInferenceConfig$,
  JobStatusDetails: () => JobStatusDetails,
  InvocationLogsConfig$: () => InvocationLogsConfig$,
  InvocationLogSource$: () => InvocationLogSource$,
  InternalServerException$: () => InternalServerException$,
  InternalServerException: () => InternalServerException,
  InputTags: () => InputTags,
  InferenceType: () => InferenceType,
  InferenceProfileType: () => InferenceProfileType,
  InferenceProfileSummary$: () => InferenceProfileSummary$,
  InferenceProfileStatus: () => InferenceProfileStatus,
  InferenceProfileModelSource$: () => InferenceProfileModelSource$,
  InferenceProfileModel$: () => InferenceProfileModel$,
  ImportedModelSummary$: () => ImportedModelSummary$,
  ImplicitFilterConfiguration$: () => ImplicitFilterConfiguration$,
  HumanWorkflowConfig$: () => HumanWorkflowConfig$,
  HumanEvaluationCustomMetric$: () => HumanEvaluationCustomMetric$,
  HumanEvaluationConfig$: () => HumanEvaluationConfig$,
  GuardrailWordPolicyConfig$: () => GuardrailWordPolicyConfig$,
  GuardrailWordPolicy$: () => GuardrailWordPolicy$,
  GuardrailWordConfig$: () => GuardrailWordConfig$,
  GuardrailWordAction: () => GuardrailWordAction2,
  GuardrailWord$: () => GuardrailWord$,
  GuardrailTopicsTierName: () => GuardrailTopicsTierName2,
  GuardrailTopicsTierConfig$: () => GuardrailTopicsTierConfig$,
  GuardrailTopicsTier$: () => GuardrailTopicsTier$,
  GuardrailTopicType: () => GuardrailTopicType,
  GuardrailTopicPolicyConfig$: () => GuardrailTopicPolicyConfig$,
  GuardrailTopicPolicy$: () => GuardrailTopicPolicy$,
  GuardrailTopicConfig$: () => GuardrailTopicConfig$,
  GuardrailTopicAction: () => GuardrailTopicAction2,
  GuardrailTopic$: () => GuardrailTopic$,
  GuardrailSummary$: () => GuardrailSummary$,
  GuardrailStatus: () => GuardrailStatus,
  GuardrailSensitiveInformationPolicyConfig$: () => GuardrailSensitiveInformationPolicyConfig$,
  GuardrailSensitiveInformationPolicy$: () => GuardrailSensitiveInformationPolicy$,
  GuardrailSensitiveInformationAction: () => GuardrailSensitiveInformationAction,
  GuardrailRegexConfig$: () => GuardrailRegexConfig$,
  GuardrailRegex$: () => GuardrailRegex$,
  GuardrailPiiEntityType: () => GuardrailPiiEntityType,
  GuardrailPiiEntityConfig$: () => GuardrailPiiEntityConfig$,
  GuardrailPiiEntity$: () => GuardrailPiiEntity$,
  GuardrailModality: () => GuardrailModality2,
  GuardrailManagedWordsType: () => GuardrailManagedWordsType,
  GuardrailManagedWordsConfig$: () => GuardrailManagedWordsConfig$,
  GuardrailManagedWords$: () => GuardrailManagedWords$,
  GuardrailFilterStrength: () => GuardrailFilterStrength,
  GuardrailCrossRegionDetails$: () => GuardrailCrossRegionDetails$,
  GuardrailCrossRegionConfig$: () => GuardrailCrossRegionConfig$,
  GuardrailContextualGroundingPolicyConfig$: () => GuardrailContextualGroundingPolicyConfig$,
  GuardrailContextualGroundingPolicy$: () => GuardrailContextualGroundingPolicy$,
  GuardrailContextualGroundingFilterType: () => GuardrailContextualGroundingFilterType,
  GuardrailContextualGroundingFilterConfig$: () => GuardrailContextualGroundingFilterConfig$,
  GuardrailContextualGroundingFilter$: () => GuardrailContextualGroundingFilter$,
  GuardrailContextualGroundingAction: () => GuardrailContextualGroundingAction2,
  GuardrailContentPolicyConfig$: () => GuardrailContentPolicyConfig$,
  GuardrailContentPolicy$: () => GuardrailContentPolicy$,
  GuardrailContentFiltersTierName: () => GuardrailContentFiltersTierName2,
  GuardrailContentFiltersTierConfig$: () => GuardrailContentFiltersTierConfig$,
  GuardrailContentFiltersTier$: () => GuardrailContentFiltersTier$,
  GuardrailContentFilterType: () => GuardrailContentFilterType,
  GuardrailContentFilterConfig$: () => GuardrailContentFilterConfig$,
  GuardrailContentFilterAction: () => GuardrailContentFilterAction2,
  GuardrailContentFilter$: () => GuardrailContentFilter$,
  GuardrailConfiguration$: () => GuardrailConfiguration$,
  GuardrailAutomatedReasoningPolicyConfig$: () => GuardrailAutomatedReasoningPolicyConfig$,
  GuardrailAutomatedReasoningPolicy$: () => GuardrailAutomatedReasoningPolicy$,
  GraderConfig$: () => GraderConfig$,
  GetUseCaseForModelAccessResponse$: () => GetUseCaseForModelAccessResponse$,
  GetUseCaseForModelAccessRequest$: () => GetUseCaseForModelAccessRequest$,
  GetUseCaseForModelAccessCommand: () => GetUseCaseForModelAccessCommand,
  GetUseCaseForModelAccess$: () => GetUseCaseForModelAccess$,
  GetResourcePolicyResponse$: () => GetResourcePolicyResponse$,
  GetResourcePolicyRequest$: () => GetResourcePolicyRequest$,
  GetResourcePolicyCommand: () => GetResourcePolicyCommand,
  GetResourcePolicy$: () => GetResourcePolicy$,
  GetProvisionedModelThroughputResponse$: () => GetProvisionedModelThroughputResponse$,
  GetProvisionedModelThroughputRequest$: () => GetProvisionedModelThroughputRequest$,
  GetProvisionedModelThroughputCommand: () => GetProvisionedModelThroughputCommand,
  GetProvisionedModelThroughput$: () => GetProvisionedModelThroughput$,
  GetPromptRouterResponse$: () => GetPromptRouterResponse$,
  GetPromptRouterRequest$: () => GetPromptRouterRequest$,
  GetPromptRouterCommand: () => GetPromptRouterCommand,
  GetPromptRouter$: () => GetPromptRouter$,
  GetModelInvocationLoggingConfigurationResponse$: () => GetModelInvocationLoggingConfigurationResponse$,
  GetModelInvocationLoggingConfigurationRequest$: () => GetModelInvocationLoggingConfigurationRequest$,
  GetModelInvocationLoggingConfigurationCommand: () => GetModelInvocationLoggingConfigurationCommand,
  GetModelInvocationLoggingConfiguration$: () => GetModelInvocationLoggingConfiguration$,
  GetModelInvocationJobResponse$: () => GetModelInvocationJobResponse$,
  GetModelInvocationJobRequest$: () => GetModelInvocationJobRequest$,
  GetModelInvocationJobCommand: () => GetModelInvocationJobCommand,
  GetModelInvocationJob$: () => GetModelInvocationJob$,
  GetModelImportJobResponse$: () => GetModelImportJobResponse$,
  GetModelImportJobRequest$: () => GetModelImportJobRequest$,
  GetModelImportJobCommand: () => GetModelImportJobCommand,
  GetModelImportJob$: () => GetModelImportJob$,
  GetModelCustomizationJobResponse$: () => GetModelCustomizationJobResponse$,
  GetModelCustomizationJobRequest$: () => GetModelCustomizationJobRequest$,
  GetModelCustomizationJobCommand: () => GetModelCustomizationJobCommand,
  GetModelCustomizationJob$: () => GetModelCustomizationJob$,
  GetModelCopyJobResponse$: () => GetModelCopyJobResponse$,
  GetModelCopyJobRequest$: () => GetModelCopyJobRequest$,
  GetModelCopyJobCommand: () => GetModelCopyJobCommand,
  GetModelCopyJob$: () => GetModelCopyJob$,
  GetMarketplaceModelEndpointResponse$: () => GetMarketplaceModelEndpointResponse$,
  GetMarketplaceModelEndpointRequest$: () => GetMarketplaceModelEndpointRequest$,
  GetMarketplaceModelEndpointCommand: () => GetMarketplaceModelEndpointCommand,
  GetMarketplaceModelEndpoint$: () => GetMarketplaceModelEndpoint$,
  GetInferenceProfileResponse$: () => GetInferenceProfileResponse$,
  GetInferenceProfileRequest$: () => GetInferenceProfileRequest$,
  GetInferenceProfileCommand: () => GetInferenceProfileCommand,
  GetInferenceProfile$: () => GetInferenceProfile$,
  GetImportedModelResponse$: () => GetImportedModelResponse$,
  GetImportedModelRequest$: () => GetImportedModelRequest$,
  GetImportedModelCommand: () => GetImportedModelCommand,
  GetImportedModel$: () => GetImportedModel$,
  GetGuardrailResponse$: () => GetGuardrailResponse$,
  GetGuardrailRequest$: () => GetGuardrailRequest$,
  GetGuardrailCommand: () => GetGuardrailCommand,
  GetGuardrail$: () => GetGuardrail$,
  GetFoundationModelResponse$: () => GetFoundationModelResponse$,
  GetFoundationModelRequest$: () => GetFoundationModelRequest$,
  GetFoundationModelCommand: () => GetFoundationModelCommand,
  GetFoundationModelAvailabilityResponse$: () => GetFoundationModelAvailabilityResponse$,
  GetFoundationModelAvailabilityRequest$: () => GetFoundationModelAvailabilityRequest$,
  GetFoundationModelAvailabilityCommand: () => GetFoundationModelAvailabilityCommand,
  GetFoundationModelAvailability$: () => GetFoundationModelAvailability$,
  GetFoundationModel$: () => GetFoundationModel$,
  GetEvaluationJobResponse$: () => GetEvaluationJobResponse$,
  GetEvaluationJobRequest$: () => GetEvaluationJobRequest$,
  GetEvaluationJobCommand: () => GetEvaluationJobCommand,
  GetEvaluationJob$: () => GetEvaluationJob$,
  GetCustomModelResponse$: () => GetCustomModelResponse$,
  GetCustomModelRequest$: () => GetCustomModelRequest$,
  GetCustomModelDeploymentResponse$: () => GetCustomModelDeploymentResponse$,
  GetCustomModelDeploymentRequest$: () => GetCustomModelDeploymentRequest$,
  GetCustomModelDeploymentCommand: () => GetCustomModelDeploymentCommand,
  GetCustomModelDeployment$: () => GetCustomModelDeployment$,
  GetCustomModelCommand: () => GetCustomModelCommand,
  GetCustomModel$: () => GetCustomModel$,
  GetAutomatedReasoningPolicyTestResultResponse$: () => GetAutomatedReasoningPolicyTestResultResponse$,
  GetAutomatedReasoningPolicyTestResultRequest$: () => GetAutomatedReasoningPolicyTestResultRequest$,
  GetAutomatedReasoningPolicyTestResultCommand: () => GetAutomatedReasoningPolicyTestResultCommand,
  GetAutomatedReasoningPolicyTestResult$: () => GetAutomatedReasoningPolicyTestResult$,
  GetAutomatedReasoningPolicyTestCaseResponse$: () => GetAutomatedReasoningPolicyTestCaseResponse$,
  GetAutomatedReasoningPolicyTestCaseRequest$: () => GetAutomatedReasoningPolicyTestCaseRequest$,
  GetAutomatedReasoningPolicyTestCaseCommand: () => GetAutomatedReasoningPolicyTestCaseCommand,
  GetAutomatedReasoningPolicyTestCase$: () => GetAutomatedReasoningPolicyTestCase$,
  GetAutomatedReasoningPolicyResponse$: () => GetAutomatedReasoningPolicyResponse$,
  GetAutomatedReasoningPolicyRequest$: () => GetAutomatedReasoningPolicyRequest$,
  GetAutomatedReasoningPolicyNextScenarioResponse$: () => GetAutomatedReasoningPolicyNextScenarioResponse$,
  GetAutomatedReasoningPolicyNextScenarioRequest$: () => GetAutomatedReasoningPolicyNextScenarioRequest$,
  GetAutomatedReasoningPolicyNextScenarioCommand: () => GetAutomatedReasoningPolicyNextScenarioCommand,
  GetAutomatedReasoningPolicyNextScenario$: () => GetAutomatedReasoningPolicyNextScenario$,
  GetAutomatedReasoningPolicyCommand: () => GetAutomatedReasoningPolicyCommand,
  GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse$: () => GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse$,
  GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest$: () => GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest$,
  GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand: () => GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand,
  GetAutomatedReasoningPolicyBuildWorkflowResultAssets$: () => GetAutomatedReasoningPolicyBuildWorkflowResultAssets$,
  GetAutomatedReasoningPolicyBuildWorkflowResponse$: () => GetAutomatedReasoningPolicyBuildWorkflowResponse$,
  GetAutomatedReasoningPolicyBuildWorkflowRequest$: () => GetAutomatedReasoningPolicyBuildWorkflowRequest$,
  GetAutomatedReasoningPolicyBuildWorkflowCommand: () => GetAutomatedReasoningPolicyBuildWorkflowCommand,
  GetAutomatedReasoningPolicyBuildWorkflow$: () => GetAutomatedReasoningPolicyBuildWorkflow$,
  GetAutomatedReasoningPolicyAnnotationsResponse$: () => GetAutomatedReasoningPolicyAnnotationsResponse$,
  GetAutomatedReasoningPolicyAnnotationsRequest$: () => GetAutomatedReasoningPolicyAnnotationsRequest$,
  GetAutomatedReasoningPolicyAnnotationsCommand: () => GetAutomatedReasoningPolicyAnnotationsCommand,
  GetAutomatedReasoningPolicyAnnotations$: () => GetAutomatedReasoningPolicyAnnotations$,
  GetAutomatedReasoningPolicy$: () => GetAutomatedReasoningPolicy$,
  GenerationConfiguration$: () => GenerationConfiguration$,
  FoundationModelSummary$: () => FoundationModelSummary$,
  FoundationModelLifecycleStatus: () => FoundationModelLifecycleStatus,
  FoundationModelLifecycle$: () => FoundationModelLifecycle$,
  FoundationModelDetails$: () => FoundationModelDetails$,
  FineTuningJobStatus: () => FineTuningJobStatus,
  FilterAttribute$: () => FilterAttribute$,
  FieldForReranking$: () => FieldForReranking$,
  ExternalSourcesRetrieveAndGenerateConfiguration$: () => ExternalSourcesRetrieveAndGenerateConfiguration$,
  ExternalSourcesGenerationConfiguration$: () => ExternalSourcesGenerationConfiguration$,
  ExternalSourceType: () => ExternalSourceType,
  ExternalSource$: () => ExternalSource$,
  ExportAutomatedReasoningPolicyVersionResponse$: () => ExportAutomatedReasoningPolicyVersionResponse$,
  ExportAutomatedReasoningPolicyVersionRequest$: () => ExportAutomatedReasoningPolicyVersionRequest$,
  ExportAutomatedReasoningPolicyVersionCommand: () => ExportAutomatedReasoningPolicyVersionCommand,
  ExportAutomatedReasoningPolicyVersion$: () => ExportAutomatedReasoningPolicyVersion$,
  EvaluatorModelConfig$: () => EvaluatorModelConfig$,
  EvaluationTaskType: () => EvaluationTaskType,
  EvaluationSummary$: () => EvaluationSummary$,
  EvaluationRagConfigSummary$: () => EvaluationRagConfigSummary$,
  EvaluationPrecomputedRetrieveSourceConfig$: () => EvaluationPrecomputedRetrieveSourceConfig$,
  EvaluationPrecomputedRetrieveAndGenerateSourceConfig$: () => EvaluationPrecomputedRetrieveAndGenerateSourceConfig$,
  EvaluationPrecomputedRagSourceConfig$: () => EvaluationPrecomputedRagSourceConfig$,
  EvaluationPrecomputedInferenceSource$: () => EvaluationPrecomputedInferenceSource$,
  EvaluationOutputDataConfig$: () => EvaluationOutputDataConfig$,
  EvaluationModelConfigSummary$: () => EvaluationModelConfigSummary$,
  EvaluationModelConfig$: () => EvaluationModelConfig$,
  EvaluationJobType: () => EvaluationJobType,
  EvaluationJobStatus: () => EvaluationJobStatus,
  EvaluationInferenceConfigSummary$: () => EvaluationInferenceConfigSummary$,
  EvaluationInferenceConfig$: () => EvaluationInferenceConfig$,
  EvaluationDatasetMetricConfig$: () => EvaluationDatasetMetricConfig$,
  EvaluationDatasetLocation$: () => EvaluationDatasetLocation$,
  EvaluationDataset$: () => EvaluationDataset$,
  EvaluationConfig$: () => EvaluationConfig$,
  EvaluationBedrockModel$: () => EvaluationBedrockModel$,
  EntitlementAvailability: () => EntitlementAvailability,
  EndpointConfig$: () => EndpointConfig$,
  DistillationConfig$: () => DistillationConfig$,
  DimensionalPriceRate$: () => DimensionalPriceRate$,
  DeregisterMarketplaceModelEndpointResponse$: () => DeregisterMarketplaceModelEndpointResponse$,
  DeregisterMarketplaceModelEndpointRequest$: () => DeregisterMarketplaceModelEndpointRequest$,
  DeregisterMarketplaceModelEndpointCommand: () => DeregisterMarketplaceModelEndpointCommand,
  DeregisterMarketplaceModelEndpoint$: () => DeregisterMarketplaceModelEndpoint$,
  DeleteResourcePolicyResponse$: () => DeleteResourcePolicyResponse$,
  DeleteResourcePolicyRequest$: () => DeleteResourcePolicyRequest$,
  DeleteResourcePolicyCommand: () => DeleteResourcePolicyCommand,
  DeleteResourcePolicy$: () => DeleteResourcePolicy$,
  DeleteProvisionedModelThroughputResponse$: () => DeleteProvisionedModelThroughputResponse$,
  DeleteProvisionedModelThroughputRequest$: () => DeleteProvisionedModelThroughputRequest$,
  DeleteProvisionedModelThroughputCommand: () => DeleteProvisionedModelThroughputCommand,
  DeleteProvisionedModelThroughput$: () => DeleteProvisionedModelThroughput$,
  DeletePromptRouterResponse$: () => DeletePromptRouterResponse$,
  DeletePromptRouterRequest$: () => DeletePromptRouterRequest$,
  DeletePromptRouterCommand: () => DeletePromptRouterCommand,
  DeletePromptRouter$: () => DeletePromptRouter$,
  DeleteModelInvocationLoggingConfigurationResponse$: () => DeleteModelInvocationLoggingConfigurationResponse$,
  DeleteModelInvocationLoggingConfigurationRequest$: () => DeleteModelInvocationLoggingConfigurationRequest$,
  DeleteModelInvocationLoggingConfigurationCommand: () => DeleteModelInvocationLoggingConfigurationCommand,
  DeleteModelInvocationLoggingConfiguration$: () => DeleteModelInvocationLoggingConfiguration$,
  DeleteMarketplaceModelEndpointResponse$: () => DeleteMarketplaceModelEndpointResponse$,
  DeleteMarketplaceModelEndpointRequest$: () => DeleteMarketplaceModelEndpointRequest$,
  DeleteMarketplaceModelEndpointCommand: () => DeleteMarketplaceModelEndpointCommand,
  DeleteMarketplaceModelEndpoint$: () => DeleteMarketplaceModelEndpoint$,
  DeleteInferenceProfileResponse$: () => DeleteInferenceProfileResponse$,
  DeleteInferenceProfileRequest$: () => DeleteInferenceProfileRequest$,
  DeleteInferenceProfileCommand: () => DeleteInferenceProfileCommand,
  DeleteInferenceProfile$: () => DeleteInferenceProfile$,
  DeleteImportedModelResponse$: () => DeleteImportedModelResponse$,
  DeleteImportedModelRequest$: () => DeleteImportedModelRequest$,
  DeleteImportedModelCommand: () => DeleteImportedModelCommand,
  DeleteImportedModel$: () => DeleteImportedModel$,
  DeleteGuardrailResponse$: () => DeleteGuardrailResponse$,
  DeleteGuardrailRequest$: () => DeleteGuardrailRequest$,
  DeleteGuardrailCommand: () => DeleteGuardrailCommand,
  DeleteGuardrail$: () => DeleteGuardrail$,
  DeleteFoundationModelAgreementResponse$: () => DeleteFoundationModelAgreementResponse$,
  DeleteFoundationModelAgreementRequest$: () => DeleteFoundationModelAgreementRequest$,
  DeleteFoundationModelAgreementCommand: () => DeleteFoundationModelAgreementCommand,
  DeleteFoundationModelAgreement$: () => DeleteFoundationModelAgreement$,
  DeleteEnforcedGuardrailConfigurationResponse$: () => DeleteEnforcedGuardrailConfigurationResponse$,
  DeleteEnforcedGuardrailConfigurationRequest$: () => DeleteEnforcedGuardrailConfigurationRequest$,
  DeleteEnforcedGuardrailConfigurationCommand: () => DeleteEnforcedGuardrailConfigurationCommand,
  DeleteEnforcedGuardrailConfiguration$: () => DeleteEnforcedGuardrailConfiguration$,
  DeleteCustomModelResponse$: () => DeleteCustomModelResponse$,
  DeleteCustomModelRequest$: () => DeleteCustomModelRequest$,
  DeleteCustomModelDeploymentResponse$: () => DeleteCustomModelDeploymentResponse$,
  DeleteCustomModelDeploymentRequest$: () => DeleteCustomModelDeploymentRequest$,
  DeleteCustomModelDeploymentCommand: () => DeleteCustomModelDeploymentCommand,
  DeleteCustomModelDeployment$: () => DeleteCustomModelDeployment$,
  DeleteCustomModelCommand: () => DeleteCustomModelCommand,
  DeleteCustomModel$: () => DeleteCustomModel$,
  DeleteAutomatedReasoningPolicyTestCaseResponse$: () => DeleteAutomatedReasoningPolicyTestCaseResponse$,
  DeleteAutomatedReasoningPolicyTestCaseRequest$: () => DeleteAutomatedReasoningPolicyTestCaseRequest$,
  DeleteAutomatedReasoningPolicyTestCaseCommand: () => DeleteAutomatedReasoningPolicyTestCaseCommand,
  DeleteAutomatedReasoningPolicyTestCase$: () => DeleteAutomatedReasoningPolicyTestCase$,
  DeleteAutomatedReasoningPolicyResponse$: () => DeleteAutomatedReasoningPolicyResponse$,
  DeleteAutomatedReasoningPolicyRequest$: () => DeleteAutomatedReasoningPolicyRequest$,
  DeleteAutomatedReasoningPolicyCommand: () => DeleteAutomatedReasoningPolicyCommand,
  DeleteAutomatedReasoningPolicyBuildWorkflowResponse$: () => DeleteAutomatedReasoningPolicyBuildWorkflowResponse$,
  DeleteAutomatedReasoningPolicyBuildWorkflowRequest$: () => DeleteAutomatedReasoningPolicyBuildWorkflowRequest$,
  DeleteAutomatedReasoningPolicyBuildWorkflowCommand: () => DeleteAutomatedReasoningPolicyBuildWorkflowCommand,
  DeleteAutomatedReasoningPolicyBuildWorkflow$: () => DeleteAutomatedReasoningPolicyBuildWorkflow$,
  DeleteAutomatedReasoningPolicy$: () => DeleteAutomatedReasoningPolicy$,
  DataProcessingDetails$: () => DataProcessingDetails$,
  CustomizationType: () => CustomizationType,
  CustomizationConfig$: () => CustomizationConfig$,
  CustomModelUnits$: () => CustomModelUnits$,
  CustomModelSummary$: () => CustomModelSummary$,
  CustomModelDeploymentUpdateStatus: () => CustomModelDeploymentUpdateStatus,
  CustomModelDeploymentUpdateDetails$: () => CustomModelDeploymentUpdateDetails$,
  CustomModelDeploymentSummary$: () => CustomModelDeploymentSummary$,
  CustomModelDeploymentStatus: () => CustomModelDeploymentStatus,
  CustomMetricEvaluatorModelConfig$: () => CustomMetricEvaluatorModelConfig$,
  CustomMetricDefinition$: () => CustomMetricDefinition$,
  CustomMetricBedrockEvaluatorModel$: () => CustomMetricBedrockEvaluatorModel$,
  CreateProvisionedModelThroughputResponse$: () => CreateProvisionedModelThroughputResponse$,
  CreateProvisionedModelThroughputRequest$: () => CreateProvisionedModelThroughputRequest$,
  CreateProvisionedModelThroughputCommand: () => CreateProvisionedModelThroughputCommand,
  CreateProvisionedModelThroughput$: () => CreateProvisionedModelThroughput$,
  CreatePromptRouterResponse$: () => CreatePromptRouterResponse$,
  CreatePromptRouterRequest$: () => CreatePromptRouterRequest$,
  CreatePromptRouterCommand: () => CreatePromptRouterCommand,
  CreatePromptRouter$: () => CreatePromptRouter$,
  CreateModelInvocationJobResponse$: () => CreateModelInvocationJobResponse$,
  CreateModelInvocationJobRequest$: () => CreateModelInvocationJobRequest$,
  CreateModelInvocationJobCommand: () => CreateModelInvocationJobCommand,
  CreateModelInvocationJob$: () => CreateModelInvocationJob$,
  CreateModelImportJobResponse$: () => CreateModelImportJobResponse$,
  CreateModelImportJobRequest$: () => CreateModelImportJobRequest$,
  CreateModelImportJobCommand: () => CreateModelImportJobCommand,
  CreateModelImportJob$: () => CreateModelImportJob$,
  CreateModelCustomizationJobResponse$: () => CreateModelCustomizationJobResponse$,
  CreateModelCustomizationJobRequest$: () => CreateModelCustomizationJobRequest$,
  CreateModelCustomizationJobCommand: () => CreateModelCustomizationJobCommand,
  CreateModelCustomizationJob$: () => CreateModelCustomizationJob$,
  CreateModelCopyJobResponse$: () => CreateModelCopyJobResponse$,
  CreateModelCopyJobRequest$: () => CreateModelCopyJobRequest$,
  CreateModelCopyJobCommand: () => CreateModelCopyJobCommand,
  CreateModelCopyJob$: () => CreateModelCopyJob$,
  CreateMarketplaceModelEndpointResponse$: () => CreateMarketplaceModelEndpointResponse$,
  CreateMarketplaceModelEndpointRequest$: () => CreateMarketplaceModelEndpointRequest$,
  CreateMarketplaceModelEndpointCommand: () => CreateMarketplaceModelEndpointCommand,
  CreateMarketplaceModelEndpoint$: () => CreateMarketplaceModelEndpoint$,
  CreateInferenceProfileResponse$: () => CreateInferenceProfileResponse$,
  CreateInferenceProfileRequest$: () => CreateInferenceProfileRequest$,
  CreateInferenceProfileCommand: () => CreateInferenceProfileCommand,
  CreateInferenceProfile$: () => CreateInferenceProfile$,
  CreateGuardrailVersionResponse$: () => CreateGuardrailVersionResponse$,
  CreateGuardrailVersionRequest$: () => CreateGuardrailVersionRequest$,
  CreateGuardrailVersionCommand: () => CreateGuardrailVersionCommand,
  CreateGuardrailVersion$: () => CreateGuardrailVersion$,
  CreateGuardrailResponse$: () => CreateGuardrailResponse$,
  CreateGuardrailRequest$: () => CreateGuardrailRequest$,
  CreateGuardrailCommand: () => CreateGuardrailCommand,
  CreateGuardrail$: () => CreateGuardrail$,
  CreateFoundationModelAgreementResponse$: () => CreateFoundationModelAgreementResponse$,
  CreateFoundationModelAgreementRequest$: () => CreateFoundationModelAgreementRequest$,
  CreateFoundationModelAgreementCommand: () => CreateFoundationModelAgreementCommand,
  CreateFoundationModelAgreement$: () => CreateFoundationModelAgreement$,
  CreateEvaluationJobResponse$: () => CreateEvaluationJobResponse$,
  CreateEvaluationJobRequest$: () => CreateEvaluationJobRequest$,
  CreateEvaluationJobCommand: () => CreateEvaluationJobCommand,
  CreateEvaluationJob$: () => CreateEvaluationJob$,
  CreateCustomModelResponse$: () => CreateCustomModelResponse$,
  CreateCustomModelRequest$: () => CreateCustomModelRequest$,
  CreateCustomModelDeploymentResponse$: () => CreateCustomModelDeploymentResponse$,
  CreateCustomModelDeploymentRequest$: () => CreateCustomModelDeploymentRequest$,
  CreateCustomModelDeploymentCommand: () => CreateCustomModelDeploymentCommand,
  CreateCustomModelDeployment$: () => CreateCustomModelDeployment$,
  CreateCustomModelCommand: () => CreateCustomModelCommand,
  CreateCustomModel$: () => CreateCustomModel$,
  CreateAutomatedReasoningPolicyVersionResponse$: () => CreateAutomatedReasoningPolicyVersionResponse$,
  CreateAutomatedReasoningPolicyVersionRequest$: () => CreateAutomatedReasoningPolicyVersionRequest$,
  CreateAutomatedReasoningPolicyVersionCommand: () => CreateAutomatedReasoningPolicyVersionCommand,
  CreateAutomatedReasoningPolicyVersion$: () => CreateAutomatedReasoningPolicyVersion$,
  CreateAutomatedReasoningPolicyTestCaseResponse$: () => CreateAutomatedReasoningPolicyTestCaseResponse$,
  CreateAutomatedReasoningPolicyTestCaseRequest$: () => CreateAutomatedReasoningPolicyTestCaseRequest$,
  CreateAutomatedReasoningPolicyTestCaseCommand: () => CreateAutomatedReasoningPolicyTestCaseCommand,
  CreateAutomatedReasoningPolicyTestCase$: () => CreateAutomatedReasoningPolicyTestCase$,
  CreateAutomatedReasoningPolicyResponse$: () => CreateAutomatedReasoningPolicyResponse$,
  CreateAutomatedReasoningPolicyRequest$: () => CreateAutomatedReasoningPolicyRequest$,
  CreateAutomatedReasoningPolicyCommand: () => CreateAutomatedReasoningPolicyCommand,
  CreateAutomatedReasoningPolicy$: () => CreateAutomatedReasoningPolicy$,
  ConflictException$: () => ConflictException$,
  ConflictException: () => ConflictException,
  ConfigurationOwner: () => ConfigurationOwner,
  CommitmentDuration: () => CommitmentDuration,
  CloudWatchConfig$: () => CloudWatchConfig$,
  CancelAutomatedReasoningPolicyBuildWorkflowResponse$: () => CancelAutomatedReasoningPolicyBuildWorkflowResponse$,
  CancelAutomatedReasoningPolicyBuildWorkflowRequest$: () => CancelAutomatedReasoningPolicyBuildWorkflowRequest$,
  CancelAutomatedReasoningPolicyBuildWorkflowCommand: () => CancelAutomatedReasoningPolicyBuildWorkflowCommand,
  CancelAutomatedReasoningPolicyBuildWorkflow$: () => CancelAutomatedReasoningPolicyBuildWorkflow$,
  ByteContentDoc$: () => ByteContentDoc$,
  BedrockServiceException$: () => BedrockServiceException$,
  BedrockServiceException: () => BedrockServiceException,
  BedrockEvaluatorModel$: () => BedrockEvaluatorModel$,
  BedrockClient: () => BedrockClient,
  Bedrock: () => Bedrock,
  BatchDeleteEvaluationJobResponse$: () => BatchDeleteEvaluationJobResponse$,
  BatchDeleteEvaluationJobRequest$: () => BatchDeleteEvaluationJobRequest$,
  BatchDeleteEvaluationJobItem$: () => BatchDeleteEvaluationJobItem$,
  BatchDeleteEvaluationJobError$: () => BatchDeleteEvaluationJobError$,
  BatchDeleteEvaluationJobCommand: () => BatchDeleteEvaluationJobCommand,
  BatchDeleteEvaluationJob$: () => BatchDeleteEvaluationJob$,
  AutomatedReasoningPolicyWorkflowTypeContent$: () => AutomatedReasoningPolicyWorkflowTypeContent$,
  AutomatedReasoningPolicyVariableReport$: () => AutomatedReasoningPolicyVariableReport$,
  AutomatedReasoningPolicyUpdateVariableMutation$: () => AutomatedReasoningPolicyUpdateVariableMutation$,
  AutomatedReasoningPolicyUpdateVariableAnnotation$: () => AutomatedReasoningPolicyUpdateVariableAnnotation$,
  AutomatedReasoningPolicyUpdateTypeValue$: () => AutomatedReasoningPolicyUpdateTypeValue$,
  AutomatedReasoningPolicyUpdateTypeMutation$: () => AutomatedReasoningPolicyUpdateTypeMutation$,
  AutomatedReasoningPolicyUpdateTypeAnnotation$: () => AutomatedReasoningPolicyUpdateTypeAnnotation$,
  AutomatedReasoningPolicyUpdateRuleMutation$: () => AutomatedReasoningPolicyUpdateRuleMutation$,
  AutomatedReasoningPolicyUpdateRuleAnnotation$: () => AutomatedReasoningPolicyUpdateRuleAnnotation$,
  AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation$: () => AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation$,
  AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation$: () => AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation$,
  AutomatedReasoningPolicyTypeValueAnnotation$: () => AutomatedReasoningPolicyTypeValueAnnotation$,
  AutomatedReasoningPolicyTestRunStatus: () => AutomatedReasoningPolicyTestRunStatus,
  AutomatedReasoningPolicyTestRunResult: () => AutomatedReasoningPolicyTestRunResult,
  AutomatedReasoningPolicyTestResult$: () => AutomatedReasoningPolicyTestResult$,
  AutomatedReasoningPolicyTestCase$: () => AutomatedReasoningPolicyTestCase$,
  AutomatedReasoningPolicySummary$: () => AutomatedReasoningPolicySummary$,
  AutomatedReasoningPolicyStatementReference$: () => AutomatedReasoningPolicyStatementReference$,
  AutomatedReasoningPolicyStatementLocation$: () => AutomatedReasoningPolicyStatementLocation$,
  AutomatedReasoningPolicySourceDocument$: () => AutomatedReasoningPolicySourceDocument$,
  AutomatedReasoningPolicyScenarios$: () => AutomatedReasoningPolicyScenarios$,
  AutomatedReasoningPolicyScenario$: () => AutomatedReasoningPolicyScenario$,
  AutomatedReasoningPolicyRuleReport$: () => AutomatedReasoningPolicyRuleReport$,
  AutomatedReasoningPolicyReportSourceDocument$: () => AutomatedReasoningPolicyReportSourceDocument$,
  AutomatedReasoningPolicyPlanning$: () => AutomatedReasoningPolicyPlanning$,
  AutomatedReasoningPolicyMutation$: () => AutomatedReasoningPolicyMutation$,
  AutomatedReasoningPolicyIngestContentAnnotation$: () => AutomatedReasoningPolicyIngestContentAnnotation$,
  AutomatedReasoningPolicyGeneratedTestCases$: () => AutomatedReasoningPolicyGeneratedTestCases$,
  AutomatedReasoningPolicyGeneratedTestCase$: () => AutomatedReasoningPolicyGeneratedTestCase$,
  AutomatedReasoningPolicyGenerateFidelityReportContent$: () => AutomatedReasoningPolicyGenerateFidelityReportContent$,
  AutomatedReasoningPolicyFidelityReport$: () => AutomatedReasoningPolicyFidelityReport$,
  AutomatedReasoningPolicyDisjointRuleSet$: () => AutomatedReasoningPolicyDisjointRuleSet$,
  AutomatedReasoningPolicyDeleteVariableMutation$: () => AutomatedReasoningPolicyDeleteVariableMutation$,
  AutomatedReasoningPolicyDeleteVariableAnnotation$: () => AutomatedReasoningPolicyDeleteVariableAnnotation$,
  AutomatedReasoningPolicyDeleteTypeValue$: () => AutomatedReasoningPolicyDeleteTypeValue$,
  AutomatedReasoningPolicyDeleteTypeMutation$: () => AutomatedReasoningPolicyDeleteTypeMutation$,
  AutomatedReasoningPolicyDeleteTypeAnnotation$: () => AutomatedReasoningPolicyDeleteTypeAnnotation$,
  AutomatedReasoningPolicyDeleteRuleMutation$: () => AutomatedReasoningPolicyDeleteRuleMutation$,
  AutomatedReasoningPolicyDeleteRuleAnnotation$: () => AutomatedReasoningPolicyDeleteRuleAnnotation$,
  AutomatedReasoningPolicyDefinitionVariable$: () => AutomatedReasoningPolicyDefinitionVariable$,
  AutomatedReasoningPolicyDefinitionTypeValuePair$: () => AutomatedReasoningPolicyDefinitionTypeValuePair$,
  AutomatedReasoningPolicyDefinitionTypeValue$: () => AutomatedReasoningPolicyDefinitionTypeValue$,
  AutomatedReasoningPolicyDefinitionType$: () => AutomatedReasoningPolicyDefinitionType$,
  AutomatedReasoningPolicyDefinitionRule$: () => AutomatedReasoningPolicyDefinitionRule$,
  AutomatedReasoningPolicyDefinitionQualityReport$: () => AutomatedReasoningPolicyDefinitionQualityReport$,
  AutomatedReasoningPolicyDefinitionElement$: () => AutomatedReasoningPolicyDefinitionElement$,
  AutomatedReasoningPolicyDefinition$: () => AutomatedReasoningPolicyDefinition$,
  AutomatedReasoningPolicyBuildWorkflowType: () => AutomatedReasoningPolicyBuildWorkflowType,
  AutomatedReasoningPolicyBuildWorkflowSummary$: () => AutomatedReasoningPolicyBuildWorkflowSummary$,
  AutomatedReasoningPolicyBuildWorkflowStatus: () => AutomatedReasoningPolicyBuildWorkflowStatus,
  AutomatedReasoningPolicyBuildWorkflowSource$: () => AutomatedReasoningPolicyBuildWorkflowSource$,
  AutomatedReasoningPolicyBuildWorkflowRepairContent$: () => AutomatedReasoningPolicyBuildWorkflowRepairContent$,
  AutomatedReasoningPolicyBuildWorkflowDocument$: () => AutomatedReasoningPolicyBuildWorkflowDocument$,
  AutomatedReasoningPolicyBuildStepMessage$: () => AutomatedReasoningPolicyBuildStepMessage$,
  AutomatedReasoningPolicyBuildStepContext$: () => AutomatedReasoningPolicyBuildStepContext$,
  AutomatedReasoningPolicyBuildStep$: () => AutomatedReasoningPolicyBuildStep$,
  AutomatedReasoningPolicyBuildResultAssets$: () => AutomatedReasoningPolicyBuildResultAssets$,
  AutomatedReasoningPolicyBuildResultAssetType: () => AutomatedReasoningPolicyBuildResultAssetType,
  AutomatedReasoningPolicyBuildResultAssetManifestEntry$: () => AutomatedReasoningPolicyBuildResultAssetManifestEntry$,
  AutomatedReasoningPolicyBuildResultAssetManifest$: () => AutomatedReasoningPolicyBuildResultAssetManifest$,
  AutomatedReasoningPolicyBuildMessageType: () => AutomatedReasoningPolicyBuildMessageType,
  AutomatedReasoningPolicyBuildLogEntry$: () => AutomatedReasoningPolicyBuildLogEntry$,
  AutomatedReasoningPolicyBuildLog$: () => AutomatedReasoningPolicyBuildLog$,
  AutomatedReasoningPolicyBuildDocumentContentType: () => AutomatedReasoningPolicyBuildDocumentContentType,
  AutomatedReasoningPolicyAtomicStatement$: () => AutomatedReasoningPolicyAtomicStatement$,
  AutomatedReasoningPolicyAnnotationStatus: () => AutomatedReasoningPolicyAnnotationStatus,
  AutomatedReasoningPolicyAnnotation$: () => AutomatedReasoningPolicyAnnotation$,
  AutomatedReasoningPolicyAnnotatedLine$: () => AutomatedReasoningPolicyAnnotatedLine$,
  AutomatedReasoningPolicyAnnotatedContent$: () => AutomatedReasoningPolicyAnnotatedContent$,
  AutomatedReasoningPolicyAnnotatedChunk$: () => AutomatedReasoningPolicyAnnotatedChunk$,
  AutomatedReasoningPolicyAddVariableMutation$: () => AutomatedReasoningPolicyAddVariableMutation$,
  AutomatedReasoningPolicyAddVariableAnnotation$: () => AutomatedReasoningPolicyAddVariableAnnotation$,
  AutomatedReasoningPolicyAddTypeValue$: () => AutomatedReasoningPolicyAddTypeValue$,
  AutomatedReasoningPolicyAddTypeMutation$: () => AutomatedReasoningPolicyAddTypeMutation$,
  AutomatedReasoningPolicyAddTypeAnnotation$: () => AutomatedReasoningPolicyAddTypeAnnotation$,
  AutomatedReasoningPolicyAddRuleMutation$: () => AutomatedReasoningPolicyAddRuleMutation$,
  AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation$: () => AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation$,
  AutomatedReasoningPolicyAddRuleAnnotation$: () => AutomatedReasoningPolicyAddRuleAnnotation$,
  AutomatedReasoningLogicStatement$: () => AutomatedReasoningLogicStatement$,
  AutomatedReasoningCheckValidFinding$: () => AutomatedReasoningCheckValidFinding$,
  AutomatedReasoningCheckTranslationOption$: () => AutomatedReasoningCheckTranslationOption$,
  AutomatedReasoningCheckTranslationAmbiguousFinding$: () => AutomatedReasoningCheckTranslationAmbiguousFinding$,
  AutomatedReasoningCheckTranslation$: () => AutomatedReasoningCheckTranslation$,
  AutomatedReasoningCheckTooComplexFinding$: () => AutomatedReasoningCheckTooComplexFinding$,
  AutomatedReasoningCheckScenario$: () => AutomatedReasoningCheckScenario$,
  AutomatedReasoningCheckSatisfiableFinding$: () => AutomatedReasoningCheckSatisfiableFinding$,
  AutomatedReasoningCheckRule$: () => AutomatedReasoningCheckRule$,
  AutomatedReasoningCheckResult: () => AutomatedReasoningCheckResult,
  AutomatedReasoningCheckNoTranslationsFinding$: () => AutomatedReasoningCheckNoTranslationsFinding$,
  AutomatedReasoningCheckLogicWarningType: () => AutomatedReasoningCheckLogicWarningType,
  AutomatedReasoningCheckLogicWarning$: () => AutomatedReasoningCheckLogicWarning$,
  AutomatedReasoningCheckInvalidFinding$: () => AutomatedReasoningCheckInvalidFinding$,
  AutomatedReasoningCheckInputTextReference$: () => AutomatedReasoningCheckInputTextReference$,
  AutomatedReasoningCheckImpossibleFinding$: () => AutomatedReasoningCheckImpossibleFinding$,
  AutomatedReasoningCheckFinding$: () => AutomatedReasoningCheckFinding$,
  AutomatedEvaluationCustomMetricSource$: () => AutomatedEvaluationCustomMetricSource$,
  AutomatedEvaluationCustomMetricConfig$: () => AutomatedEvaluationCustomMetricConfig$,
  AutomatedEvaluationConfig$: () => AutomatedEvaluationConfig$,
  AuthorizationStatus: () => AuthorizationStatus,
  AttributeType: () => AttributeType,
  ApplicationType: () => ApplicationType,
  AgreementStatus: () => AgreementStatus,
  AgreementAvailability$: () => AgreementAvailability$,
  AccountEnforcedGuardrailOutputConfiguration$: () => AccountEnforcedGuardrailOutputConfiguration$,
  AccountEnforcedGuardrailInferenceInputConfiguration$: () => AccountEnforcedGuardrailInferenceInputConfiguration$,
  AccessDeniedException$: () => AccessDeniedException$,
  AccessDeniedException: () => AccessDeniedException,
  $Command: () => Command2
});

// node_modules/@aws-sdk/middleware-eventstream/dist-es/eventStreamConfiguration.js

// node_modules/@aws-sdk/middleware-eventstream/node_modules/@smithy/protocol-http/dist-es/extensions/index.js

// node_modules/@aws-sdk/middleware-eventstream/node_modules/@smithy/protocol-http/dist-es/Field.js

// node_modules/@aws-sdk/middleware-eventstream/node_modules/@smithy/protocol-http/dist-es/httpHandler.js

// node_modules/@aws-sdk/middleware-eventstream/node_modules/@smithy/protocol-http/dist-es/httpRequest.js

// node_modules/@aws-sdk/middleware-eventstream/node_modules/@smithy/protocol-http/dist-es/types.js

// node_modules/@aws-sdk/middleware-eventstream/node_modules/@smithy/protocol-http/dist-es/index.js

// node_modules/@aws-sdk/middleware-eventstream/dist-es/eventStreamHandlingMiddleware.js

// node_modules/@aws-sdk/middleware-eventstream/dist-es/eventStreamHeaderMiddleware.js

// node_modules/@aws-sdk/middleware-eventstream/dist-es/getEventStreamPlugin.js

// node_modules/@aws-sdk/middleware-eventstream/dist-es/index.js

// node_modules/tslib/modules/index.js
var import_tslib7, __extends, __assign, __rest, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __awaiter, __generator, __exportStar, __createBinding, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet2, __classPrivateFieldSet2, __classPrivateFieldIn, __addDisposableResource, __disposeResources, __rewriteRelativeImportExtension;

// node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-es/index.js

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/fromUtf8.js

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/toUint8Array.js

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/toUtf8.js

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/index.js

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/convertToBuffer.js
var fromUtf85;

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/isEmptyData.js

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/numToUint8.js

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/uint32ArrayFrom.js

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/index.js

// node_modules/@aws-crypto/crc32/build/module/aws_crc32.js
var AwsCrc32;

// node_modules/@aws-crypto/crc32/build/module/index.js
var Crc32, a_lookUpTable, lookupTable;

// node_modules/@smithy/eventstream-codec/node_modules/@smithy/util-hex-encoding/dist-es/index.js
var SHORT_TO_HEX, HEX_TO_SHORT;

// node_modules/@smithy/eventstream-codec/dist-es/Int64.js

// node_modules/@smithy/eventstream-codec/dist-es/HeaderMarshaller.js
var HEADER_VALUE_TYPE, BOOLEAN_TAG = "boolean", BYTE_TAG = "byte", SHORT_TAG = "short", INT_TAG = "integer", LONG_TAG = "long", BINARY_TAG = "binary", STRING_TAG = "string", TIMESTAMP_TAG = "timestamp", UUID_TAG = "uuid", UUID_PATTERN;

// node_modules/@smithy/eventstream-codec/dist-es/splitMessage.js

// node_modules/@smithy/eventstream-codec/dist-es/EventStreamCodec.js

// node_modules/@smithy/eventstream-codec/dist-es/Message.js

// node_modules/@smithy/eventstream-codec/dist-es/MessageDecoderStream.js
var MessageDecoderStream;

// node_modules/@smithy/eventstream-codec/dist-es/MessageEncoderStream.js
var MessageEncoderStream;

// node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageDecoderStream.js
var SmithyMessageDecoderStream;

// node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageEncoderStream.js
var SmithyMessageEncoderStream;

// node_modules/@smithy/eventstream-codec/dist-es/index.js

// node_modules/@aws-sdk/middleware-websocket/node_modules/@smithy/protocol-http/dist-es/extensions/index.js

// node_modules/@aws-sdk/middleware-websocket/node_modules/@smithy/protocol-http/dist-es/Field.js

// node_modules/@aws-sdk/middleware-websocket/node_modules/@smithy/protocol-http/dist-es/httpHandler.js

// node_modules/@aws-sdk/middleware-websocket/node_modules/@smithy/protocol-http/dist-es/httpRequest.js

// node_modules/@aws-sdk/middleware-websocket/node_modules/@smithy/protocol-http/dist-es/types.js

// node_modules/@aws-sdk/middleware-websocket/node_modules/@smithy/protocol-http/dist-es/index.js

// node_modules/@aws-sdk/middleware-websocket/dist-es/utils.js

// node_modules/@aws-sdk/middleware-websocket/dist-es/middlewares/websocketEndpointMiddleware.js

// node_modules/@aws-sdk/middleware-websocket/dist-es/middlewares/websocketInjectSessionIdMiddleware.js

// node_modules/@aws-sdk/middleware-websocket/dist-es/getWebSocketPlugin.js

// node_modules/@aws-sdk/middleware-websocket/dist-es/WebsocketSignatureV4.js

// node_modules/@aws-sdk/middleware-websocket/dist-es/resolveWebSocketConfig.js

// node_modules/@aws-sdk/middleware-websocket/dist-es/ws-eventstream/eventStreamPayloadHandlerProvider.js

// node_modules/@aws-sdk/middleware-websocket/dist-es/index.js

// node_modules/@smithy/eventstream-serde-config-resolver/dist-es/EventStreamSerdeConfig.js

// node_modules/@smithy/eventstream-serde-config-resolver/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/client.js
var import_middleware_stack5;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/collect-stream-body.js
var import_protocols8;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/abort.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/auth/auth.js
var HttpAuthLocation3;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/auth/HttpApiKeyAuth.js
var HttpApiKeyAuthLocation3;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/auth/HttpAuthScheme.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/auth/HttpAuthSchemeProvider.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/auth/HttpSigner.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/auth/IdentityProviderConfig.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/auth/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/blob/blob-payload-input-types.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/checksum.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/client.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/command.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/connection/config.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/connection/manager.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/connection/pool.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/connection/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/crypto.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/encode.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme3;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/endpoints/EndpointRuleObject.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/endpoints/ErrorRuleObject.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/endpoints/RuleSetObject.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/endpoints/shared.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/endpoints/TreeRuleObject.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/endpoints/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/eventStream.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId3;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/extensions/defaultClientConfiguration.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/extensions/defaultExtensionConfiguration.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/feature-ids.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/http.js
var FieldPosition3;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/http/httpHandlerInitialization.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/identity/apiKeyIdentity.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/identity/awsCredentialIdentity.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/identity/identity.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/identity/tokenIdentity.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/identity/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/logger.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/middleware.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/profile.js
var IniSectionType3;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/response.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/retry.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/schema/schema.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/schema/traits.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/schema/schema-deprecated.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/schema/sentinels.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/schema/static-schemas.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/serde.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/shapes.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/signature.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/stream.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-common-types.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-input-types.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-output-types.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/transfer.js
var RequestHandlerProtocol3;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/transform/client-payload-blob-type-narrow.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/transform/mutable.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/transform/no-undefined.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/transform/type-transform.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/uri.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/util.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/waiter.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/types/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/schemaLogFilter.js
var import_schema5, SENSITIVE_STRING5 = "***SensitiveInformation***";

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/command.js

var import_middleware_stack6;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/constants.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/exceptions.js
var ServiceException3, decorateServiceException3 = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v]) => v !== void 0).forEach(([k2, v]) => {
    if (exception[k2] == null || exception[k2] === "")
      exception[k2] = v;
  });
  let message = exception.message || exception.Message || "UnknownError";
  return exception.message = message, delete exception.Message, exception;
};

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/default-error-handler.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/defaults-mode.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/extended-encode-uri-component.js
var import_protocols9;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js
var knownAlgorithms3, getChecksumConfiguration3 = (runtimeConfig) => {
  let checksumAlgorithms = [];
  for (let id in AlgorithmId3) {
    let algorithmId = AlgorithmId3[id];
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
      if (knownAlgorithms3.includes(id))
        runtimeConfig.checksumAlgorithms[id.toUpperCase()] = ctor;
      else
        runtimeConfig.checksumAlgorithms[id] = ctor;
      checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return checksumAlgorithms;
    }
  };
}, resolveChecksumRuntimeConfig3 = (clientConfig) => {
  let runtimeConfig = {};
  return clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    let id = checksumAlgorithm.algorithmId();
    if (knownAlgorithms3.includes(id))
      runtimeConfig[id] = checksumAlgorithm.checksumConstructor();
  }), runtimeConfig;
};

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/extensions/retry.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/get-array-if-single-item.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/is-serializable-header-value.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/object-mapping.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/resolve-path.js
var import_protocols10;

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/ser-utils.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/serde-json.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/index.js
__export(exports_dist_es12, {
  withBaseException: () => withBaseException3,
  throwDefaultError: () => throwDefaultError3,
  take: () => take3,
  serializeFloat: () => serializeFloat3,
  serializeDateTime: () => serializeDateTime3,
  resolvedPath: () => import_protocols10.resolvedPath,
  resolveDefaultRuntimeConfig: () => resolveDefaultRuntimeConfig3,
  map: () => map4,
  loadConfigsForDefaultMode: () => loadConfigsForDefaultMode3,
  isSerializableHeaderValue: () => isSerializableHeaderValue3,
  getValueFromTextNode: () => getValueFromTextNode3,
  getDefaultExtensionConfiguration: () => getDefaultExtensionConfiguration3,
  getDefaultClientConfiguration: () => getDefaultClientConfiguration3,
  getArrayIfSingleItem: () => getArrayIfSingleItem3,
  extendedEncodeURIComponent: () => import_protocols9.extendedEncodeURIComponent,
  emitWarningIfUnsupportedVersion: () => emitWarningIfUnsupportedVersion5,
  decorateServiceException: () => decorateServiceException3,
  createAggregatedClient: () => createAggregatedClient3,
  convertMap: () => convertMap3,
  collectBody: () => import_protocols8.collectBody,
  _json: () => _json3,
  ServiceException: () => ServiceException3,
  SENSITIVE_STRING: () => SENSITIVE_STRING6,
  NoOpLogger: () => NoOpLogger5,
  Command: () => Command3,
  Client: () => Client3
});

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/auth/httpAuthSchemeProvider.js
var import_httpAuthSchemes5, import_core30, import_util_middleware2, defaultBedrockRuntimeHttpAuthSchemeParametersProvider = async (config5, context, input) => {
  return {
    operation: import_util_middleware2.getSmithyContext(context).operation,
    region: await import_util_middleware2.normalizeProvider(config5.region)() || (() => {
      throw Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
}, defaultBedrockRuntimeHttpAuthSchemeProvider = (authParameters) => {
  let options = [];
  switch (authParameters.operation) {
    default:
      options.push(createAwsAuthSigv4HttpAuthOption2(authParameters)), options.push(createSmithyApiHttpBearerAuthHttpAuthOption2(authParameters));
  }
  return options;
}, resolveHttpAuthSchemeConfig2 = (config5) => {
  let token = import_core30.memoizeIdentityProvider(config5.token, import_core30.isIdentityExpired, import_core30.doesIdentityRequireRefresh), config_0 = import_httpAuthSchemes5.resolveAwsSdkSigV4Config(config5);
  return Object.assign(config_0, {
    authSchemePreference: import_util_middleware2.normalizeProvider(config5.authSchemePreference ?? []),
    token
  });
};

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/endpoint/EndpointParameters.js

// node_modules/@aws-sdk/client-bedrock-runtime/package.json
var package_default2;

// node_modules/@aws-sdk/eventstream-handler-node/dist-es/EventSigningTransformStream.js
import { Transform as Transform2 } from "stream";
var EventSigningTransformStream;

// node_modules/@aws-sdk/eventstream-handler-node/dist-es/EventStreamPayloadHandler.js
import { PassThrough as PassThrough2, pipeline, Readable as Readable5 } from "stream";


// node_modules/@aws-sdk/eventstream-handler-node/dist-es/eventStreamPayloadHandlerProvider.js

// node_modules/@aws-sdk/eventstream-handler-node/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/node_modules/@smithy/eventstream-serde-universal/dist-es/getChunkedStream.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/node_modules/@smithy/eventstream-serde-universal/dist-es/getUnmarshalledStream.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/node_modules/@smithy/eventstream-serde-universal/dist-es/EventStreamMarshaller.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/node_modules/@smithy/eventstream-serde-universal/dist-es/provider.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/node_modules/@smithy/eventstream-serde-universal/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/dist-es/utils.js
async function* readabletoIterable(readStream2) {
  let streamEnded = !1, generationEnded = !1, records = [];
  readStream2.on("error", (err) => {
    if (!streamEnded)
      streamEnded = !0;
    if (err)
      throw err;
  }), readStream2.on("data", (data) => {
    records.push(data);
  }), readStream2.on("end", () => {
    streamEnded = !0;
  });
  while (!generationEnded) {
    let value = await new Promise((resolve8) => setTimeout(() => resolve8(records.shift()), 0));
    if (value)
      yield value;
    generationEnded = streamEnded && records.length === 0;
  }
}

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/dist-es/EventStreamMarshaller.js
import { Readable as Readable6 } from "stream";


// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/dist-es/provider.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/eventstream-serde-node/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/util-base64/dist-es/fromBase64.js
var BASE64_REGEX2, fromBase643 = (input) => {
  if (input.length * 3 % 4 !== 0)
    throw TypeError("Incorrect padding on base64 string.");
  if (!BASE64_REGEX2.exec(input))
    throw TypeError("Invalid base64 string.");
  let buffer = fromString3(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/util-base64/dist-es/toBase64.js
var import_util_utf84, toBase643 = (_input) => {
  let input;
  if (typeof _input === "string")
    input = import_util_utf84.fromUtf8(_input);
  else
    input = _input;
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number")
    throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  return fromArrayBuffer3(input.buffer, input.byteOffset, input.byteLength).toString("base64");
};

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/util-base64/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/endpoint/ruleset.js
var h3, i3, j3, k2, l2, m2, n3, o3, p2, q2, r2, _data2, ruleSet2;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/endpoint/endpointResolver.js
var import_util_endpoints3, import_util_endpoints4, cache2, defaultEndpointResolver2 = (endpointParams, context = {}) => {
  return cache2.get(endpointParams, () => import_util_endpoints4.resolveEndpoint(ruleSet2, {
    endpointParams,
    logger: context.logger
  }));
};

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/models/BedrockRuntimeServiceException.js
var BedrockRuntimeServiceException;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/models/errors.js
var AccessDeniedException2, InternalServerException2, ThrottlingException2, ValidationException2, ConflictException2, ResourceNotFoundException2, ServiceQuotaExceededException2, ServiceUnavailableException2, ModelErrorException, ModelNotReadyException, ModelTimeoutException, ModelStreamErrorException;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/schemas/schemas_0.js
var import_schema6, _s_registry2, BedrockRuntimeServiceException$, n0_registry2, AccessDeniedException$2, ConflictException$2, InternalServerException$2, ModelErrorException$, ModelNotReadyException$, ModelStreamErrorException$, ModelTimeoutException$, ResourceNotFoundException$2, ServiceQuotaExceededException$2, ServiceUnavailableException$2, ThrottlingException$2, ValidationException$2, errorTypeRegistries2, AsyncInvokeMessage, Body, GuardrailAutomatedReasoningStatementLogicContent, GuardrailAutomatedReasoningStatementNaturalLanguageContent, ModelInputPayload, PartBody, AnyToolChoice$, AppliedGuardrailDetails$, ApplyGuardrailRequest$, ApplyGuardrailResponse$, AsyncInvokeS3OutputDataConfig$, AsyncInvokeSummary$, AudioBlock$, AutoToolChoice$, BidirectionalInputPayloadPart$, BidirectionalOutputPayloadPart$, CacheDetail$, CachePointBlock$, Citation$, CitationsConfig$, CitationsContentBlock$, CitationsDelta$, CitationSourceContentDelta$, ContentBlockDeltaEvent$, ContentBlockStartEvent$, ContentBlockStopEvent$, ConverseMetrics$, ConverseRequest$, ConverseResponse$, ConverseStreamMetadataEvent$, ConverseStreamMetrics$, ConverseStreamRequest$, ConverseStreamResponse$, ConverseStreamTrace$, ConverseTokensRequest$, ConverseTrace$, CountTokensRequest$, CountTokensResponse$, DocumentBlock$, DocumentCharLocation$, DocumentChunkLocation$, DocumentPageLocation$, ErrorBlock$, GetAsyncInvokeRequest$, GetAsyncInvokeResponse$, GuardrailAssessment$, GuardrailAutomatedReasoningImpossibleFinding$, GuardrailAutomatedReasoningInputTextReference$, GuardrailAutomatedReasoningInvalidFinding$, GuardrailAutomatedReasoningLogicWarning$, GuardrailAutomatedReasoningNoTranslationsFinding$, GuardrailAutomatedReasoningPolicyAssessment$, GuardrailAutomatedReasoningRule$, GuardrailAutomatedReasoningSatisfiableFinding$, GuardrailAutomatedReasoningScenario$, GuardrailAutomatedReasoningStatement$, GuardrailAutomatedReasoningTooComplexFinding$, GuardrailAutomatedReasoningTranslation$, GuardrailAutomatedReasoningTranslationAmbiguousFinding$, GuardrailAutomatedReasoningTranslationOption$, GuardrailAutomatedReasoningValidFinding$, GuardrailConfiguration$2, GuardrailContentFilter$2, GuardrailContentPolicyAssessment$, GuardrailContextualGroundingFilter$2, GuardrailContextualGroundingPolicyAssessment$, GuardrailConverseImageBlock$, GuardrailConverseTextBlock$, GuardrailCoverage$, GuardrailCustomWord$, GuardrailImageBlock$, GuardrailImageCoverage$, GuardrailInvocationMetrics$, GuardrailManagedWord$, GuardrailOutputContent$, GuardrailPiiEntityFilter$, GuardrailRegexFilter$, GuardrailSensitiveInformationPolicyAssessment$, GuardrailStreamConfiguration$, GuardrailTextBlock$, GuardrailTextCharactersCoverage$, GuardrailTopic$2, GuardrailTopicPolicyAssessment$, GuardrailTraceAssessment$, GuardrailUsage$, GuardrailWordPolicyAssessment$, ImageBlock$, ImageBlockDelta$, ImageBlockStart$, InferenceConfiguration$, InvokeModelRequest$, InvokeModelResponse$, InvokeModelTokensRequest$, InvokeModelWithBidirectionalStreamRequest$, InvokeModelWithBidirectionalStreamResponse$, InvokeModelWithResponseStreamRequest$, InvokeModelWithResponseStreamResponse$, JsonSchemaDefinition$, ListAsyncInvokesRequest$, ListAsyncInvokesResponse$, Message$, MessageStartEvent$, MessageStopEvent$, OutputConfig$, OutputFormat$, PayloadPart$, PerformanceConfiguration$2, PromptRouterTrace$, ReasoningTextBlock$, S3Location$, SearchResultBlock$, SearchResultContentBlock$, SearchResultLocation$, ServiceTier$, SpecificToolChoice$, StartAsyncInvokeRequest$, StartAsyncInvokeResponse$, SystemTool$, Tag$2, TokenUsage$, ToolConfiguration$, ToolResultBlock$, ToolResultBlockStart$, ToolSpecification$, ToolUseBlock$, ToolUseBlockDelta$, ToolUseBlockStart$, VideoBlock$, WebLocation$, AsyncInvokeSummaries, CacheDetailsList, CitationGeneratedContentList, Citations, CitationSourceContentList, CitationSourceContentListDelta, ContentBlocks, DocumentContentBlocks, GuardrailAssessmentList, GuardrailAutomatedReasoningDifferenceScenarioList, GuardrailAutomatedReasoningFindingList, GuardrailAutomatedReasoningInputTextReferenceList, GuardrailAutomatedReasoningRuleList, GuardrailAutomatedReasoningStatementList, GuardrailAutomatedReasoningTranslationList, GuardrailAutomatedReasoningTranslationOptionList, GuardrailContentBlockList, GuardrailContentFilterList, GuardrailContextualGroundingFilters2, GuardrailCustomWordList, GuardrailManagedWordList, GuardrailOutputContentList, GuardrailPiiEntityFilterList, GuardrailRegexFilterList, GuardrailTopicList, Messages3, SearchResultContentBlocks, SystemContentBlocks, TagList2, ToolResultBlocksDelta, ToolResultContentBlocks, Tools, GuardrailAssessmentListMap, GuardrailAssessmentMap, PromptVariableMap, RequestMetadata, AsyncInvokeOutputDataConfig$, AudioSource$, CitationGeneratedContent$, CitationLocation$, CitationSourceContent$, ContentBlock$, ContentBlockDelta$, ContentBlockStart$, ConverseOutput$, ConverseStreamOutput$, CountTokensInput$, DocumentContentBlock$, DocumentSource$, GuardrailAutomatedReasoningFinding$, GuardrailContentBlock$, GuardrailConverseContentBlock$, GuardrailConverseImageSource$, GuardrailImageSource$, ImageSource$, InvokeModelWithBidirectionalStreamInput$, InvokeModelWithBidirectionalStreamOutput$, OutputFormatStructure$, PromptVariableValues$, ReasoningContentBlock$, ReasoningContentBlockDelta$, ResponseStream$, SystemContentBlock$, Tool$, ToolChoice$, ToolInputSchema$, ToolResultBlockDelta$, ToolResultContentBlock$, VideoSource$, ApplyGuardrail$, Converse$, ConverseStream$, CountTokens$, GetAsyncInvoke$, InvokeModel$, InvokeModelWithBidirectionalStream$, InvokeModelWithResponseStream$, ListAsyncInvokes$, StartAsyncInvoke$;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/runtimeConfig.shared.js
var import_httpAuthSchemes6, import_protocols11, import_core31, import_url_parser3, import_util_utf85, getRuntimeConfig3 = (config5) => {
  return {
    apiVersion: "2023-09-30",
    base64Decoder: config5?.base64Decoder ?? fromBase643,
    base64Encoder: config5?.base64Encoder ?? toBase643,
    disableHostPrefix: config5?.disableHostPrefix ?? !1,
    endpointProvider: config5?.endpointProvider ?? defaultEndpointResolver2,
    extensions: config5?.extensions ?? [],
    httpAuthSchemeProvider: config5?.httpAuthSchemeProvider ?? defaultBedrockRuntimeHttpAuthSchemeProvider,
    httpAuthSchemes: config5?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new import_httpAuthSchemes6.AwsSdkSigV4Signer
      },
      {
        schemeId: "smithy.api#httpBearerAuth",
        identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#httpBearerAuth"),
        signer: new import_core31.HttpBearerAuthSigner
      }
    ],
    logger: config5?.logger ?? new NoOpLogger5,
    protocol: config5?.protocol ?? import_protocols11.AwsRestJsonProtocol,
    protocolSettings: config5?.protocolSettings ?? {
      defaultNamespace: "com.amazonaws.bedrockruntime",
      errorTypeRegistries: errorTypeRegistries2,
      version: "2023-09-30",
      serviceTarget: "AmazonBedrockFrontendService"
    },
    serviceId: config5?.serviceId ?? "Bedrock Runtime",
    urlParser: config5?.urlParser ?? import_url_parser3.parseUrl,
    utf8Decoder: config5?.utf8Decoder ?? import_util_utf85.fromUtf8,
    utf8Encoder: config5?.utf8Encoder ?? import_util_utf85.toUtf8
  };
};

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/runtimeConfig.js
var import_client18, import_httpAuthSchemes7, import_util_user_agent_node2, import_config_resolver3, import_core32, import_hash_node2, import_middleware_retry3, import_node_config_provider4, import_node_http_handler3, import_util_body_length_node2, import_util_defaults_mode_node2, import_util_retry2, getRuntimeConfig4 = (config5) => {
  emitWarningIfUnsupportedVersion5(process.version);
  let defaultsMode = import_util_defaults_mode_node2.resolveDefaultsModeConfig(config5), defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode3), clientSharedValues = getRuntimeConfig3(config5);
  import_client18.emitWarningIfUnsupportedVersion(process.version);
  let loaderConfig = {
    profile: config5?.profile,
    logger: clientSharedValues.logger,
    signingName: "bedrock"
  };
  return {
    ...clientSharedValues,
    ...config5,
    runtime: "node",
    defaultsMode,
    authSchemePreference: config5?.authSchemePreference ?? import_node_config_provider4.loadConfig(import_httpAuthSchemes7.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
    bodyLengthChecker: config5?.bodyLengthChecker ?? import_util_body_length_node2.calculateBodyLength,
    credentialDefaultProvider: config5?.credentialDefaultProvider ?? defaultProvider,
    defaultUserAgentProvider: config5?.defaultUserAgentProvider ?? import_util_user_agent_node2.createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: package_default2.version }),
    eventStreamPayloadHandlerProvider: config5?.eventStreamPayloadHandlerProvider ?? eventStreamPayloadHandlerProvider2,
    eventStreamSerdeProvider: config5?.eventStreamSerdeProvider ?? eventStreamSerdeProvider,
    httpAuthSchemes: config5?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new import_httpAuthSchemes7.AwsSdkSigV4Signer
      },
      {
        schemeId: "smithy.api#httpBearerAuth",
        identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#httpBearerAuth") || (async (idProps) => {
          try {
            return await fromEnvSigningName2({ signingName: "bedrock" })();
          } catch (error41) {
            return await nodeProvider2(idProps)(idProps);
          }
        }),
        signer: new import_core32.HttpBearerAuthSigner
      }
    ],
    maxAttempts: config5?.maxAttempts ?? import_node_config_provider4.loadConfig(import_middleware_retry3.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config5),
    region: config5?.region ?? import_node_config_provider4.loadConfig(import_config_resolver3.NODE_REGION_CONFIG_OPTIONS, { ...import_config_resolver3.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
    requestHandler: import_node_http_handler3.NodeHttp2Handler.create(config5?.requestHandler ?? (async () => ({
      ...await defaultConfigProvider(),
      disableConcurrentStreams: !0
    }))),
    retryMode: config5?.retryMode ?? import_node_config_provider4.loadConfig({
      ...import_middleware_retry3.NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || import_util_retry2.DEFAULT_RETRY_MODE
    }, config5),
    sha256: config5?.sha256 ?? import_hash_node2.Hash.bind(null, "sha256"),
    streamCollector: config5?.streamCollector ?? import_node_http_handler3.streamCollector,
    useDualstackEndpoint: config5?.useDualstackEndpoint ?? import_node_config_provider4.loadConfig(import_config_resolver3.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    useFipsEndpoint: config5?.useFipsEndpoint ?? import_node_config_provider4.loadConfig(import_config_resolver3.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
    userAgentAppId: config5?.userAgentAppId ?? import_node_config_provider4.loadConfig(import_util_user_agent_node2.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
  };
};

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/protocol-http/dist-es/extensions/httpExtensionConfiguration.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/protocol-http/dist-es/extensions/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/protocol-http/dist-es/Field.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/protocol-http/dist-es/httpHandler.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/protocol-http/dist-es/types.js

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/protocol-http/dist-es/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/auth/httpAuthExtensionConfiguration.js

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/runtimeExtensions.js
var import_region_config_resolver2, resolveRuntimeExtensions2 = (runtimeConfig, extensions13) => {
  let extensionConfiguration = Object.assign(import_region_config_resolver2.getAwsRegionExtensionConfiguration(runtimeConfig), getDefaultExtensionConfiguration3(runtimeConfig), getHttpHandlerExtensionConfiguration2(runtimeConfig), getHttpAuthExtensionConfiguration2(runtimeConfig));
  return extensions13.forEach((extension) => extension.configure(extensionConfiguration)), Object.assign(runtimeConfig, import_region_config_resolver2.resolveAwsRegionExtensionConfiguration(extensionConfiguration), resolveDefaultRuntimeConfig3(extensionConfiguration), resolveHttpHandlerRuntimeConfig2(extensionConfiguration), resolveHttpAuthRuntimeConfig2(extensionConfiguration));
};

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/BedrockRuntimeClient.js
var import_middleware_host_header2, import_middleware_logger2, import_middleware_recursion_detection2, import_middleware_user_agent2, import_config_resolver4, import_core33, import_schema7, import_middleware_content_length2, import_middleware_endpoint103, import_middleware_retry4, BedrockRuntimeClient;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/ApplyGuardrailCommand.js
var import_middleware_endpoint104, ApplyGuardrailCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/ConverseCommand.js
var import_middleware_endpoint105, ConverseCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/ConverseStreamCommand.js
var import_middleware_endpoint106, ConverseStreamCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/CountTokensCommand.js
var import_middleware_endpoint107, CountTokensCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/GetAsyncInvokeCommand.js
var import_middleware_endpoint108, GetAsyncInvokeCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/InvokeModelCommand.js
var import_middleware_endpoint109, InvokeModelCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/InvokeModelWithBidirectionalStreamCommand.js
var import_middleware_endpoint110, InvokeModelWithBidirectionalStreamCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/InvokeModelWithResponseStreamCommand.js
var import_middleware_endpoint111, InvokeModelWithResponseStreamCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/ListAsyncInvokesCommand.js
var import_middleware_endpoint112, ListAsyncInvokesCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/StartAsyncInvokeCommand.js
var import_middleware_endpoint113, StartAsyncInvokeCommand;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/pagination/ListAsyncInvokesPaginator.js
var import_core34, paginateListAsyncInvokes;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/BedrockRuntime.js
var commands3, paginators2, BedrockRuntime;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/commands/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/pagination/Interfaces.js

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/pagination/index.js

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/models/enums.js
var AsyncInvokeStatus, SortAsyncInvocationBy, SortOrder2, GuardrailImageFormat, GuardrailContentQualifier, GuardrailOutputScope, GuardrailContentSource, GuardrailAction, GuardrailOrigin, GuardrailOwnership, GuardrailAutomatedReasoningLogicWarningType, GuardrailContentPolicyAction, GuardrailContentFilterConfidence, GuardrailContentFilterStrength, GuardrailContentFilterType2, GuardrailContextualGroundingPolicyAction, GuardrailContextualGroundingFilterType2, GuardrailSensitiveInformationPolicyAction, GuardrailPiiEntityType2, GuardrailTopicPolicyAction, GuardrailTopicType2, GuardrailWordPolicyAction, GuardrailManagedWordType, GuardrailTrace, AudioFormat, CacheTTL, CachePointType, DocumentFormat, GuardrailConverseImageFormat, GuardrailConverseContentQualifier, ImageFormat, VideoFormat, ToolResultStatus, ToolUseType, ConversationRole, OutputFormatType, PerformanceConfigLatency2, ServiceTierType, StopReason, GuardrailStreamProcessingMode, Trace;

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/models/models_0.js

// node_modules/@aws-sdk/client-bedrock-runtime/dist-es/index.js
__export(exports_dist_es13, {
  paginateListAsyncInvokes: () => paginateListAsyncInvokes,
  errorTypeRegistries: () => errorTypeRegistries2,
  __Client: () => Client3,
  WebLocation$: () => WebLocation$,
  VideoSource$: () => VideoSource$,
  VideoFormat: () => VideoFormat,
  VideoBlock$: () => VideoBlock$,
  ValidationException$: () => ValidationException$2,
  ValidationException: () => ValidationException2,
  Trace: () => Trace,
  ToolUseType: () => ToolUseType,
  ToolUseBlockStart$: () => ToolUseBlockStart$,
  ToolUseBlockDelta$: () => ToolUseBlockDelta$,
  ToolUseBlock$: () => ToolUseBlock$,
  ToolSpecification$: () => ToolSpecification$,
  ToolResultStatus: () => ToolResultStatus,
  ToolResultContentBlock$: () => ToolResultContentBlock$,
  ToolResultBlockStart$: () => ToolResultBlockStart$,
  ToolResultBlockDelta$: () => ToolResultBlockDelta$,
  ToolResultBlock$: () => ToolResultBlock$,
  ToolInputSchema$: () => ToolInputSchema$,
  ToolConfiguration$: () => ToolConfiguration$,
  ToolChoice$: () => ToolChoice$,
  Tool$: () => Tool$,
  TokenUsage$: () => TokenUsage$,
  ThrottlingException$: () => ThrottlingException$2,
  ThrottlingException: () => ThrottlingException2,
  Tag$: () => Tag$2,
  SystemTool$: () => SystemTool$,
  SystemContentBlock$: () => SystemContentBlock$,
  StopReason: () => StopReason,
  StartAsyncInvokeResponse$: () => StartAsyncInvokeResponse$,
  StartAsyncInvokeRequest$: () => StartAsyncInvokeRequest$,
  StartAsyncInvokeCommand: () => StartAsyncInvokeCommand,
  StartAsyncInvoke$: () => StartAsyncInvoke$,
  SpecificToolChoice$: () => SpecificToolChoice$,
  SortOrder: () => SortOrder2,
  SortAsyncInvocationBy: () => SortAsyncInvocationBy,
  ServiceUnavailableException$: () => ServiceUnavailableException$2,
  ServiceUnavailableException: () => ServiceUnavailableException2,
  ServiceTierType: () => ServiceTierType,
  ServiceTier$: () => ServiceTier$,
  ServiceQuotaExceededException$: () => ServiceQuotaExceededException$2,
  ServiceQuotaExceededException: () => ServiceQuotaExceededException2,
  SearchResultLocation$: () => SearchResultLocation$,
  SearchResultContentBlock$: () => SearchResultContentBlock$,
  SearchResultBlock$: () => SearchResultBlock$,
  S3Location$: () => S3Location$,
  ResponseStream$: () => ResponseStream$,
  ResourceNotFoundException$: () => ResourceNotFoundException$2,
  ResourceNotFoundException: () => ResourceNotFoundException2,
  ReasoningTextBlock$: () => ReasoningTextBlock$,
  ReasoningContentBlockDelta$: () => ReasoningContentBlockDelta$,
  ReasoningContentBlock$: () => ReasoningContentBlock$,
  PromptVariableValues$: () => PromptVariableValues$,
  PromptRouterTrace$: () => PromptRouterTrace$,
  PerformanceConfiguration$: () => PerformanceConfiguration$2,
  PerformanceConfigLatency: () => PerformanceConfigLatency2,
  PayloadPart$: () => PayloadPart$,
  OutputFormatType: () => OutputFormatType,
  OutputFormatStructure$: () => OutputFormatStructure$,
  OutputFormat$: () => OutputFormat$,
  OutputConfig$: () => OutputConfig$,
  ModelTimeoutException$: () => ModelTimeoutException$,
  ModelTimeoutException: () => ModelTimeoutException,
  ModelStreamErrorException$: () => ModelStreamErrorException$,
  ModelStreamErrorException: () => ModelStreamErrorException,
  ModelNotReadyException$: () => ModelNotReadyException$,
  ModelNotReadyException: () => ModelNotReadyException,
  ModelErrorException$: () => ModelErrorException$,
  ModelErrorException: () => ModelErrorException,
  MessageStopEvent$: () => MessageStopEvent$,
  MessageStartEvent$: () => MessageStartEvent$,
  Message$: () => Message$,
  ListAsyncInvokesResponse$: () => ListAsyncInvokesResponse$,
  ListAsyncInvokesRequest$: () => ListAsyncInvokesRequest$,
  ListAsyncInvokesCommand: () => ListAsyncInvokesCommand,
  ListAsyncInvokes$: () => ListAsyncInvokes$,
  JsonSchemaDefinition$: () => JsonSchemaDefinition$,
  InvokeModelWithResponseStreamResponse$: () => InvokeModelWithResponseStreamResponse$,
  InvokeModelWithResponseStreamRequest$: () => InvokeModelWithResponseStreamRequest$,
  InvokeModelWithResponseStreamCommand: () => InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStream$: () => InvokeModelWithResponseStream$,
  InvokeModelWithBidirectionalStreamResponse$: () => InvokeModelWithBidirectionalStreamResponse$,
  InvokeModelWithBidirectionalStreamRequest$: () => InvokeModelWithBidirectionalStreamRequest$,
  InvokeModelWithBidirectionalStreamOutput$: () => InvokeModelWithBidirectionalStreamOutput$,
  InvokeModelWithBidirectionalStreamInput$: () => InvokeModelWithBidirectionalStreamInput$,
  InvokeModelWithBidirectionalStreamCommand: () => InvokeModelWithBidirectionalStreamCommand,
  InvokeModelWithBidirectionalStream$: () => InvokeModelWithBidirectionalStream$,
  InvokeModelTokensRequest$: () => InvokeModelTokensRequest$,
  InvokeModelResponse$: () => InvokeModelResponse$,
  InvokeModelRequest$: () => InvokeModelRequest$,
  InvokeModelCommand: () => InvokeModelCommand,
  InvokeModel$: () => InvokeModel$,
  InternalServerException$: () => InternalServerException$2,
  InternalServerException: () => InternalServerException2,
  InferenceConfiguration$: () => InferenceConfiguration$,
  ImageSource$: () => ImageSource$,
  ImageFormat: () => ImageFormat,
  ImageBlockStart$: () => ImageBlockStart$,
  ImageBlockDelta$: () => ImageBlockDelta$,
  ImageBlock$: () => ImageBlock$,
  GuardrailWordPolicyAssessment$: () => GuardrailWordPolicyAssessment$,
  GuardrailWordPolicyAction: () => GuardrailWordPolicyAction,
  GuardrailUsage$: () => GuardrailUsage$,
  GuardrailTraceAssessment$: () => GuardrailTraceAssessment$,
  GuardrailTrace: () => GuardrailTrace,
  GuardrailTopicType: () => GuardrailTopicType2,
  GuardrailTopicPolicyAssessment$: () => GuardrailTopicPolicyAssessment$,
  GuardrailTopicPolicyAction: () => GuardrailTopicPolicyAction,
  GuardrailTopic$: () => GuardrailTopic$2,
  GuardrailTextCharactersCoverage$: () => GuardrailTextCharactersCoverage$,
  GuardrailTextBlock$: () => GuardrailTextBlock$,
  GuardrailStreamProcessingMode: () => GuardrailStreamProcessingMode,
  GuardrailStreamConfiguration$: () => GuardrailStreamConfiguration$,
  GuardrailSensitiveInformationPolicyAssessment$: () => GuardrailSensitiveInformationPolicyAssessment$,
  GuardrailSensitiveInformationPolicyAction: () => GuardrailSensitiveInformationPolicyAction,
  GuardrailRegexFilter$: () => GuardrailRegexFilter$,
  GuardrailPiiEntityType: () => GuardrailPiiEntityType2,
  GuardrailPiiEntityFilter$: () => GuardrailPiiEntityFilter$,
  GuardrailOwnership: () => GuardrailOwnership,
  GuardrailOutputScope: () => GuardrailOutputScope,
  GuardrailOutputContent$: () => GuardrailOutputContent$,
  GuardrailOrigin: () => GuardrailOrigin,
  GuardrailManagedWordType: () => GuardrailManagedWordType,
  GuardrailManagedWord$: () => GuardrailManagedWord$,
  GuardrailInvocationMetrics$: () => GuardrailInvocationMetrics$,
  GuardrailImageSource$: () => GuardrailImageSource$,
  GuardrailImageFormat: () => GuardrailImageFormat,
  GuardrailImageCoverage$: () => GuardrailImageCoverage$,
  GuardrailImageBlock$: () => GuardrailImageBlock$,
  GuardrailCustomWord$: () => GuardrailCustomWord$,
  GuardrailCoverage$: () => GuardrailCoverage$,
  GuardrailConverseTextBlock$: () => GuardrailConverseTextBlock$,
  GuardrailConverseImageSource$: () => GuardrailConverseImageSource$,
  GuardrailConverseImageFormat: () => GuardrailConverseImageFormat,
  GuardrailConverseImageBlock$: () => GuardrailConverseImageBlock$,
  GuardrailConverseContentQualifier: () => GuardrailConverseContentQualifier,
  GuardrailConverseContentBlock$: () => GuardrailConverseContentBlock$,
  GuardrailContextualGroundingPolicyAssessment$: () => GuardrailContextualGroundingPolicyAssessment$,
  GuardrailContextualGroundingPolicyAction: () => GuardrailContextualGroundingPolicyAction,
  GuardrailContextualGroundingFilterType: () => GuardrailContextualGroundingFilterType2,
  GuardrailContextualGroundingFilter$: () => GuardrailContextualGroundingFilter$2,
  GuardrailContentSource: () => GuardrailContentSource,
  GuardrailContentQualifier: () => GuardrailContentQualifier,
  GuardrailContentPolicyAssessment$: () => GuardrailContentPolicyAssessment$,
  GuardrailContentPolicyAction: () => GuardrailContentPolicyAction,
  GuardrailContentFilterType: () => GuardrailContentFilterType2,
  GuardrailContentFilterStrength: () => GuardrailContentFilterStrength,
  GuardrailContentFilterConfidence: () => GuardrailContentFilterConfidence,
  GuardrailContentFilter$: () => GuardrailContentFilter$2,
  GuardrailContentBlock$: () => GuardrailContentBlock$,
  GuardrailConfiguration$: () => GuardrailConfiguration$2,
  GuardrailAutomatedReasoningValidFinding$: () => GuardrailAutomatedReasoningValidFinding$,
  GuardrailAutomatedReasoningTranslationOption$: () => GuardrailAutomatedReasoningTranslationOption$,
  GuardrailAutomatedReasoningTranslationAmbiguousFinding$: () => GuardrailAutomatedReasoningTranslationAmbiguousFinding$,
  GuardrailAutomatedReasoningTranslation$: () => GuardrailAutomatedReasoningTranslation$,
  GuardrailAutomatedReasoningTooComplexFinding$: () => GuardrailAutomatedReasoningTooComplexFinding$,
  GuardrailAutomatedReasoningStatement$: () => GuardrailAutomatedReasoningStatement$,
  GuardrailAutomatedReasoningScenario$: () => GuardrailAutomatedReasoningScenario$,
  GuardrailAutomatedReasoningSatisfiableFinding$: () => GuardrailAutomatedReasoningSatisfiableFinding$,
  GuardrailAutomatedReasoningRule$: () => GuardrailAutomatedReasoningRule$,
  GuardrailAutomatedReasoningPolicyAssessment$: () => GuardrailAutomatedReasoningPolicyAssessment$,
  GuardrailAutomatedReasoningNoTranslationsFinding$: () => GuardrailAutomatedReasoningNoTranslationsFinding$,
  GuardrailAutomatedReasoningLogicWarningType: () => GuardrailAutomatedReasoningLogicWarningType,
  GuardrailAutomatedReasoningLogicWarning$: () => GuardrailAutomatedReasoningLogicWarning$,
  GuardrailAutomatedReasoningInvalidFinding$: () => GuardrailAutomatedReasoningInvalidFinding$,
  GuardrailAutomatedReasoningInputTextReference$: () => GuardrailAutomatedReasoningInputTextReference$,
  GuardrailAutomatedReasoningImpossibleFinding$: () => GuardrailAutomatedReasoningImpossibleFinding$,
  GuardrailAutomatedReasoningFinding$: () => GuardrailAutomatedReasoningFinding$,
  GuardrailAssessment$: () => GuardrailAssessment$,
  GuardrailAction: () => GuardrailAction,
  GetAsyncInvokeResponse$: () => GetAsyncInvokeResponse$,
  GetAsyncInvokeRequest$: () => GetAsyncInvokeRequest$,
  GetAsyncInvokeCommand: () => GetAsyncInvokeCommand,
  GetAsyncInvoke$: () => GetAsyncInvoke$,
  ErrorBlock$: () => ErrorBlock$,
  DocumentSource$: () => DocumentSource$,
  DocumentPageLocation$: () => DocumentPageLocation$,
  DocumentFormat: () => DocumentFormat,
  DocumentContentBlock$: () => DocumentContentBlock$,
  DocumentChunkLocation$: () => DocumentChunkLocation$,
  DocumentCharLocation$: () => DocumentCharLocation$,
  DocumentBlock$: () => DocumentBlock$,
  CountTokensResponse$: () => CountTokensResponse$,
  CountTokensRequest$: () => CountTokensRequest$,
  CountTokensInput$: () => CountTokensInput$,
  CountTokensCommand: () => CountTokensCommand,
  CountTokens$: () => CountTokens$,
  ConverseTrace$: () => ConverseTrace$,
  ConverseTokensRequest$: () => ConverseTokensRequest$,
  ConverseStreamTrace$: () => ConverseStreamTrace$,
  ConverseStreamResponse$: () => ConverseStreamResponse$,
  ConverseStreamRequest$: () => ConverseStreamRequest$,
  ConverseStreamOutput$: () => ConverseStreamOutput$,
  ConverseStreamMetrics$: () => ConverseStreamMetrics$,
  ConverseStreamMetadataEvent$: () => ConverseStreamMetadataEvent$,
  ConverseStreamCommand: () => ConverseStreamCommand,
  ConverseStream$: () => ConverseStream$,
  ConverseResponse$: () => ConverseResponse$,
  ConverseRequest$: () => ConverseRequest$,
  ConverseOutput$: () => ConverseOutput$,
  ConverseMetrics$: () => ConverseMetrics$,
  ConverseCommand: () => ConverseCommand,
  Converse$: () => Converse$,
  ConversationRole: () => ConversationRole,
  ContentBlockStopEvent$: () => ContentBlockStopEvent$,
  ContentBlockStartEvent$: () => ContentBlockStartEvent$,
  ContentBlockStart$: () => ContentBlockStart$,
  ContentBlockDeltaEvent$: () => ContentBlockDeltaEvent$,
  ContentBlockDelta$: () => ContentBlockDelta$,
  ContentBlock$: () => ContentBlock$,
  ConflictException$: () => ConflictException$2,
  ConflictException: () => ConflictException2,
  CitationsDelta$: () => CitationsDelta$,
  CitationsContentBlock$: () => CitationsContentBlock$,
  CitationsConfig$: () => CitationsConfig$,
  CitationSourceContentDelta$: () => CitationSourceContentDelta$,
  CitationSourceContent$: () => CitationSourceContent$,
  CitationLocation$: () => CitationLocation$,
  CitationGeneratedContent$: () => CitationGeneratedContent$,
  Citation$: () => Citation$,
  CacheTTL: () => CacheTTL,
  CachePointType: () => CachePointType,
  CachePointBlock$: () => CachePointBlock$,
  CacheDetail$: () => CacheDetail$,
  BidirectionalOutputPayloadPart$: () => BidirectionalOutputPayloadPart$,
  BidirectionalInputPayloadPart$: () => BidirectionalInputPayloadPart$,
  BedrockRuntimeServiceException$: () => BedrockRuntimeServiceException$,
  BedrockRuntimeServiceException: () => BedrockRuntimeServiceException,
  BedrockRuntimeClient: () => BedrockRuntimeClient,
  BedrockRuntime: () => BedrockRuntime,
  AutoToolChoice$: () => AutoToolChoice$,
  AudioSource$: () => AudioSource$,
  AudioFormat: () => AudioFormat,
  AudioBlock$: () => AudioBlock$,
  AsyncInvokeSummary$: () => AsyncInvokeSummary$,
  AsyncInvokeStatus: () => AsyncInvokeStatus,
  AsyncInvokeS3OutputDataConfig$: () => AsyncInvokeS3OutputDataConfig$,
  AsyncInvokeOutputDataConfig$: () => AsyncInvokeOutputDataConfig$,
  ApplyGuardrailResponse$: () => ApplyGuardrailResponse$,
  ApplyGuardrailRequest$: () => ApplyGuardrailRequest$,
  ApplyGuardrailCommand: () => ApplyGuardrailCommand,
  ApplyGuardrail$: () => ApplyGuardrail$,
  AppliedGuardrailDetails$: () => AppliedGuardrailDetails$,
  AnyToolChoice$: () => AnyToolChoice$,
  AccessDeniedException$: () => AccessDeniedException$2,
  AccessDeniedException: () => AccessDeniedException2,
  $Command: () => Command3
});

