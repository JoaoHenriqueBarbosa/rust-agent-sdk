// var: require_dist_cjs68
var require_dist_cjs68 = __commonJS((exports) => {
  var middlewareStack = require_dist_cjs12(), types3 = require_dist_cjs66(), schema2 = require_schema(), serde3 = require_serde(), protocols = require_protocols();

  class Client2 {
    config;
    middlewareStack = middlewareStack.constructStack();
    initConfig;
    handlers;
    constructor(config3) {
      this.config = config3;
      let { protocol, protocolSettings } = config3;
      if (protocolSettings) {
        if (typeof protocol === "function")
          config3.protocol = new protocol(protocolSettings);
      }
    }
    send(command3, optionsOrCb, cb) {
      let options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0, callback = typeof optionsOrCb === "function" ? optionsOrCb : cb, useHandlerCache = options === void 0 && this.config.cacheMiddleware === !0, handler;
      if (useHandlerCache) {
        if (!this.handlers)
          this.handlers = /* @__PURE__ */ new WeakMap;
        let handlers = this.handlers;
        if (handlers.has(command3.constructor))
          handler = handlers.get(command3.constructor);
        else
          handler = command3.resolveMiddleware(this.middlewareStack, this.config, options), handlers.set(command3.constructor, handler);
      } else
        delete this.handlers, handler = command3.resolveMiddleware(this.middlewareStack, this.config, options);
      if (callback)
        handler(command3).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {});
      else
        return handler(command3).then((result) => result.output);
    }
    destroy() {
      this.config?.requestHandler?.destroy?.(), delete this.handlers;
    }
  }
  var SENSITIVE_STRING$1 = "***SensitiveInformation***";
  function schemaLogFilter2(schema$1, data) {
    if (data == null)
      return data;
    let ns = schema2.NormalizedSchema.of(schema$1);
    if (ns.getMergedTraits().sensitive)
      return SENSITIVE_STRING$1;
    if (ns.isListSchema()) {
      if (!!ns.getValueSchema().getMergedTraits().sensitive)
        return SENSITIVE_STRING$1;
    } else if (ns.isMapSchema()) {
      if (!!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive)
        return SENSITIVE_STRING$1;
    } else if (ns.isStructSchema() && typeof data === "object") {
      let object2 = data, newObject = {};
      for (let [member, memberNs] of ns.structIterator())
        if (object2[member] != null)
          newObject[member] = schemaLogFilter2(memberNs, object2[member]);
      return newObject;
    }
    return data;
  }

  class Command2 {
    middlewareStack = middlewareStack.constructStack();
    schema;
    static classBuilder() {
      return new ClassBuilder2;
    }
    resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
      for (let mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options))
        this.middlewareStack.use(mw);
      let stack = clientStack.concat(this.middlewareStack), { logger: logger2 } = configuration, handlerExecutionContext = {
        logger: logger2,
        clientName,
        commandName,
        inputFilterSensitiveLog,
        outputFilterSensitiveLog,
        [types3.SMITHY_CONTEXT_KEY]: {
          commandInstance: this,
          ...smithyContext
        },
        ...additionalContext
      }, { requestHandler } = configuration;
      return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
    }
  }

  class ClassBuilder2 {
    _init = () => {};
    _ep = {};
    _middlewareFn = () => [];
    _commandName = "";
    _clientName = "";
    _additionalContext = {};
    _smithyContext = {};
    _inputFilterSensitiveLog = void 0;
    _outputFilterSensitiveLog = void 0;
    _serializer = null;
    _deserializer = null;
    _operationSchema;
    init(cb) {
      this._init = cb;
    }
    ep(endpointParameterInstructions) {
      return this._ep = endpointParameterInstructions, this;
    }
    m(middlewareSupplier) {
      return this._middlewareFn = middlewareSupplier, this;
    }
    s(service, operation, smithyContext = {}) {
      return this._smithyContext = {
        service,
        operation,
        ...smithyContext
      }, this;
    }
    c(additionalContext = {}) {
      return this._additionalContext = additionalContext, this;
    }
    n(clientName, commandName) {
      return this._clientName = clientName, this._commandName = commandName, this;
    }
    f(inputFilter = (_) => _, outputFilter = (_) => _) {
      return this._inputFilterSensitiveLog = inputFilter, this._outputFilterSensitiveLog = outputFilter, this;
    }
    ser(serializer) {
      return this._serializer = serializer, this;
    }
    de(deserializer) {
      return this._deserializer = deserializer, this;
    }
    sc(operation) {
      return this._operationSchema = operation, this._smithyContext.operationSchema = operation, this;
    }
    build() {
      let closure = this, CommandRef;
      return CommandRef = class extends Command2 {
        input;
        static getEndpointParameterInstructions() {
          return closure._ep;
        }
        constructor(...[input]) {
          super();
          this.input = input ?? {}, closure._init(this), this.schema = closure._operationSchema;
        }
        resolveMiddleware(stack, configuration, options) {
          let op = closure._operationSchema, input = op?.[4] ?? op?.input, output = op?.[5] ?? op?.output;
          return this.resolveMiddlewareWithContext(stack, configuration, options, {
            CommandCtor: CommandRef,
            middlewareFn: closure._middlewareFn,
            clientName: closure._clientName,
            commandName: closure._commandName,
            inputFilterSensitiveLog: closure._inputFilterSensitiveLog ?? (op ? schemaLogFilter2.bind(null, input) : (_) => _),
            outputFilterSensitiveLog: closure._outputFilterSensitiveLog ?? (op ? schemaLogFilter2.bind(null, output) : (_) => _),
            smithyContext: closure._smithyContext,
            additionalContext: closure._additionalContext
          });
        }
        serialize = closure._serializer;
        deserialize = closure._deserializer;
      };
    }
  }
  var SENSITIVE_STRING3 = "***SensitiveInformation***", createAggregatedClient2 = (commands, Client3, options) => {
    for (let [command3, CommandCtor] of Object.entries(commands)) {
      let methodImpl = async function(args, optionsOrCb, cb) {
        let command4 = new CommandCtor(args);
        if (typeof optionsOrCb === "function")
          this.send(command4, optionsOrCb);
        else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw Error(`Expected http options but got ${typeof optionsOrCb}`);
          this.send(command4, optionsOrCb || {}, cb);
        } else
          return this.send(command4, optionsOrCb);
      }, methodName = (command3[0].toLowerCase() + command3.slice(1)).replace(/Command$/, "");
      Client3.prototype[methodName] = methodImpl;
    }
    let { paginators = {}, waiters = {} } = options ?? {};
    for (let [paginatorName, paginatorFn] of Object.entries(paginators))
      if (Client3.prototype[paginatorName] === void 0)
        Client3.prototype[paginatorName] = function(commandInput = {}, paginationConfiguration, ...rest) {
          return paginatorFn({
            ...paginationConfiguration,
            client: this
          }, commandInput, ...rest);
        };
    for (let [waiterName, waiterFn] of Object.entries(waiters))
      if (Client3.prototype[waiterName] === void 0)
        Client3.prototype[waiterName] = async function(commandInput = {}, waiterConfiguration, ...rest) {
          let config3 = waiterConfiguration;
          if (typeof waiterConfiguration === "number")
            config3 = {
              maxWaitTime: waiterConfiguration
            };
          return waiterFn({
            ...config3,
            client: this
          }, commandInput, ...rest);
        };
  };

  class ServiceException2 extends Error {
    $fault;
    $response;
    $retryable;
    $metadata;
    constructor(options) {
      super(options.message);
      Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = options.name, this.$fault = options.$fault, this.$metadata = options.$metadata;
    }
    static isInstance(value) {
      if (!value)
        return !1;
      let candidate = value;
      return ServiceException2.prototype.isPrototypeOf(candidate) || Boolean(candidate.$fault) && Boolean(candidate.$metadata) && (candidate.$fault === "client" || candidate.$fault === "server");
    }
    static [Symbol.hasInstance](instance) {
      if (!instance)
        return !1;
      let candidate = instance;
      if (this === ServiceException2)
        return ServiceException2.isInstance(instance);
      if (ServiceException2.isInstance(instance)) {
        if (candidate.name && this.name)
          return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
        return this.prototype.isPrototypeOf(instance);
      }
      return !1;
    }
  }
  var decorateServiceException2 = (exception, additions = {}) => {
    Object.entries(additions).filter(([, v]) => v !== void 0).forEach(([k, v]) => {
      if (exception[k] == null || exception[k] === "")
        exception[k] = v;
    });
    let message = exception.message || exception.Message || "UnknownError";
    return exception.message = message, delete exception.Message, exception;
  }, throwDefaultError2 = ({ output, parsedBody, exceptionCtor, errorCode }) => {
    let $metadata = deserializeMetadata2(output), statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0, response2 = new exceptionCtor({
      name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
      $fault: "client",
      $metadata
    });
    throw decorateServiceException2(response2, parsedBody);
  }, withBaseException2 = (ExceptionCtor) => {
    return ({ output, parsedBody, errorCode }) => {
      throwDefaultError2({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
    };
  }, deserializeMetadata2 = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  }), loadConfigsForDefaultMode2 = (mode) => {
    switch (mode) {
      case "standard":
        return {
          retryMode: "standard",
          connectionTimeout: 3100
        };
      case "in-region":
        return {
          retryMode: "standard",
          connectionTimeout: 1100
        };
      case "cross-region":
        return {
          retryMode: "standard",
          connectionTimeout: 3100
        };
      case "mobile":
        return {
          retryMode: "standard",
          connectionTimeout: 30000
        };
      default:
        return {};
    }
  }, warningEmitted2 = !1, emitWarningIfUnsupportedVersion3 = (version2) => {
    if (version2 && !warningEmitted2 && parseInt(version2.substring(1, version2.indexOf("."))) < 16)
      warningEmitted2 = !0;
  }, knownAlgorithms2 = Object.values(types3.AlgorithmId), getChecksumConfiguration2 = (runtimeConfig) => {
    let checksumAlgorithms = [];
    for (let id in types3.AlgorithmId) {
      let algorithmId = types3.AlgorithmId[id];
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
  }, getRetryConfiguration2 = (runtimeConfig) => {
    return {
      setRetryStrategy(retryStrategy) {
        runtimeConfig.retryStrategy = retryStrategy;
      },
      retryStrategy() {
        return runtimeConfig.retryStrategy;
      }
    };
  }, resolveRetryRuntimeConfig2 = (retryStrategyConfiguration) => {
    let runtimeConfig = {};
    return runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy(), runtimeConfig;
  }, getDefaultExtensionConfiguration2 = (runtimeConfig) => {
    return Object.assign(getChecksumConfiguration2(runtimeConfig), getRetryConfiguration2(runtimeConfig));
  }, getDefaultClientConfiguration2 = getDefaultExtensionConfiguration2, resolveDefaultRuntimeConfig2 = (config3) => {
    return Object.assign(resolveChecksumRuntimeConfig2(config3), resolveRetryRuntimeConfig2(config3));
  }, getArrayIfSingleItem2 = (mayBeArray) => Array.isArray(mayBeArray) ? mayBeArray : [mayBeArray], getValueFromTextNode2 = (obj) => {
    for (let key in obj)
      if (obj.hasOwnProperty(key) && obj[key]["#text"] !== void 0)
        obj[key] = obj[key]["#text"];
      else if (typeof obj[key] === "object" && obj[key] !== null)
        obj[key] = getValueFromTextNode2(obj[key]);
    return obj;
  }, isSerializableHeaderValue2 = (value) => {
    return value != null;
  };

  class NoOpLogger3 {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }
  function map3(arg0, arg1, arg2) {
    let target, filter2, instructions;
    if (typeof arg1 > "u" && typeof arg2 > "u")
      target = {}, instructions = arg0;
    else if (target = arg0, typeof arg1 === "function")
      return filter2 = arg1, instructions = arg2, mapWithFilter2(target, filter2, instructions);
    else
      instructions = arg1;
    for (let key of Object.keys(instructions)) {
      if (!Array.isArray(instructions[key])) {
        target[key] = instructions[key];
        continue;
      }
      applyInstruction2(target, null, instructions, key);
    }
    return target;
  }
  var convertMap2 = (target) => {
    let output = {};
    for (let [k, v] of Object.entries(target || {}))
      output[k] = [, v];
    return output;
  }, take2 = (source, instructions) => {
    let out = {};
    for (let key in instructions)
      applyInstruction2(out, source, instructions, key);
    return out;
  }, mapWithFilter2 = (target, filter2, instructions) => {
    return map3(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
      if (Array.isArray(value))
        _instructions[key] = value;
      else if (typeof value === "function")
        _instructions[key] = [filter2, value()];
      else
        _instructions[key] = [filter2, value];
      return _instructions;
    }, {}));
  }, applyInstruction2 = (target, source, instructions, targetKey) => {
    if (source !== null) {
      let instruction = instructions[targetKey];
      if (typeof instruction === "function")
        instruction = [, instruction];
      let [filter3 = nonNullish2, valueFn = pass2, sourceKey = targetKey] = instruction;
      if (typeof filter3 === "function" && filter3(source[sourceKey]) || typeof filter3 !== "function" && !!filter3)
        target[targetKey] = valueFn(source[sourceKey]);
      return;
    }
    let [filter2, value] = instructions[targetKey];
    if (typeof value === "function") {
      let _value, defaultFilterPassed = filter2 === void 0 && (_value = value()) != null, customFilterPassed = typeof filter2 === "function" && !!filter2(void 0) || typeof filter2 !== "function" && !!filter2;
      if (defaultFilterPassed)
        target[targetKey] = _value;
      else if (customFilterPassed)
        target[targetKey] = value();
    } else {
      let defaultFilterPassed = filter2 === void 0 && value != null, customFilterPassed = typeof filter2 === "function" && !!filter2(value) || typeof filter2 !== "function" && !!filter2;
      if (defaultFilterPassed || customFilterPassed)
        target[targetKey] = value;
    }
  }, nonNullish2 = (_) => _ != null, pass2 = (_) => _, serializeFloat2 = (value) => {
    if (value !== value)
      return "NaN";
    switch (value) {
      case 1 / 0:
        return "Infinity";
      case -1 / 0:
        return "-Infinity";
      default:
        return value;
    }
  }, serializeDateTime2 = (date5) => date5.toISOString().replace(".000Z", "Z"), _json2 = (obj) => {
    if (obj == null)
      return {};
    if (Array.isArray(obj))
      return obj.filter((_) => _ != null).map(_json2);
    if (typeof obj === "object") {
      let target = {};
      for (let key of Object.keys(obj)) {
        if (obj[key] == null)
          continue;
        target[key] = _json2(obj[key]);
      }
      return target;
    }
    return obj;
  };
  exports.collectBody = protocols.collectBody;
  exports.extendedEncodeURIComponent = protocols.extendedEncodeURIComponent;
  exports.resolvedPath = protocols.resolvedPath;
  exports.Client = Client2;
  exports.Command = Command2;
  exports.NoOpLogger = NoOpLogger3;
  exports.SENSITIVE_STRING = SENSITIVE_STRING3;
  exports.ServiceException = ServiceException2;
  exports._json = _json2;
  exports.convertMap = convertMap2;
  exports.createAggregatedClient = createAggregatedClient2;
  exports.decorateServiceException = decorateServiceException2;
  exports.emitWarningIfUnsupportedVersion = emitWarningIfUnsupportedVersion3;
  exports.getArrayIfSingleItem = getArrayIfSingleItem2;
  exports.getDefaultClientConfiguration = getDefaultClientConfiguration2;
  exports.getDefaultExtensionConfiguration = getDefaultExtensionConfiguration2;
  exports.getValueFromTextNode = getValueFromTextNode2;
  exports.isSerializableHeaderValue = isSerializableHeaderValue2;
  exports.loadConfigsForDefaultMode = loadConfigsForDefaultMode2;
  exports.map = map3;
  exports.resolveDefaultRuntimeConfig = resolveDefaultRuntimeConfig2;
  exports.serializeDateTime = serializeDateTime2;
  exports.serializeFloat = serializeFloat2;
  exports.take = take2;
  exports.throwDefaultError = throwDefaultError2;
  exports.withBaseException = withBaseException2;
  Object.prototype.hasOwnProperty.call(serde3, "__proto__") && !Object.prototype.hasOwnProperty.call(exports, "__proto__") && Object.defineProperty(exports, "__proto__", {
    enumerable: !0,
    value: serde3.__proto__
  });
  Object.keys(serde3).forEach(function(k) {
    if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
      exports[k] = serde3[k];
  });
});
