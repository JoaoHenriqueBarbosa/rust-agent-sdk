// var: VERSION6
var VERSION6 = "1.0.0", MAX_MESSAGE_SIZE = 1048576, LOG_FILE = void 0, messageSchema;
var init_chromeNativeHost = __esm(() => {
  init_zod();
  init_slowOperations();
  init_common3();
  messageSchema = lazySchema(() => exports_external2.object({
    type: exports_external2.string()
  }).passthrough());
});
