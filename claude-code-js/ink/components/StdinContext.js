// Original: src/ink/components/StdinContext.ts
var import_react, StdinContext, StdinContext_default;
var init_StdinContext = __esm(() => {
  init_emitter();
  import_react = __toESM(require_react_development(), 1), StdinContext = import_react.createContext({
    stdin: process.stdin,
    internal_eventEmitter: new EventEmitter3,
    setRawMode() {},
    isRawModeSupported: !1,
    internal_exitOnCtrlC: !0,
    internal_querier: null
  });
  StdinContext.displayName = "InternalStdinContext";
  StdinContext_default = StdinContext;
});
