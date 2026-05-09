// var: require_protocols
var require_protocols = __commonJS((exports) => {
  var utilStream = require_dist_cjs26(), schema2 = require_schema(), serde2 = require_serde(), protocolHttp = require_dist_cjs28(), utilBase64 = require_dist_cjs34(), utilUtf8 = require_dist_cjs17(), collectBody = async (streamBody = new Uint8Array, context) => {
    if (streamBody instanceof Uint8Array)
      return utilStream.Uint8ArrayBlobAdapter.mutate(streamBody);
    if (!streamBody)
      return utilStream.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
    let fromContext = context.streamCollector(streamBody);
    return utilStream.Uint8ArrayBlobAdapter.mutate(await fromContext);
  };
  function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c3) {
      return "%" + c3.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  class SerdeContext {
    serdeContext;
    setSerdeContext(serdeContext) {
      this.serdeContext = serdeContext;
    }
  }

  class HttpProtocol extends SerdeContext {
    options;
    compositeErrorRegistry;
    constructor(options) {
      super();
      this.options = options, this.compositeErrorRegistry = schema2.TypeRegistry.for(options.defaultNamespace);
      for (let etr of options.errorTypeRegistries ?? [])
        this.compositeErrorRegistry.copyFrom(etr);
    }
    getRequestType() {
      return protocolHttp.HttpRequest;
    }
    getResponseType() {
      return protocolHttp.HttpResponse;
    }
    setSerdeContext(serdeContext) {
      if (this.serdeContext = serdeContext, this.serializer.setSerdeContext(serdeContext), this.deserializer.setSerdeContext(serdeContext), this.getPayloadCodec())
        this.getPayloadCodec().setSerdeContext(serdeContext);
    }
    updateServiceEndpoint(request2, endpoint2) {
      if ("url" in endpoint2) {
        if (request2.protocol = endpoint2.url.protocol, request2.hostname = endpoint2.url.hostname, request2.port = endpoint2.url.port ? Number(endpoint2.url.port) : void 0, request2.path = endpoint2.url.pathname, request2.fragment = endpoint2.url.hash || void 0, request2.username = endpoint2.url.username || void 0, request2.password = endpoint2.url.password || void 0, !request2.query)
          request2.query = {};
        for (let [k, v] of endpoint2.url.searchParams.entries())
          request2.query[k] = v;
        if (endpoint2.headers)
          for (let [name, values] of Object.entries(endpoint2.headers))
            request2.headers[name] = values.join(", ");
        return request2;
      } else {
        if (request2.protocol = endpoint2.protocol, request2.hostname = endpoint2.hostname, request2.port = endpoint2.port ? Number(endpoint2.port) : void 0, request2.path = endpoint2.path, request2.query = {
          ...endpoint2.query
        }, endpoint2.headers)
          for (let [name, value] of Object.entries(endpoint2.headers))
            request2.headers[name] = value;
        return request2;
      }
    }
    setHostPrefix(request2, operationSchema, input) {
      if (this.serdeContext?.disableHostPrefix)
        return;
      let inputNs = schema2.NormalizedSchema.of(operationSchema.input), opTraits = schema2.translateTraits(operationSchema.traits ?? {});
      if (opTraits.endpoint) {
        let hostPrefix = opTraits.endpoint?.[0];
        if (typeof hostPrefix === "string") {
          let hostLabelInputs = [...inputNs.structIterator()].filter(([, member]) => member.getMergedTraits().hostLabel);
          for (let [name] of hostLabelInputs) {
            let replacement = input[name];
            if (typeof replacement !== "string")
              throw Error(`@smithy/core/schema - ${name} in input must be a string as hostLabel.`);
            hostPrefix = hostPrefix.replace(`{${name}}`, replacement);
          }
          request2.hostname = hostPrefix + request2.hostname;
        }
      }
    }
    deserializeMetadata(output) {
      return {
        httpStatusCode: output.statusCode,
        requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
        extendedRequestId: output.headers["x-amz-id-2"],
        cfId: output.headers["x-amz-cf-id"]
      };
    }
    async serializeEventStream({ eventStream: eventStream2, requestSchema, initialRequest }) {
      return (await this.loadEventStreamCapability()).serializeEventStream({
        eventStream: eventStream2,
        requestSchema,
        initialRequest
      });
    }
    async deserializeEventStream({ response: response2, responseSchema, initialResponseContainer }) {
      return (await this.loadEventStreamCapability()).deserializeEventStream({
        response: response2,
        responseSchema,
        initialResponseContainer
      });
    }
    async loadEventStreamCapability() {
      let { EventStreamSerde } = await Promise.resolve().then(() => __toESM(require_event_streams()));
      return new EventStreamSerde({
        marshaller: this.getEventStreamMarshaller(),
        serializer: this.serializer,
        deserializer: this.deserializer,
        serdeContext: this.serdeContext,
        defaultContentType: this.getDefaultContentType()
      });
    }
    getDefaultContentType() {
      throw Error(`@smithy/core/protocols - ${this.constructor.name} getDefaultContentType() implementation missing.`);
    }
    async deserializeHttpMessage(schema3, context, response2, arg4, arg5) {
      return [];
    }
    getEventStreamMarshaller() {
      let context = this.serdeContext;
      if (!context.eventStreamMarshaller)
        throw Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
      return context.eventStreamMarshaller;
    }
  }

  class HttpBindingProtocol extends HttpProtocol {
    async serializeRequest(operationSchema, _input, context) {
      let input = _input && typeof _input === "object" ? _input : {}, serializer = this.serializer, query = {}, headers = {}, endpoint2 = await context.endpoint(), ns = schema2.NormalizedSchema.of(operationSchema?.input), payloadMemberNames = [], payloadMemberSchemas = [], hasNonHttpBindingMember = !1, payload, request2 = new protocolHttp.HttpRequest({
        protocol: "",
        hostname: "",
        port: void 0,
        path: "",
        fragment: void 0,
        query,
        headers,
        body: void 0
      });
      if (endpoint2) {
        this.updateServiceEndpoint(request2, endpoint2), this.setHostPrefix(request2, operationSchema, input);
        let opTraits = schema2.translateTraits(operationSchema.traits);
        if (opTraits.http) {
          request2.method = opTraits.http[0];
          let [path9, search] = opTraits.http[1].split("?");
          if (request2.path == "/")
            request2.path = path9;
          else
            request2.path += path9;
          let traitSearchParams = new URLSearchParams(search ?? "");
          Object.assign(query, Object.fromEntries(traitSearchParams));
        }
      }
      for (let [memberName, memberNs] of ns.structIterator()) {
        let memberTraits = memberNs.getMergedTraits() ?? {}, inputMemberValue = input[memberName];
        if (inputMemberValue == null && !memberNs.isIdempotencyToken()) {
          if (memberTraits.httpLabel) {
            if (request2.path.includes(`{${memberName}+}`) || request2.path.includes(`{${memberName}}`))
              throw Error(`No value provided for input HTTP label: ${memberName}.`);
          }
          continue;
        }
        if (memberTraits.httpPayload)
          if (memberNs.isStreaming())
            if (memberNs.isStructSchema()) {
              if (input[memberName])
                payload = await this.serializeEventStream({
                  eventStream: input[memberName],
                  requestSchema: ns
                });
            } else
              payload = inputMemberValue;
          else
            serializer.write(memberNs, inputMemberValue), payload = serializer.flush();
        else if (memberTraits.httpLabel) {
          serializer.write(memberNs, inputMemberValue);
          let replacement = serializer.flush();
          if (request2.path.includes(`{${memberName}+}`))
            request2.path = request2.path.replace(`{${memberName}+}`, replacement.split("/").map(extendedEncodeURIComponent).join("/"));
          else if (request2.path.includes(`{${memberName}}`))
            request2.path = request2.path.replace(`{${memberName}}`, extendedEncodeURIComponent(replacement));
        } else if (memberTraits.httpHeader)
          serializer.write(memberNs, inputMemberValue), headers[memberTraits.httpHeader.toLowerCase()] = String(serializer.flush());
        else if (typeof memberTraits.httpPrefixHeaders === "string")
          for (let [key, val] of Object.entries(inputMemberValue)) {
            let amalgam = memberTraits.httpPrefixHeaders + key;
            serializer.write([memberNs.getValueSchema(), { httpHeader: amalgam }], val), headers[amalgam.toLowerCase()] = serializer.flush();
          }
        else if (memberTraits.httpQuery || memberTraits.httpQueryParams)
          this.serializeQuery(memberNs, inputMemberValue, query);
        else
          hasNonHttpBindingMember = !0, payloadMemberNames.push(memberName), payloadMemberSchemas.push(memberNs);
      }
      if (hasNonHttpBindingMember && input) {
        let [namespace, name] = (ns.getName(!0) ?? "#Unknown").split("#"), requiredMembers = ns.getSchema()[6], payloadSchema = [
          3,
          namespace,
          name,
          ns.getMergedTraits(),
          payloadMemberNames,
          payloadMemberSchemas,
          void 0
        ];
        if (requiredMembers)
          payloadSchema[6] = requiredMembers;
        else
          payloadSchema.pop();
        serializer.write(payloadSchema, input), payload = serializer.flush();
      }
      return request2.headers = headers, request2.query = query, request2.body = payload, request2;
    }
    serializeQuery(ns, data, query) {
      let serializer = this.serializer, traits2 = ns.getMergedTraits();
      if (traits2.httpQueryParams) {
        for (let [key, val] of Object.entries(data))
          if (!(key in query)) {
            let valueSchema = ns.getValueSchema();
            Object.assign(valueSchema.getMergedTraits(), {
              ...traits2,
              httpQuery: key,
              httpQueryParams: void 0
            }), this.serializeQuery(valueSchema, val, query);
          }
        return;
      }
      if (ns.isListSchema()) {
        let sparse = !!ns.getMergedTraits().sparse, buffer = [];
        for (let item of data) {
          serializer.write([ns.getValueSchema(), traits2], item);
          let serializable = serializer.flush();
          if (sparse || serializable !== void 0)
            buffer.push(serializable);
        }
        query[traits2.httpQuery] = buffer;
      } else
        serializer.write([ns, traits2], data), query[traits2.httpQuery] = serializer.flush();
    }
    async deserializeResponse(operationSchema, context, response2) {
      let deserializer = this.deserializer, ns = schema2.NormalizedSchema.of(operationSchema.output), dataObject = {};
      if (response2.statusCode >= 300) {
        let bytes = await collectBody(response2.body, context);
        if (bytes.byteLength > 0)
          Object.assign(dataObject, await deserializer.read(15, bytes));
        throw await this.handleError(operationSchema, context, response2, dataObject, this.deserializeMetadata(response2)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.");
      }
      for (let header in response2.headers) {
        let value = response2.headers[header];
        delete response2.headers[header], response2.headers[header.toLowerCase()] = value;
      }
      let nonHttpBindingMembers = await this.deserializeHttpMessage(ns, context, response2, dataObject);
      if (nonHttpBindingMembers.length) {
        let bytes = await collectBody(response2.body, context);
        if (bytes.byteLength > 0) {
          let dataFromBody = await deserializer.read(ns, bytes);
          for (let member of nonHttpBindingMembers)
            if (dataFromBody[member] != null)
              dataObject[member] = dataFromBody[member];
        }
      } else if (nonHttpBindingMembers.discardResponseBody)
        await collectBody(response2.body, context);
      return dataObject.$metadata = this.deserializeMetadata(response2), dataObject;
    }
    async deserializeHttpMessage(schema$1, context, response2, arg4, arg5) {
      let dataObject;
      if (arg4 instanceof Set)
        dataObject = arg5;
      else
        dataObject = arg4;
      let discardResponseBody = !0, deserializer = this.deserializer, ns = schema2.NormalizedSchema.of(schema$1), nonHttpBindingMembers = [];
      for (let [memberName, memberSchema] of ns.structIterator()) {
        let memberTraits = memberSchema.getMemberTraits();
        if (memberTraits.httpPayload) {
          if (discardResponseBody = !1, memberSchema.isStreaming())
            if (memberSchema.isStructSchema())
              dataObject[memberName] = await this.deserializeEventStream({
                response: response2,
                responseSchema: ns
              });
            else
              dataObject[memberName] = utilStream.sdkStreamMixin(response2.body);
          else if (response2.body) {
            let bytes = await collectBody(response2.body, context);
            if (bytes.byteLength > 0)
              dataObject[memberName] = await deserializer.read(memberSchema, bytes);
          }
        } else if (memberTraits.httpHeader) {
          let key = String(memberTraits.httpHeader).toLowerCase(), value = response2.headers[key];
          if (value != null)
            if (memberSchema.isListSchema()) {
              let headerListValueSchema = memberSchema.getValueSchema();
              headerListValueSchema.getMergedTraits().httpHeader = key;
              let sections;
              if (headerListValueSchema.isTimestampSchema() && headerListValueSchema.getSchema() === 4)
                sections = serde2.splitEvery(value, ",", 2);
              else
                sections = serde2.splitHeader(value);
              let list = [];
              for (let section of sections)
                list.push(await deserializer.read(headerListValueSchema, section.trim()));
              dataObject[memberName] = list;
            } else
              dataObject[memberName] = await deserializer.read(memberSchema, value);
        } else if (memberTraits.httpPrefixHeaders !== void 0) {
          dataObject[memberName] = {};
          for (let [header, value] of Object.entries(response2.headers))
            if (header.startsWith(memberTraits.httpPrefixHeaders)) {
              let valueSchema = memberSchema.getValueSchema();
              valueSchema.getMergedTraits().httpHeader = header, dataObject[memberName][header.slice(memberTraits.httpPrefixHeaders.length)] = await deserializer.read(valueSchema, value);
            }
        } else if (memberTraits.httpResponseCode)
          dataObject[memberName] = response2.statusCode;
        else
          nonHttpBindingMembers.push(memberName);
      }
      return nonHttpBindingMembers.discardResponseBody = discardResponseBody, nonHttpBindingMembers;
    }
  }

  class RpcProtocol extends HttpProtocol {
    async serializeRequest(operationSchema, _input, context) {
      let serializer = this.serializer, query = {}, headers = {}, endpoint2 = await context.endpoint(), ns = schema2.NormalizedSchema.of(operationSchema?.input), schema$1 = ns.getSchema(), payload, input = _input && typeof _input === "object" ? _input : {}, request2 = new protocolHttp.HttpRequest({
        protocol: "",
        hostname: "",
        port: void 0,
        path: "/",
        fragment: void 0,
        query,
        headers,
        body: void 0
      });
      if (endpoint2)
        this.updateServiceEndpoint(request2, endpoint2), this.setHostPrefix(request2, operationSchema, input);
      if (input) {
        let eventStreamMember = ns.getEventStreamMember();
        if (eventStreamMember) {
          if (input[eventStreamMember]) {
            let initialRequest = {};
            for (let [memberName, memberSchema] of ns.structIterator())
              if (memberName !== eventStreamMember && input[memberName])
                serializer.write(memberSchema, input[memberName]), initialRequest[memberName] = serializer.flush();
            payload = await this.serializeEventStream({
              eventStream: input[eventStreamMember],
              requestSchema: ns,
              initialRequest
            });
          }
        } else
          serializer.write(schema$1, input), payload = serializer.flush();
      }
      return request2.headers = Object.assign(request2.headers, headers), request2.query = query, request2.body = payload, request2.method = "POST", request2;
    }
    async deserializeResponse(operationSchema, context, response2) {
      let deserializer = this.deserializer, ns = schema2.NormalizedSchema.of(operationSchema.output), dataObject = {};
      if (response2.statusCode >= 300) {
        let bytes = await collectBody(response2.body, context);
        if (bytes.byteLength > 0)
          Object.assign(dataObject, await deserializer.read(15, bytes));
        throw await this.handleError(operationSchema, context, response2, dataObject, this.deserializeMetadata(response2)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.");
      }
      for (let header in response2.headers) {
        let value = response2.headers[header];
        delete response2.headers[header], response2.headers[header.toLowerCase()] = value;
      }
      let eventStreamMember = ns.getEventStreamMember();
      if (eventStreamMember)
        dataObject[eventStreamMember] = await this.deserializeEventStream({
          response: response2,
          responseSchema: ns,
          initialResponseContainer: dataObject
        });
      else {
        let bytes = await collectBody(response2.body, context);
        if (bytes.byteLength > 0)
          Object.assign(dataObject, await deserializer.read(ns, bytes));
      }
      return dataObject.$metadata = this.deserializeMetadata(response2), dataObject;
    }
  }
  var resolvedPath = (resolvedPath2, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
    if (input != null && input[memberName] !== void 0) {
      let labelValue = labelValueProvider();
      if (labelValue == null || labelValue.length <= 0)
        throw Error("Empty value provided for input HTTP label: " + memberName + ".");
      resolvedPath2 = resolvedPath2.replace(uriLabel, isGreedyLabel ? labelValue.split("/").map((segment) => extendedEncodeURIComponent(segment)).join("/") : extendedEncodeURIComponent(labelValue));
    } else
      throw Error("No value provided for input HTTP label: " + memberName + ".");
    return resolvedPath2;
  };
  function requestBuilder(input, context) {
    return new RequestBuilder(input, context);
  }

  class RequestBuilder {
    input;
    context;
    query = {};
    method = "";
    headers = {};
    path = "";
    body = null;
    hostname = "";
    resolvePathStack = [];
    constructor(input, context) {
      this.input = input, this.context = context;
    }
    async build() {
      let { hostname: hostname2, protocol = "https", port, path: basePath } = await this.context.endpoint();
      this.path = basePath;
      for (let resolvePath of this.resolvePathStack)
        resolvePath(this.path);
      return new protocolHttp.HttpRequest({
        protocol,
        hostname: this.hostname || hostname2,
        port,
        method: this.method,
        path: this.path,
        query: this.query,
        body: this.body,
        headers: this.headers
      });
    }
    hn(hostname2) {
      return this.hostname = hostname2, this;
    }
    bp(uriLabel) {
      return this.resolvePathStack.push((basePath) => {
        this.path = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + uriLabel;
      }), this;
    }
    p(memberName, labelValueProvider, uriLabel, isGreedyLabel) {
      return this.resolvePathStack.push((path9) => {
        this.path = resolvedPath(path9, this.input, memberName, labelValueProvider, uriLabel, isGreedyLabel);
      }), this;
    }
    h(headers) {
      return this.headers = headers, this;
    }
    q(query) {
      return this.query = query, this;
    }
    b(body) {
      return this.body = body, this;
    }
    m(method) {
      return this.method = method, this;
    }
  }
  function determineTimestampFormat(ns, settings) {
    if (settings.timestampFormat.useTrait) {
      if (ns.isTimestampSchema() && (ns.getSchema() === 5 || ns.getSchema() === 6 || ns.getSchema() === 7))
        return ns.getSchema();
    }
    let { httpLabel, httpPrefixHeaders, httpHeader, httpQuery } = ns.getMergedTraits();
    return (settings.httpBindings ? typeof httpPrefixHeaders === "string" || Boolean(httpHeader) ? 6 : Boolean(httpQuery) || Boolean(httpLabel) ? 5 : void 0 : void 0) ?? settings.timestampFormat.default;
  }

  class FromStringShapeDeserializer extends SerdeContext {
    settings;
    constructor(settings) {
      super();
      this.settings = settings;
    }
    read(_schema, data) {
      let ns = schema2.NormalizedSchema.of(_schema);
      if (ns.isListSchema())
        return serde2.splitHeader(data).map((item) => this.read(ns.getValueSchema(), item));
      if (ns.isBlobSchema())
        return (this.serdeContext?.base64Decoder ?? utilBase64.fromBase64)(data);
      if (ns.isTimestampSchema())
        switch (determineTimestampFormat(ns, this.settings)) {
          case 5:
            return serde2._parseRfc3339DateTimeWithOffset(data);
          case 6:
            return serde2._parseRfc7231DateTime(data);
          case 7:
            return serde2._parseEpochTimestamp(data);
          default:
            return console.warn("Missing timestamp format, parsing value with Date constructor:", data), new Date(data);
        }
      if (ns.isStringSchema()) {
        let mediaType = ns.getMergedTraits().mediaType, intermediateValue = data;
        if (mediaType) {
          if (ns.getMergedTraits().httpHeader)
            intermediateValue = this.base64ToUtf8(intermediateValue);
          if (mediaType === "application/json" || mediaType.endsWith("+json"))
            intermediateValue = serde2.LazyJsonString.from(intermediateValue);
          return intermediateValue;
        }
      }
      if (ns.isNumericSchema())
        return Number(data);
      if (ns.isBigIntegerSchema())
        return BigInt(data);
      if (ns.isBigDecimalSchema())
        return new serde2.NumericValue(data, "bigDecimal");
      if (ns.isBooleanSchema())
        return String(data).toLowerCase() === "true";
      return data;
    }
    base64ToUtf8(base64String) {
      return (this.serdeContext?.utf8Encoder ?? utilUtf8.toUtf8)((this.serdeContext?.base64Decoder ?? utilBase64.fromBase64)(base64String));
    }
  }

  class HttpInterceptingShapeDeserializer extends SerdeContext {
    codecDeserializer;
    stringDeserializer;
    constructor(codecDeserializer, codecSettings) {
      super();
      this.codecDeserializer = codecDeserializer, this.stringDeserializer = new FromStringShapeDeserializer(codecSettings);
    }
    setSerdeContext(serdeContext) {
      this.stringDeserializer.setSerdeContext(serdeContext), this.codecDeserializer.setSerdeContext(serdeContext), this.serdeContext = serdeContext;
    }
    read(schema$1, data) {
      let ns = schema2.NormalizedSchema.of(schema$1), traits2 = ns.getMergedTraits(), toString5 = this.serdeContext?.utf8Encoder ?? utilUtf8.toUtf8;
      if (traits2.httpHeader || traits2.httpResponseCode)
        return this.stringDeserializer.read(ns, toString5(data));
      if (traits2.httpPayload) {
        if (ns.isBlobSchema()) {
          let toBytes = this.serdeContext?.utf8Decoder ?? utilUtf8.fromUtf8;
          if (typeof data === "string")
            return toBytes(data);
          return data;
        } else if (ns.isStringSchema()) {
          if ("byteLength" in data)
            return toString5(data);
          return data;
        }
      }
      return this.codecDeserializer.read(ns, data);
    }
  }

  class ToStringShapeSerializer extends SerdeContext {
    settings;
    stringBuffer = "";
    constructor(settings) {
      super();
      this.settings = settings;
    }
    write(schema$1, value) {
      let ns = schema2.NormalizedSchema.of(schema$1);
      switch (typeof value) {
        case "object":
          if (value === null) {
            this.stringBuffer = "null";
            return;
          }
          if (ns.isTimestampSchema()) {
            if (!(value instanceof Date))
              throw Error(`@smithy/core/protocols - received non-Date value ${value} when schema expected Date in ${ns.getName(!0)}`);
            switch (determineTimestampFormat(ns, this.settings)) {
              case 5:
                this.stringBuffer = value.toISOString().replace(".000Z", "Z");
                break;
              case 6:
                this.stringBuffer = serde2.dateToUtcString(value);
                break;
              case 7:
                this.stringBuffer = String(value.getTime() / 1000);
                break;
              default:
                console.warn("Missing timestamp format, using epoch seconds", value), this.stringBuffer = String(value.getTime() / 1000);
            }
            return;
          }
          if (ns.isBlobSchema() && "byteLength" in value) {
            this.stringBuffer = (this.serdeContext?.base64Encoder ?? utilBase64.toBase64)(value);
            return;
          }
          if (ns.isListSchema() && Array.isArray(value)) {
            let buffer = "";
            for (let item of value) {
              this.write([ns.getValueSchema(), ns.getMergedTraits()], item);
              let headerItem = this.flush(), serialized = ns.getValueSchema().isTimestampSchema() ? headerItem : serde2.quoteHeader(headerItem);
              if (buffer !== "")
                buffer += ", ";
              buffer += serialized;
            }
            this.stringBuffer = buffer;
            return;
          }
          this.stringBuffer = JSON.stringify(value, null, 2);
          break;
        case "string":
          let mediaType = ns.getMergedTraits().mediaType, intermediateValue = value;
          if (mediaType) {
            if (mediaType === "application/json" || mediaType.endsWith("+json"))
              intermediateValue = serde2.LazyJsonString.from(intermediateValue);
            if (ns.getMergedTraits().httpHeader) {
              this.stringBuffer = (this.serdeContext?.base64Encoder ?? utilBase64.toBase64)(intermediateValue.toString());
              return;
            }
          }
          this.stringBuffer = value;
          break;
        default:
          if (ns.isIdempotencyToken())
            this.stringBuffer = serde2.generateIdempotencyToken();
          else
            this.stringBuffer = String(value);
      }
    }
    flush() {
      let buffer = this.stringBuffer;
      return this.stringBuffer = "", buffer;
    }
  }

  class HttpInterceptingShapeSerializer {
    codecSerializer;
    stringSerializer;
    buffer;
    constructor(codecSerializer, codecSettings, stringSerializer = new ToStringShapeSerializer(codecSettings)) {
      this.codecSerializer = codecSerializer, this.stringSerializer = stringSerializer;
    }
    setSerdeContext(serdeContext) {
      this.codecSerializer.setSerdeContext(serdeContext), this.stringSerializer.setSerdeContext(serdeContext);
    }
    write(schema$1, value) {
      let ns = schema2.NormalizedSchema.of(schema$1), traits2 = ns.getMergedTraits();
      if (traits2.httpHeader || traits2.httpLabel || traits2.httpQuery) {
        this.stringSerializer.write(ns, value), this.buffer = this.stringSerializer.flush();
        return;
      }
      return this.codecSerializer.write(ns, value);
    }
    flush() {
      if (this.buffer !== void 0) {
        let buffer = this.buffer;
        return this.buffer = void 0, buffer;
      }
      return this.codecSerializer.flush();
    }
  }
  exports.FromStringShapeDeserializer = FromStringShapeDeserializer;
  exports.HttpBindingProtocol = HttpBindingProtocol;
  exports.HttpInterceptingShapeDeserializer = HttpInterceptingShapeDeserializer;
  exports.HttpInterceptingShapeSerializer = HttpInterceptingShapeSerializer;
  exports.HttpProtocol = HttpProtocol;
  exports.RequestBuilder = RequestBuilder;
  exports.RpcProtocol = RpcProtocol;
  exports.SerdeContext = SerdeContext;
  exports.ToStringShapeSerializer = ToStringShapeSerializer;
  exports.collectBody = collectBody;
  exports.determineTimestampFormat = determineTimestampFormat;
  exports.extendedEncodeURIComponent = extendedEncodeURIComponent;
  exports.requestBuilder = requestBuilder;
  exports.resolvedPath = resolvedPath;
});
