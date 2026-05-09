// Original: src/hooks/useExitOnCtrlCDWithKeybindings.ts
function useExitOnCtrlCDWithKeybindings(onExit2, onInterrupt, isActive) {
  return useExitOnCtrlCD(useKeybindings, onInterrupt, onExit2, isActive);
}
var init_useExitOnCtrlCDWithKeybindings = __esm(() => {
  init_useKeybinding();
  init_useExitOnCtrlCD();
});
