// Original: src/ink/events/emitter.ts
import { EventEmitter as NodeEventEmitter } from "events";
var EventEmitter3;
var init_emitter = __esm(() => {
  EventEmitter3 = class EventEmitter3 extends NodeEventEmitter {
    constructor() {
      super();
      this.setMaxListeners(0);
    }
    emit(type, ...args) {
      if (type === "error")
        return super.emit(type, ...args);
      let listeners = this.rawListeners(type);
      if (listeners.length === 0)
        return !1;
      let ccEvent = args[0] instanceof Event2 ? args[0] : null;
      for (let listener of listeners)
        if (listener.apply(this, args), ccEvent?.didStopImmediatePropagation())
          break;
      return !0;
    }
  };
});
