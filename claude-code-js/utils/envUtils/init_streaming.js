// var: init_streaming
var init_streaming = __esm(() => {
  init_error();
  init_line();
  init_values();
  init_error();
  Stream = class Stream {
    constructor(iterator, controller) {
      this.iterator = iterator, this.controller = controller;
    }
    static fromSSEResponse(response, controller) {
      let consumed = !1;
      async function* iterator() {
        if (consumed)
          throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        consumed = !0;
        let done = !1;
        try {
          for await (let sse of _iterSSEMessages(response, controller)) {
            if (sse.event === "completion")
              try {
                yield JSON.parse(sse.data);
              } catch (e) {
                throw console.error("Could not parse message into JSON:", sse.data), console.error("From chunk:", sse.raw), e;
              }
            if (sse.event === "message_start" || sse.event === "message_delta" || sse.event === "message_stop" || sse.event === "content_block_start" || sse.event === "content_block_delta" || sse.event === "content_block_stop")
              try {
                yield JSON.parse(sse.data);
              } catch (e) {
                throw console.error("Could not parse message into JSON:", sse.data), console.error("From chunk:", sse.raw), e;
              }
            if (sse.event === "ping")
              continue;
            if (sse.event === "error")
              throw new APIError(void 0, safeJSON(sse.data) ?? sse.data, void 0, response.headers);
          }
          done = !0;
        } catch (e) {
          if (isAbortError(e))
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new Stream(iterator, controller);
    }
    static fromReadableStream(readableStream, controller) {
      let consumed = !1;
      async function* iterLines() {
        let lineDecoder = new LineDecoder, iter = ReadableStreamToAsyncIterable(readableStream);
        for await (let chunk of iter)
          for (let line of lineDecoder.decode(chunk))
            yield line;
        for (let line of lineDecoder.flush())
          yield line;
      }
      async function* iterator() {
        if (consumed)
          throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        consumed = !0;
        let done = !1;
        try {
          for await (let line of iterLines()) {
            if (done)
              continue;
            if (line)
              yield JSON.parse(line);
          }
          done = !0;
        } catch (e) {
          if (isAbortError(e))
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new Stream(iterator, controller);
    }
    [Symbol.asyncIterator]() {
      return this.iterator();
    }
    tee() {
      let left = [], right = [], iterator = this.iterator(), teeIterator = (queue) => {
        return {
          next: () => {
            if (queue.length === 0) {
              let result = iterator.next();
              left.push(result), right.push(result);
            }
            return queue.shift();
          }
        };
      };
      return [
        new Stream(() => teeIterator(left), this.controller),
        new Stream(() => teeIterator(right), this.controller)
      ];
    }
    toReadableStream() {
      let self2 = this, iter;
      return makeReadableStream({
        async start() {
          iter = self2[Symbol.asyncIterator]();
        },
        async pull(ctrl) {
          try {
            let { value, done } = await iter.next();
            if (done)
              return ctrl.close();
            let bytes = encodeUTF8(JSON.stringify(value) + `
`);
            ctrl.enqueue(bytes);
          } catch (err) {
            ctrl.error(err);
          }
        },
        async cancel() {
          await iter.return?.();
        }
      });
    }
  };
});
