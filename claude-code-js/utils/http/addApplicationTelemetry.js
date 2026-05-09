// function: addApplicationTelemetry
function addApplicationTelemetry(parameters, appTelemetry) {
  if (appTelemetry?.appName)
    parameters.set(X_APP_NAME, appTelemetry.appName);
  if (appTelemetry?.appVersion)
    parameters.set(X_APP_VER, appTelemetry.appVersion);
}
