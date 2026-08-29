// class: EventStreamPayloadHandler
class EventStreamPayloadHandler {
  messageSigner;
  eventStreamCodec;
  systemClockOffsetProvider;
  constructor(options) {
    this.messageSigner = options.messageSigner, this.eventStreamCodec = new EventStreamCodec(options.utf8Encoder, options.utf8Decoder), this.systemClockOffsetProvider = async () => options.systemClockOffset ?? 0;
  }
  async handle(next, args, context = {}) {
    let request2 = args.request, { body: payload, query } = request2;
    if (!(payload instanceof Readable5))
      throw Error("Eventstream payload must be a Readable stream.");
    let payloadStream = payload;
    request2.body = new PassThrough2({
      objectMode: !0
    });
    let priorSignature = request2.headers?.authorization?.match(/Signature=([\w]+)$/)?.[1] ?? query?.["X-Amz-Signature"] ?? "";
    if (context.__staticSignature)
      priorSignature = "";
    let signingStream = new EventSigningTransformStream({
      priorSignature,
      eventStreamCodec: this.eventStreamCodec,
      messageSigner: await this.messageSigner(),
      systemClockOffsetProvider: this.systemClockOffsetProvider
    }), resolvePipeline, pipelineError = new Promise((resolve8, reject) => {
      resolvePipeline = () => resolve8(void 0), pipeline(payloadStream, signingStream, request2.body, (err) => {
        if (err)
          reject(Error(`Pipeline error in @aws-sdk/eventstream-handler-node: ${err.message}`, { cause: err }));
      });
    }), result;
    try {
      result = await Promise.race([next(args), pipelineError]);
    } catch (e) {
      throw request2.body.end(), e;
    } finally {
      resolvePipeline();
    }
    return result;
  }
}
