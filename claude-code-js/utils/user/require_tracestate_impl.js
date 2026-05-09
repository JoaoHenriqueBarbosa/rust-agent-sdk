// var: require_tracestate_impl
var require_tracestate_impl = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.TraceStateImpl = void 0;
  var tracestate_validators_1 = require_tracestate_validators(), MAX_TRACE_STATE_ITEMS = 32, MAX_TRACE_STATE_LEN = 512, LIST_MEMBERS_SEPARATOR = ",", LIST_MEMBER_KEY_VALUE_SPLITTER = "=";

  class TraceStateImpl {
    constructor(rawTraceState) {
      if (this._internalState = /* @__PURE__ */ new Map, rawTraceState)
        this._parse(rawTraceState);
    }
    set(key2, value) {
      let traceState = this._clone();
      if (traceState._internalState.has(key2))
        traceState._internalState.delete(key2);
      return traceState._internalState.set(key2, value), traceState;
    }
    unset(key2) {
      let traceState = this._clone();
      return traceState._internalState.delete(key2), traceState;
    }
    get(key2) {
      return this._internalState.get(key2);
    }
    serialize() {
      return Array.from(this._internalState.keys()).reduceRight((agg, key2) => {
        return agg.push(key2 + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key2)), agg;
      }, []).join(LIST_MEMBERS_SEPARATOR);
    }
    _parse(rawTraceState) {
      if (rawTraceState.length > MAX_TRACE_STATE_LEN)
        return;
      if (this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reduceRight((agg, part) => {
        let listMember = part.trim(), i5 = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
        if (i5 !== -1) {
          let key2 = listMember.slice(0, i5), value = listMember.slice(i5 + 1, part.length);
          if ((0, tracestate_validators_1.validateKey)(key2) && (0, tracestate_validators_1.validateValue)(value))
            agg.set(key2, value);
        }
        return agg;
      }, /* @__PURE__ */ new Map), this._internalState.size > MAX_TRACE_STATE_ITEMS)
        this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse();
    }
    _clone() {
      let traceState = new TraceStateImpl;
      return traceState._internalState = new Map(this._internalState), traceState;
    }
  }
  exports.TraceStateImpl = TraceStateImpl;
});
