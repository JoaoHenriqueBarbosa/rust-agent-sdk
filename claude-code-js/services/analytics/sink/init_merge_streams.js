// var: init_merge_streams
var init_merge_streams = __esm(() => {
  MergedStream = class MergedStream extends PassThroughStream {
    #streams = /* @__PURE__ */ new Set([]);
    #ended = /* @__PURE__ */ new Set([]);
    #aborted = /* @__PURE__ */ new Set([]);
    #onFinished;
    #unpipeEvent = Symbol("unpipe");
    #streamPromises = /* @__PURE__ */ new WeakMap;
    add(stream) {
      if (validateStream(stream), this.#streams.has(stream))
        return;
      this.#streams.add(stream), this.#onFinished ??= onMergedStreamFinished(this, this.#streams, this.#unpipeEvent);
      let streamPromise = endWhenStreamsDone({
        passThroughStream: this,
        stream,
        streams: this.#streams,
        ended: this.#ended,
        aborted: this.#aborted,
        onFinished: this.#onFinished,
        unpipeEvent: this.#unpipeEvent
      });
      this.#streamPromises.set(stream, streamPromise), stream.pipe(this, { end: !1 });
    }
    async remove(stream) {
      if (validateStream(stream), !this.#streams.has(stream))
        return !1;
      let streamPromise = this.#streamPromises.get(stream);
      if (streamPromise === void 0)
        return !1;
      return this.#streamPromises.delete(stream), stream.unpipe(this), await streamPromise, !0;
    }
  };
});
