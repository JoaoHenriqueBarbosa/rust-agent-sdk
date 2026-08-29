// var: init_EventSigningTransformStream
var init_EventSigningTransformStream = __esm(() => {
  EventSigningTransformStream = class EventSigningTransformStream extends Transform2 {
    priorSignature;
    messageSigner;
    eventStreamCodec;
    systemClockOffsetProvider;
    constructor(options) {
      super({
        autoDestroy: !0,
        readableObjectMode: !0,
        writableObjectMode: !0,
        ...options
      });
      this.priorSignature = options.priorSignature, this.eventStreamCodec = options.eventStreamCodec, this.messageSigner = options.messageSigner, this.systemClockOffsetProvider = options.systemClockOffsetProvider;
    }
    async _transform(chunk, encoding, callback) {
      try {
        let now = new Date(Date.now() + await this.systemClockOffsetProvider()), dateHeader = {
          ":date": { type: "timestamp", value: now }
        }, signedMessage = await this.messageSigner.sign({
          message: {
            body: chunk,
            headers: dateHeader
          },
          priorSignature: this.priorSignature
        }, {
          signingDate: now
        });
        this.priorSignature = signedMessage.signature;
        let serializedSigned = this.eventStreamCodec.encode({
          headers: {
            ...dateHeader,
            ":chunk-signature": {
              type: "binary",
              value: getSignatureBinary(signedMessage.signature)
            }
          },
          body: chunk
        });
        return this.push(serializedSigned), callback();
      } catch (err) {
        callback(err);
      }
    }
  };
});
