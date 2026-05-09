// var: require_dist_cjs56
var require_dist_cjs56 = __commonJS((exports) => {
  var core2 = require_dist_cjs37(), utilEndpoints = require_dist_cjs51(), protocolHttp = require_dist_cjs53(), client3 = require_client(), utilRetry = require_dist_cjs55(), DEFAULT_UA_APP_ID = void 0;
  function isValidUserAgentAppId(appId) {
    if (appId === void 0)
      return !0;
    return typeof appId === "string" && appId.length <= 50;
  }
  function resolveUserAgentConfig(input) {
    let normalizedAppIdProvider = core2.normalizeProvider(input.userAgentAppId ?? DEFAULT_UA_APP_ID), { customUserAgent } = input;
    return Object.assign(input, {
      customUserAgent: typeof customUserAgent === "string" ? [[customUserAgent]] : customUserAgent,
      userAgentAppId: async () => {
        let appId = await normalizedAppIdProvider();
        if (!isValidUserAgentAppId(appId)) {
          let logger2 = input.logger?.constructor?.name === "NoOpLogger" || !input.logger ? console : input.logger;
          if (typeof appId !== "string")
            logger2?.warn("userAgentAppId must be a string or undefined.");
          else if (appId.length > 50)
            logger2?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
        }
        return appId;
      }
    });
  }
  var ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
  async function checkFeatures(context, config3, args) {
    if (args.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor")
      client3.setFeature(context, "PROTOCOL_RPC_V2_CBOR", "M");
    if (typeof config3.retryStrategy === "function") {
      let retryStrategy = await config3.retryStrategy();
      if (typeof retryStrategy.mode === "string")
        switch (retryStrategy.mode) {
          case utilRetry.RETRY_MODES.ADAPTIVE:
            client3.setFeature(context, "RETRY_MODE_ADAPTIVE", "F");
            break;
          case utilRetry.RETRY_MODES.STANDARD:
            client3.setFeature(context, "RETRY_MODE_STANDARD", "E");
            break;
        }
    }
    if (typeof config3.accountIdEndpointMode === "function") {
      let endpointV2 = context.endpointV2;
      if (String(endpointV2?.url?.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX))
        client3.setFeature(context, "ACCOUNT_ID_ENDPOINT", "O");
      switch (await config3.accountIdEndpointMode?.()) {
        case "disabled":
          client3.setFeature(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
          break;
        case "preferred":
          client3.setFeature(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
          break;
        case "required":
          client3.setFeature(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
          break;
      }
    }
    let identity6 = context.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (identity6?.$source) {
      let credentials = identity6;
      if (credentials.accountId)
        client3.setFeature(context, "RESOLVED_ACCOUNT_ID", "T");
      for (let [key, value] of Object.entries(credentials.$source ?? {}))
        client3.setFeature(context, key, value);
    }
  }
  var USER_AGENT = "user-agent", X_AMZ_USER_AGENT = "x-amz-user-agent", SPACE = " ", UA_NAME_SEPARATOR = "/", UA_NAME_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w]/g, UA_VALUE_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w#]/g, UA_ESCAPE_CHAR = "-", BYTE_LIMIT = 1024;
  function encodeFeatures(features) {
    let buffer = "";
    for (let key in features) {
      let val = features[key];
      if (buffer.length + val.length + 1 <= BYTE_LIMIT) {
        if (buffer.length)
          buffer += "," + val;
        else
          buffer += val;
        continue;
      }
      break;
    }
    return buffer;
  }
  var userAgentMiddleware = (options) => (next, context) => async (args) => {
    let { request: request2 } = args;
    if (!protocolHttp.HttpRequest.isInstance(request2))
      return next(args);
    let { headers } = request2, userAgent = context?.userAgent?.map(escapeUserAgent) || [], defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
    await checkFeatures(context, options, args);
    let awsContext = context;
    defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, context.__smithy_context?.features, awsContext.__aws_sdk_context?.features))}`);
    let customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [], appId = await options.userAgentAppId();
    if (appId)
      defaultUserAgent.push(escapeUserAgent(["app", `${appId}`]));
    let prefix = utilEndpoints.getUserAgentPrefix(), sdkUserAgentValue = (prefix ? [prefix] : []).concat([...defaultUserAgent, ...userAgent, ...customUserAgent]).join(SPACE), normalUAValue = [
      ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
      ...customUserAgent
    ].join(SPACE);
    if (options.runtime !== "browser") {
      if (normalUAValue)
        headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
      headers[USER_AGENT] = sdkUserAgentValue;
    } else
      headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
    return next({
      ...args,
      request: request2
    });
  }, escapeUserAgent = (userAgentPair) => {
    let name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR), version2 = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR), prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR), prefix = name.substring(0, prefixSeparatorIndex), uaName = name.substring(prefixSeparatorIndex + 1);
    if (prefix === "api")
      uaName = uaName.toLowerCase();
    return [prefix, uaName, version2].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
      switch (index) {
        case 0:
          return item;
        case 1:
          return `${acc}/${item}`;
        default:
          return `${acc}#${item}`;
      }
    }, "");
  }, getUserAgentMiddlewareOptions = {
    name: "getUserAgentMiddleware",
    step: "build",
    priority: "low",
    tags: ["SET_USER_AGENT", "USER_AGENT"],
    override: !0
  }, getUserAgentPlugin = (config3) => ({
    applyToStack: (clientStack) => {
      clientStack.add(userAgentMiddleware(config3), getUserAgentMiddlewareOptions);
    }
  });
  exports.DEFAULT_UA_APP_ID = DEFAULT_UA_APP_ID;
  exports.getUserAgentMiddlewareOptions = getUserAgentMiddlewareOptions;
  exports.getUserAgentPlugin = getUserAgentPlugin;
  exports.resolveUserAgentConfig = resolveUserAgentConfig;
  exports.userAgentMiddleware = userAgentMiddleware;
});
