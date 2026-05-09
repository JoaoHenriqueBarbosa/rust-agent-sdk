// var: require_sharedArrayCancellation
var require_sharedArrayCancellation = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.SharedArrayReceiverStrategy = exports.SharedArraySenderStrategy = void 0;
  var cancellation_1 = require_cancellation(), CancellationState;
  (function(CancellationState2) {
    CancellationState2.Continue = 0, CancellationState2.Cancelled = 1;
  })(CancellationState || (CancellationState = {}));

  class SharedArraySenderStrategy {
    constructor() {
      this.buffers = /* @__PURE__ */ new Map;
    }
    enableCancellation(request2) {
      if (request2.id === null)
        return;
      let buffer = new SharedArrayBuffer(4), data = new Int32Array(buffer, 0, 1);
      data[0] = CancellationState.Continue, this.buffers.set(request2.id, buffer), request2.$cancellationData = buffer;
    }
    async sendCancellation(_conn, id) {
      let buffer = this.buffers.get(id);
      if (buffer === void 0)
        return;
      let data = new Int32Array(buffer, 0, 1);
      Atomics.store(data, 0, CancellationState.Cancelled);
    }
    cleanup(id) {
      this.buffers.delete(id);
    }
    dispose() {
      this.buffers.clear();
    }
  }
  exports.SharedArraySenderStrategy = SharedArraySenderStrategy;

  class SharedArrayBufferCancellationToken {
    constructor(buffer) {
      this.data = new Int32Array(buffer, 0, 1);
    }
    get isCancellationRequested() {
      return Atomics.load(this.data, 0) === CancellationState.Cancelled;
    }
    get onCancellationRequested() {
      throw Error("Cancellation over SharedArrayBuffer doesn't support cancellation events");
    }
  }

  class SharedArrayBufferCancellationTokenSource {
    constructor(buffer) {
      this.token = new SharedArrayBufferCancellationToken(buffer);
    }
    cancel() {}
    dispose() {}
  }

  class SharedArrayReceiverStrategy {
    constructor() {
      this.kind = "request";
    }
    createCancellationTokenSource(request2) {
      let buffer = request2.$cancellationData;
      if (buffer === void 0)
        return new cancellation_1.CancellationTokenSource;
      return new SharedArrayBufferCancellationTokenSource(buffer);
    }
  }
  exports.SharedArrayReceiverStrategy = SharedArrayReceiverStrategy;
});
