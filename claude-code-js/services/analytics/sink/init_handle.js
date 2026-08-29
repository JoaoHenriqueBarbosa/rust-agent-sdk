// var: init_handle
var init_handle = __esm(() => {
  init_standard_stream();
  init_normalize();
  init_object_mode();
  init_type();
  init_direction();
  init_stdio_option();
  init_native();
  init_input_option();
  init_duplicate();
  INVALID_STDIO_ARRAY_OPTIONS = /* @__PURE__ */ new Set(["ignore", "ipc"]);
});
