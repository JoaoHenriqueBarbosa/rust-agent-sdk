// Original: src/hooks/useSkillsChange.ts
function useSkillsChange(cwd2, onCommandsChange) {
  let handleChange5 = import_react273.useCallback(async () => {
    if (!cwd2)
      return;
    try {
      clearCommandsCache();
      let commands7 = await getCommands(cwd2);
      onCommandsChange(commands7);
    } catch (error44) {
      if (error44 instanceof Error)
        logError2(error44);
    }
  }, [cwd2, onCommandsChange]);
  import_react273.useEffect(() => skillChangeDetector.subscribe(handleChange5), [handleChange5]);
}
var import_react273;
var init_useSkillsChange = __esm(() => {
  init_commands5();
  init_log3();
  init_skillChangeDetector();
  import_react273 = __toESM(require_react_development(), 1);
});
