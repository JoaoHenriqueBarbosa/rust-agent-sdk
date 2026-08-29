// Original: src/context/voice.tsx
var exports_voice = {};
__export(exports_voice, {
  useVoiceState: () => useVoiceState,
  useSetVoiceState: () => useSetVoiceState,
  useGetVoiceState: () => useGetVoiceState,
  VoiceProvider: () => VoiceProvider
});
function VoiceProvider(t0) {
  let $3 = import_compiler_runtime17.c(3), {
    children
  } = t0, [store] = import_react28.useState(_temp3), t1;
  if ($3[0] !== children || $3[1] !== store)
    t1 = /* @__PURE__ */ jsx_dev_runtime20.jsxDEV(VoiceContext.Provider, {
      value: store,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = store, $3[2] = t1;
  else
    t1 = $3[2];
  return t1;
}
function _temp3() {
  return createStore(DEFAULT_STATE);
}
function useVoiceStore() {
  let store = import_react28.useContext(VoiceContext);
  if (!store)
    throw Error("useVoiceState must be used within a VoiceProvider");
  return store;
}
function useVoiceState(selector) {
  let $3 = import_compiler_runtime17.c(3), store = useVoiceStore(), t0;
  if ($3[0] !== selector || $3[1] !== store)
    t0 = () => selector(store.getState()), $3[0] = selector, $3[1] = store, $3[2] = t0;
  else
    t0 = $3[2];
  let get2 = t0;
  return import_react28.useSyncExternalStore(store.subscribe, get2, get2);
}
function useSetVoiceState() {
  return useVoiceStore().setState;
}
function useGetVoiceState() {
  return useVoiceStore().getState;
}
var import_compiler_runtime17, import_react28, jsx_dev_runtime20, DEFAULT_STATE, VoiceContext;
var init_voice = __esm(() => {
  import_compiler_runtime17 = __toESM(require_react_compiler_runtime_development(), 1), import_react28 = __toESM(require_react_development(), 1), jsx_dev_runtime20 = __toESM(require_react_jsx_dev_runtime_development(), 1), DEFAULT_STATE = {
    voiceState: "idle",
    voiceError: null,
    voiceInterimTranscript: "",
    voiceAudioLevels: [],
    voiceWarmingUp: !1
  }, VoiceContext = import_react28.createContext(null);
});
