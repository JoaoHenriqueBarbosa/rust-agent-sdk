// class: c
class c {
  #t;
  #n;
  #r = !1;
  #e = void 0;
  constructor(e, t) {
    this.#t = e, this.#n = t;
  }
  next() {
    let e = () => this.#s();
    return this.#e = this.#e ? this.#e.then(e, e) : e(), this.#e;
  }
  return(e) {
    let t = () => this.#i(e);
    return this.#e ? this.#e.then(t, t) : t();
  }
  async#s() {
    if (this.#r)
      return {
        done: !0,
        value: void 0
      };
    let e;
    try {
      e = await this.#t.read();
    } catch (t) {
      throw this.#e = void 0, this.#r = !0, this.#t.releaseLock(), t;
    }
    return e.done && (this.#e = void 0, this.#r = !0, this.#t.releaseLock()), e;
  }
  async#i(e) {
    if (this.#r)
      return {
        done: !0,
        value: e
      };
    if (this.#r = !0, !this.#n) {
      let t = this.#t.cancel(e);
      return this.#t.releaseLock(), await t, {
        done: !0,
        value: e
      };
    }
    return this.#t.releaseLock(), {
      done: !0,
      value: e
    };
  }
}
