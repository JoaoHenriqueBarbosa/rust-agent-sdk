// Original: src/utils/attribution.ts
function getAttributionTexts() {
  return { commit: "", pr: "" };
}
async function getEnhancedPRAttribution(_getAppState) {
  return "";
}
var init_attribution = __esm(() => {
  init_xml();
  init_prompt2();
  init_prompt4();
  init_prompt5();
  init_commitAttribution();
  init_json();
  init_log3();
  init_sessionFileAccessHooks();
  init_sessionStorage();
  init_sessionStoragePortable();
});
