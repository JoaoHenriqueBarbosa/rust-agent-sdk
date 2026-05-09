// Shared module state and imports
// Original: src/utils/mtls.ts
import { Agent as HttpsAgent } from "https";
var getMTLSConfig, getMTLSAgent;

// node_modules/@smithy/node-http-handler/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/node-http-handler/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@smithy/querystring-builder/node_modules/@smithy/util-uri-escape/dist-cjs/index.js

// node_modules/@smithy/querystring-builder/dist-cjs/index.js

// node_modules/@smithy/node-http-handler/dist-cjs/index.js

// node_modules/@aws-sdk/core/dist-cjs/submodules/client/index.js

// node_modules/@smithy/property-provider/dist-cjs/index.js

// node_modules/@aws-sdk/credential-provider-env/dist-es/fromEnv.js
var import_client3, import_property_provider, ENV_KEY = "AWS_ACCESS_KEY_ID", ENV_SECRET = "AWS_SECRET_ACCESS_KEY", ENV_SESSION = "AWS_SESSION_TOKEN", ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION", ENV_CREDENTIAL_SCOPE = "AWS_CREDENTIAL_SCOPE", ENV_ACCOUNT_ID = "AWS_ACCOUNT_ID", fromEnv = (init) => async () => {
  init?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
  let accessKeyId = process.env[ENV_KEY], secretAccessKey = process.env[ENV_SECRET], sessionToken = process.env[ENV_SESSION], expiry = process.env[ENV_EXPIRATION], credentialScope = process.env[ENV_CREDENTIAL_SCOPE], accountId = process.env[ENV_ACCOUNT_ID];
  if (accessKeyId && secretAccessKey) {
    let credentials = {
      accessKeyId,
      secretAccessKey,
      ...sessionToken && { sessionToken },
      ...expiry && { expiration: new Date(expiry) },
      ...credentialScope && { credentialScope },
      ...accountId && { accountId }
    };
    return import_client3.setCredentialFeature(credentials, "CREDENTIALS_ENV_VARS", "g"), credentials;
  }
  throw new import_property_provider.CredentialsProviderError("Unable to find environment variable credentials.", { logger: init?.logger });
};

// node_modules/@aws-sdk/credential-provider-env/dist-es/index.js
__export(exports_dist_es, {
  fromEnv: () => fromEnv,
  ENV_SESSION: () => ENV_SESSION,
  ENV_SECRET: () => ENV_SECRET,
  ENV_KEY: () => ENV_KEY,
  ENV_EXPIRATION: () => ENV_EXPIRATION,
  ENV_CREDENTIAL_SCOPE: () => ENV_CREDENTIAL_SCOPE,
  ENV_ACCOUNT_ID: () => ENV_ACCOUNT_ID
});

// node_modules/@smithy/shared-ini-file-loader/dist-cjs/getHomeDir.js

// node_modules/@smithy/shared-ini-file-loader/dist-cjs/getSSOTokenFilepath.js

// node_modules/@smithy/shared-ini-file-loader/dist-cjs/getSSOTokenFromFile.js

// node_modules/@smithy/shared-ini-file-loader/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/shared-ini-file-loader/dist-cjs/readFile.js

// node_modules/@smithy/shared-ini-file-loader/dist-cjs/index.js

// node_modules/@smithy/credential-provider-imds/dist-es/remoteProvider/httpRequest.js
import { Buffer as Buffer7 } from "buffer";
import { request } from "http";
var import_property_provider2;

// node_modules/@smithy/credential-provider-imds/dist-es/remoteProvider/ImdsCredentials.js

// node_modules/@smithy/credential-provider-imds/dist-es/remoteProvider/RemoteProviderInit.js

// node_modules/@smithy/credential-provider-imds/dist-es/remoteProvider/retry.js

