// Original: src/hooks/useCommandKeybindings.tsx
function CommandKeybindingHandlers(t0) {
  let $3 = import_compiler_runtime335.c(8), {
    onSubmit,
    isActive: t1
  } = t0, isActive = t1 === void 0 ? !0 : t1, keybindingContext = useOptionalKeybindingContext(), isModalOverlayActive = useIsModalOverlayActive(), t2;
  bb0: {
    if (!keybindingContext) {
      let t32;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t32 = /* @__PURE__ */ new Set, $3[0] = t32;
      else
        t32 = $3[0];
      t2 = t32;
      break bb0;
    }
    let actions;
    if ($3[1] !== keybindingContext.bindings) {
      actions = /* @__PURE__ */ new Set;
      for (let binding of keybindingContext.bindings)
        if (binding.action?.startsWith("command:"))
          actions.add(binding.action);
      $3[1] = keybindingContext.bindings, $3[2] = actions;
    } else
      actions = $3[2];
    t2 = actions;
  }
  let commandActions = t2, map8;
  if ($3[3] !== commandActions || $3[4] !== onSubmit) {
    map8 = {};
    for (let action2 of commandActions) {
      let commandName = action2.slice(8);
      map8[action2] = () => {
        onSubmit(`/${commandName}`, NOOP_HELPERS, void 0, {
          fromKeybinding: !0
        });
      };
    }
    $3[3] = commandActions, $3[4] = onSubmit, $3[5] = map8;
  } else
    map8 = $3[5];
  let handlers = map8, t3 = isActive && !isModalOverlayActive, t4;
  if ($3[6] !== t3)
    t4 = {
      context: "Chat",
      isActive: t3
    }, $3[6] = t3, $3[7] = t4;
  else
    t4 = $3[7];
  return useKeybindings(handlers, t4), null;
}
var import_compiler_runtime335, NOOP_HELPERS;
var init_useCommandKeybindings = __esm(() => {
  init_overlayContext();
  init_KeybindingContext();
  init_useKeybinding();
  import_compiler_runtime335 = __toESM(require_react_compiler_runtime_development(), 1), NOOP_HELPERS = {
    setCursorOffset: () => {},
    clearBuffer: () => {},
    resetHistory: () => {}
  };
});
