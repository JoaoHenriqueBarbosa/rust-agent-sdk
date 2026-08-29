// var: require_dist_cjs58
var require_dist_cjs58 = __commonJS((exports) => {
  var utilConfigProvider = require_dist_cjs57(), utilMiddleware = require_dist_cjs30(), utilEndpoints = require_dist_cjs50(), ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT", CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint", DEFAULT_USE_DUALSTACK_ENDPOINT = !1, NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => utilConfigProvider.booleanSelector(env4, ENV_USE_DUALSTACK_ENDPOINT, utilConfigProvider.SelectorType.ENV),
    configFileSelector: (profile2) => utilConfigProvider.booleanSelector(profile2, CONFIG_USE_DUALSTACK_ENDPOINT, utilConfigProvider.SelectorType.CONFIG),
    default: !1
  }, nodeDualstackConfigSelectors = {
    environmentVariableSelector: (env4) => utilConfigProvider.booleanSelector(env4, ENV_USE_DUALSTACK_ENDPOINT, utilConfigProvider.SelectorType.ENV),
    configFileSelector: (profile2) => utilConfigProvider.booleanSelector(profile2, CONFIG_USE_DUALSTACK_ENDPOINT, utilConfigProvider.SelectorType.CONFIG),
    default: void 0
  }, ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT", CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint", DEFAULT_USE_FIPS_ENDPOINT = !1, NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => utilConfigProvider.booleanSelector(env4, ENV_USE_FIPS_ENDPOINT, utilConfigProvider.SelectorType.ENV),
    configFileSelector: (profile2) => utilConfigProvider.booleanSelector(profile2, CONFIG_USE_FIPS_ENDPOINT, utilConfigProvider.SelectorType.CONFIG),
    default: !1
  }, nodeFipsConfigSelectors = {
    environmentVariableSelector: (env4) => utilConfigProvider.booleanSelector(env4, ENV_USE_FIPS_ENDPOINT, utilConfigProvider.SelectorType.ENV),
    configFileSelector: (profile2) => utilConfigProvider.booleanSelector(profile2, CONFIG_USE_FIPS_ENDPOINT, utilConfigProvider.SelectorType.CONFIG),
    default: void 0
  }, resolveCustomEndpointsConfig = (input) => {
    let { tls, endpoint: endpoint2, urlParser, useDualstackEndpoint } = input;
    return Object.assign(input, {
      tls: tls ?? !0,
      endpoint: utilMiddleware.normalizeProvider(typeof endpoint2 === "string" ? urlParser(endpoint2) : endpoint2),
      isCustomEndpoint: !0,
      useDualstackEndpoint: utilMiddleware.normalizeProvider(useDualstackEndpoint ?? !1)
    });
  }, getEndpointFromRegion = async (input) => {
    let { tls = !0 } = input, region = await input.region();
    if (!new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/).test(region))
      throw Error("Invalid region in client config");
    let useDualstackEndpoint = await input.useDualstackEndpoint(), useFipsEndpoint = await input.useFipsEndpoint(), { hostname: hostname2 } = await input.regionInfoProvider(region, { useDualstackEndpoint, useFipsEndpoint }) ?? {};
    if (!hostname2)
      throw Error("Cannot resolve hostname from client config");
    return input.urlParser(`${tls ? "https:" : "http:"}//${hostname2}`);
  }, resolveEndpointsConfig = (input) => {
    let useDualstackEndpoint = utilMiddleware.normalizeProvider(input.useDualstackEndpoint ?? !1), { endpoint: endpoint2, useFipsEndpoint, urlParser, tls } = input;
    return Object.assign(input, {
      tls: tls ?? !0,
      endpoint: endpoint2 ? utilMiddleware.normalizeProvider(typeof endpoint2 === "string" ? urlParser(endpoint2) : endpoint2) : () => getEndpointFromRegion({ ...input, useDualstackEndpoint, useFipsEndpoint }),
      isCustomEndpoint: !!endpoint2,
      useDualstackEndpoint
    });
  }, REGION_ENV_NAME = "AWS_REGION", REGION_INI_NAME = "region", NODE_REGION_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => env4[REGION_ENV_NAME],
    configFileSelector: (profile2) => profile2[REGION_INI_NAME],
    default: () => {
      throw Error("Region is missing");
    }
  }, NODE_REGION_CONFIG_FILE_OPTIONS = {
    preferredFile: "credentials"
  }, validRegions = /* @__PURE__ */ new Set, checkRegion = (region, check2 = utilEndpoints.isValidHostLabel) => {
    if (!validRegions.has(region) && !check2(region))
      if (region === "*")
        console.warn('@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.');
      else
        throw Error(`Region not accepted: region="${region}" is not a valid hostname component.`);
    else
      validRegions.add(region);
  }, isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips")), getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region, resolveRegionConfig = (input) => {
    let { region, useFipsEndpoint } = input;
    if (!region)
      throw Error("Region is missing");
    return Object.assign(input, {
      region: async () => {
        let providedRegion = typeof region === "function" ? await region() : region, realRegion = getRealRegion(providedRegion);
        return checkRegion(realRegion), realRegion;
      },
      useFipsEndpoint: async () => {
        let providedRegion = typeof region === "string" ? region : await region();
        if (isFipsRegion(providedRegion))
          return !0;
        return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
      }
    });
  }, getHostnameFromVariants = (variants = [], { useFipsEndpoint, useDualstackEndpoint }) => variants.find(({ tags }) => useFipsEndpoint === tags.includes("fips") && useDualstackEndpoint === tags.includes("dualstack"))?.hostname, getResolvedHostname = (resolvedRegion, { regionHostname, partitionHostname }) => regionHostname ? regionHostname : partitionHostname ? partitionHostname.replace("{region}", resolvedRegion) : void 0, getResolvedPartition = (region, { partitionHash }) => Object.keys(partitionHash || {}).find((key) => partitionHash[key].regions.includes(region)) ?? "aws", getResolvedSigningRegion = (hostname2, { signingRegion, regionRegex, useFipsEndpoint }) => {
    if (signingRegion)
      return signingRegion;
    else if (useFipsEndpoint) {
      let regionRegexJs = regionRegex.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\."), regionRegexmatchArray = hostname2.match(regionRegexJs);
      if (regionRegexmatchArray)
        return regionRegexmatchArray[0].slice(1, -1);
    }
  }, getRegionInfo = (region, { useFipsEndpoint = !1, useDualstackEndpoint = !1, signingService, regionHash, partitionHash }) => {
    let partition2 = getResolvedPartition(region, { partitionHash }), resolvedRegion = region in regionHash ? region : partitionHash[partition2]?.endpoint ?? region, hostnameOptions = { useFipsEndpoint, useDualstackEndpoint }, regionHostname = getHostnameFromVariants(regionHash[resolvedRegion]?.variants, hostnameOptions), partitionHostname = getHostnameFromVariants(partitionHash[partition2]?.variants, hostnameOptions), hostname2 = getResolvedHostname(resolvedRegion, { regionHostname, partitionHostname });
    if (hostname2 === void 0)
      throw Error(`Endpoint resolution failed for: ${{ resolvedRegion, useFipsEndpoint, useDualstackEndpoint }}`);
    let signingRegion = getResolvedSigningRegion(hostname2, {
      signingRegion: regionHash[resolvedRegion]?.signingRegion,
      regionRegex: partitionHash[partition2].regionRegex,
      useFipsEndpoint
    });
    return {
      partition: partition2,
      signingService,
      hostname: hostname2,
      ...signingRegion && { signingRegion },
      ...regionHash[resolvedRegion]?.signingService && {
        signingService: regionHash[resolvedRegion].signingService
      }
    };
  };
  exports.CONFIG_USE_DUALSTACK_ENDPOINT = CONFIG_USE_DUALSTACK_ENDPOINT;
  exports.CONFIG_USE_FIPS_ENDPOINT = CONFIG_USE_FIPS_ENDPOINT;
  exports.DEFAULT_USE_DUALSTACK_ENDPOINT = DEFAULT_USE_DUALSTACK_ENDPOINT;
  exports.DEFAULT_USE_FIPS_ENDPOINT = DEFAULT_USE_FIPS_ENDPOINT;
  exports.ENV_USE_DUALSTACK_ENDPOINT = ENV_USE_DUALSTACK_ENDPOINT;
  exports.ENV_USE_FIPS_ENDPOINT = ENV_USE_FIPS_ENDPOINT;
  exports.NODE_REGION_CONFIG_FILE_OPTIONS = NODE_REGION_CONFIG_FILE_OPTIONS;
  exports.NODE_REGION_CONFIG_OPTIONS = NODE_REGION_CONFIG_OPTIONS;
  exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS;
  exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS;
  exports.REGION_ENV_NAME = REGION_ENV_NAME;
  exports.REGION_INI_NAME = REGION_INI_NAME;
  exports.getRegionInfo = getRegionInfo;
  exports.nodeDualstackConfigSelectors = nodeDualstackConfigSelectors;
  exports.nodeFipsConfigSelectors = nodeFipsConfigSelectors;
  exports.resolveCustomEndpointsConfig = resolveCustomEndpointsConfig;
  exports.resolveEndpointsConfig = resolveEndpointsConfig;
  exports.resolveRegionConfig = resolveRegionConfig;
});
