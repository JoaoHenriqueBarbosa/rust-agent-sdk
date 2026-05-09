// var: init_dist9
var init_dist9 = __esm(() => {
  init_dist8();
  ErrorEvent = class ErrorEvent extends Event {
    constructor(type, errorEventInitDict) {
      var _a3, _b2;
      super(type), this.code = (_a3 = errorEventInitDict == null ? void 0 : errorEventInitDict.code) != null ? _a3 : void 0, this.message = (_b2 = errorEventInitDict == null ? void 0 : errorEventInitDict.message) != null ? _b2 : void 0;
    }
    [Symbol.for("nodejs.util.inspect.custom")](_depth, options2, inspect4) {
      return inspect4(inspectableError(this), options2);
    }
    [Symbol.for("Deno.customInspect")](inspect4, options2) {
      return inspect4(inspectableError(this), options2);
    }
  };
  EventSource = class EventSource extends EventTarget {
    constructor(url3, eventSourceInitDict) {
      var _a3, _b2;
      super(), __privateAdd(this, _EventSource_instances), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, __privateAdd(this, _readyState), __privateAdd(this, _url2), __privateAdd(this, _redirectUrl), __privateAdd(this, _withCredentials), __privateAdd(this, _fetch), __privateAdd(this, _reconnectInterval), __privateAdd(this, _reconnectTimer), __privateAdd(this, _lastEventId, null), __privateAdd(this, _controller), __privateAdd(this, _parser), __privateAdd(this, _onError, null), __privateAdd(this, _onMessage, null), __privateAdd(this, _onOpen, null), __privateAdd(this, _onFetchResponse, async (response7) => {
        var _a22;
        __privateGet(this, _parser).reset();
        let { body, redirected, status, headers } = response7;
        if (status === 204) {
          __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
          return;
        }
        if (redirected ? __privateSet(this, _redirectUrl, new URL(response7.url)) : __privateSet(this, _redirectUrl, void 0), status !== 200) {
          __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, `Non-200 status code (${status})`, status);
          return;
        }
        if (!(headers.get("content-type") || "").startsWith("text/event-stream")) {
          __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, 'Invalid content type, expected "text/event-stream"', status);
          return;
        }
        if (__privateGet(this, _readyState) === this.CLOSED)
          return;
        __privateSet(this, _readyState, this.OPEN);
        let openEvent = new Event("open");
        if ((_a22 = __privateGet(this, _onOpen)) == null || _a22.call(this, openEvent), this.dispatchEvent(openEvent), typeof body != "object" || !body || !("getReader" in body)) {
          __privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Invalid response body, expected a web ReadableStream", status), this.close();
          return;
        }
        let decoder = /* @__PURE__ */ new TextDecoder, reader = body.getReader(), open5 = !0;
        do {
          let { done, value } = await reader.read();
          value && __privateGet(this, _parser).feed(decoder.decode(value, { stream: !done })), done && (open5 = !1, __privateGet(this, _parser).reset(), __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this));
        } while (open5);
      }), __privateAdd(this, _onFetchError, (err2) => {
        __privateSet(this, _controller, void 0), !(err2.name === "AbortError" || err2.type === "aborted") && __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this, flattenError2(err2));
      }), __privateAdd(this, _onEvent, (event) => {
        typeof event.id == "string" && __privateSet(this, _lastEventId, event.id);
        let messageEvent = new MessageEvent(event.event || "message", {
          data: event.data,
          origin: __privateGet(this, _redirectUrl) ? __privateGet(this, _redirectUrl).origin : __privateGet(this, _url2).origin,
          lastEventId: event.id || ""
        });
        __privateGet(this, _onMessage) && (!event.event || event.event === "message") && __privateGet(this, _onMessage).call(this, messageEvent), this.dispatchEvent(messageEvent);
      }), __privateAdd(this, _onRetryChange, (value) => {
        __privateSet(this, _reconnectInterval, value);
      }), __privateAdd(this, _reconnect, () => {
        __privateSet(this, _reconnectTimer, void 0), __privateGet(this, _readyState) === this.CONNECTING && __privateMethod(this, _EventSource_instances, connect_fn).call(this);
      });
      try {
        if (url3 instanceof URL)
          __privateSet(this, _url2, url3);
        else if (typeof url3 == "string")
          __privateSet(this, _url2, new URL(url3, getBaseURL()));
        else
          throw Error("Invalid URL");
      } catch {
        throw syntaxError("An invalid or illegal string was specified");
      }
      __privateSet(this, _parser, createParser({
        onEvent: __privateGet(this, _onEvent),
        onRetry: __privateGet(this, _onRetryChange)
      })), __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _reconnectInterval, 3000), __privateSet(this, _fetch, (_a3 = eventSourceInitDict == null ? void 0 : eventSourceInitDict.fetch) != null ? _a3 : globalThis.fetch), __privateSet(this, _withCredentials, (_b2 = eventSourceInitDict == null ? void 0 : eventSourceInitDict.withCredentials) != null ? _b2 : !1), __privateMethod(this, _EventSource_instances, connect_fn).call(this);
    }
    get readyState() {
      return __privateGet(this, _readyState);
    }
    get url() {
      return __privateGet(this, _url2).href;
    }
    get withCredentials() {
      return __privateGet(this, _withCredentials);
    }
    get onerror() {
      return __privateGet(this, _onError);
    }
    set onerror(value) {
      __privateSet(this, _onError, value);
    }
    get onmessage() {
      return __privateGet(this, _onMessage);
    }
    set onmessage(value) {
      __privateSet(this, _onMessage, value);
    }
    get onopen() {
      return __privateGet(this, _onOpen);
    }
    set onopen(value) {
      __privateSet(this, _onOpen, value);
    }
    addEventListener(type, listener2, options2) {
      let listen = listener2;
      super.addEventListener(type, listen, options2);
    }
    removeEventListener(type, listener2, options2) {
      let listen = listener2;
      super.removeEventListener(type, listen, options2);
    }
    close() {
      __privateGet(this, _reconnectTimer) && clearTimeout(__privateGet(this, _reconnectTimer)), __privateGet(this, _readyState) !== this.CLOSED && (__privateGet(this, _controller) && __privateGet(this, _controller).abort(), __privateSet(this, _readyState, this.CLOSED), __privateSet(this, _controller, void 0));
    }
  };
  _readyState = /* @__PURE__ */ new WeakMap, _url2 = /* @__PURE__ */ new WeakMap, _redirectUrl = /* @__PURE__ */ new WeakMap, _withCredentials = /* @__PURE__ */ new WeakMap, _fetch = /* @__PURE__ */ new WeakMap, _reconnectInterval = /* @__PURE__ */ new WeakMap, _reconnectTimer = /* @__PURE__ */ new WeakMap, _lastEventId = /* @__PURE__ */ new WeakMap, _controller = /* @__PURE__ */ new WeakMap, _parser = /* @__PURE__ */ new WeakMap, _onError = /* @__PURE__ */ new WeakMap, _onMessage = /* @__PURE__ */ new WeakMap, _onOpen = /* @__PURE__ */ new WeakMap, _EventSource_instances = /* @__PURE__ */ new WeakSet, connect_fn = function() {
    __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _controller, new AbortController), __privateGet(this, _fetch)(__privateGet(this, _url2), __privateMethod(this, _EventSource_instances, getRequestOptions_fn).call(this)).then(__privateGet(this, _onFetchResponse)).catch(__privateGet(this, _onFetchError));
  }, _onFetchResponse = /* @__PURE__ */ new WeakMap, _onFetchError = /* @__PURE__ */ new WeakMap, getRequestOptions_fn = function() {
    var _a3;
    let init2 = {
      mode: "cors",
      redirect: "follow",
      headers: { Accept: "text/event-stream", ...__privateGet(this, _lastEventId) ? { "Last-Event-ID": __privateGet(this, _lastEventId) } : void 0 },
      cache: "no-store",
      signal: (_a3 = __privateGet(this, _controller)) == null ? void 0 : _a3.signal
    };
    return "window" in globalThis && (init2.credentials = this.withCredentials ? "include" : "same-origin"), init2;
  }, _onEvent = /* @__PURE__ */ new WeakMap, _onRetryChange = /* @__PURE__ */ new WeakMap, failConnection_fn = function(message, code) {
    var _a3;
    __privateGet(this, _readyState) !== this.CLOSED && __privateSet(this, _readyState, this.CLOSED);
    let errorEvent = new ErrorEvent("error", { code, message });
    (_a3 = __privateGet(this, _onError)) == null || _a3.call(this, errorEvent), this.dispatchEvent(errorEvent);
  }, scheduleReconnect_fn = function(message, code) {
    var _a3;
    if (__privateGet(this, _readyState) === this.CLOSED)
      return;
    __privateSet(this, _readyState, this.CONNECTING);
    let errorEvent = new ErrorEvent("error", { code, message });
    (_a3 = __privateGet(this, _onError)) == null || _a3.call(this, errorEvent), this.dispatchEvent(errorEvent), __privateSet(this, _reconnectTimer, setTimeout(__privateGet(this, _reconnect), __privateGet(this, _reconnectInterval)));
  }, _reconnect = /* @__PURE__ */ new WeakMap, EventSource.CONNECTING = 0, EventSource.OPEN = 1, EventSource.CLOSED = 2;
});
