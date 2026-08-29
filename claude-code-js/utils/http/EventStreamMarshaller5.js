// class: EventStreamMarshaller5
class EventStreamMarshaller5 {
  constructor({ utf8Encoder, utf8Decoder }) {
    this.eventStreamCodec = new EventStreamCodec3(utf8Encoder, utf8Decoder), this.utfEncoder = utf8Encoder;
  }
  deserialize(body, deserializer) {
    let inputStream = getChunkedStream2(body);
    return new SmithyMessageDecoderStream3({
      messageStream: new MessageDecoderStream3({ inputStream, decoder: this.eventStreamCodec }),
      deserializer: getMessageUnmarshaller2(deserializer, this.utfEncoder)
    });
  }
  serialize(inputStream, serializer) {
    return new MessageEncoderStream3({
      messageStream: new SmithyMessageEncoderStream3({ inputStream, serializer }),
      encoder: this.eventStreamCodec,
      includeEndFrame: !0
    });
  }
}
