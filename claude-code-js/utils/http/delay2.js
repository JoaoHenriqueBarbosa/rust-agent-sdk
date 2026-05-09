// function: delay2
function delay2(timeInMs, options) {
  let token, { abortSignal, abortErrorMsg } = options ?? {};
  return createAbortablePromise((resolve9) => {
    token = setTimeout(resolve9, timeInMs);
  }, {
    cleanupBeforeAbort: () => clearTimeout(token),
    abortSignal,
    abortErrorMsg: abortErrorMsg ?? StandardAbortMessage
  });
}
