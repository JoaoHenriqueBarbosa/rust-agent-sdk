// var: onAbortedSignal
var onAbortedSignal = async (mainSignal, stopSignal) => {
  if (!mainSignal.aborted)
    await once(mainSignal, "abort", { signal: stopSignal });
};
