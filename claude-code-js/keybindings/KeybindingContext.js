// Original: src/keybindings/KeybindingContext.tsx
function KeybindingProvider(t0) {
  let $3 = import_compiler_runtime19.c(24), {
    bindings,
    pendingChordRef,
    pendingChord,
    setPendingChord,
    activeContexts,
    registerActiveContext,
    unregisterActiveContext,
    handlerRegistryRef,
    children
  } = t0, t1;
  if ($3[0] !== bindings)
    t1 = (action, context3) => getBindingDisplayText(action, context3, bindings), $3[0] = bindings, $3[1] = t1;
  else
    t1 = $3[1];
  let getDisplay = t1, t2;
  if ($3[2] !== handlerRegistryRef)
    t2 = (registration) => {
      let registry2 = handlerRegistryRef.current;
      if (!registry2)
        return _temp4;
      if (!registry2.has(registration.action))
        registry2.set(registration.action, /* @__PURE__ */ new Set);
      return registry2.get(registration.action).add(registration), () => {
        let handlers = registry2.get(registration.action);
        if (handlers) {
          if (handlers.delete(registration), handlers.size === 0)
            registry2.delete(registration.action);
        }
      };
    }, $3[2] = handlerRegistryRef, $3[3] = t2;
  else
    t2 = $3[3];
  let registerHandler = t2, t3;
  if ($3[4] !== activeContexts || $3[5] !== handlerRegistryRef)
    t3 = (action_0) => {
      let registry_0 = handlerRegistryRef.current;
      if (!registry_0)
        return !1;
      let handlers_0 = registry_0.get(action_0);
      if (!handlers_0 || handlers_0.size === 0)
        return !1;
      for (let registration_0 of handlers_0)
        if (activeContexts.has(registration_0.context))
          return registration_0.handler(), !0;
      return !1;
    }, $3[4] = activeContexts, $3[5] = handlerRegistryRef, $3[6] = t3;
  else
    t3 = $3[6];
  let invokeAction = t3, t4;
  if ($3[7] !== bindings || $3[8] !== pendingChordRef)
    t4 = (input, key2, contexts) => resolveKeyWithChordState(input, key2, contexts, bindings, pendingChordRef.current), $3[7] = bindings, $3[8] = pendingChordRef, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] !== activeContexts || $3[11] !== bindings || $3[12] !== getDisplay || $3[13] !== invokeAction || $3[14] !== pendingChord || $3[15] !== registerActiveContext || $3[16] !== registerHandler || $3[17] !== setPendingChord || $3[18] !== t4 || $3[19] !== unregisterActiveContext)
    t5 = {
      resolve: t4,
      setPendingChord,
      getDisplayText: getDisplay,
      bindings,
      pendingChord,
      activeContexts,
      registerActiveContext,
      unregisterActiveContext,
      registerHandler,
      invokeAction
    }, $3[10] = activeContexts, $3[11] = bindings, $3[12] = getDisplay, $3[13] = invokeAction, $3[14] = pendingChord, $3[15] = registerActiveContext, $3[16] = registerHandler, $3[17] = setPendingChord, $3[18] = t4, $3[19] = unregisterActiveContext, $3[20] = t5;
  else
    t5 = $3[20];
  let value = t5, t6;
  if ($3[21] !== children || $3[22] !== value)
    t6 = /* @__PURE__ */ jsx_dev_runtime22.jsxDEV(KeybindingContext.Provider, {
      value,
      children
    }, void 0, !1, void 0, this), $3[21] = children, $3[22] = value, $3[23] = t6;
  else
    t6 = $3[23];
  return t6;
}
function _temp4() {}
function useOptionalKeybindingContext() {
  return import_react31.useContext(KeybindingContext);
}
function useRegisterKeybindingContext(context3, t0) {
  let $3 = import_compiler_runtime19.c(5), isActive = t0 === void 0 ? !0 : t0, keybindingContext = useOptionalKeybindingContext(), t1, t2;
  if ($3[0] !== context3 || $3[1] !== isActive || $3[2] !== keybindingContext)
    t1 = () => {
      if (!keybindingContext || !isActive)
        return;
      return keybindingContext.registerActiveContext(context3), () => {
        keybindingContext.unregisterActiveContext(context3);
      };
    }, t2 = [context3, keybindingContext, isActive], $3[0] = context3, $3[1] = isActive, $3[2] = keybindingContext, $3[3] = t1, $3[4] = t2;
  else
    t1 = $3[3], t2 = $3[4];
  import_react31.useLayoutEffect(t1, t2);
}
var import_compiler_runtime19, import_react31, jsx_dev_runtime22, KeybindingContext;
var init_KeybindingContext = __esm(() => {
  init_resolver();
  import_compiler_runtime19 = __toESM(require_react_compiler_runtime_development(), 1), import_react31 = __toESM(require_react_development(), 1), jsx_dev_runtime22 = __toESM(require_react_jsx_dev_runtime_development(), 1), KeybindingContext = import_react31.createContext(null);
});
