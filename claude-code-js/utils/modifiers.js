// Original: src/utils/modifiers.ts
function prewarmModifiers() {
  if (prewarmed || process.platform !== "darwin")
    return;
  prewarmed = !0;
  try {
    let { prewarm } = __require("modifiers-napi");
    prewarm();
  } catch {}
}
function isModifierPressed(modifier) {
  if (process.platform !== "darwin")
    return !1;
  let { isModifierPressed: nativeIsModifierPressed } = __require("modifiers-napi");
  return nativeIsModifierPressed(modifier);
}
var prewarmed = !1;
