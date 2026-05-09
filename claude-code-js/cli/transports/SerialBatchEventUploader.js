// Original: src/cli/transports/SerialBatchEventUploader.ts
class SerialBatchEventUploader {
  pending = [];
  pendingAtClose = 0;
  draining = !1;
  closed = !1;
  backpressureResolvers = [];
  sleepResolve = null;
  flushResolvers = [];
  droppedBatches = 0;
  config;
  constructor(config11) {
    this.config = config11;
  }
  get droppedBatchCount() {
    return this.droppedBatches;
  }
  get pendingCount() {
    return this.closed ? this.pendingAtClose : this.pending.length;
  }
  async enqueue(events2) {
    if (this.closed)
      return;
    let items = Array.isArray(events2) ? events2 : [events2];
    if (items.length === 0)
      return;
    while (this.pending.length + items.length > this.config.maxQueueSize && !this.closed)
      await new Promise((resolve47) => {
        this.backpressureResolvers.push(resolve47);
      });
    if (this.closed)
      return;
    this.pending.push(...items), this.drain();
  }
  flush() {
    if (this.pending.length === 0 && !this.draining)
      return Promise.resolve();
    return this.drain(), new Promise((resolve47) => {
      this.flushResolvers.push(resolve47);
    });
  }
  close() {
    if (this.closed)
      return;
    this.closed = !0, this.pendingAtClose = this.pending.length, this.pending = [], this.sleepResolve?.(), this.sleepResolve = null;
    for (let resolve47 of this.backpressureResolvers)
      resolve47();
    this.backpressureResolvers = [];
    for (let resolve47 of this.flushResolvers)
      resolve47();
    this.flushResolvers = [];
  }
  async drain() {
    if (this.draining || this.closed)
      return;
    this.draining = !0;
    let failures = 0;
    try {
      while (this.pending.length > 0 && !this.closed) {
        let batch = this.takeBatch();
        if (batch.length === 0)
          continue;
        try {
          await this.config.send(batch), failures = 0;
        } catch (err2) {
          if (failures++, this.config.maxConsecutiveFailures !== void 0 && failures >= this.config.maxConsecutiveFailures) {
            this.droppedBatches++, this.config.onBatchDropped?.(batch.length, failures), failures = 0, this.releaseBackpressure();
            continue;
          }
          this.pending = batch.concat(this.pending);
          let retryAfterMs = err2 instanceof RetryableError ? err2.retryAfterMs : void 0;
          await this.sleep(this.retryDelay(failures, retryAfterMs));
          continue;
        }
        this.releaseBackpressure();
      }
    } finally {
      if (this.draining = !1, this.pending.length === 0) {
        for (let resolve47 of this.flushResolvers)
          resolve47();
        this.flushResolvers = [];
      }
    }
  }
  takeBatch() {
    let { maxBatchSize, maxBatchBytes } = this.config;
    if (maxBatchBytes === void 0)
      return this.pending.splice(0, maxBatchSize);
    let bytes = 0, count4 = 0;
    while (count4 < this.pending.length && count4 < maxBatchSize) {
      let itemBytes;
      try {
        itemBytes = Buffer.byteLength(jsonStringify(this.pending[count4]));
      } catch {
        this.pending.splice(count4, 1);
        continue;
      }
      if (count4 > 0 && bytes + itemBytes > maxBatchBytes)
        break;
      bytes += itemBytes, count4++;
    }
    return this.pending.splice(0, count4);
  }
  retryDelay(failures, retryAfterMs) {
    let jitter = Math.random() * this.config.jitterMs;
    if (retryAfterMs !== void 0)
      return Math.max(this.config.baseDelayMs, Math.min(retryAfterMs, this.config.maxDelayMs)) + jitter;
    return Math.min(this.config.baseDelayMs * 2 ** (failures - 1), this.config.maxDelayMs) + jitter;
  }
  releaseBackpressure() {
    let resolvers2 = this.backpressureResolvers;
    this.backpressureResolvers = [];
    for (let resolve47 of resolvers2)
      resolve47();
  }
  sleep(ms) {
    return new Promise((resolve47) => {
      this.sleepResolve = resolve47, setTimeout((self2, resolve48) => {
        self2.sleepResolve = null, resolve48();
      }, ms, this, resolve47);
    });
  }
}
var RetryableError;
var init_SerialBatchEventUploader = __esm(() => {
  init_slowOperations();
  RetryableError = class RetryableError extends Error {
    retryAfterMs;
    constructor(message, retryAfterMs) {
      super(message);
      this.retryAfterMs = retryAfterMs;
    }
  };
});
