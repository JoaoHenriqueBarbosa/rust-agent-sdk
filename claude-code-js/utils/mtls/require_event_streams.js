// var: require_event_streams
var require_event_streams = __commonJS((exports) => {
  var utilUtf8 = require_dist_cjs17();

  class EventStreamSerde {
    marshaller;
    serializer;
    deserializer;
    serdeContext;
    defaultContentType;
    constructor({ marshaller, serializer, deserializer, serdeContext, defaultContentType }) {
      this.marshaller = marshaller, this.serializer = serializer, this.deserializer = deserializer, this.serdeContext = serdeContext, this.defaultContentType = defaultContentType;
    }
    async serializeEventStream({ eventStream: eventStream2, requestSchema, initialRequest }) {
      let marshaller = this.marshaller, eventStreamMember = requestSchema.getEventStreamMember(), unionSchema = requestSchema.getMemberSchema(eventStreamMember), serializer = this.serializer, defaultContentType = this.defaultContentType, initialRequestMarker = Symbol("initialRequestMarker"), eventStreamIterable = {
        async* [Symbol.asyncIterator]() {
          if (initialRequest) {
            let headers = {
              ":event-type": { type: "string", value: "initial-request" },
              ":message-type": { type: "string", value: "event" },
              ":content-type": { type: "string", value: defaultContentType }
            };
            serializer.write(requestSchema, initialRequest);
            let body = serializer.flush();
            yield {
              [initialRequestMarker]: !0,
              headers,
              body
            };
          }
          for await (let page of eventStream2)
            yield page;
        }
      };
      return marshaller.serialize(eventStreamIterable, (event) => {
        if (event[initialRequestMarker])
          return {
            headers: event.headers,
            body: event.body
          };
        let unionMember = Object.keys(event).find((key) => {
          return key !== "__type";
        }) ?? "", { additionalHeaders, body, eventType, explicitPayloadContentType } = this.writeEventBody(unionMember, unionSchema, event);
        return {
          headers: {
            ":event-type": { type: "string", value: eventType },
            ":message-type": { type: "string", value: "event" },
            ":content-type": { type: "string", value: explicitPayloadContentType ?? defaultContentType },
            ...additionalHeaders
          },
          body
        };
      });
    }
    async deserializeEventStream({ response: response2, responseSchema, initialResponseContainer }) {
      let marshaller = this.marshaller, eventStreamMember = responseSchema.getEventStreamMember(), memberSchemas = responseSchema.getMemberSchema(eventStreamMember).getMemberSchemas(), initialResponseMarker = Symbol("initialResponseMarker"), asyncIterable = marshaller.deserialize(response2.body, async (event) => {
        let unionMember = Object.keys(event).find((key) => {
          return key !== "__type";
        }) ?? "", body = event[unionMember].body;
        if (unionMember === "initial-response") {
          let dataObject = await this.deserializer.read(responseSchema, body);
          return delete dataObject[eventStreamMember], {
            [initialResponseMarker]: !0,
            ...dataObject
          };
        } else if (unionMember in memberSchemas) {
          let eventStreamSchema = memberSchemas[unionMember];
          if (eventStreamSchema.isStructSchema()) {
            let out = {}, hasBindings = !1;
            for (let [name, member] of eventStreamSchema.structIterator()) {
              let { eventHeader, eventPayload } = member.getMergedTraits();
              if (hasBindings = hasBindings || Boolean(eventHeader || eventPayload), eventPayload) {
                if (member.isBlobSchema())
                  out[name] = body;
                else if (member.isStringSchema())
                  out[name] = (this.serdeContext?.utf8Encoder ?? utilUtf8.toUtf8)(body);
                else if (member.isStructSchema())
                  out[name] = await this.deserializer.read(member, body);
              } else if (eventHeader) {
                let value = event[unionMember].headers[name]?.value;
                if (value != null)
                  if (member.isNumericSchema())
                    if (value && typeof value === "object" && "bytes" in value)
                      out[name] = BigInt(value.toString());
                    else
                      out[name] = Number(value);
                  else
                    out[name] = value;
              }
            }
            if (hasBindings)
              return {
                [unionMember]: out
              };
            if (body.byteLength === 0)
              return {
                [unionMember]: {}
              };
          }
          return {
            [unionMember]: await this.deserializer.read(eventStreamSchema, body)
          };
        } else
          return {
            $unknown: event
          };
      }), asyncIterator2 = asyncIterable[Symbol.asyncIterator](), firstEvent = await asyncIterator2.next();
      if (firstEvent.done)
        return asyncIterable;
      if (firstEvent.value?.[initialResponseMarker]) {
        if (!responseSchema)
          throw Error("@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.");
        for (let [key, value] of Object.entries(firstEvent.value))
          initialResponseContainer[key] = value;
      }
      return {
        async* [Symbol.asyncIterator]() {
          if (!firstEvent?.value?.[initialResponseMarker])
            yield firstEvent.value;
          while (!0) {
            let { done, value } = await asyncIterator2.next();
            if (done)
              break;
            yield value;
          }
        }
      };
    }
    writeEventBody(unionMember, unionSchema, event) {
      let serializer = this.serializer, eventType = unionMember, explicitPayloadMember = null, explicitPayloadContentType, isKnownSchema = (() => {
        return unionSchema.getSchema()[4].includes(unionMember);
      })(), additionalHeaders = {};
      if (!isKnownSchema) {
        let [type, value] = event[unionMember];
        eventType = type, serializer.write(15, value);
      } else {
        let eventSchema = unionSchema.getMemberSchema(unionMember);
        if (eventSchema.isStructSchema()) {
          for (let [memberName, memberSchema] of eventSchema.structIterator()) {
            let { eventHeader, eventPayload } = memberSchema.getMergedTraits();
            if (eventPayload)
              explicitPayloadMember = memberName;
            else if (eventHeader) {
              let value = event[unionMember][memberName], type = "binary";
              if (memberSchema.isNumericSchema())
                if (-2147483648 <= value && value <= 2147483647)
                  type = "integer";
                else
                  type = "long";
              else if (memberSchema.isTimestampSchema())
                type = "timestamp";
              else if (memberSchema.isStringSchema())
                type = "string";
              else if (memberSchema.isBooleanSchema())
                type = "boolean";
              if (value != null)
                additionalHeaders[memberName] = {
                  type,
                  value
                }, delete event[unionMember][memberName];
            }
          }
          if (explicitPayloadMember !== null) {
            let payloadSchema = eventSchema.getMemberSchema(explicitPayloadMember);
            if (payloadSchema.isBlobSchema())
              explicitPayloadContentType = "application/octet-stream";
            else if (payloadSchema.isStringSchema())
              explicitPayloadContentType = "text/plain";
            serializer.write(payloadSchema, event[unionMember][explicitPayloadMember]);
          } else
            serializer.write(eventSchema, event[unionMember]);
        } else if (eventSchema.isUnitSchema())
          serializer.write(eventSchema, {});
        else
          throw Error("@smithy/core/event-streams - non-struct member not supported in event stream union.");
      }
      let messageSerialization = serializer.flush() ?? new Uint8Array;
      return {
        body: typeof messageSerialization === "string" ? (this.serdeContext?.utf8Decoder ?? utilUtf8.fromUtf8)(messageSerialization) : messageSerialization,
        eventType,
        explicitPayloadContentType,
        additionalHeaders
      };
    }
  }
  exports.EventStreamSerde = EventStreamSerde;
});
