// Original: src/hooks/useMainLoopModel.ts
function useMainLoopModel() {
  let mainLoopModel = useAppState((s2) => s2.mainLoopModel), mainLoopModelForSession = useAppState((s2) => s2.mainLoopModelForSession);
  return parseUserSpecifiedModel(mainLoopModelForSession ?? mainLoopModel ?? getDefaultMainLoopModelSetting());
}
var init_useMainLoopModel = __esm(() => {
  init_AppState();
  init_model();
});
