// var: require_signal_exit
var require_signal_exit = __commonJS((exports, module) => {
  var process13 = global.process, processOk2 = function(process14) {
    return process14 && typeof process14 === "object" && typeof process14.removeListener === "function" && typeof process14.emit === "function" && typeof process14.reallyExit === "function" && typeof process14.listeners === "function" && typeof process14.kill === "function" && typeof process14.pid === "number" && typeof process14.on === "function";
  };
  if (!processOk2(process13))
    module.exports = function() {
      return function() {};
    };
  else {
    if (assert2 = __require("assert"), signals2 = require_signals(), isWin = /^win/i.test(process13.platform), EE = __require("events"), typeof EE !== "function")
      EE = EE.EventEmitter;
    if (process13.__signal_exit_emitter__)
      emitter = process13.__signal_exit_emitter__;
    else
      emitter = process13.__signal_exit_emitter__ = new EE, emitter.count = 0, emitter.emitted = {};
    if (!emitter.infinite)
      emitter.setMaxListeners(1 / 0), emitter.infinite = !0;
    module.exports = function(cb, opts) {
      if (!processOk2(global.process))
        return function() {};
      if (assert2.equal(typeof cb, "function", "a callback must be provided for exit handler"), loaded === !1)
        load2();
      var ev = "exit";
      if (opts && opts.alwaysLast)
        ev = "afterexit";
      var remove = function() {
        if (emitter.removeListener(ev, cb), emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0)
          unload2();
      };
      return emitter.on(ev, cb), remove;
    }, unload2 = function() {
      if (!loaded || !processOk2(global.process))
        return;
      loaded = !1, signals2.forEach(function(sig) {
        try {
          process13.removeListener(sig, sigListeners[sig]);
        } catch (er) {}
      }), process13.emit = originalProcessEmit, process13.reallyExit = originalProcessReallyExit, emitter.count -= 1;
    }, module.exports.unload = unload2, emit = function(event, code, signal) {
      if (emitter.emitted[event])
        return;
      emitter.emitted[event] = !0, emitter.emit(event, code, signal);
    }, sigListeners = {}, signals2.forEach(function(sig) {
      sigListeners[sig] = function() {
        if (!processOk2(global.process))
          return;
        var listeners = process13.listeners(sig);
        if (listeners.length === emitter.count) {
          if (unload2(), emit("exit", null, sig), emit("afterexit", null, sig), isWin && sig === "SIGHUP")
            sig = "SIGINT";
          process13.kill(process13.pid, sig);
        }
      };
    }), module.exports.signals = function() {
      return signals2;
    }, loaded = !1, load2 = function() {
      if (loaded || !processOk2(global.process))
        return;
      loaded = !0, emitter.count += 1, signals2 = signals2.filter(function(sig) {
        try {
          return process13.on(sig, sigListeners[sig]), !0;
        } catch (er) {
          return !1;
        }
      }), process13.emit = processEmit, process13.reallyExit = processReallyExit;
    }, module.exports.load = load2, originalProcessReallyExit = process13.reallyExit, processReallyExit = function(code) {
      if (!processOk2(global.process))
        return;
      process13.exitCode = code || 0, emit("exit", process13.exitCode, null), emit("afterexit", process13.exitCode, null), originalProcessReallyExit.call(process13, process13.exitCode);
    }, originalProcessEmit = process13.emit, processEmit = function(ev, arg) {
      if (ev === "exit" && processOk2(global.process)) {
        if (arg !== void 0)
          process13.exitCode = arg;
        var ret = originalProcessEmit.apply(this, arguments);
        return emit("exit", process13.exitCode, null), emit("afterexit", process13.exitCode, null), ret;
      } else
        return originalProcessEmit.apply(this, arguments);
    };
  }
  var assert2, signals2, isWin, EE, emitter, unload2, emit, sigListeners, loaded, load2, originalProcessReallyExit, processReallyExit, originalProcessEmit, processEmit;
});
