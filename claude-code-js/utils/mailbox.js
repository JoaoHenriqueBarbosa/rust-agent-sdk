// Original: src/utils/mailbox.ts
class Mailbox {
  queue = [];
  waiters = [];
  changed = createSignal();
  _revision = 0;
  get length() {
    return this.queue.length;
  }
  get revision() {
    return this._revision;
  }
  send(msg) {
    this._revision++;
    let idx = this.waiters.findIndex((w2) => w2.fn(msg));
    if (idx !== -1) {
      let waiter7 = this.waiters.splice(idx, 1)[0];
      if (waiter7) {
        waiter7.resolve(msg), this.notify();
        return;
      }
    }
    this.queue.push(msg), this.notify();
  }
  poll(fn = () => !0) {
    let idx = this.queue.findIndex(fn);
    if (idx === -1)
      return;
    return this.queue.splice(idx, 1)[0];
  }
  receive(fn = () => !0) {
    let idx = this.queue.findIndex(fn);
    if (idx !== -1) {
      let msg = this.queue.splice(idx, 1)[0];
      if (msg)
        return this.notify(), Promise.resolve(msg);
    }
    return new Promise((resolve11) => {
      this.waiters.push({ fn, resolve: resolve11 });
    });
  }
  subscribe = this.changed.subscribe;
  notify() {
    this.changed.emit();
  }
}
var init_mailbox = () => {};