// node_modules/@smithy/credential-provider-imds/dist-es/fromContainerMetadata.js
import { parse as parse7 } from "url";
var import_property_provider3, ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI", ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI", ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN", fromContainerMetadata = (init = {}) => {
  let { timeout, maxRetries } = providerConfigFromInit(init);
  return () => retry(async () => {
    let requestOptions = await getCmdsUri({ logger: init.logger }), credsResponse = JSON.parse(await requestFromEcsImds(timeout, requestOptions));
    if (!isImdsCredentials(credsResponse))
      throw new import_property_provider3.CredentialsProviderError("Invalid response received from instance metadata service.", {
        logger: init.logger
      });
    return fromImdsCredentials(credsResponse);
  }, maxRetries);
}, requestFromEcsImds = async (timeout, options) => {
  if (process.env[ENV_CMDS_AUTH_TOKEN])
    options.headers = {
      ...options.headers,
      Authorization: process.env[ENV_CMDS_AUTH_TOKEN]
    };
  return (await httpRequest({
    ...options,
    timeout
  })).toString();
}, CMDS_IP = "169.254.170.2", GREENGRASS_HOSTS, GREENGRASS_PROTOCOLS, getCmdsUri = async ({ logger }) => {
  if (process.env[ENV_CMDS_RELATIVE_URI])
    return {
      hostname: CMDS_IP,
      path: process.env[ENV_CMDS_RELATIVE_URI]
    };
  if (process.env[ENV_CMDS_FULL_URI]) {
    let parsed = parse7(process.env[ENV_CMDS_FULL_URI]);
    if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS))
      throw new import_property_provider3.CredentialsProviderError(`${parsed.hostname} is not a valid container metadata service hostname`, {
        tryNextLink: !1,
        logger
      });
    if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS))
      throw new import_property_provider3.CredentialsProviderError(`${parsed.protocol} is not a valid container metadata service protocol`, {
        tryNextLink: !1,
        logger
      });
    return {
      ...parsed,
      port: parsed.port ? parseInt(parsed.port, 10) : void 0
    };
  }
  throw new import_property_provider3.CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${ENV_CMDS_RELATIVE_URI} or ${ENV_CMDS_FULL_URI} environment variable is set`, {
    tryNextLink: !1,
    logger
  });
};

// node_modules/@smithy/node-config-provider/dist-cjs/index.js

// node_modules/@smithy/credential-provider-imds/dist-es/error/InstanceMetadataV1FallbackError.js
var import_property_provider4, InstanceMetadataV1FallbackError;

// node_modules/@smithy/querystring-parser/dist-cjs/index.js

// node_modules/@smithy/url-parser/dist-cjs/index.js

// node_modules/@smithy/credential-provider-imds/dist-es/config/Endpoint.js
var Endpoint;

// node_modules/@smithy/credential-provider-imds/dist-es/config/EndpointConfigOptions.js
var ENDPOINT_CONFIG_OPTIONS;

// node_modules/@smithy/credential-provider-imds/dist-es/config/EndpointMode.js
var EndpointMode;

// node_modules/@smithy/credential-provider-imds/dist-es/config/EndpointModeConfigOptions.js

// node_modules/@smithy/credential-provider-imds/dist-es/utils/getInstanceMetadataEndpoint.js
var import_node_config_provider, import_url_parser, getInstanceMetadataEndpoint = async () => import_url_parser.parseUrl(await getFromEndpointConfig() || await getFromEndpointModeConfig()), getFromEndpointConfig = async () => import_node_config_provider.loadConfig(ENDPOINT_CONFIG_OPTIONS)(), getFromEndpointModeConfig = async () => {
  let endpointMode = await import_node_config_provider.loadConfig(ENDPOINT_MODE_CONFIG_OPTIONS)();
  switch (endpointMode) {
    case EndpointMode.IPv4:
      return Endpoint.IPv4;
    case EndpointMode.IPv6:
      return Endpoint.IPv6;
    default:
      throw Error(`Unsupported endpoint mode: ${endpointMode}. Select from ${Object.values(EndpointMode)}`);
  }
};

// node_modules/@smithy/credential-provider-imds/dist-es/utils/getExtendedInstanceMetadataCredentials.js

// node_modules/@smithy/credential-provider-imds/dist-es/utils/staticStabilityProvider.js

// node_modules/@smithy/credential-provider-imds/dist-es/fromInstanceMetadata.js
var import_node_config_provider2, import_property_provider5, IMDS_PATH = "/latest/meta-data/iam/security-credentials/", IMDS_TOKEN_PATH = "/latest/api/token", AWS_EC2_METADATA_V1_DISABLED = "AWS_EC2_METADATA_V1_DISABLED", PROFILE_AWS_EC2_METADATA_V1_DISABLED = "ec2_metadata_v1_disabled", X_AWS_EC2_METADATA_TOKEN = "x-aws-ec2-metadata-token", fromInstanceMetadata = (init = {}) => staticStabilityProvider(getInstanceMetadataProvider(init), { logger: init.logger }), getInstanceMetadataProvider = (init = {}) => {
  let disableFetchToken = !1, { logger, profile } = init, { timeout, maxRetries } = providerConfigFromInit(init), getCredentials = async (maxRetries2, options) => {
    if (disableFetchToken || options.headers?.[X_AWS_EC2_METADATA_TOKEN] == null) {
      let fallbackBlockedFromProfile = !1, fallbackBlockedFromProcessEnv = !1, configValue = await import_node_config_provider2.loadConfig({
        environmentVariableSelector: (env4) => {
          let envValue = env4[AWS_EC2_METADATA_V1_DISABLED];
          if (fallbackBlockedFromProcessEnv = !!envValue && envValue !== "false", envValue === void 0)
            throw new import_property_provider5.CredentialsProviderError(`${AWS_EC2_METADATA_V1_DISABLED} not set in env, checking config file next.`, { logger: init.logger });
          return fallbackBlockedFromProcessEnv;
        },
        configFileSelector: (profile2) => {
          let profileValue = profile2[PROFILE_AWS_EC2_METADATA_V1_DISABLED];
          return fallbackBlockedFromProfile = !!profileValue && profileValue !== "false", fallbackBlockedFromProfile;
        },
        default: !1
      }, {
        profile
      })();
      if (init.ec2MetadataV1Disabled || configValue) {
        let causes = [];
        if (init.ec2MetadataV1Disabled)
          causes.push("credential provider initialization (runtime option ec2MetadataV1Disabled)");
        if (fallbackBlockedFromProfile)
          causes.push(`config file profile (${PROFILE_AWS_EC2_METADATA_V1_DISABLED})`);
        if (fallbackBlockedFromProcessEnv)
          causes.push(`process environment variable (${AWS_EC2_METADATA_V1_DISABLED})`);
        throw new InstanceMetadataV1FallbackError(`AWS EC2 Metadata v1 fallback has been blocked by AWS SDK configuration in the following: [${causes.join(", ")}].`);
      }
    }
    let imdsProfile = (await retry(async () => {
      let profile2;
      try {
        profile2 = await getProfile(options);
      } catch (err) {
        if (err.statusCode === 401)
          disableFetchToken = !1;
        throw err;
      }
      return profile2;
    }, maxRetries2)).trim();
    return retry(async () => {
      let creds;
      try {
        creds = await getCredentialsFromProfile(imdsProfile, options, init);
      } catch (err) {
        if (err.statusCode === 401)
          disableFetchToken = !1;
        throw err;
      }
      return creds;
    }, maxRetries2);
  };
  return async () => {
    let endpoint = await getInstanceMetadataEndpoint();
    if (disableFetchToken)
      return logger?.debug("AWS SDK Instance Metadata", "using v1 fallback (no token fetch)"), getCredentials(maxRetries, { ...endpoint, timeout });
    else {
      let token;
      try {
        token = (await getMetadataToken({ ...endpoint, timeout })).toString();
      } catch (error41) {
        if (error41?.statusCode === 400)
          throw Object.assign(error41, {
            message: "EC2 Metadata token request returned error"
          });
        else if (error41.message === "TimeoutError" || [403, 404, 405].includes(error41.statusCode))
          disableFetchToken = !0;
        return logger?.debug("AWS SDK Instance Metadata", "using v1 fallback (initial)"), getCredentials(maxRetries, { ...endpoint, timeout });
      }
      return getCredentials(maxRetries, {
        ...endpoint,
        headers: {
          [X_AWS_EC2_METADATA_TOKEN]: token
        },
        timeout
      });
    }
  };
}, getMetadataToken = async (options) => httpRequest({
  ...options,
  path: IMDS_TOKEN_PATH,
  method: "PUT",
  headers: {
    "x-aws-ec2-metadata-token-ttl-seconds": "21600"
  }
}), getProfile = async (options) => (await httpRequest({ ...options, path: IMDS_PATH })).toString(), getCredentialsFromProfile = async (profile, options, init) => {
  let credentialsResponse = JSON.parse((await httpRequest({
    ...options,
    path: IMDS_PATH + profile
  })).toString());
  if (!isImdsCredentials(credentialsResponse))
    throw new import_property_provider5.CredentialsProviderError("Invalid response received from instance metadata service.", {
      logger: init.logger
    });
  return fromImdsCredentials(credentialsResponse);
};

// node_modules/@smithy/credential-provider-imds/dist-es/types.js

// node_modules/@smithy/credential-provider-imds/dist-es/index.js
__export(exports_dist_es2, {
  providerConfigFromInit: () => providerConfigFromInit,
  httpRequest: () => httpRequest,
  getInstanceMetadataEndpoint: () => getInstanceMetadataEndpoint,
  fromInstanceMetadata: () => fromInstanceMetadata,
  fromContainerMetadata: () => fromContainerMetadata,
  Endpoint: () => Endpoint,
  ENV_CMDS_RELATIVE_URI: () => ENV_CMDS_RELATIVE_URI,
  ENV_CMDS_FULL_URI: () => ENV_CMDS_FULL_URI,
  ENV_CMDS_AUTH_TOKEN: () => ENV_CMDS_AUTH_TOKEN,
  DEFAULT_TIMEOUT: () => DEFAULT_TIMEOUT,
  DEFAULT_MAX_RETRIES: () => DEFAULT_MAX_RETRIES
});

// node_modules/@aws-sdk/credential-provider-http/dist-es/fromHttp/checkUrl.js
var import_property_provider6, ECS_CONTAINER_HOST = "169.254.170.2", EKS_CONTAINER_HOST_IPv4 = "169.254.170.23", EKS_CONTAINER_HOST_IPv6 = "[fd00:ec2::23]", checkUrl = (url3, logger) => {
  if (url3.protocol === "https:")
    return;
  if (url3.hostname === ECS_CONTAINER_HOST || url3.hostname === EKS_CONTAINER_HOST_IPv4 || url3.hostname === EKS_CONTAINER_HOST_IPv6)
    return;
  if (url3.hostname.includes("[")) {
    if (url3.hostname === "[::1]" || url3.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]")
      return;
  } else {
    if (url3.hostname === "localhost")
      return;
    let ipComponents = url3.hostname.split("."), inRange = (component) => {
      let num = parseInt(component, 10);
      return 0 <= num && num <= 255;
    };
    if (ipComponents[0] === "127" && inRange(ipComponents[1]) && inRange(ipComponents[2]) && inRange(ipComponents[3]) && ipComponents.length === 4)
      return;
  }
  throw new import_property_provider6.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, { logger });
};

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/protocol-http/dist-es/extensions/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/abort.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/auth/auth.js
var HttpAuthLocation;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/auth/HttpApiKeyAuth.js
var HttpApiKeyAuthLocation;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/auth/HttpAuthScheme.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/auth/HttpAuthSchemeProvider.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/auth/HttpSigner.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/auth/IdentityProviderConfig.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/auth/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/blob/blob-payload-input-types.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/checksum.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/client.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/command.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/connection/config.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/connection/manager.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/connection/pool.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/connection/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/crypto.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/encode.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/endpoints/EndpointRuleObject.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/endpoints/ErrorRuleObject.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/endpoints/RuleSetObject.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/endpoints/shared.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/endpoints/TreeRuleObject.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/endpoints/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/eventStream.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/extensions/defaultClientConfiguration.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/extensions/defaultExtensionConfiguration.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/extensions/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/feature-ids.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/http.js
var FieldPosition;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/http/httpHandlerInitialization.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/identity/apiKeyIdentity.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/identity/awsCredentialIdentity.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/identity/identity.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/identity/tokenIdentity.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/identity/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/logger.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/middleware.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/profile.js
var IniSectionType;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/response.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/retry.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/schema/schema.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/schema/traits.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/schema/schema-deprecated.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/schema/sentinels.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/schema/static-schemas.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/serde.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/shapes.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/signature.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/stream.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-common-types.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-input-types.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/streaming-payload/streaming-blob-payload-output-types.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/transfer.js
var RequestHandlerProtocol;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/transform/client-payload-blob-type-narrow.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/transform/mutable.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/transform/no-undefined.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/transform/type-transform.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/uri.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/util.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/waiter.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/types/dist-es/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/protocol-http/dist-es/Field.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/protocol-http/dist-es/httpHandler.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/protocol-http/dist-es/httpRequest.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/protocol-http/dist-es/types.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/protocol-http/dist-es/index.js

// node_modules/@smithy/middleware-stack/dist-cjs/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/client.js
var import_middleware_stack;

// node_modules/@smithy/util-stream/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-cjs/index.js

// node_modules/@smithy/util-stream/node_modules/@smithy/util-buffer-from/dist-cjs/index.js

// node_modules/@smithy/util-stream/node_modules/@smithy/util-base64/dist-cjs/fromBase64.js

// node_modules/@smithy/util-utf8/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-cjs/index.js

// node_modules/@smithy/util-utf8/node_modules/@smithy/util-buffer-from/dist-cjs/index.js

// node_modules/@smithy/util-utf8/dist-cjs/index.js

// node_modules/@smithy/util-stream/node_modules/@smithy/util-base64/dist-cjs/toBase64.js

// node_modules/@smithy/util-stream/node_modules/@smithy/util-base64/dist-cjs/index.js

// node_modules/@smithy/util-stream/dist-cjs/checksum/ChecksumStream.js

// node_modules/@smithy/util-stream/dist-cjs/stream-type-check.js

// node_modules/@smithy/util-stream/dist-cjs/checksum/ChecksumStream.browser.js

// node_modules/@smithy/util-stream/dist-cjs/checksum/createChecksumStream.browser.js

// node_modules/@smithy/util-stream/dist-cjs/checksum/createChecksumStream.js

// node_modules/@smithy/util-stream/dist-cjs/ByteArrayCollector.js

// node_modules/@smithy/util-stream/dist-cjs/createBufferedReadableStream.js

// node_modules/@smithy/util-stream/dist-cjs/createBufferedReadable.js

// node_modules/@smithy/util-stream/dist-cjs/getAwsChunkedEncodingStream.browser.js

// node_modules/@smithy/util-stream/dist-cjs/getAwsChunkedEncodingStream.js

// node_modules/@smithy/util-stream/dist-cjs/headStream.browser.js

// node_modules/@smithy/util-stream/dist-cjs/headStream.js

// node_modules/@smithy/fetch-http-handler/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/fetch-http-handler/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@smithy/fetch-http-handler/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-cjs/index.js

// node_modules/@smithy/fetch-http-handler/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/dist-cjs/index.js

// node_modules/@smithy/fetch-http-handler/node_modules/@smithy/util-base64/dist-cjs/fromBase64.js

// node_modules/@smithy/fetch-http-handler/node_modules/@smithy/util-base64/dist-cjs/toBase64.js

// node_modules/@smithy/fetch-http-handler/node_modules/@smithy/util-base64/dist-cjs/index.js

// node_modules/@smithy/fetch-http-handler/dist-cjs/index.js

// node_modules/@smithy/util-stream/node_modules/@smithy/util-hex-encoding/dist-cjs/index.js

// node_modules/@smithy/util-stream/dist-cjs/sdk-stream-mixin.browser.js

// node_modules/@smithy/util-stream/dist-cjs/sdk-stream-mixin.js

// node_modules/@smithy/util-stream/dist-cjs/splitStream.browser.js

// node_modules/@smithy/util-stream/dist-cjs/splitStream.js

// node_modules/@smithy/util-stream/dist-cjs/index.js

// node_modules/@smithy/core/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/core/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@smithy/util-middleware/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/util-middleware/dist-cjs/index.js

// node_modules/@smithy/core/dist-cjs/submodules/endpoints/index.js

// node_modules/@smithy/core/dist-cjs/submodules/schema/index.js

// node_modules/tslib/tslib.js

// node_modules/@smithy/uuid/dist-cjs/randomUUID.js

// node_modules/@smithy/uuid/dist-cjs/index.js

// node_modules/@smithy/core/dist-cjs/submodules/serde/index.js

// node_modules/@smithy/core/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-cjs/index.js

// node_modules/@smithy/core/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/dist-cjs/index.js

// node_modules/@smithy/core/node_modules/@smithy/util-base64/dist-cjs/fromBase64.js

// node_modules/@smithy/core/node_modules/@smithy/util-base64/dist-cjs/toBase64.js

// node_modules/@smithy/core/node_modules/@smithy/util-base64/dist-cjs/index.js

// node_modules/@smithy/core/dist-cjs/submodules/event-streams/index.js

// node_modules/@smithy/core/dist-cjs/submodules/protocols/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/collect-stream-body.js
var import_protocols;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/schemaLogFilter.js
var import_schema, SENSITIVE_STRING = "***SensitiveInformation***";

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/command.js

var import_middleware_stack2;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/constants.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/exceptions.js
var ServiceException, decorateServiceException = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v]) => v !== void 0).forEach(([k, v]) => {
    if (exception[k] == null || exception[k] === "")
      exception[k] = v;
  });
  let message = exception.message || exception.Message || "UnknownError";
  return exception.message = message, delete exception.Message, exception;
};

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/default-error-handler.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/defaults-mode.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/extended-encode-uri-component.js
var import_protocols2;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js
var knownAlgorithms, getChecksumConfiguration = (runtimeConfig) => {
  let checksumAlgorithms = [];
  for (let id in AlgorithmId) {
    let algorithmId = AlgorithmId[id];
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
      if (knownAlgorithms.includes(id))
        runtimeConfig.checksumAlgorithms[id.toUpperCase()] = ctor;
      else
        runtimeConfig.checksumAlgorithms[id] = ctor;
      checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return checksumAlgorithms;
    }
  };
}, resolveChecksumRuntimeConfig = (clientConfig) => {
  let runtimeConfig = {};
  return clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    let id = checksumAlgorithm.algorithmId();
    if (knownAlgorithms.includes(id))
      runtimeConfig[id] = checksumAlgorithm.checksumConstructor();
  }), runtimeConfig;
};

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/extensions/retry.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/extensions/index.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/get-array-if-single-item.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/is-serializable-header-value.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/object-mapping.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/resolve-path.js
var import_protocols3;

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/ser-utils.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/serde-json.js

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/index.js
__export(exports_dist_es3, {
  withBaseException: () => withBaseException,
  throwDefaultError: () => throwDefaultError,
  take: () => take,
  serializeFloat: () => serializeFloat,
  serializeDateTime: () => serializeDateTime,
  resolvedPath: () => import_protocols3.resolvedPath,
  resolveDefaultRuntimeConfig: () => resolveDefaultRuntimeConfig,
  map: () => map2,
  loadConfigsForDefaultMode: () => loadConfigsForDefaultMode,
  isSerializableHeaderValue: () => isSerializableHeaderValue,
  getValueFromTextNode: () => getValueFromTextNode,
  getDefaultExtensionConfiguration: () => getDefaultExtensionConfiguration,
  getDefaultClientConfiguration: () => getDefaultClientConfiguration,
  getArrayIfSingleItem: () => getArrayIfSingleItem,
  extendedEncodeURIComponent: () => import_protocols2.extendedEncodeURIComponent,
  emitWarningIfUnsupportedVersion: () => emitWarningIfUnsupportedVersion,
  decorateServiceException: () => decorateServiceException,
  createAggregatedClient: () => createAggregatedClient,
  convertMap: () => convertMap,
  collectBody: () => import_protocols.collectBody,
  _json: () => _json,
  ServiceException: () => ServiceException,
  SENSITIVE_STRING: () => SENSITIVE_STRING2,
  NoOpLogger: () => NoOpLogger,
  Command: () => Command,
  Client: () => Client
});

// node_modules/@aws-sdk/credential-provider-http/dist-es/fromHttp/requestHelpers.js
var import_property_provider7, import_util_stream;

// node_modules/@aws-sdk/credential-provider-http/dist-es/fromHttp/retry-wrapper.js

// node_modules/@aws-sdk/credential-provider-http/dist-es/fromHttp/fromHttp.js
import fs2 from "fs/promises";
var import_client4, import_node_http_handler, import_property_provider8, AWS_CONTAINER_CREDENTIALS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI", DEFAULT_LINK_LOCAL_HOST = "http://169.254.170.2", AWS_CONTAINER_CREDENTIALS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI", AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE", AWS_CONTAINER_AUTHORIZATION_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN", fromHttp = (options = {}) => {
  options.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
  let host, relative3 = options.awsContainerCredentialsRelativeUri ?? process.env[AWS_CONTAINER_CREDENTIALS_RELATIVE_URI], full = options.awsContainerCredentialsFullUri ?? process.env[AWS_CONTAINER_CREDENTIALS_FULL_URI], token = options.awsContainerAuthorizationToken ?? process.env[AWS_CONTAINER_AUTHORIZATION_TOKEN], tokenFile = options.awsContainerAuthorizationTokenFile ?? process.env[AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE], warn = options.logger?.constructor?.name === "NoOpLogger" || !options.logger?.warn ? console.warn : options.logger.warn.bind(options.logger);
  if (relative3 && full)
    warn("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), warn("awsContainerCredentialsFullUri will take precedence.");
  if (token && tokenFile)
    warn("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), warn("awsContainerAuthorizationToken will take precedence.");
  if (full)
    host = full;
  else if (relative3)
    host = `${DEFAULT_LINK_LOCAL_HOST}${relative3}`;
  else
    throw new import_property_provider8.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, { logger: options.logger });
  let url3 = new URL(host);
  checkUrl(url3, options.logger);
  let requestHandler = import_node_http_handler.NodeHttpHandler.create({
    requestTimeout: options.timeout ?? 1000,
    connectionTimeout: options.timeout ?? 1000
  });
  return retryWrapper(async () => {
    let request2 = createGetRequest(url3);
    if (token)
      request2.headers.Authorization = token;
    else if (tokenFile)
      request2.headers.Authorization = (await fs2.readFile(tokenFile)).toString();
    try {
      let result = await requestHandler.handle(request2);
      return getCredentials(result.response).then((creds) => import_client4.setCredentialFeature(creds, "CREDENTIALS_HTTP", "z"));
    } catch (e) {
      throw new import_property_provider8.CredentialsProviderError(String(e), { logger: options.logger });
    }
  }, options.maxRetries ?? 3, options.timeout ?? 1000);
};

// node_modules/@aws-sdk/credential-provider-http/dist-es/index.js
__export(exports_dist_es4, {
  fromHttp: () => fromHttp
});

// node_modules/@aws-sdk/credential-provider-node/dist-es/remoteProvider.js
var import_property_provider9, ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED", remoteProvider = async (init) => {
  let { ENV_CMDS_FULL_URI: ENV_CMDS_FULL_URI2, ENV_CMDS_RELATIVE_URI: ENV_CMDS_RELATIVE_URI2, fromContainerMetadata: fromContainerMetadata3, fromInstanceMetadata: fromInstanceMetadata3 } = await Promise.resolve().then(() => (init_dist_es2(), exports_dist_es2));
  if (process.env[ENV_CMDS_RELATIVE_URI2] || process.env[ENV_CMDS_FULL_URI2]) {
    init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
    let { fromHttp: fromHttp2 } = await Promise.resolve().then(() => (init_dist_es6(), exports_dist_es4));
    return import_property_provider9.chain(fromHttp2(init), fromContainerMetadata3(init));
  }
  if (process.env[ENV_IMDS_DISABLED] && process.env[ENV_IMDS_DISABLED] !== "false")
    return async () => {
      throw new import_property_provider9.CredentialsProviderError("EC2 Instance Metadata Service access disabled", { logger: init.logger });
    };
  return init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata"), fromInstanceMetadata3(init);
};

// node_modules/@aws-sdk/credential-provider-node/dist-es/runtime/memoize-chain.js

// node_modules/@aws-sdk/credential-provider-sso/dist-es/isSsoProfile.js

// node_modules/@aws-sdk/core/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@smithy/core/dist-cjs/index.js

// node_modules/@aws-sdk/core/node_modules/@smithy/signature-v4/node_modules/@smithy/util-hex-encoding/dist-cjs/index.js

// node_modules/@aws-sdk/core/node_modules/@smithy/signature-v4/node_modules/@smithy/is-array-buffer/dist-cjs/index.js

// node_modules/@aws-sdk/core/node_modules/@smithy/signature-v4/node_modules/@smithy/util-uri-escape/dist-cjs/index.js

// node_modules/@aws-sdk/core/node_modules/@smithy/signature-v4/dist-cjs/index.js

// node_modules/@aws-sdk/core/dist-cjs/submodules/httpAuthSchemes/index.js

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/fromEnvSigningName.js

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/constants.js

// node_modules/@aws-sdk/middleware-host-header/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@aws-sdk/middleware-host-header/dist-cjs/index.js

// node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js

// node_modules/@aws/lambda-invoke-store/dist-cjs/invoke-store.js

// node_modules/@aws-sdk/middleware-recursion-detection/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@aws-sdk/middleware-recursion-detection/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@aws-sdk/middleware-recursion-detection/dist-cjs/recursionDetectionMiddleware.js

// node_modules/@aws-sdk/middleware-recursion-detection/dist-cjs/index.js

// node_modules/@smithy/util-endpoints/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/util-endpoints/dist-cjs/index.js

// node_modules/@aws-sdk/util-endpoints/dist-cjs/index.js

// node_modules/@aws-sdk/middleware-user-agent/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@aws-sdk/middleware-user-agent/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@smithy/service-error-classification/dist-cjs/index.js

// node_modules/@smithy/util-retry/dist-cjs/index.js

// node_modules/@aws-sdk/middleware-user-agent/dist-cjs/index.js

// node_modules/@smithy/util-config-provider/dist-cjs/index.js

// node_modules/@smithy/config-resolver/dist-cjs/index.js

// node_modules/@smithy/middleware-content-length/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/middleware-content-length/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@smithy/middleware-content-length/dist-cjs/index.js

// node_modules/@smithy/middleware-endpoint/dist-cjs/adaptors/getEndpointUrlConfig.js

// node_modules/@smithy/middleware-endpoint/dist-cjs/adaptors/getEndpointFromConfig.js

// node_modules/@smithy/middleware-serde/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/middleware-serde/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@smithy/middleware-serde/dist-cjs/index.js

// node_modules/@smithy/middleware-endpoint/dist-cjs/index.js

// node_modules/@smithy/middleware-retry/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@smithy/middleware-retry/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@smithy/middleware-retry/node_modules/@smithy/smithy-client/dist-cjs/index.js

// node_modules/@smithy/middleware-retry/dist-cjs/isStreamingPayload/isStreamingPayload.js

// node_modules/@smithy/middleware-retry/dist-cjs/index.js

// node_modules/@aws-sdk/nested-clients/node_modules/@smithy/types/dist-cjs/index.js

// node_modules/@aws-sdk/nested-clients/node_modules/@smithy/smithy-client/dist-cjs/index.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/auth/httpAuthSchemeProvider.js

// node_modules/@aws-sdk/nested-clients/package.json

// node_modules/@aws-sdk/util-user-agent-node/dist-cjs/index.js

// node_modules/@smithy/hash-node/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-cjs/index.js

// node_modules/@smithy/hash-node/node_modules/@smithy/util-buffer-from/dist-cjs/index.js

// node_modules/@smithy/hash-node/dist-cjs/index.js

// node_modules/@smithy/util-body-length-node/dist-cjs/index.js

// node_modules/@smithy/util-defaults-mode-node/dist-cjs/index.js

// node_modules/@smithy/util-body-length-browser/dist-cjs/index.js

// node_modules/@smithy/core/dist-cjs/submodules/cbor/index.js

// node_modules/@aws-sdk/core/node_modules/@smithy/smithy-client/dist-cjs/index.js

// node_modules/@aws-sdk/core/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-cjs/index.js

// node_modules/@aws-sdk/core/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/dist-cjs/index.js

// node_modules/@aws-sdk/core/node_modules/@smithy/util-base64/dist-cjs/fromBase64.js

// node_modules/@aws-sdk/core/node_modules/@smithy/util-base64/dist-cjs/toBase64.js

// node_modules/@aws-sdk/core/node_modules/@smithy/util-base64/dist-cjs/index.js

// node_modules/fast-xml-parser/lib/fxp.cjs

// node_modules/@aws-sdk/xml-builder/dist-cjs/xml-parser.js

// node_modules/@aws-sdk/xml-builder/dist-cjs/index.js

// node_modules/@aws-sdk/core/dist-cjs/submodules/protocols/index.js

// node_modules/@aws-sdk/nested-clients/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/node_modules/@smithy/is-array-buffer/dist-cjs/index.js

// node_modules/@aws-sdk/nested-clients/node_modules/@smithy/util-base64/node_modules/@smithy/util-buffer-from/dist-cjs/index.js

// node_modules/@aws-sdk/nested-clients/node_modules/@smithy/util-base64/dist-cjs/fromBase64.js

// node_modules/@aws-sdk/nested-clients/node_modules/@smithy/util-base64/dist-cjs/toBase64.js

// node_modules/@aws-sdk/nested-clients/node_modules/@smithy/util-base64/dist-cjs/index.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/endpoint/ruleset.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/endpoint/endpointResolver.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/models/SSOOIDCServiceException.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/models/errors.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/schemas/schemas_0.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/runtimeConfig.shared.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/runtimeConfig.js

// node_modules/@aws-sdk/region-config-resolver/dist-cjs/regionConfig/stsRegionDefaultResolver.js

// node_modules/@aws-sdk/region-config-resolver/dist-cjs/index.js

// node_modules/@aws-sdk/nested-clients/node_modules/@smithy/protocol-http/dist-cjs/index.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso-oidc/index.js

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/getSsoOidcClient.js

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/getNewSsoOidcToken.js

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/validateTokenExpiry.js
var import_property_provider10, validateTokenExpiry = (token) => {
  if (token.expiration && token.expiration.getTime() < Date.now())
    throw new import_property_provider10.TokenProviderError(`Token is expired. ${REFRESH_MESSAGE}`, !1);
};

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/validateTokenKey.js
var import_property_provider11, validateTokenKey = (key, value, forRefresh = !1) => {
  if (typeof value > "u")
    throw new import_property_provider11.TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${REFRESH_MESSAGE}`, !1);
};

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/writeSSOTokenToFile.js
import { promises as fsPromises } from "fs";
var import_shared_ini_file_loader, writeFile2, writeSSOTokenToFile = (id, ssoToken) => {
  let tokenFilepath = import_shared_ini_file_loader.getSSOTokenFilepath(id), tokenString = JSON.stringify(ssoToken, null, 2);
  return writeFile2(tokenFilepath, tokenString);
};

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/fromSso.js
var import_property_provider12, import_shared_ini_file_loader2, lastRefreshAttemptTime, fromSso = (init = {}) => async ({ callerClientConfig } = {}) => {
  init.logger?.debug("@aws-sdk/token-providers - fromSso");
  let profiles = await import_shared_ini_file_loader2.parseKnownFiles(init), profileName = import_shared_ini_file_loader2.getProfileName({
    profile: init.profile ?? callerClientConfig?.profile
  }), profile2 = profiles[profileName];
  if (!profile2)
    throw new import_property_provider12.TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, !1);
  else if (!profile2.sso_session)
    throw new import_property_provider12.TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
  let ssoSessionName = profile2.sso_session, ssoSession = (await import_shared_ini_file_loader2.loadSsoSessionData(init))[ssoSessionName];
  if (!ssoSession)
    throw new import_property_provider12.TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, !1);
  for (let ssoSessionRequiredKey of ["sso_start_url", "sso_region"])
    if (!ssoSession[ssoSessionRequiredKey])
      throw new import_property_provider12.TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, !1);
  let { sso_start_url: ssoStartUrl, sso_region: ssoRegion } = ssoSession, ssoToken;
  try {
    ssoToken = await import_shared_ini_file_loader2.getSSOTokenFromFile(ssoSessionName);
  } catch (e) {
    throw new import_property_provider12.TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${REFRESH_MESSAGE}`, !1);
  }
  validateTokenKey("accessToken", ssoToken.accessToken), validateTokenKey("expiresAt", ssoToken.expiresAt);
  let { accessToken, expiresAt } = ssoToken, existingToken = { token: accessToken, expiration: new Date(expiresAt) };
  if (existingToken.expiration.getTime() - Date.now() > EXPIRE_WINDOW_MS)
    return existingToken;
  if (Date.now() - lastRefreshAttemptTime.getTime() < 30000)
    return validateTokenExpiry(existingToken), existingToken;
  validateTokenKey("clientId", ssoToken.clientId, !0), validateTokenKey("clientSecret", ssoToken.clientSecret, !0), validateTokenKey("refreshToken", ssoToken.refreshToken, !0);
  try {
    lastRefreshAttemptTime.setTime(Date.now());
    let newSsoOidcToken = await getNewSsoOidcToken(ssoToken, ssoRegion, init, callerClientConfig);
    validateTokenKey("accessToken", newSsoOidcToken.accessToken), validateTokenKey("expiresIn", newSsoOidcToken.expiresIn);
    let newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1000);
    try {
      await writeSSOTokenToFile(ssoSessionName, {
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
    return validateTokenExpiry(existingToken), existingToken;
  }
};

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/fromStatic.js

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/nodeProvider.js

// node_modules/@aws-sdk/credential-provider-sso/node_modules/@aws-sdk/token-providers/dist-es/index.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/auth/httpAuthSchemeProvider.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/endpoint/ruleset.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/endpoint/endpointResolver.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/models/SSOServiceException.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/models/errors.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/schemas/schemas_0.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/runtimeConfig.shared.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/runtimeConfig.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sso/index.js

// node_modules/@aws-sdk/credential-provider-sso/dist-es/loadSso.js
__export(exports_loadSso, {
  SSOClient: () => import_sso.SSOClient,
  GetRoleCredentialsCommand: () => import_sso.GetRoleCredentialsCommand
});
var import_sso;

// node_modules/@aws-sdk/credential-provider-sso/dist-es/resolveSSOCredentials.js
var import_client5, import_property_provider13, import_shared_ini_file_loader3, SHOULD_FAIL_CREDENTIAL_CHAIN = !1, resolveSSOCredentials = async ({ ssoStartUrl, ssoSession, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, clientConfig, parentClientConfig, callerClientConfig, profile: profile2, filepath, configFilepath, ignoreCache, logger: logger2 }) => {
  let token, refreshMessage = "To refresh this SSO session run aws sso login with the corresponding profile.";
  if (ssoSession)
    try {
      let _token = await fromSso({
        profile: profile2,
        filepath,
        configFilepath,
        ignoreCache
      })();
      token = {
        accessToken: _token.token,
        expiresAt: new Date(_token.expiration).toISOString()
      };
    } catch (e) {
      throw new import_property_provider13.CredentialsProviderError(e.message, {
        tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
        logger: logger2
      });
    }
  else
    try {
      token = await import_shared_ini_file_loader3.getSSOTokenFromFile(ssoStartUrl);
    } catch (e) {
      throw new import_property_provider13.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
        tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
        logger: logger2
      });
    }
  if (new Date(token.expiresAt).getTime() - Date.now() <= 0)
    throw new import_property_provider13.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
      tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
      logger: logger2
    });
  let { accessToken } = token, { SSOClient: SSOClient2, GetRoleCredentialsCommand: GetRoleCredentialsCommand2 } = await Promise.resolve().then(() => (init_loadSso(), exports_loadSso)), sso = ssoClient || new SSOClient2(Object.assign({}, clientConfig ?? {}, {
    logger: clientConfig?.logger ?? callerClientConfig?.logger ?? parentClientConfig?.logger,
    region: clientConfig?.region ?? ssoRegion,
    userAgentAppId: clientConfig?.userAgentAppId ?? callerClientConfig?.userAgentAppId ?? parentClientConfig?.userAgentAppId
  })), ssoResp;
  try {
    ssoResp = await sso.send(new GetRoleCredentialsCommand2({
      accountId: ssoAccountId,
      roleName: ssoRoleName,
      accessToken
    }));
  } catch (e) {
    throw new import_property_provider13.CredentialsProviderError(e, {
      tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
      logger: logger2
    });
  }
  let { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration, credentialScope, accountId } = {} } = ssoResp;
  if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration)
    throw new import_property_provider13.CredentialsProviderError("SSO returns an invalid temporary credential.", {
      tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
      logger: logger2
    });
  let credentials = {
    accessKeyId,
    secretAccessKey,
    sessionToken,
    expiration: new Date(expiration),
    ...credentialScope && { credentialScope },
    ...accountId && { accountId }
  };
  if (ssoSession)
    import_client5.setCredentialFeature(credentials, "CREDENTIALS_SSO", "s");
  else
    import_client5.setCredentialFeature(credentials, "CREDENTIALS_SSO_LEGACY", "u");
  return credentials;
};

// node_modules/@aws-sdk/credential-provider-sso/dist-es/validateSsoProfile.js
var import_property_provider14, validateSsoProfile = (profile2, logger2) => {
  let { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile2;
  if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name)
    throw new import_property_provider14.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile2).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, { tryNextLink: !1, logger: logger2 });
  return profile2;
};

// node_modules/@aws-sdk/credential-provider-sso/dist-es/fromSSO.js
var import_property_provider15, import_shared_ini_file_loader4, fromSSO = (init = {}) => async ({ callerClientConfig } = {}) => {
  init.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
  let { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init, { ssoClient } = init, profileName = import_shared_ini_file_loader4.getProfileName({
    profile: init.profile ?? callerClientConfig?.profile
  });
  if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
    let profile2 = (await import_shared_ini_file_loader4.parseKnownFiles(init))[profileName];
    if (!profile2)
      throw new import_property_provider15.CredentialsProviderError(`Profile ${profileName} was not found.`, { logger: init.logger });
    if (!isSsoProfile(profile2))
      throw new import_property_provider15.CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`, {
        logger: init.logger
      });
    if (profile2?.sso_session) {
      let session = (await import_shared_ini_file_loader4.loadSsoSessionData(init))[profile2.sso_session], conflictMsg = ` configurations in profile ${profileName} and sso-session ${profile2.sso_session}`;
      if (ssoRegion && ssoRegion !== session.sso_region)
        throw new import_property_provider15.CredentialsProviderError("Conflicting SSO region" + conflictMsg, {
          tryNextLink: !1,
          logger: init.logger
        });
      if (ssoStartUrl && ssoStartUrl !== session.sso_start_url)
        throw new import_property_provider15.CredentialsProviderError("Conflicting SSO start_url" + conflictMsg, {
          tryNextLink: !1,
          logger: init.logger
        });
      profile2.sso_region = session.sso_region, profile2.sso_start_url = session.sso_start_url;
    }
    let { sso_start_url, sso_account_id, sso_region, sso_role_name, sso_session } = validateSsoProfile(profile2, init.logger);
    return resolveSSOCredentials({
      ssoStartUrl: sso_start_url,
      ssoSession: sso_session,
      ssoAccountId: sso_account_id,
      ssoRegion: sso_region,
      ssoRoleName: sso_role_name,
      ssoClient,
      clientConfig: init.clientConfig,
      parentClientConfig: init.parentClientConfig,
      callerClientConfig: init.callerClientConfig,
      profile: profileName,
      filepath: init.filepath,
      configFilepath: init.configFilepath,
      ignoreCache: init.ignoreCache,
      logger: init.logger
    });
  } else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName)
    throw new import_property_provider15.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', { tryNextLink: !1, logger: init.logger });
  else
    return resolveSSOCredentials({
      ssoStartUrl,
      ssoSession,
      ssoAccountId,
      ssoRegion,
      ssoRoleName,
      ssoClient,
      clientConfig: init.clientConfig,
      parentClientConfig: init.parentClientConfig,
      callerClientConfig: init.callerClientConfig,
      profile: profileName,
      filepath: init.filepath,
      configFilepath: init.configFilepath,
      ignoreCache: init.ignoreCache,
      logger: init.logger
    });
};

