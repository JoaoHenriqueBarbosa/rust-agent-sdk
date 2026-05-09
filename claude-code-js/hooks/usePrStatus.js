// Original: src/hooks/usePrStatus.ts
function usePrStatus(isLoading, enabled2 = !0) {
  let [prStatus, setPrStatus] = import_react250.useState(INITIAL_STATE4), timeoutRef = import_react250.useRef(null), disabledRef = import_react250.useRef(!1), lastFetchRef = import_react250.useRef(0);
  return import_react250.useEffect(() => {
    if (!enabled2)
      return;
    if (disabledRef.current)
      return;
    let cancelled = !1, lastSeenInteractionTime = -1, lastActivityTimestamp = Date.now();
    async function poll() {
      if (cancelled)
        return;
      let currentInteractionTime = getLastInteractionTime();
      if (lastSeenInteractionTime !== currentInteractionTime)
        lastSeenInteractionTime = currentInteractionTime, lastActivityTimestamp = Date.now();
      else if (Date.now() - lastActivityTimestamp >= IDLE_STOP_MS)
        return;
      let start = Date.now(), result = await fetchPrStatus();
      if (cancelled)
        return;
      if (lastFetchRef.current = start, setPrStatus((prev) => {
        let newNumber = result?.number ?? null, newReviewState = result?.reviewState ?? null;
        if (prev.number === newNumber && prev.reviewState === newReviewState)
          return prev;
        return {
          number: newNumber,
          url: result?.url ?? null,
          reviewState: newReviewState,
          lastUpdated: Date.now()
        };
      }), Date.now() - start > SLOW_GH_THRESHOLD_MS) {
        disabledRef.current = !0;
        return;
      }
      if (!cancelled)
        timeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS3);
    }
    let elapsed = Date.now() - lastFetchRef.current;
    if (elapsed >= POLL_INTERVAL_MS3)
      poll();
    else
      timeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS3 - elapsed);
    return () => {
      if (cancelled = !0, timeoutRef.current)
        clearTimeout(timeoutRef.current), timeoutRef.current = null;
    };
  }, [isLoading, enabled2]), prStatus;
}
var import_react250, POLL_INTERVAL_MS3 = 60000, SLOW_GH_THRESHOLD_MS = 4000, IDLE_STOP_MS = 3600000, INITIAL_STATE4;
var init_usePrStatus = __esm(() => {
  init_state();
  init_ghPrStatus();
  import_react250 = __toESM(require_react_development(), 1), INITIAL_STATE4 = {
    number: null,
    url: null,
    reviewState: null,
    lastUpdated: 0
  };
});
