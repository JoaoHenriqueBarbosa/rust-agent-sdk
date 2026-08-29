// var: init_graceful
var init_graceful = __esm(() => {
  init_send();
  init_forward();
  init_validation();
  cancelController = new AbortController;
});
