// Original: src/utils/semanticNumber.ts
function semanticNumber(inner = exports_external.number()) {
  return exports_external.preprocess((v2) => {
    if (typeof v2 === "string" && /^-?\d+(\.\d+)?$/.test(v2)) {
      let n5 = Number(v2);
      if (Number.isFinite(n5))
        return n5;
    }
    return v2;
  }, inner);
}
var init_semanticNumber = __esm(() => {
  init_v4();
});
