// class: Emitter
class Emitter {
  emitted = {
    afterExit: !1,
    exit: !1
  };
  listeners = {
    afterExit: [],
    exit: []
  };
  count = 0;
  id = Math.random();
  constructor() {
    if (global2[kExitEmitter])
      return global2[kExitEmitter];
    ObjectDefineProperty(global2, kExitEmitter, {
      value: this,
      writable: !1,
      enumerable: !1,
      configurable: !1
    });
  }
  on(ev, fn) {
    this.listeners[ev].push(fn);
  }
  removeListener(ev, fn) {
    let list = this.listeners[ev], i2 = list.indexOf(fn);
    if (i2 === -1)
      return;
    if (i2 === 0 && list.length === 1)
      list.length = 0;
    else
      list.splice(i2, 1);
  }
  emit(ev, code, signal) {
    if (this.emitted[ev])
      return !1;
    this.emitted[ev] = !0;
    let ret = !1;
    for (let fn of this.listeners[ev])
      ret = fn(code, signal) === !0 || ret;
    if (ev === "exit")
      ret = this.emit("afterExit", code, signal) || ret;
    return ret;
  }
}
