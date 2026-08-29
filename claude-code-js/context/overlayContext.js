// Original: src/context/overlayContext.tsx
function useRegisterOverlay(id, t0) {
  let $3 = import_compiler_runtime47.c(8), enabled2 = t0 === void 0 ? !0 : t0, setAppState = import_react44.useContext(AppStoreContext)?.setState, t1, t2;
  if ($3[0] !== enabled2 || $3[1] !== id || $3[2] !== setAppState)
    t1 = () => {
      if (!enabled2 || !setAppState)
        return;
      return setAppState((prev) => {
        if (prev.activeOverlays.has(id))
          return prev;
        let next = new Set(prev.activeOverlays);
        return next.add(id), {
          ...prev,
          activeOverlays: next
        };
      }), () => {
        setAppState((prev_0) => {
          if (!prev_0.activeOverlays.has(id))
            return prev_0;
          let next_0 = new Set(prev_0.activeOverlays);
          return next_0.delete(id), {
            ...prev_0,
            activeOverlays: next_0
          };
        });
      };
    }, t2 = [id, enabled2, setAppState], $3[0] = enabled2, $3[1] = id, $3[2] = setAppState, $3[3] = t1, $3[4] = t2;
  else
    t1 = $3[3], t2 = $3[4];
  import_react44.useEffect(t1, t2);
  let t3, t4;
  if ($3[5] !== enabled2)
    t3 = () => {
      if (!enabled2)
        return;
      return _temp7;
    }, t4 = [enabled2], $3[5] = enabled2, $3[6] = t3, $3[7] = t4;
  else
    t3 = $3[6], t4 = $3[7];
  import_react44.useLayoutEffect(t3, t4);
}
function _temp7() {
  return instances_default.get(process.stdout)?.invalidatePrevFrame();
}
function useIsOverlayActive() {
  return useAppState(_temp22);
}
function _temp22(s2) {
  return s2.activeOverlays.size > 0;
}
function useIsModalOverlayActive() {
  return useAppState(_temp32);
}
function _temp32(s2) {
  for (let id of s2.activeOverlays)
    if (!NON_MODAL_OVERLAYS.has(id))
      return !0;
  return !1;
}
var import_compiler_runtime47, import_react44, NON_MODAL_OVERLAYS;
var init_overlayContext = __esm(() => {
  init_instances();
  init_AppState();
  import_compiler_runtime47 = __toESM(require_react_compiler_runtime_development(), 1), import_react44 = __toESM(require_react_development(), 1), NON_MODAL_OVERLAYS = /* @__PURE__ */ new Set(["autocomplete"]);
});
