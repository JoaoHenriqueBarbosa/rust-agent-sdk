// var: init_mjs
var init_mjs = __esm(() => {
  init_signals2();
  kExitEmitter = Symbol.for("signal-exit emitter"), global2 = globalThis, ObjectDefineProperty = Object.defineProperty.bind(Object);
  SignalExitFallback = class SignalExitFallback extends SignalExitBase {
    onExit() {
      return () => {};
    }
    load() {}
    unload() {}
  };
  SignalExit = class SignalExit extends SignalExitBase {
    #hupSig = process11.platform === "win32" ? "SIGINT" : "SIGHUP";
    #emitter = new Emitter;
    #process;
    #originalProcessEmit;
    #originalProcessReallyExit;
    #sigListeners = {};
    #loaded = !1;
    constructor(process11) {
      super();
      this.#process = process11, this.#sigListeners = {};
      for (let sig of signals)
        this.#sigListeners[sig] = () => {
          let listeners = this.#process.listeners(sig), { count: count2 } = this.#emitter, p = process11;
          if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number")
            count2 += p.__signal_exit_emitter__.count;
          if (listeners.length === count2) {
            this.unload();
            let ret = this.#emitter.emit("exit", null, sig), s = sig === "SIGHUP" ? this.#hupSig : sig;
            if (!ret)
              process11.kill(process11.pid, s);
          }
        };
      this.#originalProcessReallyExit = process11.reallyExit, this.#originalProcessEmit = process11.emit;
    }
    onExit(cb, opts) {
      if (!processOk(this.#process))
        return () => {};
      if (this.#loaded === !1)
        this.load();
      let ev = opts?.alwaysLast ? "afterExit" : "exit";
      return this.#emitter.on(ev, cb), () => {
        if (this.#emitter.removeListener(ev, cb), this.#emitter.listeners.exit.length === 0 && this.#emitter.listeners.afterExit.length === 0)
          this.unload();
      };
    }
    load() {
      if (this.#loaded)
        return;
      this.#loaded = !0, this.#emitter.count += 1;
      for (let sig of signals)
        try {
          let fn = this.#sigListeners[sig];
          if (fn)
            this.#process.on(sig, fn);
        } catch (_) {}
      this.#process.emit = (ev, ...a2) => {
        return this.#processEmit(ev, ...a2);
      }, this.#process.reallyExit = (code) => {
        return this.#processReallyExit(code);
      };
    }
    unload() {
      if (!this.#loaded)
        return;
      this.#loaded = !1, signals.forEach((sig) => {
        let listener = this.#sigListeners[sig];
        if (!listener)
          throw Error("Listener not defined for signal: " + sig);
        try {
          this.#process.removeListener(sig, listener);
        } catch (_) {}
      }), this.#process.emit = this.#originalProcessEmit, this.#process.reallyExit = this.#originalProcessReallyExit, this.#emitter.count -= 1;
    }
    #processReallyExit(code) {
      if (!processOk(this.#process))
        return 0;
      return this.#process.exitCode = code || 0, this.#emitter.emit("exit", this.#process.exitCode, null), this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
    }
    #processEmit(ev, ...args) {
      let og = this.#originalProcessEmit;
      if (ev === "exit" && processOk(this.#process)) {
        if (typeof args[0] === "number")
          this.#process.exitCode = args[0];
        let ret = og.call(this.#process, ev, ...args);
        return this.#emitter.emit("exit", this.#process.exitCode, null), ret;
      } else
        return og.call(this.#process, ev, ...args);
    }
  };
  process11 = globalThis.process, {
    onExit,
    load,
    unload
  } = signalExitWrap(processOk(process11) ? new SignalExit(process11) : new SignalExitFallback);
});
