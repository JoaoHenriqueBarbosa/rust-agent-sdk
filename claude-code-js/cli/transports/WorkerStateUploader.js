// Original: src/cli/transports/WorkerStateUploader.ts
class WorkerStateUploader {
  inflight = null;
  pending = null;
  closed = !1;
  config;
  constructor(config11) {
    this.config = config11;
  }
  enqueue(patch2) {
    if (this.closed)
      return;
    this.pending = this.pending ? coalescePatches(this.pending, patch2) : patch2, this.drain();
  }
  close() {
    this.closed = !0, this.pending = null;
  }
  async drain() {
    if (this.inflight || this.closed)
      return;
    if (!this.pending)
      return;
    let payload = this.pending;
    this.pending = null, this.inflight = this.sendWithRetry(payload).then(() => {
      if (this.inflight = null, this.pending && !this.closed)
        this.drain();
    });
  }
  async sendWithRetry(payload) {
    let current = payload, failures = 0;
    while (!this.closed) {
      if (await this.config.send(current))
        return;
      if (failures++, await sleep3(this.retryDelay(failures)), this.pending && !this.closed)
        current = coalescePatches(current, this.pending), this.pending = null;
    }
  }
  retryDelay(failures) {
    let exponential = Math.min(this.config.baseDelayMs * 2 ** (failures - 1), this.config.maxDelayMs), jitter = Math.random() * this.config.jitterMs;
    return exponential + jitter;
  }
}
function coalescePatches(base2, overlay) {
  let merged = { ...base2 };
  for (let [key3, value] of Object.entries(overlay))
    if ((key3 === "external_metadata" || key3 === "internal_metadata") && merged[key3] && typeof merged[key3] === "object" && typeof value === "object" && value !== null)
      merged[key3] = {
        ...merged[key3],
        ...value
      };
    else
      merged[key3] = value;
  return merged;
}
var init_WorkerStateUploader = () => {};
