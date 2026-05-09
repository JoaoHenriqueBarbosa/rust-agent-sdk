// function: propagateAbort
function propagateAbort(weakChild) {
  let parent2 = this.deref();
  weakChild.deref()?.abort(parent2?.signal.reason);
}
