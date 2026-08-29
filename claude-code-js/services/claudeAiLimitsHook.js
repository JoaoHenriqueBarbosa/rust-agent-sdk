// Original: src/services/claudeAiLimitsHook.ts
function useClaudeAiLimits() {
  let [limits, setLimits] = import_react61.useState({ ...currentLimits });
  return import_react61.useEffect(() => {
    let listener2 = (newLimits) => {
      setLimits({ ...newLimits });
    };
    return statusListeners.add(listener2), () => {
      statusListeners.delete(listener2);
    };
  }, []), limits;
}
var import_react61;
var init_claudeAiLimitsHook = __esm(() => {
  init_claudeAiLimits();
  import_react61 = __toESM(require_react_development(), 1);
});
