// Original: src/utils/settings/internalWrites.ts
function markInternalWrite(path9) {
  timestamps.set(path9, Date.now());
}
function consumeInternalWrite(path9, windowMs) {
  let ts = timestamps.get(path9);
  if (ts !== void 0 && Date.now() - ts < windowMs)
    return timestamps.delete(path9), !0;
  return !1;
}
function clearInternalWrites() {
  timestamps.clear();
}
var timestamps;
var init_internalWrites = __esm(() => {
  timestamps = /* @__PURE__ */ new Map;
});
