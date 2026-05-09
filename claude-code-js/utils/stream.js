// Original: src/utils/stream.ts
var Stream4;
var init_stream9 = __esm(() => {
  Stream4 = class Stream4 {
    returned;
    queue = [];
    readResolve;
    readReject;
    isDone = !1;
    hasError;
    started = !1;
    constructor(returned) {
      this.returned = returned;
    }
    [Symbol.asyncIterator]() {
      if (this.started)
        throw Error("Stream can only be iterated once");
      return this.started = !0, this;
    }
    next() {
      if (this.queue.length > 0)
        return Promise.resolve({
          done: !1,
          value: this.queue.shift()
        });
      if (this.isDone)
        return Promise.resolve({ done: !0, value: void 0 });
      if (this.hasError)
        return Promise.reject(this.hasError);
      return new Promise((resolve35, reject2) => {
        this.readResolve = resolve35, this.readReject = reject2;
      });
    }
    enqueue(value) {
      if (this.readResolve) {
        let resolve35 = this.readResolve;
        this.readResolve = void 0, this.readReject = void 0, resolve35({ done: !1, value });
      } else
        this.queue.push(value);
    }
    done() {
      if (this.isDone = !0, this.readResolve) {
        let resolve35 = this.readResolve;
        this.readResolve = void 0, this.readReject = void 0, resolve35({ done: !0, value: void 0 });
      }
    }
    error(error44) {
      if (this.hasError = error44, this.readReject) {
        let reject2 = this.readReject;
        this.readResolve = void 0, this.readReject = void 0, reject2(error44);
      }
    }
    return() {
      if (this.isDone = !0, this.returned)
        this.returned();
      return Promise.resolve({ done: !0, value: void 0 });
    }
  };
});
