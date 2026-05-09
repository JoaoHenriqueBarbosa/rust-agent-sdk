// var: init_tracing
var init_tracing = __esm(() => {
  init_constants7();
  init_esm2();
  tracingClient = createTracingClient({
    namespace: "Microsoft.AAD",
    packageName: "@azure/identity",
    packageVersion: SDK_VERSION
  });
});
