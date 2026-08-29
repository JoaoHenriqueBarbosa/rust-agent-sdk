// Original: src/ink/events/dispatcher.ts
function getHandler(node, eventType, capture) {
  let handlers = node._eventHandlers;
  if (!handlers)
    return;
  let mapping = HANDLER_FOR_EVENT[eventType];
  if (!mapping)
    return;
  let propName = capture ? mapping.capture : mapping.bubble;
  if (!propName)
    return;
  return handlers[propName];
}
function collectListeners(target, event) {
  let listeners = [], node = target;
  while (node) {
    let isTarget = node === target, captureHandler = getHandler(node, event.type, !0), bubbleHandler = getHandler(node, event.type, !1);
    if (captureHandler)
      listeners.unshift({
        node,
        handler: captureHandler,
        phase: isTarget ? "at_target" : "capturing"
      });
    if (bubbleHandler && (event.bubbles || isTarget))
      listeners.push({
        node,
        handler: bubbleHandler,
        phase: isTarget ? "at_target" : "bubbling"
      });
    node = node.parentNode;
  }
  return listeners;
}
function processDispatchQueue(listeners, event) {
  let previousNode;
  for (let { node, handler, phase } of listeners) {
    if (event._isImmediatePropagationStopped())
      break;
    if (event._isPropagationStopped() && node !== previousNode)
      break;
    event._setEventPhase(phase), event._setCurrentTarget(node), event._prepareForTarget(node);
    try {
      handler(event);
    } catch (error44) {
      logError2(error44);
    }
    previousNode = node;
  }
}
function getEventPriority(eventType) {
  switch (eventType) {
    case "keydown":
    case "keyup":
    case "click":
    case "focus":
    case "blur":
    case "paste":
      return import_constants36.DiscreteEventPriority;
    case "resize":
    case "scroll":
    case "mousemove":
      return import_constants36.ContinuousEventPriority;
    default:
      return import_constants36.DefaultEventPriority;
  }
}

class Dispatcher {
  currentEvent = null;
  currentUpdatePriority = import_constants36.DefaultEventPriority;
  discreteUpdates = null;
  resolveEventPriority() {
    if (this.currentUpdatePriority !== import_constants36.NoEventPriority)
      return this.currentUpdatePriority;
    if (this.currentEvent)
      return getEventPriority(this.currentEvent.type);
    return import_constants36.DefaultEventPriority;
  }
  dispatch(target, event) {
    let previousEvent = this.currentEvent;
    this.currentEvent = event;
    try {
      event._setTarget(target);
      let listeners = collectListeners(target, event);
      return processDispatchQueue(listeners, event), event._setEventPhase("none"), event._setCurrentTarget(null), !event.defaultPrevented;
    } finally {
      this.currentEvent = previousEvent;
    }
  }
  dispatchDiscrete(target, event) {
    if (!this.discreteUpdates)
      return this.dispatch(target, event);
    return this.discreteUpdates((t2, e) => this.dispatch(t2, e), target, event, void 0, void 0);
  }
  dispatchContinuous(target, event) {
    let previousPriority = this.currentUpdatePriority;
    try {
      return this.currentUpdatePriority = import_constants36.ContinuousEventPriority, this.dispatch(target, event);
    } finally {
      this.currentUpdatePriority = previousPriority;
    }
  }
}
var import_constants36;
var init_dispatcher = __esm(() => {
  init_log3();
  init_event_handlers();
  import_constants36 = __toESM(require_react_reconciler_constants_development(), 1);
});
