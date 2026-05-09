// var: init_esm
var init_esm = __esm(() => {
  init_internal();
  context2 = createLoggerContext({
    logLevelEnvVarName: "AZURE_LOG_LEVEL",
    namespace: "azure"
  }), AzureLogger = context2.logger;
});
