// function: throwIfCancellationRequested
function throwIfCancellationRequested(config2) {
  if (config2.cancelToken)
    config2.cancelToken.throwIfRequested();
  if (config2.signal && config2.signal.aborted)
    throw new CanceledError_default(null, config2);
}
