// function: dispatch
function dispatch(event, listener2) {
  if (typeof listener2 === "function")
    listener2.call(event.target, event);
  else
    listener2.handleEvent(event);
  return event._stopImmediatePropagationFlag;
}
