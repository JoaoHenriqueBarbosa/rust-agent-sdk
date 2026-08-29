// var: init_BetaMessageStream
var init_BetaMessageStream = __esm(() => {
  init_tslib();
  init_error2();
  init_streaming2();
  init_parser();
  BetaMessageStream = class BetaMessageStream {
    constructor() {
      _BetaMessageStream_instances.add(this), this.messages = [], this.receivedMessages = [], _BetaMessageStream_currentMessageSnapshot.set(this, void 0), this.controller = new AbortController, _BetaMessageStream_connectedPromise.set(this, void 0), _BetaMessageStream_resolveConnectedPromise.set(this, () => {}), _BetaMessageStream_rejectConnectedPromise.set(this, () => {}), _BetaMessageStream_endPromise.set(this, void 0), _BetaMessageStream_resolveEndPromise.set(this, () => {}), _BetaMessageStream_rejectEndPromise.set(this, () => {}), _BetaMessageStream_listeners.set(this, {}), _BetaMessageStream_ended.set(this, !1), _BetaMessageStream_errored.set(this, !1), _BetaMessageStream_aborted.set(this, !1), _BetaMessageStream_catchingPromiseCreated.set(this, !1), _BetaMessageStream_response.set(this, void 0), _BetaMessageStream_request_id.set(this, void 0), _BetaMessageStream_handleError.set(this, (error2) => {
        if (__classPrivateFieldSet(this, _BetaMessageStream_errored, !0, "f"), isAbortError(error2))
          error2 = new APIUserAbortError;
        if (error2 instanceof APIUserAbortError)
          return __classPrivateFieldSet(this, _BetaMessageStream_aborted, !0, "f"), this._emit("abort", error2);
        if (error2 instanceof AnthropicError)
          return this._emit("error", error2);
        if (error2 instanceof Error) {
          let anthropicError = new AnthropicError(error2.message);
          return anthropicError.cause = error2, this._emit("error", anthropicError);
        }
        return this._emit("error", new AnthropicError(String(error2)));
      }), __classPrivateFieldSet(this, _BetaMessageStream_connectedPromise, new Promise((resolve, reject) => {
        __classPrivateFieldSet(this, _BetaMessageStream_resolveConnectedPromise, resolve, "f"), __classPrivateFieldSet(this, _BetaMessageStream_rejectConnectedPromise, reject, "f");
      }), "f"), __classPrivateFieldSet(this, _BetaMessageStream_endPromise, new Promise((resolve, reject) => {
        __classPrivateFieldSet(this, _BetaMessageStream_resolveEndPromise, resolve, "f"), __classPrivateFieldSet(this, _BetaMessageStream_rejectEndPromise, reject, "f");
      }), "f"), __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f").catch(() => {}), __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f").catch(() => {});
    }
    get response() {
      return __classPrivateFieldGet(this, _BetaMessageStream_response, "f");
    }
    get request_id() {
      return __classPrivateFieldGet(this, _BetaMessageStream_request_id, "f");
    }
    async withResponse() {
      let response = await __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f");
      if (!response)
        throw Error("Could not resolve a `Response` object");
      return {
        data: this,
        response,
        request_id: response.headers.get("request-id")
      };
    }
    static fromReadableStream(stream) {
      let runner = new BetaMessageStream;
      return runner._run(() => runner._fromReadableStream(stream)), runner;
    }
    static createMessage(messages, params, options) {
      let runner = new BetaMessageStream;
      for (let message of params.messages)
        runner._addMessageParam(message);
      return runner._run(() => runner._createMessage(messages, { ...params, stream: !0 }, { ...options, headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" } })), runner;
    }
    _run(executor) {
      executor().then(() => {
        this._emitFinal(), this._emit("end");
      }, __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f"));
    }
    _addMessageParam(message) {
      this.messages.push(message);
    }
    _addMessage(message, emit = !0) {
      if (this.receivedMessages.push(message), emit)
        this._emit("message", message);
    }
    async _createMessage(messages, params, options) {
      let signal = options?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
      let { response, data: stream } = await messages.create({ ...params, stream: !0 }, { ...options, signal: this.controller.signal }).withResponse();
      this._connected(response);
      for await (let event of stream)
        __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
      if (stream.controller.signal?.aborted)
        throw new APIUserAbortError;
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
    }
    _connected(response) {
      if (this.ended)
        return;
      __classPrivateFieldSet(this, _BetaMessageStream_response, response, "f"), __classPrivateFieldSet(this, _BetaMessageStream_request_id, response?.headers.get("request-id"), "f"), __classPrivateFieldGet(this, _BetaMessageStream_resolveConnectedPromise, "f").call(this, response), this._emit("connect");
    }
    get ended() {
      return __classPrivateFieldGet(this, _BetaMessageStream_ended, "f");
    }
    get errored() {
      return __classPrivateFieldGet(this, _BetaMessageStream_errored, "f");
    }
    get aborted() {
      return __classPrivateFieldGet(this, _BetaMessageStream_aborted, "f");
    }
    abort() {
      this.controller.abort();
    }
    on(event, listener) {
      return (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = [])).push({ listener }), this;
    }
    off(event, listener) {
      let listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
      if (!listeners)
        return this;
      let index = listeners.findIndex((l) => l.listener === listener);
      if (index >= 0)
        listeners.splice(index, 1);
      return this;
    }
    once(event, listener) {
      return (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = [])).push({ listener, once: !0 }), this;
    }
    emitted(event) {
      return new Promise((resolve, reject) => {
        if (__classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, !0, "f"), event !== "error")
          this.once("error", reject);
        this.once(event, resolve);
      });
    }
    async done() {
      __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, !0, "f"), await __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f");
    }
    get currentMessage() {
      return __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
    }
    async finalMessage() {
      return await this.done(), __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this);
    }
    async finalText() {
      return await this.done(), __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalText).call(this);
    }
    _emit(event, ...args) {
      if (__classPrivateFieldGet(this, _BetaMessageStream_ended, "f"))
        return;
      if (event === "end")
        __classPrivateFieldSet(this, _BetaMessageStream_ended, !0, "f"), __classPrivateFieldGet(this, _BetaMessageStream_resolveEndPromise, "f").call(this);
      let listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
      if (listeners)
        __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once), listeners.forEach(({ listener }) => listener(...args));
      if (event === "abort") {
        let error2 = args[0];
        if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length)
          Promise.reject(error2);
        __classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error2), __classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error2), this._emit("end");
        return;
      }
      if (event === "error") {
        let error2 = args[0];
        if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length)
          Promise.reject(error2);
        __classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error2), __classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error2), this._emit("end");
      }
    }
    _emitFinal() {
      if (this.receivedMessages.at(-1))
        this._emit("finalMessage", __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this));
    }
    async _fromReadableStream(readableStream, options) {
      let signal = options?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this), this._connected(null);
      let stream = Stream.fromReadableStream(readableStream, this.controller);
      for await (let event of stream)
        __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
      if (stream.controller.signal?.aborted)
        throw new APIUserAbortError;
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
    }
    [(_BetaMessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap, _BetaMessageStream_connectedPromise = /* @__PURE__ */ new WeakMap, _BetaMessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap, _BetaMessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap, _BetaMessageStream_endPromise = /* @__PURE__ */ new WeakMap, _BetaMessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap, _BetaMessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap, _BetaMessageStream_listeners = /* @__PURE__ */ new WeakMap, _BetaMessageStream_ended = /* @__PURE__ */ new WeakMap, _BetaMessageStream_errored = /* @__PURE__ */ new WeakMap, _BetaMessageStream_aborted = /* @__PURE__ */ new WeakMap, _BetaMessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap, _BetaMessageStream_response = /* @__PURE__ */ new WeakMap, _BetaMessageStream_request_id = /* @__PURE__ */ new WeakMap, _BetaMessageStream_handleError = /* @__PURE__ */ new WeakMap, _BetaMessageStream_instances = /* @__PURE__ */ new WeakSet, _BetaMessageStream_getFinalMessage = function() {
      if (this.receivedMessages.length === 0)
        throw new AnthropicError("stream ended without producing a Message with role=assistant");
      return this.receivedMessages.at(-1);
    }, _BetaMessageStream_getFinalText = function() {
      if (this.receivedMessages.length === 0)
        throw new AnthropicError("stream ended without producing a Message with role=assistant");
      let textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
      if (textBlocks.length === 0)
        throw new AnthropicError("stream ended without producing a content block with type=text");
      return textBlocks.join(" ");
    }, _BetaMessageStream_beginRequest = function() {
      if (this.ended)
        return;
      __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
    }, _BetaMessageStream_addStreamEvent = function(event) {
      if (this.ended)
        return;
      let messageSnapshot = __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_accumulateMessage).call(this, event);
      switch (this._emit("streamEvent", event, messageSnapshot), event.type) {
        case "content_block_delta": {
          let content = messageSnapshot.content.at(-1);
          switch (event.delta.type) {
            case "text_delta": {
              if (content.type === "text")
                this._emit("text", event.delta.text, content.text || "");
              break;
            }
            case "citations_delta": {
              if (content.type === "text")
                this._emit("citation", event.delta.citation, content.citations ?? []);
              break;
            }
            case "input_json_delta": {
              if ((content.type === "tool_use" || content.type === "mcp_tool_use") && content.input)
                this._emit("inputJson", event.delta.partial_json, content.input);
              break;
            }
            case "thinking_delta": {
              if (content.type === "thinking")
                this._emit("thinking", event.delta.thinking, content.thinking);
              break;
            }
            case "signature_delta": {
              if (content.type === "thinking")
                this._emit("signature", content.signature);
              break;
            }
            default:
              checkNever(event.delta);
          }
          break;
        }
        case "message_stop": {
          this._addMessageParam(messageSnapshot), this._addMessage(messageSnapshot, !0);
          break;
        }
        case "content_block_stop": {
          this._emit("contentBlock", messageSnapshot.content.at(-1));
          break;
        }
        case "message_start": {
          __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, messageSnapshot, "f");
          break;
        }
        case "content_block_start":
        case "message_delta":
          break;
      }
    }, _BetaMessageStream_endRequest = function() {
      if (this.ended)
        throw new AnthropicError("stream has ended, this shouldn't happen");
      let snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
      if (!snapshot)
        throw new AnthropicError("request ended without sending any chunks");
      return __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f"), snapshot;
    }, _BetaMessageStream_accumulateMessage = function(event) {
      let snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
      if (event.type === "message_start") {
        if (snapshot)
          throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
        return event.message;
      }
      if (!snapshot)
        throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
      switch (event.type) {
        case "message_stop":
          return snapshot;
        case "message_delta":
          if (snapshot.container = event.delta.container, snapshot.stop_reason = event.delta.stop_reason, snapshot.stop_sequence = event.delta.stop_sequence, snapshot.usage.output_tokens = event.usage.output_tokens, event.usage.input_tokens != null)
            snapshot.usage.input_tokens = event.usage.input_tokens;
          if (event.usage.cache_creation_input_tokens != null)
            snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
          if (event.usage.cache_read_input_tokens != null)
            snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
          if (event.usage.server_tool_use != null)
            snapshot.usage.server_tool_use = event.usage.server_tool_use;
          return snapshot;
        case "content_block_start":
          return snapshot.content.push(event.content_block), snapshot;
        case "content_block_delta": {
          let snapshotContent = snapshot.content.at(event.index);
          switch (event.delta.type) {
            case "text_delta": {
              if (snapshotContent?.type === "text")
                snapshotContent.text += event.delta.text;
              break;
            }
            case "citations_delta": {
              if (snapshotContent?.type === "text")
                snapshotContent.citations ?? (snapshotContent.citations = []), snapshotContent.citations.push(event.delta.citation);
              break;
            }
            case "input_json_delta": {
              if (snapshotContent?.type === "tool_use" || snapshotContent?.type === "mcp_tool_use") {
                let jsonBuf = snapshotContent[JSON_BUF_PROPERTY] || "";
                if (jsonBuf += event.delta.partial_json, Object.defineProperty(snapshotContent, JSON_BUF_PROPERTY, {
                  value: jsonBuf,
                  enumerable: !1,
                  writable: !0
                }), jsonBuf)
                  snapshotContent.input = partialParse(jsonBuf);
              }
              break;
            }
            case "thinking_delta": {
              if (snapshotContent?.type === "thinking")
                snapshotContent.thinking += event.delta.thinking;
              break;
            }
            case "signature_delta": {
              if (snapshotContent?.type === "thinking")
                snapshotContent.signature = event.delta.signature;
              break;
            }
            default:
              checkNever(event.delta);
          }
          return snapshot;
        }
        case "content_block_stop":
          return snapshot;
      }
    }, Symbol.asyncIterator)]() {
      let pushQueue = [], readQueue = [], done = !1;
      return this.on("streamEvent", (event) => {
        let reader = readQueue.shift();
        if (reader)
          reader.resolve(event);
        else
          pushQueue.push(event);
      }), this.on("end", () => {
        done = !0;
        for (let reader of readQueue)
          reader.resolve(void 0);
        readQueue.length = 0;
      }), this.on("abort", (err) => {
        done = !0;
        for (let reader of readQueue)
          reader.reject(err);
        readQueue.length = 0;
      }), this.on("error", (err) => {
        done = !0;
        for (let reader of readQueue)
          reader.reject(err);
        readQueue.length = 0;
      }), {
        next: async () => {
          if (!pushQueue.length) {
            if (done)
              return { value: void 0, done: !0 };
            return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: !1 } : { value: void 0, done: !0 });
          }
          return { value: pushQueue.shift(), done: !1 };
        },
        return: async () => {
          return this.abort(), { value: void 0, done: !0 };
        }
      };
    }
    toReadableStream() {
      return new Stream(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
    }
  };
});
