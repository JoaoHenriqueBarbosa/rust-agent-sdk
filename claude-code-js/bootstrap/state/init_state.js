// var: init_state
var init_state = __esm(() => {
  init_sumBy();
  init_crypto();
  init_settingsCache();
  STATE = getInitialState();
  sessionSwitched = createSignal(), onSessionSwitch = sessionSwitched.subscribe;
});
