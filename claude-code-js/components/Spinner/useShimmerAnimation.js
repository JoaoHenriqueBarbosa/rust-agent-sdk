// Original: src/components/Spinner/useShimmerAnimation.ts
function useShimmerAnimation(mode, message, isStalled) {
  let glimmerSpeed = mode === "requesting" ? 50 : 200, [ref, time3] = useAnimationFrame(isStalled ? null : glimmerSpeed), messageWidth = import_react52.useMemo(() => stringWidth(message), [message]);
  if (isStalled)
    return [ref, -100];
  let cyclePosition = Math.floor(time3 / glimmerSpeed), cycleLength = messageWidth + 20;
  if (mode === "requesting")
    return [ref, cyclePosition % cycleLength - 10];
  return [ref, messageWidth + 10 - cyclePosition % cycleLength];
}
var import_react52;
var init_useShimmerAnimation = __esm(() => {
  init_stringWidth();
  init_ink2();
  import_react52 = __toESM(require_react_development(), 1);
});
