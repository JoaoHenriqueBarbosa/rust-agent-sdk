// function: registerHookCallbacks
function registerHookCallbacks(hooks) {
  if (!STATE.registeredHooks)
    STATE.registeredHooks = {};
  for (let [event, matchers] of Object.entries(hooks)) {
    let eventKey = event;
    if (!STATE.registeredHooks[eventKey])
      STATE.registeredHooks[eventKey] = [];
    STATE.registeredHooks[eventKey].push(...matchers);
  }
}
