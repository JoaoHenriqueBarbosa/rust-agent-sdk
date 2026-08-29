// var: init_logger7
var init_logger7 = __esm(() => {
  init_debug2();
  TYPESPEC_RUNTIME_LOG_LEVELS = ["verbose", "info", "warning", "error"], levelMap = {
    verbose: 400,
    info: 300,
    warning: 200,
    error: 100
  };
  context = createLoggerContext({
    logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
    namespace: "typeSpecRuntime"
  }), TypeSpecRuntimeLogger = context.logger;
});
