// Original: src/utils/semanticBoolean.ts
function semanticBoolean(inner = exports_external.boolean()) {
  return exports_external.preprocess((v2) => v2 === "true" ? !0 : v2 === "false" ? !1 : v2, inner);
}
var init_semanticBoolean = __esm(() => {
  init_v4();
});
