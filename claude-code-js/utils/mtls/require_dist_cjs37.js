// var: require_dist_cjs37
var require_dist_cjs37 = __commonJS((exports) => {
  var types3 = require_dist_cjs27(), protocolHttp = require_dist_cjs28(), utilMiddleware = require_dist_cjs30(), protocols = require_protocols(), getSmithyContext = (context) => context[types3.SMITHY_CONTEXT_KEY] || (context[types3.SMITHY_CONTEXT_KEY] = {}), resolveAuthOptions = (candidateAuthOptions, authSchemePreference) => {
    if (!authSchemePreference || authSchemePreference.length === 0)
      return candidateAuthOptions;
    let preferredAuthOptions = [];
    for (let preferredSchemeName of authSchemePreference)
      for (let candidateAuthOption of candidateAuthOptions)
        if (candidateAuthOption.schemeId.split("#")[1] === preferredSchemeName)
          preferredAuthOptions.push(candidateAuthOption);
    for (let candidateAuthOption of candidateAuthOptions)
      if (!preferredAuthOptions.find(({ schemeId }) => schemeId === candidateAuthOption.schemeId))
        preferredAuthOptions.push(candidateAuthOption);
    return preferredAuthOptions;
  };
  function convertHttpAuthSchemesToMap(httpAuthSchemes) {
    let map3 = /* @__PURE__ */ new Map;
    for (let scheme of httpAuthSchemes)
      map3.set(scheme.schemeId, scheme);
    return map3;
  }
  var httpAuthSchemeMiddleware = (config3, mwOptions) => (next, context) => async (args) => {
    let options = config3.httpAuthSchemeProvider(await mwOptions.httpAuthSchemeParametersProvider(config3, context, args.input)), authSchemePreference = config3.authSchemePreference ? await config3.authSchemePreference() : [], resolvedOptions = resolveAuthOptions(options, authSchemePreference), authSchemes = convertHttpAuthSchemesToMap(config3.httpAuthSchemes), smithyContext = utilMiddleware.getSmithyContext(context), failureReasons = [];
    for (let option of resolvedOptions) {
      let scheme = authSchemes.get(option.schemeId);
      if (!scheme) {
        failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` was not enabled for this service.`);
        continue;
      }
      let identityProvider = scheme.identityProvider(await mwOptions.identityProviderConfigProvider(config3));
      if (!identityProvider) {
        failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` did not have an IdentityProvider configured.`);
        continue;
      }
      let { identityProperties = {}, signingProperties = {} } = option.propertiesExtractor?.(config3, context) || {};
      option.identityProperties = Object.assign(option.identityProperties || {}, identityProperties), option.signingProperties = Object.assign(option.signingProperties || {}, signingProperties), smithyContext.selectedHttpAuthScheme = {
        httpAuthOption: option,
        identity: await identityProvider(option.identityProperties),
        signer: scheme.signer
      };
      break;
    }
    if (!smithyContext.selectedHttpAuthScheme)
      throw Error(failureReasons.join(`
`));
    return next(args);
  }, httpAuthSchemeEndpointRuleSetMiddlewareOptions = {
    step: "serialize",
    tags: ["HTTP_AUTH_SCHEME"],
    name: "httpAuthSchemeMiddleware",
    override: !0,
    relation: "before",
    toMiddleware: "endpointV2Middleware"
  }, getHttpAuthSchemeEndpointRuleSetPlugin = (config3, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({
    applyToStack: (clientStack) => {
      clientStack.addRelativeTo(httpAuthSchemeMiddleware(config3, {
        httpAuthSchemeParametersProvider,
        identityProviderConfigProvider
      }), httpAuthSchemeEndpointRuleSetMiddlewareOptions);
    }
  }), httpAuthSchemeMiddlewareOptions = {
    step: "serialize",
    tags: ["HTTP_AUTH_SCHEME"],
    name: "httpAuthSchemeMiddleware",
    override: !0,
    relation: "before",
    toMiddleware: "serializerMiddleware"
  }, getHttpAuthSchemePlugin = (config3, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({
    applyToStack: (clientStack) => {
      clientStack.addRelativeTo(httpAuthSchemeMiddleware(config3, {
        httpAuthSchemeParametersProvider,
        identityProviderConfigProvider
      }), httpAuthSchemeMiddlewareOptions);
    }
  }), defaultErrorHandler = (signingProperties) => (error41) => {
    throw error41;
  }, defaultSuccessHandler = (httpResponse2, signingProperties) => {}, httpSigningMiddleware = (config3) => (next, context) => async (args) => {
    if (!protocolHttp.HttpRequest.isInstance(args.request))
      return next(args);
    let scheme = utilMiddleware.getSmithyContext(context).selectedHttpAuthScheme;
    if (!scheme)
      throw Error("No HttpAuthScheme was selected: unable to sign request");
    let { httpAuthOption: { signingProperties = {} }, identity: identity6, signer } = scheme, output = await next({
      ...args,
      request: await signer.sign(args.request, identity6, signingProperties)
    }).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
    return (signer.successHandler || defaultSuccessHandler)(output.response, signingProperties), output;
  }, httpSigningMiddlewareOptions = {
    step: "finalizeRequest",
    tags: ["HTTP_SIGNING"],
    name: "httpSigningMiddleware",
    aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
    override: !0,
    relation: "after",
    toMiddleware: "retryMiddleware"
  }, getHttpSigningPlugin = (config3) => ({
    applyToStack: (clientStack) => {
      clientStack.addRelativeTo(httpSigningMiddleware(), httpSigningMiddlewareOptions);
    }
  }), normalizeProvider = (input) => {
    if (typeof input === "function")
      return input;
    let promisified = Promise.resolve(input);
    return () => promisified;
  }, makePagedClientRequest = async (CommandCtor, client3, input, withCommand = (_) => _, ...args) => {
    let command3 = new CommandCtor(input);
    return command3 = withCommand(command3) ?? command3, await client3.send(command3, ...args);
  };
  function createPaginator(ClientCtor, CommandCtor, inputTokenName, outputTokenName, pageSizeTokenName) {
    return async function* (config3, input, ...additionalArguments) {
      let _input = input, token = config3.startingToken ?? _input[inputTokenName], hasNext = !0, page;
      while (hasNext) {
        if (_input[inputTokenName] = token, pageSizeTokenName)
          _input[pageSizeTokenName] = _input[pageSizeTokenName] ?? config3.pageSize;
        if (config3.client instanceof ClientCtor)
          page = await makePagedClientRequest(CommandCtor, config3.client, input, config3.withCommand, ...additionalArguments);
        else
          throw Error(`Invalid client, expected instance of ${ClientCtor.name}`);
        yield page;
        let prevToken = token;
        token = get2(page, outputTokenName), hasNext = !!(token && (!config3.stopOnSameToken || token !== prevToken));
      }
      return;
    };
  }
  var get2 = (fromObject, path9) => {
    let cursor = fromObject, pathComponents = path9.split(".");
    for (let step of pathComponents) {
      if (!cursor || typeof cursor !== "object")
        return;
      cursor = cursor[step];
    }
    return cursor;
  };
  function setFeature(context, feature, value) {
    if (!context.__smithy_context)
      context.__smithy_context = {
        features: {}
      };
    else if (!context.__smithy_context.features)
      context.__smithy_context.features = {};
    context.__smithy_context.features[feature] = value;
  }

  class DefaultIdentityProviderConfig {
    authSchemes = /* @__PURE__ */ new Map;
    constructor(config3) {
      for (let [key, value] of Object.entries(config3))
        if (value !== void 0)
          this.authSchemes.set(key, value);
    }
    getIdentityProvider(schemeId) {
      return this.authSchemes.get(schemeId);
    }
  }

  class HttpApiKeyAuthSigner {
    async sign(httpRequest3, identity6, signingProperties) {
      if (!signingProperties)
        throw Error("request could not be signed with `apiKey` since the `name` and `in` signer properties are missing");
      if (!signingProperties.name)
        throw Error("request could not be signed with `apiKey` since the `name` signer property is missing");
      if (!signingProperties.in)
        throw Error("request could not be signed with `apiKey` since the `in` signer property is missing");
      if (!identity6.apiKey)
        throw Error("request could not be signed with `apiKey` since the `apiKey` is not defined");
      let clonedRequest = protocolHttp.HttpRequest.clone(httpRequest3);
      if (signingProperties.in === types3.HttpApiKeyAuthLocation.QUERY)
        clonedRequest.query[signingProperties.name] = identity6.apiKey;
      else if (signingProperties.in === types3.HttpApiKeyAuthLocation.HEADER)
        clonedRequest.headers[signingProperties.name] = signingProperties.scheme ? `${signingProperties.scheme} ${identity6.apiKey}` : identity6.apiKey;
      else
        throw Error("request can only be signed with `apiKey` locations `query` or `header`, but found: `" + signingProperties.in + "`");
      return clonedRequest;
    }
  }

  class HttpBearerAuthSigner {
    async sign(httpRequest3, identity6, signingProperties) {
      let clonedRequest = protocolHttp.HttpRequest.clone(httpRequest3);
      if (!identity6.token)
        throw Error("request could not be signed with `token` since the `token` is not defined");
      return clonedRequest.headers.Authorization = `Bearer ${identity6.token}`, clonedRequest;
    }
  }

  class NoAuthSigner {
    async sign(httpRequest3, identity6, signingProperties) {
      return httpRequest3;
    }
  }
  var createIsIdentityExpiredFunction = (expirationMs) => function(identity6) {
    return doesIdentityRequireRefresh(identity6) && identity6.expiration.getTime() - Date.now() < expirationMs;
  }, EXPIRATION_MS = 300000, isIdentityExpired = createIsIdentityExpiredFunction(EXPIRATION_MS), doesIdentityRequireRefresh = (identity6) => identity6.expiration !== void 0, memoizeIdentityProvider = (provider, isExpired, requiresRefresh) => {
    if (provider === void 0)
      return;
    let normalizedProvider = typeof provider !== "function" ? async () => Promise.resolve(provider) : provider, resolved, pending, hasResult, isConstant = !1, coalesceProvider = async (options) => {
      if (!pending)
        pending = normalizedProvider(options);
      try {
        resolved = await pending, hasResult = !0, isConstant = !1;
      } finally {
        pending = void 0;
      }
      return resolved;
    };
    if (isExpired === void 0)
      return async (options) => {
        if (!hasResult || options?.forceRefresh)
          resolved = await coalesceProvider(options);
        return resolved;
      };
    return async (options) => {
      if (!hasResult || options?.forceRefresh)
        resolved = await coalesceProvider(options);
      if (isConstant)
        return resolved;
      if (!requiresRefresh(resolved))
        return isConstant = !0, resolved;
      if (isExpired(resolved))
        return await coalesceProvider(options), resolved;
      return resolved;
    };
  };
  exports.requestBuilder = protocols.requestBuilder;
  exports.DefaultIdentityProviderConfig = DefaultIdentityProviderConfig;
  exports.EXPIRATION_MS = EXPIRATION_MS;
  exports.HttpApiKeyAuthSigner = HttpApiKeyAuthSigner;
  exports.HttpBearerAuthSigner = HttpBearerAuthSigner;
  exports.NoAuthSigner = NoAuthSigner;
  exports.createIsIdentityExpiredFunction = createIsIdentityExpiredFunction;
  exports.createPaginator = createPaginator;
  exports.doesIdentityRequireRefresh = doesIdentityRequireRefresh;
  exports.getHttpAuthSchemeEndpointRuleSetPlugin = getHttpAuthSchemeEndpointRuleSetPlugin;
  exports.getHttpAuthSchemePlugin = getHttpAuthSchemePlugin;
  exports.getHttpSigningPlugin = getHttpSigningPlugin;
  exports.getSmithyContext = getSmithyContext;
  exports.httpAuthSchemeEndpointRuleSetMiddlewareOptions = httpAuthSchemeEndpointRuleSetMiddlewareOptions;
  exports.httpAuthSchemeMiddleware = httpAuthSchemeMiddleware;
  exports.httpAuthSchemeMiddlewareOptions = httpAuthSchemeMiddlewareOptions;
  exports.httpSigningMiddleware = httpSigningMiddleware;
  exports.httpSigningMiddlewareOptions = httpSigningMiddlewareOptions;
  exports.isIdentityExpired = isIdentityExpired;
  exports.memoizeIdentityProvider = memoizeIdentityProvider;
  exports.normalizeProvider = normalizeProvider;
  exports.setFeature = setFeature;
});
