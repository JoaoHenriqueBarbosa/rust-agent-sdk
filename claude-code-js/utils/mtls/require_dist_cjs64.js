// var: require_dist_cjs64
var require_dist_cjs64 = __commonJS((exports) => {
  var protocolHttp = require_dist_cjs63(), endpoints2 = require_endpoints(), deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
    let { response: response2 } = await next(args);
    try {
      let parsed = await deserializer(response2, options);
      return {
        response: response2,
        output: parsed
      };
    } catch (error41) {
      if (Object.defineProperty(error41, "$response", {
        value: response2,
        enumerable: !1,
        writable: !1,
        configurable: !1
      }), !("$metadata" in error41)) {
        try {
          error41.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
        } catch (e) {
          if (!context.logger || context.logger?.constructor?.name === "NoOpLogger")
            console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
          else
            context.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
        }
        if (typeof error41.$responseBodyText < "u") {
          if (error41.$response)
            error41.$response.body = error41.$responseBodyText;
        }
        try {
          if (protocolHttp.HttpResponse.isInstance(response2)) {
            let { headers = {} } = response2, headerEntries = Object.entries(headers);
            error41.$metadata = {
              httpStatusCode: response2.statusCode,
              requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
              extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
              cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries)
            };
          }
        } catch (e) {}
      }
      throw error41;
    }
  }, findHeader = (pattern, headers) => {
    return (headers.find(([k]) => {
      return k.match(pattern);
    }) || [void 0, void 0])[1];
  }, serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
    let endpointConfig = options, endpoint2 = context.endpointV2 ? async () => endpoints2.toEndpointV1(context.endpointV2) : endpointConfig.endpoint;
    if (!endpoint2)
      throw Error("No valid endpoint provider available.");
    let request2 = await serializer(args.input, { ...options, endpoint: endpoint2 });
    return next({
      ...args,
      request: request2
    });
  }, deserializerMiddlewareOption = {
    name: "deserializerMiddleware",
    step: "deserialize",
    tags: ["DESERIALIZER"],
    override: !0
  }, serializerMiddlewareOption = {
    name: "serializerMiddleware",
    step: "serialize",
    tags: ["SERIALIZER"],
    override: !0
  };
  function getSerdePlugin(config3, serializer, deserializer) {
    return {
      applyToStack: (commandStack) => {
        commandStack.add(deserializerMiddleware(config3, deserializer), deserializerMiddlewareOption), commandStack.add(serializerMiddleware(config3, serializer), serializerMiddlewareOption);
      }
    };
  }
  exports.deserializerMiddleware = deserializerMiddleware;
  exports.deserializerMiddlewareOption = deserializerMiddlewareOption;
  exports.getSerdePlugin = getSerdePlugin;
  exports.serializerMiddleware = serializerMiddleware;
  exports.serializerMiddlewareOption = serializerMiddlewareOption;
});
