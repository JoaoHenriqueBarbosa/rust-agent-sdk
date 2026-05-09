// function: tryCreateTracingClient
function tryCreateTracingClient() {
  try {
    return createTracingClient({
      namespace: "",
      packageName: "@azure/core-rest-pipeline",
      packageVersion: SDK_VERSION2
    });
  } catch (e) {
    logger12.warning(`Error when creating the TracingClient: ${getErrorMessage2(e)}`);
    return;
  }
}
