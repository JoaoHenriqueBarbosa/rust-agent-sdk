// var: require_schema
var require_schema = __commonJS((exports) => {
  var protocolHttp = require_dist_cjs28(), utilMiddleware = require_dist_cjs30(), endpoints2 = require_endpoints(), deref = (schemaRef) => {
    if (typeof schemaRef === "function")
      return schemaRef();
    return schemaRef;
  }, operation = (namespace, name, traits2, input, output) => ({
    name,
    namespace,
    traits: traits2,
    input,
    output
  }), schemaDeserializationMiddleware = (config3) => (next, context) => async (args) => {
    let { response: response2 } = await next(args), { operationSchema } = utilMiddleware.getSmithyContext(context), [, ns, n2, t, i2, o2] = operationSchema ?? [];
    try {
      let parsed = await config3.protocol.deserializeResponse(operation(ns, n2, t, i2, o2), {
        ...config3,
        ...context
      }, response2);
      return {
        response: response2,
        output: parsed
      };
    } catch (error42) {
      if (Object.defineProperty(error42, "$response", {
        value: response2,
        enumerable: !1,
        writable: !1,
        configurable: !1
      }), !("$metadata" in error42)) {
        try {
          error42.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
        } catch (e) {
          if (!context.logger || context.logger?.constructor?.name === "NoOpLogger")
            console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
          else
            context.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
        }
        if (typeof error42.$responseBodyText < "u") {
          if (error42.$response)
            error42.$response.body = error42.$responseBodyText;
        }
        try {
          if (protocolHttp.HttpResponse.isInstance(response2)) {
            let { headers = {} } = response2, headerEntries = Object.entries(headers);
            error42.$metadata = {
              httpStatusCode: response2.statusCode,
              requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
              extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
              cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries)
            };
          }
        } catch (e) {}
      }
      throw error42;
    }
  }, findHeader = (pattern, headers) => {
    return (headers.find(([k]) => {
      return k.match(pattern);
    }) || [void 0, void 0])[1];
  }, schemaSerializationMiddleware = (config3) => (next, context) => async (args) => {
    let { operationSchema } = utilMiddleware.getSmithyContext(context), [, ns, n2, t, i2, o2] = operationSchema ?? [], endpoint2 = context.endpointV2 ? async () => endpoints2.toEndpointV1(context.endpointV2) : config3.endpoint, request2 = await config3.protocol.serializeRequest(operation(ns, n2, t, i2, o2), args.input, {
      ...config3,
      ...context,
      endpoint: endpoint2
    });
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
  function getSchemaSerdePlugin(config3) {
    return {
      applyToStack: (commandStack) => {
        commandStack.add(schemaSerializationMiddleware(config3), serializerMiddlewareOption), commandStack.add(schemaDeserializationMiddleware(config3), deserializerMiddlewareOption), config3.protocol.setSerdeContext(config3);
      }
    };
  }

  class Schema {
    name;
    namespace;
    traits;
    static assign(instance, values) {
      return Object.assign(instance, values);
    }
    static [Symbol.hasInstance](lhs) {
      let isPrototype2 = this.prototype.isPrototypeOf(lhs);
      if (!isPrototype2 && typeof lhs === "object" && lhs !== null)
        return lhs.symbol === this.symbol;
      return isPrototype2;
    }
    getName() {
      return this.namespace + "#" + this.name;
    }
  }

  class ListSchema extends Schema {
    static symbol = Symbol.for("@smithy/lis");
    name;
    traits;
    valueSchema;
    symbol = ListSchema.symbol;
  }
  var list = (namespace, name, traits2, valueSchema) => Schema.assign(new ListSchema, {
    name,
    namespace,
    traits: traits2,
    valueSchema
  });

  class MapSchema extends Schema {
    static symbol = Symbol.for("@smithy/map");
    name;
    traits;
    keySchema;
    valueSchema;
    symbol = MapSchema.symbol;
  }
  var map2 = (namespace, name, traits2, keySchema, valueSchema) => Schema.assign(new MapSchema, {
    name,
    namespace,
    traits: traits2,
    keySchema,
    valueSchema
  });

  class OperationSchema extends Schema {
    static symbol = Symbol.for("@smithy/ope");
    name;
    traits;
    input;
    output;
    symbol = OperationSchema.symbol;
  }
  var op = (namespace, name, traits2, input, output) => Schema.assign(new OperationSchema, {
    name,
    namespace,
    traits: traits2,
    input,
    output
  });

  class StructureSchema extends Schema {
    static symbol = Symbol.for("@smithy/str");
    name;
    traits;
    memberNames;
    memberList;
    symbol = StructureSchema.symbol;
  }
  var struct = (namespace, name, traits2, memberNames, memberList) => Schema.assign(new StructureSchema, {
    name,
    namespace,
    traits: traits2,
    memberNames,
    memberList
  });

  class ErrorSchema extends StructureSchema {
    static symbol = Symbol.for("@smithy/err");
    ctor;
    symbol = ErrorSchema.symbol;
  }
  var error41 = (namespace, name, traits2, memberNames, memberList, ctor) => Schema.assign(new ErrorSchema, {
    name,
    namespace,
    traits: traits2,
    memberNames,
    memberList,
    ctor: null
  }), traitsCache = [];
  function translateTraits(indicator) {
    if (typeof indicator === "object")
      return indicator;
    if (indicator = indicator | 0, traitsCache[indicator])
      return traitsCache[indicator];
    let traits2 = {}, i2 = 0;
    for (let trait of [
      "httpLabel",
      "idempotent",
      "idempotencyToken",
      "sensitive",
      "httpPayload",
      "httpResponseCode",
      "httpQueryParams"
    ])
      if ((indicator >> i2++ & 1) === 1)
        traits2[trait] = 1;
    return traitsCache[indicator] = traits2;
  }
  var anno = {
    it: Symbol.for("@smithy/nor-struct-it"),
    ns: Symbol.for("@smithy/ns")
  }, simpleSchemaCacheN = [], simpleSchemaCacheS = {};

  class NormalizedSchema {
    ref;
    memberName;
    static symbol = Symbol.for("@smithy/nor");
    symbol = NormalizedSchema.symbol;
    name;
    schema;
    _isMemberSchema;
    traits;
    memberTraits;
    normalizedTraits;
    constructor(ref, memberName) {
      this.ref = ref, this.memberName = memberName;
      let traitStack = [], _ref = ref, schema2 = ref;
      this._isMemberSchema = !1;
      while (isMemberSchema(_ref))
        traitStack.push(_ref[1]), _ref = _ref[0], schema2 = deref(_ref), this._isMemberSchema = !0;
      if (traitStack.length > 0) {
        this.memberTraits = {};
        for (let i2 = traitStack.length - 1;i2 >= 0; --i2) {
          let traitSet = traitStack[i2];
          Object.assign(this.memberTraits, translateTraits(traitSet));
        }
      } else
        this.memberTraits = 0;
      if (schema2 instanceof NormalizedSchema) {
        let computedMemberTraits = this.memberTraits;
        Object.assign(this, schema2), this.memberTraits = Object.assign({}, computedMemberTraits, schema2.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = memberName ?? schema2.memberName;
        return;
      }
      if (this.schema = deref(schema2), isStaticSchema(this.schema))
        this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3];
      else
        this.name = this.memberName ?? String(schema2), this.traits = 0;
      if (this._isMemberSchema && !memberName)
        throw Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
    }
    static [Symbol.hasInstance](lhs) {
      let isPrototype2 = this.prototype.isPrototypeOf(lhs);
      if (!isPrototype2 && typeof lhs === "object" && lhs !== null)
        return lhs.symbol === this.symbol;
      return isPrototype2;
    }
    static of(ref) {
      let keyAble = typeof ref === "function" || typeof ref === "object" && ref !== null;
      if (typeof ref === "number") {
        if (simpleSchemaCacheN[ref])
          return simpleSchemaCacheN[ref];
      } else if (typeof ref === "string") {
        if (simpleSchemaCacheS[ref])
          return simpleSchemaCacheS[ref];
      } else if (keyAble) {
        if (ref[anno.ns])
          return ref[anno.ns];
      }
      let sc = deref(ref);
      if (sc instanceof NormalizedSchema)
        return sc;
      if (isMemberSchema(sc)) {
        let [ns2, traits2] = sc;
        if (ns2 instanceof NormalizedSchema)
          return Object.assign(ns2.getMergedTraits(), translateTraits(traits2)), ns2;
        throw Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(ref, null, 2)}.`);
      }
      let ns = new NormalizedSchema(sc);
      if (keyAble)
        return ref[anno.ns] = ns;
      if (typeof sc === "string")
        return simpleSchemaCacheS[sc] = ns;
      if (typeof sc === "number")
        return simpleSchemaCacheN[sc] = ns;
      return ns;
    }
    getSchema() {
      let sc = this.schema;
      if (Array.isArray(sc) && sc[0] === 0)
        return sc[4];
      return sc;
    }
    getName(withNamespace = !1) {
      let { name } = this;
      return !withNamespace && name && name.includes("#") ? name.split("#")[1] : name || void 0;
    }
    getMemberName() {
      return this.memberName;
    }
    isMemberSchema() {
      return this._isMemberSchema;
    }
    isListSchema() {
      let sc = this.getSchema();
      return typeof sc === "number" ? sc >= 64 && sc < 128 : sc[0] === 1;
    }
    isMapSchema() {
      let sc = this.getSchema();
      return typeof sc === "number" ? sc >= 128 && sc <= 255 : sc[0] === 2;
    }
    isStructSchema() {
      let sc = this.getSchema();
      if (typeof sc !== "object")
        return !1;
      let id = sc[0];
      return id === 3 || id === -3 || id === 4;
    }
    isUnionSchema() {
      let sc = this.getSchema();
      if (typeof sc !== "object")
        return !1;
      return sc[0] === 4;
    }
    isBlobSchema() {
      let sc = this.getSchema();
      return sc === 21 || sc === 42;
    }
    isTimestampSchema() {
      let sc = this.getSchema();
      return typeof sc === "number" && sc >= 4 && sc <= 7;
    }
    isUnitSchema() {
      return this.getSchema() === "unit";
    }
    isDocumentSchema() {
      return this.getSchema() === 15;
    }
    isStringSchema() {
      return this.getSchema() === 0;
    }
    isBooleanSchema() {
      return this.getSchema() === 2;
    }
    isNumericSchema() {
      return this.getSchema() === 1;
    }
    isBigIntegerSchema() {
      return this.getSchema() === 17;
    }
    isBigDecimalSchema() {
      return this.getSchema() === 19;
    }
    isStreaming() {
      let { streaming: streaming2 } = this.getMergedTraits();
      return !!streaming2 || this.getSchema() === 42;
    }
    isIdempotencyToken() {
      return !!this.getMergedTraits().idempotencyToken;
    }
    getMergedTraits() {
      return this.normalizedTraits ?? (this.normalizedTraits = {
        ...this.getOwnTraits(),
        ...this.getMemberTraits()
      });
    }
    getMemberTraits() {
      return translateTraits(this.memberTraits);
    }
    getOwnTraits() {
      return translateTraits(this.traits);
    }
    getKeySchema() {
      let [isDoc, isMap2] = [this.isDocumentSchema(), this.isMapSchema()];
      if (!isDoc && !isMap2)
        throw Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
      let schema2 = this.getSchema(), memberSchema = isDoc ? 15 : schema2[4] ?? 0;
      return member([memberSchema, 0], "key");
    }
    getValueSchema() {
      let sc = this.getSchema(), [isDoc, isMap2, isList] = [this.isDocumentSchema(), this.isMapSchema(), this.isListSchema()], memberSchema = typeof sc === "number" ? 63 & sc : sc && typeof sc === "object" && (isMap2 || isList) ? sc[3 + sc[0]] : isDoc ? 15 : void 0;
      if (memberSchema != null)
        return member([memberSchema, 0], isMap2 ? "value" : "member");
      throw Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
    }
    getMemberSchema(memberName) {
      let struct2 = this.getSchema();
      if (this.isStructSchema() && struct2[4].includes(memberName)) {
        let i2 = struct2[4].indexOf(memberName), memberSchema = struct2[5][i2];
        return member(isMemberSchema(memberSchema) ? memberSchema : [memberSchema, 0], memberName);
      }
      if (this.isDocumentSchema())
        return member([15, 0], memberName);
      throw Error(`@smithy/core/schema - ${this.getName(!0)} has no member=${memberName}.`);
    }
    getMemberSchemas() {
      let buffer = {};
      try {
        for (let [k, v] of this.structIterator())
          buffer[k] = v;
      } catch (ignored) {}
      return buffer;
    }
    getEventStreamMember() {
      if (this.isStructSchema()) {
        for (let [memberName, memberSchema] of this.structIterator())
          if (memberSchema.isStreaming() && memberSchema.isStructSchema())
            return memberName;
      }
      return "";
    }
    *structIterator() {
      if (this.isUnitSchema())
        return;
      if (!this.isStructSchema())
        throw Error("@smithy/core/schema - cannot iterate non-struct schema.");
      let struct2 = this.getSchema(), z = struct2[4].length, it = struct2[anno.it];
      if (it && z === it.length) {
        yield* it;
        return;
      }
      it = Array(z);
      for (let i2 = 0;i2 < z; ++i2) {
        let k = struct2[4][i2], v = member([struct2[5][i2], 0], k);
        yield it[i2] = [k, v];
      }
      struct2[anno.it] = it;
    }
  }
  function member(memberSchema, memberName) {
    if (memberSchema instanceof NormalizedSchema)
      return Object.assign(memberSchema, {
        memberName,
        _isMemberSchema: !0
      });
    return new NormalizedSchema(memberSchema, memberName);
  }
  var isMemberSchema = (sc) => Array.isArray(sc) && sc.length === 2, isStaticSchema = (sc) => Array.isArray(sc) && sc.length >= 5;

  class SimpleSchema extends Schema {
    static symbol = Symbol.for("@smithy/sim");
    name;
    schemaRef;
    traits;
    symbol = SimpleSchema.symbol;
  }
  var sim = (namespace, name, schemaRef, traits2) => Schema.assign(new SimpleSchema, {
    name,
    namespace,
    traits: traits2,
    schemaRef
  }), simAdapter = (namespace, name, traits2, schemaRef) => Schema.assign(new SimpleSchema, {
    name,
    namespace,
    traits: traits2,
    schemaRef
  }), SCHEMA = {
    BLOB: 21,
    STREAMING_BLOB: 42,
    BOOLEAN: 2,
    STRING: 0,
    NUMERIC: 1,
    BIG_INTEGER: 17,
    BIG_DECIMAL: 19,
    DOCUMENT: 15,
    TIMESTAMP_DEFAULT: 4,
    TIMESTAMP_DATE_TIME: 5,
    TIMESTAMP_HTTP_DATE: 6,
    TIMESTAMP_EPOCH_SECONDS: 7,
    LIST_MODIFIER: 64,
    MAP_MODIFIER: 128
  };

  class TypeRegistry {
    namespace;
    schemas;
    exceptions;
    static registries = /* @__PURE__ */ new Map;
    constructor(namespace, schemas3 = /* @__PURE__ */ new Map, exceptions = /* @__PURE__ */ new Map) {
      this.namespace = namespace, this.schemas = schemas3, this.exceptions = exceptions;
    }
    static for(namespace) {
      if (!TypeRegistry.registries.has(namespace))
        TypeRegistry.registries.set(namespace, new TypeRegistry(namespace));
      return TypeRegistry.registries.get(namespace);
    }
    copyFrom(other) {
      let { schemas: schemas3, exceptions } = this;
      for (let [k, v] of other.schemas)
        if (!schemas3.has(k))
          schemas3.set(k, v);
      for (let [k, v] of other.exceptions)
        if (!exceptions.has(k))
          exceptions.set(k, v);
    }
    register(shapeId, schema2) {
      let qualifiedName = this.normalizeShapeId(shapeId);
      for (let r of [this, TypeRegistry.for(qualifiedName.split("#")[0])])
        r.schemas.set(qualifiedName, schema2);
    }
    getSchema(shapeId) {
      let id = this.normalizeShapeId(shapeId);
      if (!this.schemas.has(id))
        throw Error(`@smithy/core/schema - schema not found for ${id}`);
      return this.schemas.get(id);
    }
    registerError(es, ctor) {
      let $error2 = es, ns = $error2[1];
      for (let r of [this, TypeRegistry.for(ns)])
        r.schemas.set(ns + "#" + $error2[2], $error2), r.exceptions.set($error2, ctor);
    }
    getErrorCtor(es) {
      let $error2 = es;
      if (this.exceptions.has($error2))
        return this.exceptions.get($error2);
      return TypeRegistry.for($error2[1]).exceptions.get($error2);
    }
    getBaseException() {
      for (let exceptionKey of this.exceptions.keys())
        if (Array.isArray(exceptionKey)) {
          let [, ns, name] = exceptionKey, id = ns + "#" + name;
          if (id.startsWith("smithy.ts.sdk.synthetic.") && id.endsWith("ServiceException"))
            return exceptionKey;
        }
      return;
    }
    find(predicate) {
      return [...this.schemas.values()].find(predicate);
    }
    clear() {
      this.schemas.clear(), this.exceptions.clear();
    }
    normalizeShapeId(shapeId) {
      if (shapeId.includes("#"))
        return shapeId;
      return this.namespace + "#" + shapeId;
    }
  }
  exports.ErrorSchema = ErrorSchema;
  exports.ListSchema = ListSchema;
  exports.MapSchema = MapSchema;
  exports.NormalizedSchema = NormalizedSchema;
  exports.OperationSchema = OperationSchema;
  exports.SCHEMA = SCHEMA;
  exports.Schema = Schema;
  exports.SimpleSchema = SimpleSchema;
  exports.StructureSchema = StructureSchema;
  exports.TypeRegistry = TypeRegistry;
  exports.deref = deref;
  exports.deserializerMiddlewareOption = deserializerMiddlewareOption;
  exports.error = error41;
  exports.getSchemaSerdePlugin = getSchemaSerdePlugin;
  exports.isStaticSchema = isStaticSchema;
  exports.list = list;
  exports.map = map2;
  exports.op = op;
  exports.operation = operation;
  exports.serializerMiddlewareOption = serializerMiddlewareOption;
  exports.sim = sim;
  exports.simAdapter = simAdapter;
  exports.simpleSchemaCacheN = simpleSchemaCacheN;
  exports.simpleSchemaCacheS = simpleSchemaCacheS;
  exports.struct = struct;
  exports.traitsCache = traitsCache;
  exports.translateTraits = translateTraits;
});
