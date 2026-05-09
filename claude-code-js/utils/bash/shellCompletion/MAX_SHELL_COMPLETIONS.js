// var: MAX_SHELL_COMPLETIONS
var MAX_SHELL_COMPLETIONS = 15, SHELL_COMPLETION_TIMEOUT_MS = 1000, COMMAND_OPERATORS;
var init_shellCompletion = __esm(() => {
  init_shellQuote();
  init_debug();
  init_localInstaller();
  init_Shell();
  COMMAND_OPERATORS = ["|", "||", "&&", ";"];
});
