// Original: src/hooks/useSettingsChange.ts
function useSettingsChange(onChange) {
  let handleChange2 = import_react30.useCallback((source) => {
    let newSettings = getSettings_DEPRECATED();
    onChange(source, newSettings);
  }, [onChange]);
  import_react30.useEffect(() => settingsChangeDetector.subscribe(handleChange2), [handleChange2]);
}
var import_react30;
var init_useSettingsChange = __esm(() => {
  init_changeDetector();
  init_settings2();
  import_react30 = __toESM(require_react_development(), 1);
});

// node_modules/lodash-es/last.js
function last(array2) {
  var length = array2 == null ? 0 : array2.length;
  return length ? array2[length - 1] : void 0;
}
var last_default;
var init_last = __esm(() => {
  last_default = last;
});
