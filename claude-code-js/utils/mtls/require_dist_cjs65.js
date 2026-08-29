// var: require_dist_cjs65
var require_dist_cjs65 = __commonJS((exports) => {
  var core2 = require_dist_cjs37(), utilMiddleware = require_dist_cjs30(), getEndpointFromConfig = require_getEndpointFromConfig(), urlParser = require_dist_cjs11(), middlewareSerde = require_dist_cjs64(), resolveParamsForS3 = async (endpointParams) => {
    let bucket = endpointParams?.Bucket || "";
    if (typeof endpointParams.Bucket === "string")
      endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
    if (isArnBucketName(bucket)) {
      if (endpointParams.ForcePathStyle === !0)
        throw Error("Path-style addressing cannot be used with ARN buckets");
    } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3)
      endpointParams.ForcePathStyle = !0;
    if (endpointParams.DisableMultiRegionAccessPoints)
      endpointParams.disableMultiRegionAccessPoints = !0, endpointParams.DisableMRAP = !0;
    return endpointParams;
  }, DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/, IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/, DOTS_PATTERN = /\.\./, isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName), isArnBucketName = (bucketName) => {
    let [arn, partition2, service, , , bucket] = bucketName.split(":"), isArn = arn === "arn" && bucketName.split(":").length >= 6, isValidArn = Boolean(isArn && partition2 && service && bucket);
    if (isArn && !isValidArn)
      throw Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
    return isValidArn;
  }, createConfigValueProvider = (configKey, canonicalEndpointParamKey, config3, isClientContextParam = !1) => {
    let configProvider = async () => {
      let configValue;
      if (isClientContextParam)
        configValue = config3.clientContextParams?.[configKey] ?? config3[configKey] ?? config3[canonicalEndpointParamKey];
      else
        configValue = config3[configKey] ?? config3[canonicalEndpointParamKey];
      if (typeof configValue === "function")
        return configValue();
      return configValue;
    };
    if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope")
      return async () => {
        let credentials = typeof config3.credentials === "function" ? await config3.credentials() : config3.credentials;
        return credentials?.credentialScope ?? credentials?.CredentialScope;
      };
    if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId")
      return async () => {
        let credentials = typeof config3.credentials === "function" ? await config3.credentials() : config3.credentials;
        return credentials?.accountId ?? credentials?.AccountId;
      };
    if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint")
      return async () => {
        if (config3.isCustomEndpoint === !1)
          return;
        let endpoint2 = await configProvider();
        if (endpoint2 && typeof endpoint2 === "object") {
          if ("url" in endpoint2)
            return endpoint2.url.href;
          if ("hostname" in endpoint2) {
            let { protocol, hostname: hostname2, port, path: path9 } = endpoint2;
            return `${protocol}//${hostname2}${port ? ":" + port : ""}${path9}`;
          }
        }
        return endpoint2;
      };
    return configProvider;
  }, toEndpointV1 = (endpoint2) => {
    if (typeof endpoint2 === "object") {
      if ("url" in endpoint2) {
        let v1Endpoint = urlParser.parseUrl(endpoint2.url);
        if (endpoint2.headers) {
          v1Endpoint.headers = {};
          for (let [name, values] of Object.entries(endpoint2.headers))
            v1Endpoint.headers[name.toLowerCase()] = values.join(", ");
        }
        return v1Endpoint;
      }
      return endpoint2;
    }
    return urlParser.parseUrl(endpoint2);
  }, getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
    if (!clientConfig.isCustomEndpoint) {
      let endpointFromConfig;
      if (clientConfig.serviceConfiguredEndpoint)
        endpointFromConfig = await clientConfig.serviceConfiguredEndpoint();
      else
        endpointFromConfig = await getEndpointFromConfig.getEndpointFromConfig(clientConfig.serviceId);
      if (endpointFromConfig)
        clientConfig.endpoint = () => Promise.resolve(toEndpointV1(endpointFromConfig)), clientConfig.isCustomEndpoint = !0;
    }
    let endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
    if (typeof clientConfig.endpointProvider !== "function")
      throw Error("config.endpointProvider is not set.");
    let endpoint2 = clientConfig.endpointProvider(endpointParams, context);
    if (clientConfig.isCustomEndpoint && clientConfig.endpoint) {
      let customEndpoint = await clientConfig.endpoint();
      if (customEndpoint?.headers) {
        endpoint2.headers ??= {};
        for (let [name, value] of Object.entries(customEndpoint.headers))
          endpoint2.headers[name] = Array.isArray(value) ? value : [value];
      }
    }
    return endpoint2;
  }, resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
    let endpointParams = {}, instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
    for (let [name, instruction] of Object.entries(instructions))
      switch (instruction.type) {
        case "staticContextParams":
          endpointParams[name] = instruction.value;
          break;
        case "contextParams":
          endpointParams[name] = commandInput[instruction.name];
          break;
        case "clientContextParams":
        case "builtInParams":
          endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig, instruction.type !== "builtInParams")();
          break;
        case "operationContextParams":
          endpointParams[name] = instruction.get(commandInput);
          break;
        default:
          throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
      }
    if (Object.keys(instructions).length === 0)
      Object.assign(endpointParams, clientConfig);
    if (String(clientConfig.serviceId).toLowerCase() === "s3")
      await resolveParamsForS3(endpointParams);
    return endpointParams;
  }, endpointMiddleware = ({ config: config3, instructions }) => {
    return (next, context) => async (args) => {
      if (config3.isCustomEndpoint)
        core2.setFeature(context, "ENDPOINT_OVERRIDE", "N");
      let endpoint2 = await getEndpointFromInstructions(args.input, {
        getEndpointParameterInstructions() {
          return instructions;
        }
      }, { ...config3 }, context);
      context.endpointV2 = endpoint2, context.authSchemes = endpoint2.properties?.authSchemes;
      let authScheme = context.authSchemes?.[0];
      if (authScheme) {
        context.signing_region = authScheme.signingRegion, context.signing_service = authScheme.signingName;
        let httpAuthOption = utilMiddleware.getSmithyContext(context)?.selectedHttpAuthScheme?.httpAuthOption;
        if (httpAuthOption)
          httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
            signing_region: authScheme.signingRegion,
            signingRegion: authScheme.signingRegion,
            signing_service: authScheme.signingName,
            signingName: authScheme.signingName,
            signingRegionSet: authScheme.signingRegionSet
          }, authScheme.properties);
      }
      return next({
        ...args
      });
    };
  }, endpointMiddlewareOptions = {
    step: "serialize",
    tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
    name: "endpointV2Middleware",
    override: !0,
    relation: "before",
    toMiddleware: middlewareSerde.serializerMiddlewareOption.name
  }, getEndpointPlugin = (config3, instructions) => ({
    applyToStack: (clientStack) => {
      clientStack.addRelativeTo(endpointMiddleware({
        config: config3,
        instructions
      }), endpointMiddlewareOptions);
    }
  }), resolveEndpointConfig = (input) => {
    let tls = input.tls ?? !0, { endpoint: endpoint2, useDualstackEndpoint, useFipsEndpoint } = input, customEndpointProvider = endpoint2 != null ? async () => toEndpointV1(await utilMiddleware.normalizeProvider(endpoint2)()) : void 0, resolvedConfig = Object.assign(input, {
      endpoint: customEndpointProvider,
      tls,
      isCustomEndpoint: !!endpoint2,
      useDualstackEndpoint: utilMiddleware.normalizeProvider(useDualstackEndpoint ?? !1),
      useFipsEndpoint: utilMiddleware.normalizeProvider(useFipsEndpoint ?? !1)
    }), configuredEndpointPromise = void 0;
    return resolvedConfig.serviceConfiguredEndpoint = async () => {
      if (input.serviceId && !configuredEndpointPromise)
        configuredEndpointPromise = getEndpointFromConfig.getEndpointFromConfig(input.serviceId);
      return configuredEndpointPromise;
    }, resolvedConfig;
  }, resolveEndpointRequiredConfig = (input) => {
    let { endpoint: endpoint2 } = input;
    if (endpoint2 === void 0)
      input.endpoint = async () => {
        throw Error("@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.");
      };
    return input;
  };
  exports.endpointMiddleware = endpointMiddleware;
  exports.endpointMiddlewareOptions = endpointMiddlewareOptions;
  exports.getEndpointFromInstructions = getEndpointFromInstructions;
  exports.getEndpointPlugin = getEndpointPlugin;
  exports.resolveEndpointConfig = resolveEndpointConfig;
  exports.resolveEndpointRequiredConfig = resolveEndpointRequiredConfig;
  exports.resolveParams = resolveParams;
  exports.toEndpointV1 = toEndpointV1;
});
