// Original: src/keybindings/KeybindingProviderSetup.tsx
function useKeybindingWarnings(warnings, isReload) {
  let $3 = import_compiler_runtime53.c(9), {
    addNotification,
    removeNotification
  } = useNotifications(), t0;
  if ($3[0] !== addNotification || $3[1] !== removeNotification || $3[2] !== warnings)
    t0 = () => {
      if (warnings.length === 0) {
        removeNotification("keybinding-config-warning");
        return;
      }
      let errorCount = count2(warnings, _temp13), warnCount = count2(warnings, _temp24), message;
      if (errorCount > 0 && warnCount > 0)
        message = `Found ${errorCount} keybinding ${plural(errorCount, "error")} and ${warnCount} ${plural(warnCount, "warning")}`;
      else if (errorCount > 0)
        message = `Found ${errorCount} keybinding ${plural(errorCount, "error")}`;
      else
        message = `Found ${warnCount} keybinding ${plural(warnCount, "warning")}`;
      message = message + " \xB7 /doctor for details", addNotification({
        key: "keybinding-config-warning",
        text: message,
        color: errorCount > 0 ? "error" : "warning",
        priority: errorCount > 0 ? "immediate" : "high",
        timeoutMs: 60000
      });
    }, $3[0] = addNotification, $3[1] = removeNotification, $3[2] = warnings, $3[3] = t0;
  else
    t0 = $3[3];
  let t1;
  if ($3[4] !== addNotification || $3[5] !== isReload || $3[6] !== removeNotification || $3[7] !== warnings)
    t1 = [warnings, isReload, addNotification, removeNotification], $3[4] = addNotification, $3[5] = isReload, $3[6] = removeNotification, $3[7] = warnings, $3[8] = t1;
  else
    t1 = $3[8];
  import_react50.useEffect(t0, t1);
}
function _temp24(w_0) {
  return w_0.severity === "warning";
}
function _temp13(w2) {
  return w2.severity === "error";
}
function KeybindingSetup({
  children
}) {
  let [{
    bindings,
    warnings
  }, setLoadResult] = import_react50.useState(() => {
    let result = loadKeybindingsSyncWithWarnings();
    return logForDebugging(`[keybindings] KeybindingSetup initialized with ${result.bindings.length} bindings, ${result.warnings.length} warnings`), result;
  }), [isReload, setIsReload] = import_react50.useState(!1);
  useKeybindingWarnings(warnings, isReload);
  let pendingChordRef = import_react50.useRef(null), [pendingChord, setPendingChordState] = import_react50.useState(null), chordTimeoutRef = import_react50.useRef(null), handlerRegistryRef = import_react50.useRef(/* @__PURE__ */ new Map), activeContextsRef = import_react50.useRef(/* @__PURE__ */ new Set), registerActiveContext = import_react50.useCallback((context3) => {
    activeContextsRef.current.add(context3);
  }, []), unregisterActiveContext = import_react50.useCallback((context_0) => {
    activeContextsRef.current.delete(context_0);
  }, []), clearChordTimeout = import_react50.useCallback(() => {
    if (chordTimeoutRef.current)
      clearTimeout(chordTimeoutRef.current), chordTimeoutRef.current = null;
  }, []), setPendingChord = import_react50.useCallback((pending) => {
    if (clearChordTimeout(), pending !== null)
      chordTimeoutRef.current = setTimeout((pendingChordRef_0, setPendingChordState_0) => {
        logForDebugging("[keybindings] Chord timeout - cancelling"), pendingChordRef_0.current = null, setPendingChordState_0(null);
      }, CHORD_TIMEOUT_MS, pendingChordRef, setPendingChordState);
    pendingChordRef.current = pending, setPendingChordState(pending);
  }, [clearChordTimeout]);
  return import_react50.useEffect(() => {
    initializeKeybindingWatcher();
    let unsubscribe = subscribeToKeybindingChanges((result_0) => {
      setIsReload(!0), setLoadResult(result_0), logForDebugging(`[keybindings] Reloaded: ${result_0.bindings.length} bindings, ${result_0.warnings.length} warnings`);
    });
    return () => {
      unsubscribe(), clearChordTimeout();
    };
  }, [clearChordTimeout]), /* @__PURE__ */ jsx_dev_runtime58.jsxDEV(KeybindingProvider, {
    bindings,
    pendingChordRef,
    pendingChord,
    setPendingChord,
    activeContexts: activeContextsRef.current,
    registerActiveContext,
    unregisterActiveContext,
    handlerRegistryRef,
    children: [
      /* @__PURE__ */ jsx_dev_runtime58.jsxDEV(ChordInterceptor, {
        bindings,
        pendingChordRef,
        setPendingChord,
        activeContexts: activeContextsRef.current,
        handlerRegistryRef
      }, void 0, !1, void 0, this),
      children
    ]
  }, void 0, !0, void 0, this);
}
function ChordInterceptor(t0) {
  let $3 = import_compiler_runtime53.c(6), {
    bindings,
    pendingChordRef,
    setPendingChord,
    activeContexts,
    handlerRegistryRef
  } = t0, t1;
  if ($3[0] !== activeContexts || $3[1] !== bindings || $3[2] !== handlerRegistryRef || $3[3] !== pendingChordRef || $3[4] !== setPendingChord)
    t1 = (input, key2, event) => {
      if ((key2.wheelUp || key2.wheelDown) && pendingChordRef.current === null)
        return;
      let registry2 = handlerRegistryRef.current, handlerContexts = /* @__PURE__ */ new Set;
      if (registry2)
        for (let handlers of registry2.values())
          for (let registration of handlers)
            handlerContexts.add(registration.context);
      let contexts = [...handlerContexts, ...activeContexts, "Global"], wasInChord = pendingChordRef.current !== null, result = resolveKeyWithChordState(input, key2, contexts, bindings, pendingChordRef.current);
      bb23:
        switch (result.type) {
          case "chord_started": {
            setPendingChord(result.pending), event.stopImmediatePropagation();
            break bb23;
          }
          case "match": {
            if (setPendingChord(null), wasInChord) {
              let contextsSet = new Set(contexts);
              if (registry2) {
                let handlers_0 = registry2.get(result.action);
                if (handlers_0 && handlers_0.size > 0) {
                  for (let registration_0 of handlers_0)
                    if (contextsSet.has(registration_0.context)) {
                      registration_0.handler(), event.stopImmediatePropagation();
                      break;
                    }
                }
              }
            }
            break bb23;
          }
          case "chord_cancelled": {
            setPendingChord(null), event.stopImmediatePropagation();
            break bb23;
          }
          case "unbound": {
            setPendingChord(null), event.stopImmediatePropagation();
            break bb23;
          }
          case "none":
        }
    }, $3[0] = activeContexts, $3[1] = bindings, $3[2] = handlerRegistryRef, $3[3] = pendingChordRef, $3[4] = setPendingChord, $3[5] = t1;
  else
    t1 = $3[5];
  return use_input_default(t1), null;
}
var import_compiler_runtime53, import_react50, jsx_dev_runtime58, CHORD_TIMEOUT_MS = 1000;
var init_KeybindingProviderSetup = __esm(() => {
  init_notifications();
  init_ink2();
  init_debug();
  init_KeybindingContext();
  init_loadUserBindings();
  init_resolver();
  import_compiler_runtime53 = __toESM(require_react_compiler_runtime_development(), 1), import_react50 = __toESM(require_react_development(), 1), jsx_dev_runtime58 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