// node_modules/@aws-sdk/credential-provider-sso/dist-es/types.js

// node_modules/@aws-sdk/credential-provider-sso/dist-es/index.js
__export(exports_dist_es5, {
  validateSsoProfile: () => validateSsoProfile,
  isSsoProfile: () => isSsoProfile,
  fromSSO: () => fromSSO
});

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveCredentialSource.js
var import_client6, import_property_provider16, resolveCredentialSource = (credentialSource, profileName, logger2) => {
  let sourceProvidersMap = {
    EcsContainer: async (options) => {
      let { fromHttp: fromHttp2 } = await Promise.resolve().then(() => (init_dist_es6(), exports_dist_es4)), { fromContainerMetadata: fromContainerMetadata3 } = await Promise.resolve().then(() => (init_dist_es2(), exports_dist_es2));
      return logger2?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer"), async () => import_property_provider16.chain(fromHttp2(options ?? {}), fromContainerMetadata3(options))().then(setNamedProvider);
    },
    Ec2InstanceMetadata: async (options) => {
      logger2?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
      let { fromInstanceMetadata: fromInstanceMetadata3 } = await Promise.resolve().then(() => (init_dist_es2(), exports_dist_es2));
      return async () => fromInstanceMetadata3(options)().then(setNamedProvider);
    },
    Environment: async (options) => {
      logger2?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
      let { fromEnv: fromEnv3 } = await Promise.resolve().then(() => (init_dist_es(), exports_dist_es));
      return async () => fromEnv3(options)().then(setNamedProvider);
    }
  };
  if (credentialSource in sourceProvidersMap)
    return sourceProvidersMap[credentialSource];
  else
    throw new import_property_provider16.CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, expected EcsContainer or Ec2InstanceMetadata or Environment.`, { logger: logger2 });
}, setNamedProvider = (creds) => import_client6.setCredentialFeature(creds, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p");

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/auth/httpAuthSchemeProvider.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/endpoint/EndpointParameters.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/endpoint/ruleset.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/endpoint/endpointResolver.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/models/STSServiceException.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/models/errors.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/schemas/schemas_0.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/runtimeConfig.shared.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/runtimeConfig.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/auth/httpAuthExtensionConfiguration.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/runtimeExtensions.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/STSClient.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/sts/index.js

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveAssumeRoleCredentials.js
var import_client7, import_property_provider17, import_shared_ini_file_loader5, isAssumeRoleProfile = (arg, { profile: profile2 = "default", logger: logger2 } = {}) => {
  return Boolean(arg) && typeof arg === "object" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof arg.external_id) > -1 && ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 && (isAssumeRoleWithSourceProfile(arg, { profile: profile2, logger: logger2 }) || isCredentialSourceProfile(arg, { profile: profile2, logger: logger2 }));
}, isAssumeRoleWithSourceProfile = (arg, { profile: profile2, logger: logger2 }) => {
  let withSourceProfile = typeof arg.source_profile === "string" && typeof arg.credential_source > "u";
  if (withSourceProfile)
    logger2?.debug?.(`    ${profile2} isAssumeRoleWithSourceProfile source_profile=${arg.source_profile}`);
  return withSourceProfile;
}, isCredentialSourceProfile = (arg, { profile: profile2, logger: logger2 }) => {
  let withProviderProfile = typeof arg.credential_source === "string" && typeof arg.source_profile > "u";
  if (withProviderProfile)
    logger2?.debug?.(`    ${profile2} isCredentialSourceProfile credential_source=${arg.credential_source}`);
  return withProviderProfile;
}, resolveAssumeRoleCredentials = async (profileName, profiles, options, callerClientConfig, visitedProfiles = {}, resolveProfileData) => {
  options.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
  let profileData = profiles[profileName], { source_profile, region } = profileData;
  if (!options.roleAssumer) {
    let { getDefaultRoleAssumer } = await Promise.resolve().then(() => __toESM(require_sts(), 1));
    options.roleAssumer = getDefaultRoleAssumer({
      ...options.clientConfig,
      credentialProviderLogger: options.logger,
      parentClientConfig: {
        ...callerClientConfig,
        ...options?.parentClientConfig,
        region: region ?? options?.parentClientConfig?.region ?? callerClientConfig?.region
      }
    }, options.clientPlugins);
  }
  if (source_profile && source_profile in visitedProfiles)
    throw new import_property_provider17.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${import_shared_ini_file_loader5.getProfileName(options)}. Profiles visited: ` + Object.keys(visitedProfiles).join(", "), { logger: options.logger });
  options.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${source_profile ? `source_profile=[${source_profile}]` : `profile=[${profileName}]`}`);
  let sourceCredsProvider = source_profile ? resolveProfileData(source_profile, profiles, options, callerClientConfig, {
    ...visitedProfiles,
    [source_profile]: !0
  }, isCredentialSourceWithoutRoleArn(profiles[source_profile] ?? {})) : (await resolveCredentialSource(profileData.credential_source, profileName, options.logger)(options))();
  if (isCredentialSourceWithoutRoleArn(profileData))
    return sourceCredsProvider.then((creds) => import_client7.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
  else {
    let params = {
      RoleArn: profileData.role_arn,
      RoleSessionName: profileData.role_session_name || `aws-sdk-js-${Date.now()}`,
      ExternalId: profileData.external_id,
      DurationSeconds: parseInt(profileData.duration_seconds || "3600", 10)
    }, { mfa_serial } = profileData;
    if (mfa_serial) {
      if (!options.mfaCodeProvider)
        throw new import_property_provider17.CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, { logger: options.logger, tryNextLink: !1 });
      params.SerialNumber = mfa_serial, params.TokenCode = await options.mfaCodeProvider(mfa_serial);
    }
    let sourceCreds = await sourceCredsProvider;
    return options.roleAssumer(sourceCreds, params).then((creds) => import_client7.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
  }
}, isCredentialSourceWithoutRoleArn = (section) => {
  return !section.role_arn && !!section.credential_source;
};

// node_modules/@aws-sdk/credential-provider-login/node_modules/@smithy/protocol-http/dist-es/extensions/index.js

// node_modules/@aws-sdk/credential-provider-login/node_modules/@smithy/protocol-http/dist-es/Field.js

// node_modules/@aws-sdk/credential-provider-login/node_modules/@smithy/protocol-http/dist-es/httpHandler.js

// node_modules/@aws-sdk/credential-provider-login/node_modules/@smithy/protocol-http/dist-es/httpRequest.js

// node_modules/@aws-sdk/credential-provider-login/node_modules/@smithy/protocol-http/dist-es/types.js

// node_modules/@aws-sdk/credential-provider-login/node_modules/@smithy/protocol-http/dist-es/index.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/auth/httpAuthSchemeProvider.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/endpoint/ruleset.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/endpoint/endpointResolver.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/models/SigninServiceException.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/models/errors.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/schemas/schemas_0.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/runtimeConfig.shared.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/runtimeConfig.js

// node_modules/@aws-sdk/nested-clients/dist-cjs/submodules/signin/index.js

// node_modules/@aws-sdk/credential-provider-login/dist-es/LoginCredentialsFetcher.js
import { createHash, createPrivateKey, createPublicKey, sign } from "crypto";
import { promises as fs3 } from "fs";
import { homedir as homedir9 } from "os";
import { dirname as dirname11, join as join18 } from "path";

var import_property_provider18, import_shared_ini_file_loader6;

// node_modules/@aws-sdk/credential-provider-login/dist-es/fromLoginCredentials.js
var import_client8, import_property_provider19, import_shared_ini_file_loader7, fromLoginCredentials = (init) => async ({ callerClientConfig } = {}) => {
  init?.logger?.debug?.("@aws-sdk/credential-providers - fromLoginCredentials");
  let profiles = await import_shared_ini_file_loader7.parseKnownFiles(init || {}), profileName = import_shared_ini_file_loader7.getProfileName({
    profile: init?.profile ?? callerClientConfig?.profile
  }), profile2 = profiles[profileName];
  if (!profile2?.login_session)
    throw new import_property_provider19.CredentialsProviderError(`Profile ${profileName} does not contain login_session.`, {
      tryNextLink: !0,
      logger: init?.logger
    });
  let credentials = await new LoginCredentialsFetcher(profile2, init, callerClientConfig).loadCredentials();
  return import_client8.setCredentialFeature(credentials, "CREDENTIALS_LOGIN", "AD");
};

// node_modules/@aws-sdk/credential-provider-login/dist-es/types.js

// node_modules/@aws-sdk/credential-provider-login/dist-es/index.js

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveLoginCredentials.js
var import_client9, isLoginProfile = (data) => {
  return Boolean(data && data.login_session);
}, resolveLoginCredentials = async (profileName, options, callerClientConfig) => {
  let credentials = await fromLoginCredentials({
    ...options,
    profile: profileName
  })({ callerClientConfig });
  return import_client9.setCredentialFeature(credentials, "CREDENTIALS_PROFILE_LOGIN", "AC");
};

// node_modules/@aws-sdk/credential-provider-process/dist-es/getValidatedProcessCredentials.js
var import_client10, getValidatedProcessCredentials = (profileName, data, profiles) => {
  if (data.Version !== 1)
    throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
  if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0)
    throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
  if (data.Expiration) {
    let currentTime = /* @__PURE__ */ new Date;
    if (new Date(data.Expiration) < currentTime)
      throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
  }
  let accountId = data.AccountId;
  if (!accountId && profiles?.[profileName]?.aws_account_id)
    accountId = profiles[profileName].aws_account_id;
  let credentials = {
    accessKeyId: data.AccessKeyId,
    secretAccessKey: data.SecretAccessKey,
    ...data.SessionToken && { sessionToken: data.SessionToken },
    ...data.Expiration && { expiration: new Date(data.Expiration) },
    ...data.CredentialScope && { credentialScope: data.CredentialScope },
    ...accountId && { accountId }
  };
  return import_client10.setCredentialFeature(credentials, "CREDENTIALS_PROCESS", "w"), credentials;
};

// node_modules/@aws-sdk/credential-provider-process/dist-es/resolveProcessCredentials.js
import { exec } from "child_process";
import { promisify as promisify4 } from "util";
var import_property_provider20, import_shared_ini_file_loader8, resolveProcessCredentials = async (profileName, profiles, logger2) => {
  let profile2 = profiles[profileName];
  if (profiles[profileName]) {
    let credentialProcess = profile2.credential_process;
    if (credentialProcess !== void 0) {
      let execPromise = promisify4(import_shared_ini_file_loader8.externalDataInterceptor?.getTokenRecord?.().exec ?? exec);
      try {
        let { stdout } = await execPromise(credentialProcess), data;
        try {
          data = JSON.parse(stdout.trim());
        } catch {
          throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
        }
        return getValidatedProcessCredentials(profileName, data, profiles);
      } catch (error41) {
        throw new import_property_provider20.CredentialsProviderError(error41.message, { logger: logger2 });
      }
    } else
      throw new import_property_provider20.CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`, { logger: logger2 });
  } else
    throw new import_property_provider20.CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`, {
      logger: logger2
    });
};

// node_modules/@aws-sdk/credential-provider-process/dist-es/fromProcess.js
var import_shared_ini_file_loader9, fromProcess = (init = {}) => async ({ callerClientConfig } = {}) => {
  init.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
  let profiles = await import_shared_ini_file_loader9.parseKnownFiles(init);
  return resolveProcessCredentials(import_shared_ini_file_loader9.getProfileName({
    profile: init.profile ?? callerClientConfig?.profile
  }), profiles, init.logger);
};

// node_modules/@aws-sdk/credential-provider-process/dist-es/index.js
__export(exports_dist_es6, {
  fromProcess: () => fromProcess
});

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProcessCredentials.js
var import_client11, isProcessProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string", resolveProcessCredentials2 = async (options, profile2) => Promise.resolve().then(() => (init_dist_es11(), exports_dist_es6)).then(({ fromProcess: fromProcess3 }) => fromProcess3({
  ...options,
  profile: profile2
})().then((creds) => import_client11.setCredentialFeature(creds, "CREDENTIALS_PROFILE_PROCESS", "v")));

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveSsoCredentials.js
var import_client12, resolveSsoCredentials = async (profile2, profileData, options = {}, callerClientConfig) => {
  let { fromSSO: fromSSO3 } = await Promise.resolve().then(() => (init_dist_es8(), exports_dist_es5));
  return fromSSO3({
    profile: profile2,
    logger: options.logger,
    parentClientConfig: options.parentClientConfig,
    clientConfig: options.clientConfig
  })({
    callerClientConfig
  }).then((creds) => {
    if (profileData.sso_session)
      return import_client12.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SSO", "r");
    else
      return import_client12.setCredentialFeature(creds, "CREDENTIALS_PROFILE_SSO_LEGACY", "t");
  });
}, isSsoProfile3 = (arg) => arg && (typeof arg.sso_start_url === "string" || typeof arg.sso_account_id === "string" || typeof arg.sso_session === "string" || typeof arg.sso_region === "string" || typeof arg.sso_role_name === "string");

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveStaticCredentials.js
var import_client13, isStaticCredsProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.aws_access_key_id === "string" && typeof arg.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1 && ["undefined", "string"].indexOf(typeof arg.aws_account_id) > -1, resolveStaticCredentials = async (profile2, options) => {
  options?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
  let credentials = {
    accessKeyId: profile2.aws_access_key_id,
    secretAccessKey: profile2.aws_secret_access_key,
    sessionToken: profile2.aws_session_token,
    ...profile2.aws_credential_scope && { credentialScope: profile2.aws_credential_scope },
    ...profile2.aws_account_id && { accountId: profile2.aws_account_id }
  };
  return import_client13.setCredentialFeature(credentials, "CREDENTIALS_PROFILE", "n");
};

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromWebToken.js

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
import { readFileSync as readFileSync6 } from "fs";
var import_client14, import_property_provider21, import_shared_ini_file_loader10, ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE", ENV_ROLE_ARN = "AWS_ROLE_ARN", ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME", fromTokenFile = (init = {}) => async (awsIdentityProperties) => {
  init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
  let webIdentityTokenFile = init?.webIdentityTokenFile ?? process.env[ENV_TOKEN_FILE], roleArn = init?.roleArn ?? process.env[ENV_ROLE_ARN], roleSessionName = init?.roleSessionName ?? process.env[ENV_ROLE_SESSION_NAME];
  if (!webIdentityTokenFile || !roleArn)
    throw new import_property_provider21.CredentialsProviderError("Web identity configuration not specified", {
      logger: init.logger
    });
  let credentials = await fromWebToken({
    ...init,
    webIdentityToken: import_shared_ini_file_loader10.externalDataInterceptor?.getTokenRecord?.()[webIdentityTokenFile] ?? readFileSync6(webIdentityTokenFile, { encoding: "ascii" }),
    roleArn,
    roleSessionName
  })(awsIdentityProperties);
  if (webIdentityTokenFile === process.env[ENV_TOKEN_FILE])
    import_client14.setCredentialFeature(credentials, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
  return credentials;
};

// node_modules/@aws-sdk/credential-provider-web-identity/dist-es/index.js
__export(exports_dist_es7, {
  fromWebToken: () => fromWebToken,
  fromTokenFile: () => fromTokenFile
});

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveWebIdentityCredentials.js
var import_client15, isWebIdentityProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.web_identity_token_file === "string" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1, resolveWebIdentityCredentials = async (profile2, options, callerClientConfig) => Promise.resolve().then(() => (init_dist_es12(), exports_dist_es7)).then(({ fromTokenFile: fromTokenFile3 }) => fromTokenFile3({
  webIdentityTokenFile: profile2.web_identity_token_file,
  roleArn: profile2.role_arn,
  roleSessionName: profile2.role_session_name,
  roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity,
  logger: options.logger,
  parentClientConfig: options.parentClientConfig
})({
  callerClientConfig
}).then((creds) => import_client15.setCredentialFeature(creds, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q")));

// node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProfileData.js
var import_property_provider22, resolveProfileData = async (profileName, profiles, options, callerClientConfig, visitedProfiles = {}, isAssumeRoleRecursiveCall = !1) => {
  let data = profiles[profileName];
  if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data))
    return resolveStaticCredentials(data, options);
  if (isAssumeRoleRecursiveCall || isAssumeRoleProfile(data, { profile: profileName, logger: options.logger }))
    return resolveAssumeRoleCredentials(profileName, profiles, options, callerClientConfig, visitedProfiles, resolveProfileData);
  if (isStaticCredsProfile(data))
    return resolveStaticCredentials(data, options);
  if (isWebIdentityProfile(data))
    return resolveWebIdentityCredentials(data, options, callerClientConfig);
  if (isProcessProfile(data))
    return resolveProcessCredentials2(options, profileName);
  if (isSsoProfile3(data))
    return await resolveSsoCredentials(profileName, data, options, callerClientConfig);
  if (isLoginProfile(data))
    return resolveLoginCredentials(profileName, options, callerClientConfig);
  throw new import_property_provider22.CredentialsProviderError(`Could not resolve credentials using profile: [${profileName}] in configuration/credentials file(s).`, { logger: options.logger });
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/fromIni.js
var import_shared_ini_file_loader11, fromIni = (init = {}) => async ({ callerClientConfig } = {}) => {
  init.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
  let profiles = await import_shared_ini_file_loader11.parseKnownFiles(init);
  return resolveProfileData(import_shared_ini_file_loader11.getProfileName({
    profile: init.profile ?? callerClientConfig?.profile
  }), profiles, init, callerClientConfig);
};

// node_modules/@aws-sdk/credential-provider-ini/dist-es/index.js
__export(exports_dist_es8, {
  fromIni: () => fromIni
});

// node_modules/@aws-sdk/credential-provider-node/dist-es/defaultProvider.js
var import_property_provider23, import_shared_ini_file_loader12, multipleCredentialSourceWarningEmitted = !1, defaultProvider = (init = {}) => memoizeChain([
  async () => {
    if (init.profile ?? process.env[import_shared_ini_file_loader12.ENV_PROFILE]) {
      if (process.env[ENV_KEY] && process.env[ENV_SECRET]) {
        if (!multipleCredentialSourceWarningEmitted)
          (init.logger?.warn && init.logger?.constructor?.name !== "NoOpLogger" ? init.logger.warn.bind(init.logger) : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`), multipleCredentialSourceWarningEmitted = !0;
      }
      throw new import_property_provider23.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
        logger: init.logger,
        tryNextLink: !0
      });
    }
    return init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv"), fromEnv(init)();
  },
  async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
    let { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init;
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession)
      throw new import_property_provider23.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", { logger: init.logger });
    let { fromSSO: fromSSO3 } = await Promise.resolve().then(() => (init_dist_es8(), exports_dist_es5));
    return fromSSO3(init)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
    let { fromIni: fromIni3 } = await Promise.resolve().then(() => (init_dist_es13(), exports_dist_es8));
    return fromIni3(init)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
    let { fromProcess: fromProcess3 } = await Promise.resolve().then(() => (init_dist_es11(), exports_dist_es6));
    return fromProcess3(init)(awsIdentityProperties);
  },
  async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
    let { fromTokenFile: fromTokenFile3 } = await Promise.resolve().then(() => (init_dist_es12(), exports_dist_es7));
    return fromTokenFile3(init)(awsIdentityProperties);
  },
  async () => {
    return init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider"), (await remoteProvider(init))();
  },
  async () => {
    throw new import_property_provider23.CredentialsProviderError("Could not load credentials from any providers", {
      tryNextLink: !1,
      logger: init.logger
    });
  }
], credentialsTreatedAsExpired), credentialsWillNeedRefresh = (credentials) => credentials?.expiration !== void 0, credentialsTreatedAsExpired = (credentials) => credentials?.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 300000;

// node_modules/@aws-sdk/credential-provider-node/dist-es/index.js
__export(exports_dist_es9, {
  defaultProvider: () => defaultProvider,
  credentialsWillNeedRefresh: () => credentialsWillNeedRefresh,
  credentialsTreatedAsExpired: () => credentialsTreatedAsExpired
});

