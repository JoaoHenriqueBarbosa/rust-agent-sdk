// Original: src/components/Spinner/useStalledAnimation.ts
function useStalledAnimation(time3, currentResponseLength, hasActiveTools = !1, reducedMotion = !1) {
  let lastTokenTime = import_react53.useRef(time3), lastResponseLength = import_react53.useRef(currentResponseLength), mountTime = import_react53.useRef(time3), stalledIntensityRef = import_react53.useRef(0), lastSmoothTime = import_react53.useRef(time3);
  if (currentResponseLength > lastResponseLength.current)
    lastTokenTime.current = time3, lastResponseLength.current = currentResponseLength, stalledIntensityRef.current = 0, lastSmoothTime.current = time3;
  let timeSinceLastToken;
  if (hasActiveTools)
    timeSinceLastToken = 0, lastTokenTime.current = time3;
  else if (currentResponseLength > 0)
    timeSinceLastToken = time3 - lastTokenTime.current;
  else
    timeSinceLastToken = time3 - mountTime.current;
  let isStalled = timeSinceLastToken > 3000 && !hasActiveTools, intensity = isStalled ? Math.min((timeSinceLastToken - 3000) / 2000, 1) : 0;
  if (!reducedMotion && (intensity > 0 || stalledIntensityRef.current > 0)) {
    let dt = time3 - lastSmoothTime.current;
    if (dt >= 50) {
      let steps = Math.floor(dt / 50), current = stalledIntensityRef.current;
      for (let i5 = 0;i5 < steps; i5++) {
        let diff2 = intensity - current;
        if (Math.abs(diff2) < 0.01) {
          current = intensity;
          break;
        }
        current += diff2 * 0.1;
      }
      stalledIntensityRef.current = current, lastSmoothTime.current = time3;
    }
  } else
    stalledIntensityRef.current = intensity, lastSmoothTime.current = time3;
  let effectiveIntensity = reducedMotion ? intensity : stalledIntensityRef.current;
  return { isStalled, stalledIntensity: effectiveIntensity };
}
var import_react53;
var init_useStalledAnimation = __esm(() => {
  import_react53 = __toESM(require_react_development(), 1);
});
