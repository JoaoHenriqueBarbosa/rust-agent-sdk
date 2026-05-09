// function: invokeListeners
function invokeListeners({ currentTarget, target }) {
  let map8 = wm.get(currentTarget);
  if (map8 && map8.has(this.type)) {
    let listeners = map8.get(this.type);
    if (currentTarget === target)
      this.eventPhase = this.AT_TARGET;
    else
      this.eventPhase = this.BUBBLING_PHASE;
    this.currentTarget = currentTarget, this.target = target;
    for (let [listener2, options2] of listeners) {
      if (options2 && options2.once)
        listeners.delete(listener2);
      if (dispatch(this, listener2))
        break;
    }
    return delete this.currentTarget, delete this.target, this.cancelBubble;
  }
}
