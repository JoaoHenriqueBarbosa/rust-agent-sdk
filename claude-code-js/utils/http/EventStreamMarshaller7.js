// class: EventStreamMarshaller7
class EventStreamMarshaller7 {
  constructor({ utf8Encoder, utf8Decoder }) {
    this.universalMarshaller = new EventStreamMarshaller5({
      utf8Decoder,
      utf8Encoder
    });
  }
  deserialize(body, deserializer) {
    let bodyIterable = typeof body[Symbol.asyncIterator] === "function" ? body : readabletoIterable2(body);
    return this.universalMarshaller.deserialize(bodyIterable, deserializer);
  }
  serialize(input, serializer) {
    return Readable7.from(this.universalMarshaller.serialize(input, serializer));
  }
}
