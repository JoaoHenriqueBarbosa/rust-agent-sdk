// var: init_errors2
var init_errors2 = __esm(() => {
  init_core();
  init_util();
  $ZodError = $constructor("$ZodError", initializer), $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
});
