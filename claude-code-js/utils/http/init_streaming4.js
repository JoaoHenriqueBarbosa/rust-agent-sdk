// var: init_streaming4
var init_streaming4 = __esm(() => {
  init_dist_es60();
  init_dist_es62();
  init_streaming2();
  init_error2();
  init_sdk();
  init_AWS_restJson1();
  init_values3();
  init_log4();
  import_fetch_http_handler2 = __toESM(require_dist_cjs24(), 1);
  Stream2 = class Stream2 extends Stream {
    static fromSSEResponse(response7, controller, client12) {
      let consumed = !1, logger8 = client12 ? loggerFor2(client12) : console;
      async function* iterMessages() {
        if (!response7.body)
          throw controller.abort(), new AnthropicError("Attempted to iterate over a response with no body");
        let responseBodyIter = ReadableStreamToAsyncIterable2(response7.body), eventStream7 = de_ResponseStream(responseBodyIter, getMinimalSerdeContext());
        for await (let event of eventStream7)
          if (event.chunk && event.chunk.bytes)
            yield { event: "chunk", data: toUtf89(event.chunk.bytes), raw: [] };
          else if (event.internalServerException)
            yield { event: "error", data: "InternalServerException", raw: [] };
          else if (event.modelStreamErrorException)
            yield { event: "error", data: "ModelStreamErrorException", raw: [] };
          else if (event.validationException)
            yield { event: "error", data: "ValidationException", raw: [] };
          else if (event.throttlingException)
            yield { event: "error", data: "ThrottlingException", raw: [] };
      }
      async function* iterator2() {
        if (consumed)
          throw Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        consumed = !0;
        let done = !1;
        try {
          for await (let sse of iterMessages()) {
            if (sse.event === "chunk")
              try {
                yield JSON.parse(sse.data);
              } catch (e) {
                throw logger8.error("Could not parse message into JSON:", sse.data), logger8.error("From chunk:", sse.raw), e;
              }
            if (sse.event === "error") {
              let errText = sse.data, errJSON = safeJSON2(errText), errMessage = errJSON ? void 0 : errText;
              throw APIError.generate(void 0, errJSON, errMessage, response7.headers);
            }
          }
          done = !0;
        } catch (e) {
          if (isAbortError4(e))
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new Stream2(iterator2, controller);
    }
  };
});
