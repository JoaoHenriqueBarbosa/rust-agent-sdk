// Original: src/utils/extraUsage.ts
function isBilledAsExtraUsage(model, isFastMode, isOpus1mMerged) {
  if (!isClaudeAISubscriber())
    return !1;
  if (isFastMode)
    return !0;
  if (model === null || !has1mContext(model))
    return !1;
  let m4 = model.toLowerCase().replace(/\[1m\]$/, "").trim(), isOpus46 = m4 === "opus" || m4.includes("opus-4-6"), isSonnet46 = m4 === "sonnet" || m4.includes("sonnet-4-6");
  if (isOpus46 && isOpus1mMerged)
    return !1;
  return isOpus46 || isSonnet46;
}
var init_extraUsage = __esm(() => {
  init_auth14();
  init_context();
});
