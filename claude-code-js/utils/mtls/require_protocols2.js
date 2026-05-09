// var: require_protocols2
var require_protocols2 = __commonJS((exports) => {
  var cbor = require_cbor(), schema2 = require_schema(), smithyClient = require_dist_cjs79(), protocols = require_protocols(), serde3 = require_serde(), utilBase64 = require_dist_cjs82(), utilUtf8 = require_dist_cjs17(), xmlBuilder = require_dist_cjs83();

  class ProtocolLib {
    queryCompat;
    errorRegistry;
    constructor(queryCompat = !1) {
      this.queryCompat = queryCompat;
    }
    resolveRestContentType(defaultContentType, inputSchema) {
      let members = inputSchema.getMemberSchemas(), httpPayloadMember = Object.values(members).find((m) => {
        return !!m.getMergedTraits().httpPayload;
      });
      if (httpPayloadMember) {
        let mediaType = httpPayloadMember.getMergedTraits().mediaType;
        if (mediaType)
          return mediaType;
        else if (httpPayloadMember.isStringSchema())
          return "text/plain";
        else if (httpPayloadMember.isBlobSchema())
          return "application/octet-stream";
        else
          return defaultContentType;
      } else if (!inputSchema.isUnitSchema()) {
        if (Object.values(members).find((m) => {
          let { httpQuery, httpQueryParams, httpHeader, httpLabel, httpPrefixHeaders } = m.getMergedTraits();
          return !httpQuery && !httpQueryParams && !httpHeader && !httpLabel && httpPrefixHeaders === void 0;
        }))
          return defaultContentType;
      }
    }
    async getErrorSchemaOrThrowBaseException(errorIdentifier, defaultNamespace, response2, dataObject, metadata, getErrorSchema) {
      let errorName = errorIdentifier;
      if (errorIdentifier.includes("#"))
        [, errorName] = errorIdentifier.split("#");
      let errorMetadata = {
        $metadata: metadata,
        $fault: response2.statusCode < 500 ? "client" : "server"
      };
      if (!this.errorRegistry)
        throw Error("@aws-sdk/core/protocols - error handler not initialized.");
      try {
        return { errorSchema: getErrorSchema?.(this.errorRegistry, errorName) ?? this.errorRegistry.getSchema(errorIdentifier), errorMetadata };
      } catch (e) {
        dataObject.message = dataObject.message ?? dataObject.Message ?? "UnknownError";
        let synthetic = this.errorRegistry, baseExceptionSchema = synthetic.getBaseException();
        if (baseExceptionSchema) {
          let ErrorCtor = synthetic.getErrorCtor(baseExceptionSchema) ?? Error;
          throw this.decorateServiceException(Object.assign(new ErrorCtor({ name: errorName }), errorMetadata), dataObject);
        }
        let d = dataObject, message = d?.message ?? d?.Message ?? d?.Error?.Message ?? d?.Error?.message;
        throw this.decorateServiceException(Object.assign(Error(message), {
          name: errorName
        }, errorMetadata), dataObject);
      }
    }
    compose(composite, errorIdentifier, defaultNamespace) {
      let namespace = defaultNamespace;
      if (errorIdentifier.includes("#"))
        [namespace] = errorIdentifier.split("#");
      let staticRegistry = schema2.TypeRegistry.for(namespace), defaultSyntheticRegistry = schema2.TypeRegistry.for("smithy.ts.sdk.synthetic." + defaultNamespace);
      composite.copyFrom(staticRegistry), composite.copyFrom(defaultSyntheticRegistry), this.errorRegistry = composite;
    }
    decorateServiceException(exception, additions = {}) {
      if (this.queryCompat) {
        let msg = exception.Message ?? additions.Message, error41 = smithyClient.decorateServiceException(exception, additions);
        if (msg)
          error41.message = msg;
        error41.Error = {
          ...error41.Error,
          Type: error41.Error?.Type,
          Code: error41.Error?.Code,
          Message: error41.Error?.message ?? error41.Error?.Message ?? msg
        };
        let reqId = error41.$metadata.requestId;
        if (reqId)
          error41.RequestId = reqId;
        return error41;
      }
      return smithyClient.decorateServiceException(exception, additions);
    }
    setQueryCompatError(output, response2) {
      let queryErrorHeader = response2.headers?.["x-amzn-query-error"];
      if (output !== void 0 && queryErrorHeader != null) {
        let [Code, Type] = queryErrorHeader.split(";"), entries = Object.entries(output), Error2 = {
          Code,
          Type
        };
        Object.assign(output, Error2);
        for (let [k, v] of entries)
          Error2[k === "message" ? "Message" : k] = v;
        delete Error2.__type, output.Error = Error2;
      }
    }
    queryCompatOutput(queryCompatErrorData, errorData) {
      if (queryCompatErrorData.Error)
        errorData.Error = queryCompatErrorData.Error;
      if (queryCompatErrorData.Type)
        errorData.Type = queryCompatErrorData.Type;
      if (queryCompatErrorData.Code)
        errorData.Code = queryCompatErrorData.Code;
    }
    findQueryCompatibleError(registry2, errorName) {
      try {
        return registry2.getSchema(errorName);
      } catch (e) {
        return registry2.find((schema$1) => schema2.NormalizedSchema.of(schema$1).getMergedTraits().awsQueryError?.[0] === errorName);
      }
    }
  }

  class AwsSmithyRpcV2CborProtocol extends cbor.SmithyRpcV2CborProtocol {
    awsQueryCompatible;
    mixin;
    constructor({ defaultNamespace, errorTypeRegistries, awsQueryCompatible }) {
      super({ defaultNamespace, errorTypeRegistries });
      this.awsQueryCompatible = !!awsQueryCompatible, this.mixin = new ProtocolLib(this.awsQueryCompatible);
    }
    async serializeRequest(operationSchema, input, context) {
      let request2 = await super.serializeRequest(operationSchema, input, context);
      if (this.awsQueryCompatible)
        request2.headers["x-amzn-query-mode"] = "true";
      return request2;
    }
    async handleError(operationSchema, context, response2, dataObject, metadata) {
      if (this.awsQueryCompatible)
        this.mixin.setQueryCompatError(dataObject, response2);
      let errorName = (() => {
        let compatHeader = response2.headers["x-amzn-query-error"];
        if (compatHeader && this.awsQueryCompatible)
          return compatHeader.split(";")[0];
        return cbor.loadSmithyRpcV2CborErrorCode(response2, dataObject) ?? "Unknown";
      })();
      this.mixin.compose(this.compositeErrorRegistry, errorName, this.options.defaultNamespace);
      let { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorName, this.options.defaultNamespace, response2, dataObject, metadata, this.awsQueryCompatible ? this.mixin.findQueryCompatibleError : void 0), ns = schema2.NormalizedSchema.of(errorSchema), message = dataObject.message ?? dataObject.Message ?? "UnknownError", exception = new (this.compositeErrorRegistry.getErrorCtor(errorSchema) ?? Error)(message), output = {};
      for (let [name, member] of ns.structIterator())
        if (dataObject[name] != null)
          output[name] = this.deserializer.readValue(member, dataObject[name]);
      if (this.awsQueryCompatible)
        this.mixin.queryCompatOutput(dataObject, output);
      throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
        $fault: ns.getMergedTraits().error,
        message
      }, output), dataObject);
    }
  }
  var _toStr = (val) => {
    if (val == null)
      return val;
    if (typeof val === "number" || typeof val === "bigint") {
      let warning = Error(`Received number ${val} where a string was expected.`);
      return warning.name = "Warning", console.warn(warning), String(val);
    }
    if (typeof val === "boolean") {
      let warning = Error(`Received boolean ${val} where a string was expected.`);
      return warning.name = "Warning", console.warn(warning), String(val);
    }
    return val;
  }, _toBool = (val) => {
    if (val == null)
      return val;
    if (typeof val === "string") {
      let lowercase2 = val.toLowerCase();
      if (val !== "" && lowercase2 !== "false" && lowercase2 !== "true") {
        let warning = Error(`Received string "${val}" where a boolean was expected.`);
        warning.name = "Warning", console.warn(warning);
      }
      return val !== "" && lowercase2 !== "false";
    }
    return val;
  }, _toNum = (val) => {
    if (val == null)
      return val;
    if (typeof val === "string") {
      let num = Number(val);
      if (num.toString() !== val) {
        let warning = Error(`Received string "${val}" where a number was expected.`);
        return warning.name = "Warning", console.warn(warning), val;
      }
      return num;
    }
    return val;
  };

  class SerdeContextConfig {
    serdeContext;
    setSerdeContext(serdeContext) {
      this.serdeContext = serdeContext;
    }
  }

  class UnionSerde {
    from;
    to;
    keys;
    constructor(from, to) {
      this.from = from, this.to = to, this.keys = new Set(Object.keys(this.from).filter((k) => k !== "__type"));
    }
    mark(key) {
      this.keys.delete(key);
    }
    hasUnknown() {
      return this.keys.size === 1 && Object.keys(this.to).length === 0;
    }
    writeUnknown() {
      if (this.hasUnknown()) {
        let k = this.keys.values().next().value, v = this.from[k];
        this.to.$unknown = [k, v];
      }
    }
  }
  function jsonReviver(key, value, context) {
    if (context?.source) {
      let numericString = context.source;
      if (typeof value === "number") {
        if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER || numericString !== String(value))
          if (numericString.includes("."))
            return new serde3.NumericValue(numericString, "bigDecimal");
          else
            return BigInt(numericString);
      }
    }
    return value;
  }
  var collectBodyString = (streamBody, context) => smithyClient.collectBody(streamBody, context).then((body) => (context?.utf8Encoder ?? utilUtf8.toUtf8)(body)), parseJsonBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length)
      try {
        return JSON.parse(encoded);
      } catch (e) {
        if (e?.name === "SyntaxError")
          Object.defineProperty(e, "$responseBodyText", {
            value: encoded
          });
        throw e;
      }
    return {};
  }), parseJsonErrorBody = async (errorBody, context) => {
    let value = await parseJsonBody(errorBody, context);
    return value.message = value.message ?? value.Message, value;
  }, loadRestJsonErrorCode = (output, data) => {
    let findKey2 = (object2, key) => Object.keys(object2).find((k) => k.toLowerCase() === key.toLowerCase()), sanitizeErrorCode = (rawValue) => {
      let cleanValue = rawValue;
      if (typeof cleanValue === "number")
        cleanValue = cleanValue.toString();
      if (cleanValue.indexOf(",") >= 0)
        cleanValue = cleanValue.split(",")[0];
      if (cleanValue.indexOf(":") >= 0)
        cleanValue = cleanValue.split(":")[0];
      if (cleanValue.indexOf("#") >= 0)
        cleanValue = cleanValue.split("#")[1];
      return cleanValue;
    }, headerKey = findKey2(output.headers, "x-amzn-errortype");
    if (headerKey !== void 0)
      return sanitizeErrorCode(output.headers[headerKey]);
    if (data && typeof data === "object") {
      let codeKey = findKey2(data, "code");
      if (codeKey && data[codeKey] !== void 0)
        return sanitizeErrorCode(data[codeKey]);
      if (data.__type !== void 0)
        return sanitizeErrorCode(data.__type);
    }
  };

  class JsonShapeDeserializer extends SerdeContextConfig {
    settings;
    constructor(settings) {
      super();
      this.settings = settings;
    }
    async read(schema3, data) {
      return this._read(schema3, typeof data === "string" ? JSON.parse(data, jsonReviver) : await parseJsonBody(data, this.serdeContext));
    }
    readObject(schema3, data) {
      return this._read(schema3, data);
    }
    _read(schema$1, value) {
      let isObject5 = value !== null && typeof value === "object", ns = schema2.NormalizedSchema.of(schema$1);
      if (isObject5) {
        if (ns.isStructSchema()) {
          let record2 = value, union2 = ns.isUnionSchema(), out = {}, nameMap = void 0, { jsonName } = this.settings;
          if (jsonName)
            nameMap = {};
          let unionSerde;
          if (union2)
            unionSerde = new UnionSerde(record2, out);
          for (let [memberName, memberSchema] of ns.structIterator()) {
            let fromKey = memberName;
            if (jsonName)
              fromKey = memberSchema.getMergedTraits().jsonName ?? fromKey, nameMap[fromKey] = memberName;
            if (union2)
              unionSerde.mark(fromKey);
            if (record2[fromKey] != null)
              out[memberName] = this._read(memberSchema, record2[fromKey]);
          }
          if (union2)
            unionSerde.writeUnknown();
          else if (typeof record2.__type === "string")
            for (let [k, v] of Object.entries(record2)) {
              let t = jsonName ? nameMap[k] ?? k : k;
              if (!(t in out))
                out[t] = v;
            }
          return out;
        }
        if (Array.isArray(value) && ns.isListSchema()) {
          let listMember = ns.getValueSchema(), out = [];
          for (let item of value)
            out.push(this._read(listMember, item));
          return out;
        }
        if (ns.isMapSchema()) {
          let mapMember = ns.getValueSchema(), out = {};
          for (let [_k, _v] of Object.entries(value))
            out[_k] = this._read(mapMember, _v);
          return out;
        }
      }
      if (ns.isBlobSchema() && typeof value === "string")
        return utilBase64.fromBase64(value);
      let mediaType = ns.getMergedTraits().mediaType;
      if (ns.isStringSchema() && typeof value === "string" && mediaType) {
        if (mediaType === "application/json" || mediaType.endsWith("+json"))
          return serde3.LazyJsonString.from(value);
        return value;
      }
      if (ns.isTimestampSchema() && value != null)
        switch (protocols.determineTimestampFormat(ns, this.settings)) {
          case 5:
            return serde3.parseRfc3339DateTimeWithOffset(value);
          case 6:
            return serde3.parseRfc7231DateTime(value);
          case 7:
            return serde3.parseEpochTimestamp(value);
          default:
            return console.warn("Missing timestamp format, parsing value with Date constructor:", value), new Date(value);
        }
      if (ns.isBigIntegerSchema() && (typeof value === "number" || typeof value === "string"))
        return BigInt(value);
      if (ns.isBigDecimalSchema() && value != null) {
        if (value instanceof serde3.NumericValue)
          return value;
        let untyped = value;
        if (untyped.type === "bigDecimal" && "string" in untyped)
          return new serde3.NumericValue(untyped.string, untyped.type);
        return new serde3.NumericValue(String(value), "bigDecimal");
      }
      if (ns.isNumericSchema() && typeof value === "string") {
        switch (value) {
          case "Infinity":
            return 1 / 0;
          case "-Infinity":
            return -1 / 0;
          case "NaN":
            return NaN;
        }
        return value;
      }
      if (ns.isDocumentSchema())
        if (isObject5) {
          let out = Array.isArray(value) ? [] : {};
          for (let [k, v] of Object.entries(value))
            if (v instanceof serde3.NumericValue)
              out[k] = v;
            else
              out[k] = this._read(ns, v);
          return out;
        } else
          return structuredClone(value);
      return value;
    }
  }
  var NUMERIC_CONTROL_CHAR = String.fromCharCode(925);

  class JsonReplacer {
    values = /* @__PURE__ */ new Map;
    counter = 0;
    stage = 0;
    createReplacer() {
      if (this.stage === 1)
        throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
      if (this.stage === 2)
        throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
      return this.stage = 1, (key, value) => {
        if (value instanceof serde3.NumericValue) {
          let v = `${NUMERIC_CONTROL_CHAR + "nv" + this.counter++}_` + value.string;
          return this.values.set(`"${v}"`, value.string), v;
        }
        if (typeof value === "bigint") {
          let s = value.toString(), v = `${NUMERIC_CONTROL_CHAR + "b" + this.counter++}_` + s;
          return this.values.set(`"${v}"`, s), v;
        }
        return value;
      };
    }
    replaceInJson(json2) {
      if (this.stage === 0)
        throw Error("@aws-sdk/core/protocols - JsonReplacer not created yet.");
      if (this.stage === 2)
        throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
      if (this.stage = 2, this.counter === 0)
        return json2;
      for (let [key, value] of this.values)
        json2 = json2.replace(key, value);
      return json2;
    }
  }

  class JsonShapeSerializer extends SerdeContextConfig {
    settings;
    buffer;
    useReplacer = !1;
    rootSchema;
    constructor(settings) {
      super();
      this.settings = settings;
    }
    write(schema$1, value) {
      this.rootSchema = schema2.NormalizedSchema.of(schema$1), this.buffer = this._write(this.rootSchema, value);
    }
    writeDiscriminatedDocument(schema$1, value) {
      if (this.write(schema$1, value), typeof this.buffer === "object")
        this.buffer.__type = schema2.NormalizedSchema.of(schema$1).getName(!0);
    }
    flush() {
      let { rootSchema, useReplacer } = this;
      if (this.rootSchema = void 0, this.useReplacer = !1, rootSchema?.isStructSchema() || rootSchema?.isDocumentSchema()) {
        if (!useReplacer)
          return JSON.stringify(this.buffer);
        let replacer = new JsonReplacer;
        return replacer.replaceInJson(JSON.stringify(this.buffer, replacer.createReplacer(), 0));
      }
      return this.buffer;
    }
    _write(schema$1, value, container) {
      let isObject5 = value !== null && typeof value === "object", ns = schema2.NormalizedSchema.of(schema$1);
      if (isObject5) {
        if (ns.isStructSchema()) {
          let record2 = value, out = {}, { jsonName } = this.settings, nameMap = void 0;
          if (jsonName)
            nameMap = {};
          for (let [memberName, memberSchema] of ns.structIterator()) {
            let serializableValue = this._write(memberSchema, record2[memberName], ns);
            if (serializableValue !== void 0) {
              let targetKey = memberName;
              if (jsonName)
                targetKey = memberSchema.getMergedTraits().jsonName ?? memberName, nameMap[memberName] = targetKey;
              out[targetKey] = serializableValue;
            }
          }
          if (ns.isUnionSchema() && Object.keys(out).length === 0) {
            let { $unknown } = record2;
            if (Array.isArray($unknown)) {
              let [k, v] = $unknown;
              out[k] = this._write(15, v);
            }
          } else if (typeof record2.__type === "string")
            for (let [k, v] of Object.entries(record2)) {
              let targetKey = jsonName ? nameMap[k] ?? k : k;
              if (!(targetKey in out))
                out[targetKey] = this._write(15, v);
            }
          return out;
        }
        if (Array.isArray(value) && ns.isListSchema()) {
          let listMember = ns.getValueSchema(), out = [], sparse = !!ns.getMergedTraits().sparse;
          for (let item of value)
            if (sparse || item != null)
              out.push(this._write(listMember, item));
          return out;
        }
        if (ns.isMapSchema()) {
          let mapMember = ns.getValueSchema(), out = {}, sparse = !!ns.getMergedTraits().sparse;
          for (let [_k, _v] of Object.entries(value))
            if (sparse || _v != null)
              out[_k] = this._write(mapMember, _v);
          return out;
        }
        if (value instanceof Uint8Array && (ns.isBlobSchema() || ns.isDocumentSchema())) {
          if (ns === this.rootSchema)
            return value;
          return (this.serdeContext?.base64Encoder ?? utilBase64.toBase64)(value);
        }
        if (value instanceof Date && (ns.isTimestampSchema() || ns.isDocumentSchema()))
          switch (protocols.determineTimestampFormat(ns, this.settings)) {
            case 5:
              return value.toISOString().replace(".000Z", "Z");
            case 6:
              return serde3.dateToUtcString(value);
            case 7:
              return value.getTime() / 1000;
            default:
              return console.warn("Missing timestamp format, using epoch seconds", value), value.getTime() / 1000;
          }
        if (value instanceof serde3.NumericValue)
          this.useReplacer = !0;
      }
      if (value === null && container?.isStructSchema())
        return;
      if (ns.isStringSchema()) {
        if (typeof value > "u" && ns.isIdempotencyToken())
          return serde3.generateIdempotencyToken();
        let mediaType = ns.getMergedTraits().mediaType;
        if (value != null && mediaType) {
          if (mediaType === "application/json" || mediaType.endsWith("+json"))
            return serde3.LazyJsonString.from(value);
        }
        return value;
      }
      if (typeof value === "number" && ns.isNumericSchema()) {
        if (Math.abs(value) === 1 / 0 || isNaN(value))
          return String(value);
        return value;
      }
      if (typeof value === "string" && ns.isBlobSchema()) {
        if (ns === this.rootSchema)
          return value;
        return (this.serdeContext?.base64Encoder ?? utilBase64.toBase64)(value);
      }
      if (typeof value === "bigint")
        this.useReplacer = !0;
      if (ns.isDocumentSchema())
        if (isObject5) {
          let out = Array.isArray(value) ? [] : {};
          for (let [k, v] of Object.entries(value))
            if (v instanceof serde3.NumericValue)
              this.useReplacer = !0, out[k] = v;
            else
              out[k] = this._write(ns, v);
          return out;
        } else
          return structuredClone(value);
      return value;
    }
  }

  class JsonCodec extends SerdeContextConfig {
    settings;
    constructor(settings) {
      super();
      this.settings = settings;
    }
    createSerializer() {
      let serializer = new JsonShapeSerializer(this.settings);
      return serializer.setSerdeContext(this.serdeContext), serializer;
    }
    createDeserializer() {
      let deserializer = new JsonShapeDeserializer(this.settings);
      return deserializer.setSerdeContext(this.serdeContext), deserializer;
    }
  }

  class AwsJsonRpcProtocol extends protocols.RpcProtocol {
    serializer;
    deserializer;
    serviceTarget;
    codec;
    mixin;
    awsQueryCompatible;
    constructor({ defaultNamespace, errorTypeRegistries, serviceTarget, awsQueryCompatible, jsonCodec }) {
      super({
        defaultNamespace,
        errorTypeRegistries
      });
      this.serviceTarget = serviceTarget, this.codec = jsonCodec ?? new JsonCodec({
        timestampFormat: {
          useTrait: !0,
          default: 7
        },
        jsonName: !1
      }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!awsQueryCompatible, this.mixin = new ProtocolLib(this.awsQueryCompatible);
    }
    async serializeRequest(operationSchema, input, context) {
      let request2 = await super.serializeRequest(operationSchema, input, context);
      if (!request2.path.endsWith("/"))
        request2.path += "/";
      if (Object.assign(request2.headers, {
        "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
        "x-amz-target": `${this.serviceTarget}.${operationSchema.name}`
      }), this.awsQueryCompatible)
        request2.headers["x-amzn-query-mode"] = "true";
      if (schema2.deref(operationSchema.input) === "unit" || !request2.body)
        request2.body = "{}";
      return request2;
    }
    getPayloadCodec() {
      return this.codec;
    }
    async handleError(operationSchema, context, response2, dataObject, metadata) {
      if (this.awsQueryCompatible)
        this.mixin.setQueryCompatError(dataObject, response2);
      let errorIdentifier = loadRestJsonErrorCode(response2, dataObject) ?? "Unknown";
      this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace);
      let { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response2, dataObject, metadata, this.awsQueryCompatible ? this.mixin.findQueryCompatibleError : void 0), ns = schema2.NormalizedSchema.of(errorSchema), message = dataObject.message ?? dataObject.Message ?? "UnknownError", exception = new (this.compositeErrorRegistry.getErrorCtor(errorSchema) ?? Error)(message), output = {};
      for (let [name, member] of ns.structIterator())
        if (dataObject[name] != null)
          output[name] = this.codec.createDeserializer().readObject(member, dataObject[name]);
      if (this.awsQueryCompatible)
        this.mixin.queryCompatOutput(dataObject, output);
      throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
        $fault: ns.getMergedTraits().error,
        message
      }, output), dataObject);
    }
  }

  class AwsJson1_0Protocol extends AwsJsonRpcProtocol {
    constructor({ defaultNamespace, errorTypeRegistries, serviceTarget, awsQueryCompatible, jsonCodec }) {
      super({
        defaultNamespace,
        errorTypeRegistries,
        serviceTarget,
        awsQueryCompatible,
        jsonCodec
      });
    }
    getShapeId() {
      return "aws.protocols#awsJson1_0";
    }
    getJsonRpcVersion() {
      return "1.0";
    }
    getDefaultContentType() {
      return "application/x-amz-json-1.0";
    }
  }

  class AwsJson1_1Protocol extends AwsJsonRpcProtocol {
    constructor({ defaultNamespace, errorTypeRegistries, serviceTarget, awsQueryCompatible, jsonCodec }) {
      super({
        defaultNamespace,
        errorTypeRegistries,
        serviceTarget,
        awsQueryCompatible,
        jsonCodec
      });
    }
    getShapeId() {
      return "aws.protocols#awsJson1_1";
    }
    getJsonRpcVersion() {
      return "1.1";
    }
    getDefaultContentType() {
      return "application/x-amz-json-1.1";
    }
  }

  class AwsRestJsonProtocol extends protocols.HttpBindingProtocol {
    serializer;
    deserializer;
    codec;
    mixin = new ProtocolLib;
    constructor({ defaultNamespace, errorTypeRegistries }) {
      super({
        defaultNamespace,
        errorTypeRegistries
      });
      let settings = {
        timestampFormat: {
          useTrait: !0,
          default: 7
        },
        httpBindings: !0,
        jsonName: !0
      };
      this.codec = new JsonCodec(settings), this.serializer = new protocols.HttpInterceptingShapeSerializer(this.codec.createSerializer(), settings), this.deserializer = new protocols.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), settings);
    }
    getShapeId() {
      return "aws.protocols#restJson1";
    }
    getPayloadCodec() {
      return this.codec;
    }
    setSerdeContext(serdeContext) {
      this.codec.setSerdeContext(serdeContext), super.setSerdeContext(serdeContext);
    }
    async serializeRequest(operationSchema, input, context) {
      let request2 = await super.serializeRequest(operationSchema, input, context), inputSchema = schema2.NormalizedSchema.of(operationSchema.input);
      if (!request2.headers["content-type"]) {
        let contentType = this.mixin.resolveRestContentType(this.getDefaultContentType(), inputSchema);
        if (contentType)
          request2.headers["content-type"] = contentType;
      }
      if (request2.body == null && request2.headers["content-type"] === this.getDefaultContentType())
        request2.body = "{}";
      return request2;
    }
    async deserializeResponse(operationSchema, context, response2) {
      let output = await super.deserializeResponse(operationSchema, context, response2), outputSchema = schema2.NormalizedSchema.of(operationSchema.output);
      for (let [name, member] of outputSchema.structIterator())
        if (member.getMemberTraits().httpPayload && !(name in output))
          output[name] = null;
      return output;
    }
    async handleError(operationSchema, context, response2, dataObject, metadata) {
      let errorIdentifier = loadRestJsonErrorCode(response2, dataObject) ?? "Unknown";
      this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace);
      let { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response2, dataObject, metadata), ns = schema2.NormalizedSchema.of(errorSchema), message = dataObject.message ?? dataObject.Message ?? "UnknownError", exception = new (this.compositeErrorRegistry.getErrorCtor(errorSchema) ?? Error)(message);
      await this.deserializeHttpMessage(errorSchema, context, response2, dataObject);
      let output = {};
      for (let [name, member] of ns.structIterator()) {
        let target = member.getMergedTraits().jsonName ?? name;
        output[name] = this.codec.createDeserializer().readObject(member, dataObject[target]);
      }
      throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
        $fault: ns.getMergedTraits().error,
        message
      }, output), dataObject);
    }
    getDefaultContentType() {
      return "application/json";
    }
  }
  var awsExpectUnion = (value) => {
    if (value == null)
      return;
    if (typeof value === "object" && "__type" in value)
      delete value.__type;
    return smithyClient.expectUnion(value);
  };

  class XmlShapeDeserializer extends SerdeContextConfig {
    settings;
    stringDeserializer;
    constructor(settings) {
      super();
      this.settings = settings, this.stringDeserializer = new protocols.FromStringShapeDeserializer(settings);
    }
    setSerdeContext(serdeContext) {
      this.serdeContext = serdeContext, this.stringDeserializer.setSerdeContext(serdeContext);
    }
    read(schema$1, bytes, key) {
      let ns = schema2.NormalizedSchema.of(schema$1), memberSchemas = ns.getMemberSchemas();
      if (ns.isStructSchema() && ns.isMemberSchema() && !!Object.values(memberSchemas).find((memberNs) => {
        return !!memberNs.getMemberTraits().eventPayload;
      })) {
        let output = {}, memberName = Object.keys(memberSchemas)[0];
        if (memberSchemas[memberName].isBlobSchema())
          output[memberName] = bytes;
        else
          output[memberName] = this.read(memberSchemas[memberName], bytes);
        return output;
      }
      let xmlString = (this.serdeContext?.utf8Encoder ?? utilUtf8.toUtf8)(bytes), parsedObject = this.parseXml(xmlString);
      return this.readSchema(schema$1, key ? parsedObject[key] : parsedObject);
    }
    readSchema(_schema, value) {
      let ns = schema2.NormalizedSchema.of(_schema);
      if (ns.isUnitSchema())
        return;
      let traits2 = ns.getMergedTraits();
      if (ns.isListSchema() && !Array.isArray(value))
        return this.readSchema(ns, [value]);
      if (value == null)
        return value;
      if (typeof value === "object") {
        let flat = !!traits2.xmlFlattened;
        if (ns.isListSchema()) {
          let listValue = ns.getValueSchema(), buffer2 = [], sourceKey = listValue.getMergedTraits().xmlName ?? "member", source = flat ? value : (value[0] ?? value)[sourceKey];
          if (source == null)
            return buffer2;
          let sourceArray = Array.isArray(source) ? source : [source];
          for (let v of sourceArray)
            buffer2.push(this.readSchema(listValue, v));
          return buffer2;
        }
        let buffer = {};
        if (ns.isMapSchema()) {
          let keyNs = ns.getKeySchema(), memberNs = ns.getValueSchema(), entries;
          if (flat)
            entries = Array.isArray(value) ? value : [value];
          else
            entries = Array.isArray(value.entry) ? value.entry : [value.entry];
          let keyProperty = keyNs.getMergedTraits().xmlName ?? "key", valueProperty = memberNs.getMergedTraits().xmlName ?? "value";
          for (let entry of entries) {
            let key = entry[keyProperty], value2 = entry[valueProperty];
            buffer[key] = this.readSchema(memberNs, value2);
          }
          return buffer;
        }
        if (ns.isStructSchema()) {
          let union2 = ns.isUnionSchema(), unionSerde;
          if (union2)
            unionSerde = new UnionSerde(value, buffer);
          for (let [memberName, memberSchema] of ns.structIterator()) {
            let memberTraits = memberSchema.getMergedTraits(), xmlObjectKey = !memberTraits.httpPayload ? memberSchema.getMemberTraits().xmlName ?? memberName : memberTraits.xmlName ?? memberSchema.getName();
            if (union2)
              unionSerde.mark(xmlObjectKey);
            if (value[xmlObjectKey] != null)
              buffer[memberName] = this.readSchema(memberSchema, value[xmlObjectKey]);
          }
          if (union2)
            unionSerde.writeUnknown();
          return buffer;
        }
        if (ns.isDocumentSchema())
          return value;
        throw Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${ns.getName(!0)}`);
      }
      if (ns.isListSchema())
        return [];
      if (ns.isMapSchema() || ns.isStructSchema())
        return {};
      return this.stringDeserializer.read(ns, value);
    }
    parseXml(xml) {
      if (xml.length) {
        let parsedObj;
        try {
          parsedObj = xmlBuilder.parseXML(xml);
        } catch (e) {
          if (e && typeof e === "object")
            Object.defineProperty(e, "$responseBodyText", {
              value: xml
            });
          throw e;
        }
        let textNodeName = "#text", key = Object.keys(parsedObj)[0], parsedObjToReturn = parsedObj[key];
        if (parsedObjToReturn[textNodeName])
          parsedObjToReturn[key] = parsedObjToReturn[textNodeName], delete parsedObjToReturn[textNodeName];
        return smithyClient.getValueFromTextNode(parsedObjToReturn);
      }
      return {};
    }
  }

  class QueryShapeSerializer extends SerdeContextConfig {
    settings;
    buffer;
    constructor(settings) {
      super();
      this.settings = settings;
    }
    write(schema$1, value, prefix = "") {
      if (this.buffer === void 0)
        this.buffer = "";
      let ns = schema2.NormalizedSchema.of(schema$1);
      if (prefix && !prefix.endsWith("."))
        prefix += ".";
      if (ns.isBlobSchema()) {
        if (typeof value === "string" || value instanceof Uint8Array)
          this.writeKey(prefix), this.writeValue((this.serdeContext?.base64Encoder ?? utilBase64.toBase64)(value));
      } else if (ns.isBooleanSchema() || ns.isNumericSchema() || ns.isStringSchema()) {
        if (value != null)
          this.writeKey(prefix), this.writeValue(String(value));
        else if (ns.isIdempotencyToken())
          this.writeKey(prefix), this.writeValue(serde3.generateIdempotencyToken());
      } else if (ns.isBigIntegerSchema()) {
        if (value != null)
          this.writeKey(prefix), this.writeValue(String(value));
      } else if (ns.isBigDecimalSchema()) {
        if (value != null)
          this.writeKey(prefix), this.writeValue(value instanceof serde3.NumericValue ? value.string : String(value));
      } else if (ns.isTimestampSchema()) {
        if (value instanceof Date)
          switch (this.writeKey(prefix), protocols.determineTimestampFormat(ns, this.settings)) {
            case 5:
              this.writeValue(value.toISOString().replace(".000Z", "Z"));
              break;
            case 6:
              this.writeValue(smithyClient.dateToUtcString(value));
              break;
            case 7:
              this.writeValue(String(value.getTime() / 1000));
              break;
          }
      } else if (ns.isDocumentSchema())
        if (Array.isArray(value))
          this.write(79, value, prefix);
        else if (value instanceof Date)
          this.write(4, value, prefix);
        else if (value instanceof Uint8Array)
          this.write(21, value, prefix);
        else if (value && typeof value === "object")
          this.write(143, value, prefix);
        else
          this.writeKey(prefix), this.writeValue(String(value));
      else if (ns.isListSchema()) {
        if (Array.isArray(value))
          if (value.length === 0) {
            if (this.settings.serializeEmptyLists)
              this.writeKey(prefix), this.writeValue("");
          } else {
            let member = ns.getValueSchema(), flat = this.settings.flattenLists || ns.getMergedTraits().xmlFlattened, i2 = 1;
            for (let item of value) {
              if (item == null)
                continue;
              let traits2 = member.getMergedTraits(), suffix = this.getKey("member", traits2.xmlName, traits2.ec2QueryName), key = flat ? `${prefix}${i2}` : `${prefix}${suffix}.${i2}`;
              this.write(member, item, key), ++i2;
            }
          }
      } else if (ns.isMapSchema()) {
        if (value && typeof value === "object") {
          let keySchema = ns.getKeySchema(), memberSchema = ns.getValueSchema(), flat = ns.getMergedTraits().xmlFlattened, i2 = 1;
          for (let [k, v] of Object.entries(value)) {
            if (v == null)
              continue;
            let keyTraits = keySchema.getMergedTraits(), keySuffix = this.getKey("key", keyTraits.xmlName, keyTraits.ec2QueryName), key = flat ? `${prefix}${i2}.${keySuffix}` : `${prefix}entry.${i2}.${keySuffix}`, valTraits = memberSchema.getMergedTraits(), valueSuffix = this.getKey("value", valTraits.xmlName, valTraits.ec2QueryName), valueKey = flat ? `${prefix}${i2}.${valueSuffix}` : `${prefix}entry.${i2}.${valueSuffix}`;
            this.write(keySchema, k, key), this.write(memberSchema, v, valueKey), ++i2;
          }
        }
      } else if (ns.isStructSchema()) {
        if (value && typeof value === "object") {
          let didWriteMember = !1;
          for (let [memberName, member] of ns.structIterator()) {
            if (value[memberName] == null && !member.isIdempotencyToken())
              continue;
            let traits2 = member.getMergedTraits(), suffix = this.getKey(memberName, traits2.xmlName, traits2.ec2QueryName, "struct"), key = `${prefix}${suffix}`;
            this.write(member, value[memberName], key), didWriteMember = !0;
          }
          if (!didWriteMember && ns.isUnionSchema()) {
            let { $unknown } = value;
            if (Array.isArray($unknown)) {
              let [k, v] = $unknown, key = `${prefix}${k}`;
              this.write(15, v, key);
            }
          }
        }
      } else if (ns.isUnitSchema())
        ;
      else
        throw Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${ns.getName(!0)}`);
    }
    flush() {
      if (this.buffer === void 0)
        throw Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
      let str = this.buffer;
      return delete this.buffer, str;
    }
    getKey(memberName, xmlName, ec2QueryName, keySource) {
      let { ec2, capitalizeKeys } = this.settings;
      if (ec2 && ec2QueryName)
        return ec2QueryName;
      let key = xmlName ?? memberName;
      if (capitalizeKeys && keySource === "struct")
        return key[0].toUpperCase() + key.slice(1);
      return key;
    }
    writeKey(key) {
      if (key.endsWith("."))
        key = key.slice(0, key.length - 1);
      this.buffer += `&${protocols.extendedEncodeURIComponent(key)}=`;
    }
    writeValue(value) {
      this.buffer += protocols.extendedEncodeURIComponent(value);
    }
  }

  class AwsQueryProtocol extends protocols.RpcProtocol {
    options;
    serializer;
    deserializer;
    mixin = new ProtocolLib;
    constructor(options) {
      super({
        defaultNamespace: options.defaultNamespace,
        errorTypeRegistries: options.errorTypeRegistries
      });
      this.options = options;
      let settings = {
        timestampFormat: {
          useTrait: !0,
          default: 5
        },
        httpBindings: !1,
        xmlNamespace: options.xmlNamespace,
        serviceNamespace: options.defaultNamespace,
        serializeEmptyLists: !0
      };
      this.serializer = new QueryShapeSerializer(settings), this.deserializer = new XmlShapeDeserializer(settings);
    }
    getShapeId() {
      return "aws.protocols#awsQuery";
    }
    setSerdeContext(serdeContext) {
      this.serializer.setSerdeContext(serdeContext), this.deserializer.setSerdeContext(serdeContext);
    }
    getPayloadCodec() {
      throw Error("AWSQuery protocol has no payload codec.");
    }
    async serializeRequest(operationSchema, input, context) {
      let request2 = await super.serializeRequest(operationSchema, input, context);
      if (!request2.path.endsWith("/"))
        request2.path += "/";
      if (Object.assign(request2.headers, {
        "content-type": "application/x-www-form-urlencoded"
      }), schema2.deref(operationSchema.input) === "unit" || !request2.body)
        request2.body = "";
      let action = operationSchema.name.split("#")[1] ?? operationSchema.name;
      if (request2.body = `Action=${action}&Version=${this.options.version}` + request2.body, request2.body.endsWith("&"))
        request2.body = request2.body.slice(-1);
      return request2;
    }
    async deserializeResponse(operationSchema, context, response2) {
      let deserializer = this.deserializer, ns = schema2.NormalizedSchema.of(operationSchema.output), dataObject = {};
      if (response2.statusCode >= 300) {
        let bytes2 = await protocols.collectBody(response2.body, context);
        if (bytes2.byteLength > 0)
          Object.assign(dataObject, await deserializer.read(15, bytes2));
        await this.handleError(operationSchema, context, response2, dataObject, this.deserializeMetadata(response2));
      }
      for (let header in response2.headers) {
        let value = response2.headers[header];
        delete response2.headers[header], response2.headers[header.toLowerCase()] = value;
      }
      let shortName = operationSchema.name.split("#")[1] ?? operationSchema.name, awsQueryResultKey = ns.isStructSchema() && this.useNestedResult() ? shortName + "Result" : void 0, bytes = await protocols.collectBody(response2.body, context);
      if (bytes.byteLength > 0)
        Object.assign(dataObject, await deserializer.read(ns, bytes, awsQueryResultKey));
      return {
        $metadata: this.deserializeMetadata(response2),
        ...dataObject
      };
    }
    useNestedResult() {
      return !0;
    }
    async handleError(operationSchema, context, response2, dataObject, metadata) {
      let errorIdentifier = this.loadQueryErrorCode(response2, dataObject) ?? "Unknown";
      this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace);
      let errorData = this.loadQueryError(dataObject) ?? {}, message = this.loadQueryErrorMessage(dataObject);
      errorData.message = message, errorData.Error = {
        Type: errorData.Type,
        Code: errorData.Code,
        Message: message
      };
      let { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response2, errorData, metadata, this.mixin.findQueryCompatibleError), ns = schema2.NormalizedSchema.of(errorSchema), exception = new (this.compositeErrorRegistry.getErrorCtor(errorSchema) ?? Error)(message), output = {
        Type: errorData.Error.Type,
        Code: errorData.Error.Code,
        Error: errorData.Error
      };
      for (let [name, member] of ns.structIterator()) {
        let target = member.getMergedTraits().xmlName ?? name, value = errorData[target] ?? dataObject[target];
        output[name] = this.deserializer.readSchema(member, value);
      }
      throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
        $fault: ns.getMergedTraits().error,
        message
      }, output), dataObject);
    }
    loadQueryErrorCode(output, data) {
      let code = (data.Errors?.[0]?.Error ?? data.Errors?.Error ?? data.Error)?.Code;
      if (code !== void 0)
        return code;
      if (output.statusCode == 404)
        return "NotFound";
    }
    loadQueryError(data) {
      return data.Errors?.[0]?.Error ?? data.Errors?.Error ?? data.Error;
    }
    loadQueryErrorMessage(data) {
      let errorData = this.loadQueryError(data);
      return errorData?.message ?? errorData?.Message ?? data.message ?? data.Message ?? "Unknown";
    }
    getDefaultContentType() {
      return "application/x-www-form-urlencoded";
    }
  }

  class AwsEc2QueryProtocol extends AwsQueryProtocol {
    options;
    constructor(options) {
      super(options);
      this.options = options;
      let ec2Settings = {
        capitalizeKeys: !0,
        flattenLists: !0,
        serializeEmptyLists: !1,
        ec2: !0
      };
      Object.assign(this.serializer.settings, ec2Settings);
    }
    getShapeId() {
      return "aws.protocols#ec2Query";
    }
    useNestedResult() {
      return !1;
    }
  }
  var parseXmlBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
      let parsedObj;
      try {
        parsedObj = xmlBuilder.parseXML(encoded);
      } catch (e) {
        if (e && typeof e === "object")
          Object.defineProperty(e, "$responseBodyText", {
            value: encoded
          });
        throw e;
      }
      let textNodeName = "#text", key = Object.keys(parsedObj)[0], parsedObjToReturn = parsedObj[key];
      if (parsedObjToReturn[textNodeName])
        parsedObjToReturn[key] = parsedObjToReturn[textNodeName], delete parsedObjToReturn[textNodeName];
      return smithyClient.getValueFromTextNode(parsedObjToReturn);
    }
    return {};
  }), parseXmlErrorBody = async (errorBody, context) => {
    let value = await parseXmlBody(errorBody, context);
    if (value.Error)
      value.Error.message = value.Error.message ?? value.Error.Message;
    return value;
  }, loadRestXmlErrorCode = (output, data) => {
    if (data?.Error?.Code !== void 0)
      return data.Error.Code;
    if (data?.Code !== void 0)
      return data.Code;
    if (output.statusCode == 404)
      return "NotFound";
  };

  class XmlShapeSerializer extends SerdeContextConfig {
    settings;
    stringBuffer;
    byteBuffer;
    buffer;
    constructor(settings) {
      super();
      this.settings = settings;
    }
    write(schema$1, value) {
      let ns = schema2.NormalizedSchema.of(schema$1);
      if (ns.isStringSchema() && typeof value === "string")
        this.stringBuffer = value;
      else if (ns.isBlobSchema())
        this.byteBuffer = "byteLength" in value ? value : (this.serdeContext?.base64Decoder ?? utilBase64.fromBase64)(value);
      else {
        this.buffer = this.writeStruct(ns, value, void 0);
        let traits2 = ns.getMergedTraits();
        if (traits2.httpPayload && !traits2.xmlName)
          this.buffer.withName(ns.getName());
      }
    }
    flush() {
      if (this.byteBuffer !== void 0) {
        let bytes = this.byteBuffer;
        return delete this.byteBuffer, bytes;
      }
      if (this.stringBuffer !== void 0) {
        let str = this.stringBuffer;
        return delete this.stringBuffer, str;
      }
      let buffer = this.buffer;
      if (this.settings.xmlNamespace) {
        if (!buffer?.attributes?.xmlns)
          buffer.addAttribute("xmlns", this.settings.xmlNamespace);
      }
      return delete this.buffer, buffer.toString();
    }
    writeStruct(ns, value, parentXmlns) {
      let traits2 = ns.getMergedTraits(), name = ns.isMemberSchema() && !traits2.httpPayload ? ns.getMemberTraits().xmlName ?? ns.getMemberName() : traits2.xmlName ?? ns.getName();
      if (!name || !ns.isStructSchema())
        throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${ns.getName(!0)}.`);
      let structXmlNode = xmlBuilder.XmlNode.of(name), [xmlnsAttr, xmlns] = this.getXmlnsAttribute(ns, parentXmlns);
      for (let [memberName, memberSchema] of ns.structIterator()) {
        let val = value[memberName];
        if (val != null || memberSchema.isIdempotencyToken()) {
          if (memberSchema.getMergedTraits().xmlAttribute) {
            structXmlNode.addAttribute(memberSchema.getMergedTraits().xmlName ?? memberName, this.writeSimple(memberSchema, val));
            continue;
          }
          if (memberSchema.isListSchema())
            this.writeList(memberSchema, val, structXmlNode, xmlns);
          else if (memberSchema.isMapSchema())
            this.writeMap(memberSchema, val, structXmlNode, xmlns);
          else if (memberSchema.isStructSchema())
            structXmlNode.addChildNode(this.writeStruct(memberSchema, val, xmlns));
          else {
            let memberNode = xmlBuilder.XmlNode.of(memberSchema.getMergedTraits().xmlName ?? memberSchema.getMemberName());
            this.writeSimpleInto(memberSchema, val, memberNode, xmlns), structXmlNode.addChildNode(memberNode);
          }
        }
      }
      let { $unknown } = value;
      if ($unknown && ns.isUnionSchema() && Array.isArray($unknown) && Object.keys(value).length === 1) {
        let [k, v] = $unknown, node = xmlBuilder.XmlNode.of(k);
        if (typeof v !== "string")
          if (value instanceof xmlBuilder.XmlNode || value instanceof xmlBuilder.XmlText)
            structXmlNode.addChildNode(value);
          else
            throw Error("@aws-sdk - $unknown union member in XML requires value of type string, @aws-sdk/xml-builder::XmlNode or XmlText.");
        this.writeSimpleInto(0, v, node, xmlns), structXmlNode.addChildNode(node);
      }
      if (xmlns)
        structXmlNode.addAttribute(xmlnsAttr, xmlns);
      return structXmlNode;
    }
    writeList(listMember, array2, container, parentXmlns) {
      if (!listMember.isMemberSchema())
        throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${listMember.getName(!0)}`);
      let listTraits = listMember.getMergedTraits(), listValueSchema = listMember.getValueSchema(), listValueTraits = listValueSchema.getMergedTraits(), sparse = !!listValueTraits.sparse, flat = !!listTraits.xmlFlattened, [xmlnsAttr, xmlns] = this.getXmlnsAttribute(listMember, parentXmlns), writeItem = (container2, value) => {
        if (listValueSchema.isListSchema())
          this.writeList(listValueSchema, Array.isArray(value) ? value : [value], container2, xmlns);
        else if (listValueSchema.isMapSchema())
          this.writeMap(listValueSchema, value, container2, xmlns);
        else if (listValueSchema.isStructSchema()) {
          let struct = this.writeStruct(listValueSchema, value, xmlns);
          container2.addChildNode(struct.withName(flat ? listTraits.xmlName ?? listMember.getMemberName() : listValueTraits.xmlName ?? "member"));
        } else {
          let listItemNode = xmlBuilder.XmlNode.of(flat ? listTraits.xmlName ?? listMember.getMemberName() : listValueTraits.xmlName ?? "member");
          this.writeSimpleInto(listValueSchema, value, listItemNode, xmlns), container2.addChildNode(listItemNode);
        }
      };
      if (flat) {
        for (let value of array2)
          if (sparse || value != null)
            writeItem(container, value);
      } else {
        let listNode = xmlBuilder.XmlNode.of(listTraits.xmlName ?? listMember.getMemberName());
        if (xmlns)
          listNode.addAttribute(xmlnsAttr, xmlns);
        for (let value of array2)
          if (sparse || value != null)
            writeItem(listNode, value);
        container.addChildNode(listNode);
      }
    }
    writeMap(mapMember, map3, container, parentXmlns, containerIsMap = !1) {
      if (!mapMember.isMemberSchema())
        throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${mapMember.getName(!0)}`);
      let mapTraits = mapMember.getMergedTraits(), mapKeySchema = mapMember.getKeySchema(), keyTag = mapKeySchema.getMergedTraits().xmlName ?? "key", mapValueSchema = mapMember.getValueSchema(), mapValueTraits = mapValueSchema.getMergedTraits(), valueTag = mapValueTraits.xmlName ?? "value", sparse = !!mapValueTraits.sparse, flat = !!mapTraits.xmlFlattened, [xmlnsAttr, xmlns] = this.getXmlnsAttribute(mapMember, parentXmlns), addKeyValue = (entry, key, val) => {
        let keyNode = xmlBuilder.XmlNode.of(keyTag, key), [keyXmlnsAttr, keyXmlns] = this.getXmlnsAttribute(mapKeySchema, xmlns);
        if (keyXmlns)
          keyNode.addAttribute(keyXmlnsAttr, keyXmlns);
        entry.addChildNode(keyNode);
        let valueNode = xmlBuilder.XmlNode.of(valueTag);
        if (mapValueSchema.isListSchema())
          this.writeList(mapValueSchema, val, valueNode, xmlns);
        else if (mapValueSchema.isMapSchema())
          this.writeMap(mapValueSchema, val, valueNode, xmlns, !0);
        else if (mapValueSchema.isStructSchema())
          valueNode = this.writeStruct(mapValueSchema, val, xmlns);
        else
          this.writeSimpleInto(mapValueSchema, val, valueNode, xmlns);
        entry.addChildNode(valueNode);
      };
      if (flat) {
        for (let [key, val] of Object.entries(map3))
          if (sparse || val != null) {
            let entry = xmlBuilder.XmlNode.of(mapTraits.xmlName ?? mapMember.getMemberName());
            addKeyValue(entry, key, val), container.addChildNode(entry);
          }
      } else {
        let mapNode2;
        if (!containerIsMap) {
          if (mapNode2 = xmlBuilder.XmlNode.of(mapTraits.xmlName ?? mapMember.getMemberName()), xmlns)
            mapNode2.addAttribute(xmlnsAttr, xmlns);
          container.addChildNode(mapNode2);
        }
        for (let [key, val] of Object.entries(map3))
          if (sparse || val != null) {
            let entry = xmlBuilder.XmlNode.of("entry");
            addKeyValue(entry, key, val), (containerIsMap ? container : mapNode2).addChildNode(entry);
          }
      }
    }
    writeSimple(_schema, value) {
      if (value === null)
        throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
      let ns = schema2.NormalizedSchema.of(_schema), nodeContents = null;
      if (value && typeof value === "object")
        if (ns.isBlobSchema())
          nodeContents = (this.serdeContext?.base64Encoder ?? utilBase64.toBase64)(value);
        else if (ns.isTimestampSchema() && value instanceof Date)
          switch (protocols.determineTimestampFormat(ns, this.settings)) {
            case 5:
              nodeContents = value.toISOString().replace(".000Z", "Z");
              break;
            case 6:
              nodeContents = smithyClient.dateToUtcString(value);
              break;
            case 7:
              nodeContents = String(value.getTime() / 1000);
              break;
            default:
              console.warn("Missing timestamp format, using http date", value), nodeContents = smithyClient.dateToUtcString(value);
              break;
          }
        else if (ns.isBigDecimalSchema() && value) {
          if (value instanceof serde3.NumericValue)
            return value.string;
          return String(value);
        } else if (ns.isMapSchema() || ns.isListSchema())
          throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
        else
          throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${ns.getName(!0)}`);
      if (ns.isBooleanSchema() || ns.isNumericSchema() || ns.isBigIntegerSchema() || ns.isBigDecimalSchema())
        nodeContents = String(value);
      if (ns.isStringSchema())
        if (value === void 0 && ns.isIdempotencyToken())
          nodeContents = serde3.generateIdempotencyToken();
        else
          nodeContents = String(value);
      if (nodeContents === null)
        throw Error(`Unhandled schema-value pair ${ns.getName(!0)}=${value}`);
      return nodeContents;
    }
    writeSimpleInto(_schema, value, into, parentXmlns) {
      let nodeContents = this.writeSimple(_schema, value), ns = schema2.NormalizedSchema.of(_schema), content = new xmlBuilder.XmlText(nodeContents), [xmlnsAttr, xmlns] = this.getXmlnsAttribute(ns, parentXmlns);
      if (xmlns)
        into.addAttribute(xmlnsAttr, xmlns);
      into.addChildNode(content);
    }
    getXmlnsAttribute(ns, parentXmlns) {
      let traits2 = ns.getMergedTraits(), [prefix, xmlns] = traits2.xmlNamespace ?? [];
      if (xmlns && xmlns !== parentXmlns)
        return [prefix ? `xmlns:${prefix}` : "xmlns", xmlns];
      return [void 0, void 0];
    }
  }

  class XmlCodec extends SerdeContextConfig {
    settings;
    constructor(settings) {
      super();
      this.settings = settings;
    }
    createSerializer() {
      let serializer = new XmlShapeSerializer(this.settings);
      return serializer.setSerdeContext(this.serdeContext), serializer;
    }
    createDeserializer() {
      let deserializer = new XmlShapeDeserializer(this.settings);
      return deserializer.setSerdeContext(this.serdeContext), deserializer;
    }
  }

  class AwsRestXmlProtocol extends protocols.HttpBindingProtocol {
    codec;
    serializer;
    deserializer;
    mixin = new ProtocolLib;
    constructor(options) {
      super(options);
      let settings = {
        timestampFormat: {
          useTrait: !0,
          default: 5
        },
        httpBindings: !0,
        xmlNamespace: options.xmlNamespace,
        serviceNamespace: options.defaultNamespace
      };
      this.codec = new XmlCodec(settings), this.serializer = new protocols.HttpInterceptingShapeSerializer(this.codec.createSerializer(), settings), this.deserializer = new protocols.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), settings), this.compositeErrorRegistry;
    }
    getPayloadCodec() {
      return this.codec;
    }
    getShapeId() {
      return "aws.protocols#restXml";
    }
    async serializeRequest(operationSchema, input, context) {
      let request2 = await super.serializeRequest(operationSchema, input, context), inputSchema = schema2.NormalizedSchema.of(operationSchema.input);
      if (!request2.headers["content-type"]) {
        let contentType = this.mixin.resolveRestContentType(this.getDefaultContentType(), inputSchema);
        if (contentType)
          request2.headers["content-type"] = contentType;
      }
      if (typeof request2.body === "string" && request2.headers["content-type"] === this.getDefaultContentType() && !request2.body.startsWith("<?xml ") && !this.hasUnstructuredPayloadBinding(inputSchema))
        request2.body = '<?xml version="1.0" encoding="UTF-8"?>' + request2.body;
      return request2;
    }
    async deserializeResponse(operationSchema, context, response2) {
      return super.deserializeResponse(operationSchema, context, response2);
    }
    async handleError(operationSchema, context, response2, dataObject, metadata) {
      let errorIdentifier = loadRestXmlErrorCode(response2, dataObject) ?? "Unknown";
      if (this.mixin.compose(this.compositeErrorRegistry, errorIdentifier, this.options.defaultNamespace), dataObject.Error && typeof dataObject.Error === "object") {
        for (let key of Object.keys(dataObject.Error))
          if (dataObject[key] = dataObject.Error[key], key.toLowerCase() === "message")
            dataObject.message = dataObject.Error[key];
      }
      if (dataObject.RequestId && !metadata.requestId)
        metadata.requestId = dataObject.RequestId;
      let { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response2, dataObject, metadata), ns = schema2.NormalizedSchema.of(errorSchema), message = dataObject.Error?.message ?? dataObject.Error?.Message ?? dataObject.message ?? dataObject.Message ?? "UnknownError", exception = new (this.compositeErrorRegistry.getErrorCtor(errorSchema) ?? Error)(message);
      await this.deserializeHttpMessage(errorSchema, context, response2, dataObject);
      let output = {};
      for (let [name, member] of ns.structIterator()) {
        let target = member.getMergedTraits().xmlName ?? name, value = dataObject.Error?.[target] ?? dataObject[target];
        output[name] = this.codec.createDeserializer().readSchema(member, value);
      }
      throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
        $fault: ns.getMergedTraits().error,
        message
      }, output), dataObject);
    }
    getDefaultContentType() {
      return "application/xml";
    }
    hasUnstructuredPayloadBinding(ns) {
      for (let [, member] of ns.structIterator())
        if (member.getMergedTraits().httpPayload)
          return !(member.isStructSchema() || member.isMapSchema() || member.isListSchema());
      return !1;
    }
  }
  exports.AwsEc2QueryProtocol = AwsEc2QueryProtocol;
  exports.AwsJson1_0Protocol = AwsJson1_0Protocol;
  exports.AwsJson1_1Protocol = AwsJson1_1Protocol;
  exports.AwsJsonRpcProtocol = AwsJsonRpcProtocol;
  exports.AwsQueryProtocol = AwsQueryProtocol;
  exports.AwsRestJsonProtocol = AwsRestJsonProtocol;
  exports.AwsRestXmlProtocol = AwsRestXmlProtocol;
  exports.AwsSmithyRpcV2CborProtocol = AwsSmithyRpcV2CborProtocol;
  exports.JsonCodec = JsonCodec;
  exports.JsonShapeDeserializer = JsonShapeDeserializer;
  exports.JsonShapeSerializer = JsonShapeSerializer;
  exports.QueryShapeSerializer = QueryShapeSerializer;
  exports.XmlCodec = XmlCodec;
  exports.XmlShapeDeserializer = XmlShapeDeserializer;
  exports.XmlShapeSerializer = XmlShapeSerializer;
  exports._toBool = _toBool;
  exports._toNum = _toNum;
  exports._toStr = _toStr;
  exports.awsExpectUnion = awsExpectUnion;
  exports.loadRestJsonErrorCode = loadRestJsonErrorCode;
  exports.loadRestXmlErrorCode = loadRestXmlErrorCode;
  exports.parseJsonBody = parseJsonBody;
  exports.parseJsonErrorBody = parseJsonErrorBody;
  exports.parseXmlBody = parseXmlBody;
  exports.parseXmlErrorBody = parseXmlErrorBody;
});
