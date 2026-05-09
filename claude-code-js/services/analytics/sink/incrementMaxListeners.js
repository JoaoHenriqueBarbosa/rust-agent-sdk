// var: incrementMaxListeners
var incrementMaxListeners = (eventEmitter, maxListenersIncrement, signal) => {
  let maxListeners = eventEmitter.getMaxListeners();
  if (maxListeners === 0 || maxListeners === Number.POSITIVE_INFINITY)
    return;
  eventEmitter.setMaxListeners(maxListeners + maxListenersIncrement), addAbortListener(signal, () => {
    eventEmitter.setMaxListeners(eventEmitter.getMaxListeners() - maxListenersIncrement);
  });
};
