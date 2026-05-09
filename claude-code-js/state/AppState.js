// Original: src/state/AppState.tsx
function AppStateProvider(t0) {
  let $3 = import_compiler_runtime123.c(13), {
    children,
    initialState,
    onChangeAppState
  } = t0;
  if (import_react83.useContext(HasAppStateContext))
    throw Error("AppStateProvider can not be nested within another AppStateProvider");
  let t1;
  if ($3[0] !== initialState || $3[1] !== onChangeAppState)
    t1 = () => createStore(initialState ?? getDefaultAppState(), onChangeAppState), $3[0] = initialState, $3[1] = onChangeAppState, $3[2] = t1;
  else
    t1 = $3[2];
  let [store] = import_react83.useState(t1), t2;
  if ($3[3] !== store)
    t2 = () => {
      let {
        toolPermissionContext
      } = store.getState();
      if (toolPermissionContext.isBypassPermissionsModeAvailable && isBypassPermissionsModeDisabled())
        logForDebugging("Disabling bypass permissions mode on mount (remote settings loaded before mount)"), store.setState(_temp55);
    }, $3[3] = store, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t3 = [], $3[5] = t3;
  else
    t3 = $3[5];
  import_react83.useEffect(t2, t3);
  let t4;
  if ($3[6] !== store.setState)
    t4 = (source) => applySettingsChange(source, store.setState), $3[6] = store.setState, $3[7] = t4;
  else
    t4 = $3[7];
  let onSettingsChange = import_react83.useEffectEvent(t4);
  useSettingsChange(onSettingsChange);
  let t5;
  if ($3[8] !== children)
    t5 = /* @__PURE__ */ jsx_dev_runtime155.jsxDEV(MailboxProvider, {
      children: /* @__PURE__ */ jsx_dev_runtime155.jsxDEV(VoiceProvider2, {
        children
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = children, $3[9] = t5;
  else
    t5 = $3[9];
  let t6;
  if ($3[10] !== store || $3[11] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime155.jsxDEV(HasAppStateContext.Provider, {
      value: !0,
      children: /* @__PURE__ */ jsx_dev_runtime155.jsxDEV(AppStoreContext.Provider, {
        value: store,
        children: t5
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[10] = store, $3[11] = t5, $3[12] = t6;
  else
    t6 = $3[12];
  return t6;
}
function _temp55(prev) {
  return {
    ...prev,
    toolPermissionContext: createDisabledBypassPermissionsContext(prev.toolPermissionContext)
  };
}
function useAppStore() {
  let store = import_react83.useContext(AppStoreContext);
  if (!store)
    throw ReferenceError("useAppState/useSetAppState cannot be called outside of an <AppStateProvider />");
  return store;
}
function useAppState(selector) {
  let $3 = import_compiler_runtime123.c(3), store = useAppStore(), t0;
  if ($3[0] !== selector || $3[1] !== store)
    t0 = () => {
      let state3 = store.getState();
      return selector(state3);
    }, $3[0] = selector, $3[1] = store, $3[2] = t0;
  else
    t0 = $3[2];
  let get2 = t0;
  return import_react83.useSyncExternalStore(store.subscribe, get2, get2);
}
function useSetAppState() {
  return useAppStore().setState;
}
function useAppStateStore() {
  return useAppStore();
}
function useAppStateMaybeOutsideOfProvider(selector) {
  let $3 = import_compiler_runtime123.c(3), store = import_react83.useContext(AppStoreContext), t0;
  if ($3[0] !== selector || $3[1] !== store)
    t0 = () => store ? selector(store.getState()) : void 0, $3[0] = selector, $3[1] = store, $3[2] = t0;
  else
    t0 = $3[2];
  return import_react83.useSyncExternalStore(store ? store.subscribe : NOOP_SUBSCRIBE2, t0);
}
var import_compiler_runtime123, import_react83, jsx_dev_runtime155, VoiceProvider2, AppStoreContext, HasAppStateContext, NOOP_SUBSCRIBE2 = () => () => {};
var init_AppState = __esm(() => {
  init_mailbox2();
  init_useSettingsChange();
  init_debug();
  init_permissionSetup();
  init_applySettingsChange();
  init_AppStateStore();
  init_AppStateStore();
  import_compiler_runtime123 = __toESM(require_react_compiler_runtime_development(), 1), import_react83 = __toESM(require_react_development(), 1), jsx_dev_runtime155 = __toESM(require_react_jsx_dev_runtime_development(), 1), VoiceProvider2 = (init_voice(), __toCommonJS(exports_voice)).VoiceProvider, AppStoreContext = import_react83.default.createContext(null), HasAppStateContext = import_react83.default.createContext(!1);
});
