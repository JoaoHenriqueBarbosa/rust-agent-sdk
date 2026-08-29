// class: JSONSchemaGenerator
class JSONSchemaGenerator {
  constructor(params) {
    this.counter = 0, this.metadataRegistry = params?.metadata ?? globalRegistry, this.target = params?.target ?? "draft-2020-12", this.unrepresentable = params?.unrepresentable ?? "throw", this.override = params?.override ?? (() => {}), this.io = params?.io ?? "output", this.seen = /* @__PURE__ */ new Map;
  }
  process(schema, _params = { path: [], schemaPath: [] }) {
    var _a2;
    let def = schema._zod.def, formatMap = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: ""
    }, seen = this.seen.get(schema);
    if (seen) {
      if (seen.count++, _params.schemaPath.includes(schema))
        seen.cycle = _params.path;
      return seen.schema;
    }
    let result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
    this.seen.set(schema, result);
    let overrideSchema = schema._zod.toJSONSchema?.();
    if (overrideSchema)
      result.schema = overrideSchema;
    else {
      let params = {
        ..._params,
        schemaPath: [..._params.schemaPath, schema],
        path: _params.path
      }, parent = schema._zod.parent;
      if (parent)
        result.ref = parent, this.process(parent, params), this.seen.get(parent).isParent = !0;
      else {
        let _json = result.schema;
        switch (def.type) {
          case "string": {
            let json = _json;
            json.type = "string";
            let { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minLength = minimum;
            if (typeof maximum === "number")
              json.maxLength = maximum;
            if (format) {
              if (json.format = formatMap[format] ?? format, json.format === "")
                delete json.format;
            }
            if (contentEncoding)
              json.contentEncoding = contentEncoding;
            if (patterns && patterns.size > 0) {
              let regexes = [...patterns];
              if (regexes.length === 1)
                json.pattern = regexes[0].source;
              else if (regexes.length > 1)
                result.schema.allOf = [
                  ...regexes.map((regex2) => ({
                    ...this.target === "draft-7" ? { type: "string" } : {},
                    pattern: regex2.source
                  }))
                ];
            }
            break;
          }
          case "number": {
            let json = _json, { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
            if (typeof format === "string" && format.includes("int"))
              json.type = "integer";
            else
              json.type = "number";
            if (typeof exclusiveMinimum === "number")
              json.exclusiveMinimum = exclusiveMinimum;
            if (typeof minimum === "number") {
              if (json.minimum = minimum, typeof exclusiveMinimum === "number")
                if (exclusiveMinimum >= minimum)
                  delete json.minimum;
                else
                  delete json.exclusiveMinimum;
            }
            if (typeof exclusiveMaximum === "number")
              json.exclusiveMaximum = exclusiveMaximum;
            if (typeof maximum === "number") {
              if (json.maximum = maximum, typeof exclusiveMaximum === "number")
                if (exclusiveMaximum <= maximum)
                  delete json.maximum;
                else
                  delete json.exclusiveMaximum;
            }
            if (typeof multipleOf === "number")
              json.multipleOf = multipleOf;
            break;
          }
          case "boolean": {
            let json = _json;
            json.type = "boolean";
            break;
          }
          case "bigint": {
            if (this.unrepresentable === "throw")
              throw Error("BigInt cannot be represented in JSON Schema");
            break;
          }
          case "symbol": {
            if (this.unrepresentable === "throw")
              throw Error("Symbols cannot be represented in JSON Schema");
            break;
          }
          case "null": {
            _json.type = "null";
            break;
          }
          case "any":
            break;
          case "unknown":
            break;
          case "undefined": {
            if (this.unrepresentable === "throw")
              throw Error("Undefined cannot be represented in JSON Schema");
            break;
          }
          case "void": {
            if (this.unrepresentable === "throw")
              throw Error("Void cannot be represented in JSON Schema");
            break;
          }
          case "never": {
            _json.not = {};
            break;
          }
          case "date": {
            if (this.unrepresentable === "throw")
              throw Error("Date cannot be represented in JSON Schema");
            break;
          }
          case "array": {
            let json = _json, { minimum, maximum } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minItems = minimum;
            if (typeof maximum === "number")
              json.maxItems = maximum;
            json.type = "array", json.items = this.process(def.element, { ...params, path: [...params.path, "items"] });
            break;
          }
          case "object": {
            let json = _json;
            json.type = "object", json.properties = {};
            let shape = def.shape;
            for (let key in shape)
              json.properties[key] = this.process(shape[key], {
                ...params,
                path: [...params.path, "properties", key]
              });
            let allKeys = new Set(Object.keys(shape)), requiredKeys = new Set([...allKeys].filter((key) => {
              let v = def.shape[key]._zod;
              if (this.io === "input")
                return v.optin === void 0;
              else
                return v.optout === void 0;
            }));
            if (requiredKeys.size > 0)
              json.required = Array.from(requiredKeys);
            if (def.catchall?._zod.def.type === "never")
              json.additionalProperties = !1;
            else if (!def.catchall) {
              if (this.io === "output")
                json.additionalProperties = !1;
            } else if (def.catchall)
              json.additionalProperties = this.process(def.catchall, {
                ...params,
                path: [...params.path, "additionalProperties"]
              });
            break;
          }
          case "union": {
            let json = _json;
            json.anyOf = def.options.map((x, i) => this.process(x, {
              ...params,
              path: [...params.path, "anyOf", i]
            }));
            break;
          }
          case "intersection": {
            let json = _json, a = this.process(def.left, {
              ...params,
              path: [...params.path, "allOf", 0]
            }), b = this.process(def.right, {
              ...params,
              path: [...params.path, "allOf", 1]
            }), isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1, allOf = [
              ...isSimpleIntersection(a) ? a.allOf : [a],
              ...isSimpleIntersection(b) ? b.allOf : [b]
            ];
            json.allOf = allOf;
            break;
          }
          case "tuple": {
            let json = _json;
            json.type = "array";
            let prefixItems = def.items.map((x, i) => this.process(x, { ...params, path: [...params.path, "prefixItems", i] }));
            if (this.target === "draft-2020-12")
              json.prefixItems = prefixItems;
            else
              json.items = prefixItems;
            if (def.rest) {
              let rest = this.process(def.rest, {
                ...params,
                path: [...params.path, "items"]
              });
              if (this.target === "draft-2020-12")
                json.items = rest;
              else
                json.additionalItems = rest;
            }
            if (def.rest)
              json.items = this.process(def.rest, {
                ...params,
                path: [...params.path, "items"]
              });
            let { minimum, maximum } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minItems = minimum;
            if (typeof maximum === "number")
              json.maxItems = maximum;
            break;
          }
          case "record": {
            let json = _json;
            json.type = "object", json.propertyNames = this.process(def.keyType, { ...params, path: [...params.path, "propertyNames"] }), json.additionalProperties = this.process(def.valueType, {
              ...params,
              path: [...params.path, "additionalProperties"]
            });
            break;
          }
          case "map": {
            if (this.unrepresentable === "throw")
              throw Error("Map cannot be represented in JSON Schema");
            break;
          }
          case "set": {
            if (this.unrepresentable === "throw")
              throw Error("Set cannot be represented in JSON Schema");
            break;
          }
          case "enum": {
            let json = _json, values = getEnumValues(def.entries);
            if (values.every((v) => typeof v === "number"))
              json.type = "number";
            if (values.every((v) => typeof v === "string"))
              json.type = "string";
            json.enum = values;
            break;
          }
          case "literal": {
            let json = _json, vals = [];
            for (let val of def.values)
              if (val === void 0) {
                if (this.unrepresentable === "throw")
                  throw Error("Literal `undefined` cannot be represented in JSON Schema");
              } else if (typeof val === "bigint")
                if (this.unrepresentable === "throw")
                  throw Error("BigInt literals cannot be represented in JSON Schema");
                else
                  vals.push(Number(val));
              else
                vals.push(val);
            if (vals.length === 0)
              ;
            else if (vals.length === 1) {
              let val = vals[0];
              json.type = val === null ? "null" : typeof val, json.const = val;
            } else {
              if (vals.every((v) => typeof v === "number"))
                json.type = "number";
              if (vals.every((v) => typeof v === "string"))
                json.type = "string";
              if (vals.every((v) => typeof v === "boolean"))
                json.type = "string";
              if (vals.every((v) => v === null))
                json.type = "null";
              json.enum = vals;
            }
            break;
          }
          case "file": {
            let json = _json, file = {
              type: "string",
              format: "binary",
              contentEncoding: "binary"
            }, { minimum, maximum, mime } = schema._zod.bag;
            if (minimum !== void 0)
              file.minLength = minimum;
            if (maximum !== void 0)
              file.maxLength = maximum;
            if (mime)
              if (mime.length === 1)
                file.contentMediaType = mime[0], Object.assign(json, file);
              else
                json.anyOf = mime.map((m) => {
                  return { ...file, contentMediaType: m };
                });
            else
              Object.assign(json, file);
            break;
          }
          case "transform": {
            if (this.unrepresentable === "throw")
              throw Error("Transforms cannot be represented in JSON Schema");
            break;
          }
          case "nullable": {
            let inner = this.process(def.innerType, params);
            _json.anyOf = [inner, { type: "null" }];
            break;
          }
          case "nonoptional": {
            this.process(def.innerType, params), result.ref = def.innerType;
            break;
          }
          case "success": {
            let json = _json;
            json.type = "boolean";
            break;
          }
          case "default": {
            this.process(def.innerType, params), result.ref = def.innerType, _json.default = JSON.parse(JSON.stringify(def.defaultValue));
            break;
          }
          case "prefault": {
            if (this.process(def.innerType, params), result.ref = def.innerType, this.io === "input")
              _json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
            break;
          }
          case "catch": {
            this.process(def.innerType, params), result.ref = def.innerType;
            let catchValue;
            try {
              catchValue = def.catchValue(void 0);
            } catch {
              throw Error("Dynamic catch values are not supported in JSON Schema");
            }
            _json.default = catchValue;
            break;
          }
          case "nan": {
            if (this.unrepresentable === "throw")
              throw Error("NaN cannot be represented in JSON Schema");
            break;
          }
          case "template_literal": {
            let json = _json, pattern = schema._zod.pattern;
            if (!pattern)
              throw Error("Pattern not found in template literal");
            json.type = "string", json.pattern = pattern.source;
            break;
          }
          case "pipe": {
            let innerType = this.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
            this.process(innerType, params), result.ref = innerType;
            break;
          }
          case "readonly": {
            this.process(def.innerType, params), result.ref = def.innerType, _json.readOnly = !0;
            break;
          }
          case "promise": {
            this.process(def.innerType, params), result.ref = def.innerType;
            break;
          }
          case "optional": {
            this.process(def.innerType, params), result.ref = def.innerType;
            break;
          }
          case "lazy": {
            let innerType = schema._zod.innerType;
            this.process(innerType, params), result.ref = innerType;
            break;
          }
          case "custom": {
            if (this.unrepresentable === "throw")
              throw Error("Custom types cannot be represented in JSON Schema");
            break;
          }
          default:
        }
      }
    }
    let meta = this.metadataRegistry.get(schema);
    if (meta)
      Object.assign(result.schema, meta);
    if (this.io === "input" && isTransforming(schema))
      delete result.schema.examples, delete result.schema.default;
    if (this.io === "input" && result.schema._prefault)
      (_a2 = result.schema).default ?? (_a2.default = result.schema._prefault);
    return delete result.schema._prefault, this.seen.get(schema).schema;
  }
  emit(schema, _params) {
    let params = {
      cycles: _params?.cycles ?? "ref",
      reused: _params?.reused ?? "inline",
      external: _params?.external ?? void 0
    }, root2 = this.seen.get(schema);
    if (!root2)
      throw Error("Unprocessed schema. This is a bug in Zod.");
    let makeURI = (entry) => {
      let defsSegment = this.target === "draft-2020-12" ? "$defs" : "definitions";
      if (params.external) {
        let externalId = params.external.registry.get(entry[0])?.id, uriGenerator = params.external.uri ?? ((id2) => id2);
        if (externalId)
          return { ref: uriGenerator(externalId) };
        let id = entry[1].defId ?? entry[1].schema.id ?? `schema${this.counter++}`;
        return entry[1].defId = id, { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
      }
      if (entry[1] === root2)
        return { ref: "#" };
      let defUriPrefix = `${"#"}/${defsSegment}/`, defId = entry[1].schema.id ?? `__schema${this.counter++}`;
      return { defId, ref: defUriPrefix + defId };
    }, extractToDef = (entry) => {
      if (entry[1].schema.$ref)
        return;
      let seen = entry[1], { ref, defId } = makeURI(entry);
      if (seen.def = { ...seen.schema }, defId)
        seen.defId = defId;
      let schema2 = seen.schema;
      for (let key in schema2)
        delete schema2[key];
      schema2.$ref = ref;
    };
    if (params.cycles === "throw")
      for (let entry of this.seen.entries()) {
        let seen = entry[1];
        if (seen.cycle)
          throw Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    for (let entry of this.seen.entries()) {
      let seen = entry[1];
      if (schema === entry[0]) {
        extractToDef(entry);
        continue;
      }
      if (params.external) {
        let ext = params.external.registry.get(entry[0])?.id;
        if (schema !== entry[0] && ext) {
          extractToDef(entry);
          continue;
        }
      }
      if (this.metadataRegistry.get(entry[0])?.id) {
        extractToDef(entry);
        continue;
      }
      if (seen.cycle) {
        extractToDef(entry);
        continue;
      }
      if (seen.count > 1) {
        if (params.reused === "ref") {
          extractToDef(entry);
          continue;
        }
      }
    }
    let flattenRef = (zodSchema, params2) => {
      let seen = this.seen.get(zodSchema), schema2 = seen.def ?? seen.schema, _cached = { ...schema2 };
      if (seen.ref === null)
        return;
      let ref = seen.ref;
      if (seen.ref = null, ref) {
        flattenRef(ref, params2);
        let refSchema = this.seen.get(ref).schema;
        if (refSchema.$ref && params2.target === "draft-7")
          schema2.allOf = schema2.allOf ?? [], schema2.allOf.push(refSchema);
        else
          Object.assign(schema2, refSchema), Object.assign(schema2, _cached);
      }
      if (!seen.isParent)
        this.override({
          zodSchema,
          jsonSchema: schema2,
          path: seen.path ?? []
        });
    };
    for (let entry of [...this.seen.entries()].reverse())
      flattenRef(entry[0], { target: this.target });
    let result = {};
    if (this.target === "draft-2020-12")
      result.$schema = "https://json-schema.org/draft/2020-12/schema";
    else if (this.target === "draft-7")
      result.$schema = "http://json-schema.org/draft-07/schema#";
    else
      console.warn(`Invalid target: ${this.target}`);
    if (params.external?.uri) {
      let id = params.external.registry.get(schema)?.id;
      if (!id)
        throw Error("Schema is missing an `id` property");
      result.$id = params.external.uri(id);
    }
    Object.assign(result, root2.def);
    let defs = params.external?.defs ?? {};
    for (let entry of this.seen.entries()) {
      let seen = entry[1];
      if (seen.def && seen.defId)
        defs[seen.defId] = seen.def;
    }
    if (params.external)
      ;
    else if (Object.keys(defs).length > 0)
      if (this.target === "draft-2020-12")
        result.$defs = defs;
      else
        result.definitions = defs;
    try {
      return JSON.parse(JSON.stringify(result));
    } catch (_err) {
      throw Error("Error converting schema to JSON.");
    }
  }
}
