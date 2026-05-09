// Original: src/keybindings/useKeybinding.ts
function useKeybinding(action, handler, options2 = {}) {
  let { context: context3 = "Global", isActive = !0 } = options2, keybindingContext = useOptionalKeybindingContext();
  import_react33.useEffect(() => {
    if (!keybindingContext || !isActive)
      return;
    return keybindingContext.registerHandler({ action, context: context3, handler });
  }, [action, context3, handler, keybindingContext, isActive]);
  let handleInput = import_react33.useCallback((input, key2, event) => {
    if (!keybindingContext)
      return;
    let contextsToCheck = [
      ...keybindingContext.activeContexts,
      context3,
      "Global"
    ], uniqueContexts = [...new Set(contextsToCheck)], result = keybindingContext.resolve(input, key2, uniqueContexts);
    switch (result.type) {
      case "match":
        if (keybindingContext.setPendingChord(null), result.action === action) {
          if (handler() !== !1)
            event.stopImmediatePropagation();
        }
        break;
      case "chord_started":
        keybindingContext.setPendingChord(result.pending), event.stopImmediatePropagation();
        break;
      case "chord_cancelled":
        keybindingContext.setPendingChord(null);
        break;
      case "unbound":
        keybindingContext.setPendingChord(null), event.stopImmediatePropagation();
        break;
      case "none":
        break;
    }
  }, [action, context3, handler, keybindingContext]);
  use_input_default(handleInput, { isActive });
}
function useKeybindings(handlers, options2 = {}) {
  let { context: context3 = "Global", isActive = !0 } = options2, keybindingContext = useOptionalKeybindingContext();
  import_react33.useEffect(() => {
    if (!keybindingContext || !isActive)
      return;
    let unregisterFns = [];
    for (let [action, handler] of Object.entries(handlers))
      unregisterFns.push(keybindingContext.registerHandler({ action, context: context3, handler }));
    return () => {
      for (let unregister of unregisterFns)
        unregister();
    };
  }, [context3, handlers, keybindingContext, isActive]);
  let handleInput = import_react33.useCallback((input, key2, event) => {
    if (!keybindingContext)
      return;
    let contextsToCheck = [
      ...keybindingContext.activeContexts,
      context3,
      "Global"
    ], uniqueContexts = [...new Set(contextsToCheck)], result = keybindingContext.resolve(input, key2, uniqueContexts);
    switch (result.type) {
      case "match":
        if (keybindingContext.setPendingChord(null), result.action in handlers) {
          let handler = handlers[result.action];
          if (handler && handler() !== !1)
            event.stopImmediatePropagation();
        }
        break;
      case "chord_started":
        keybindingContext.setPendingChord(result.pending), event.stopImmediatePropagation();
        break;
      case "chord_cancelled":
        keybindingContext.setPendingChord(null);
        break;
      case "unbound":
        keybindingContext.setPendingChord(null), event.stopImmediatePropagation();
        break;
      case "none":
        break;
    }
  }, [context3, handlers, keybindingContext]);
  use_input_default(handleInput, { isActive });
}
var import_react33;
var init_useKeybinding = __esm(() => {
  init_ink2();
  init_KeybindingContext();
  import_react33 = __toESM(require_react_development(), 1);
});
