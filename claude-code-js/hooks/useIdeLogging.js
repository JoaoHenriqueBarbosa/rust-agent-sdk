// Original: src/hooks/useIdeLogging.ts
function useIdeLogging(mcpClients) {
  import_react200.useEffect(() => {
    if (!mcpClients.length)
      return;
    let ideClient = getConnectedIdeClient(mcpClients);
    if (ideClient)
      ideClient.client.setNotificationHandler(LogEventSchema(), (notification) => {
        let { eventName, eventData } = notification.params;
        logEvent(`tengu_ide_${eventName}`, eventData);
      });
  }, [mcpClients]);
}
var import_react200, LogEventSchema;
var init_useIdeLogging = __esm(() => {
  init_v4();
  init_ide();
  import_react200 = __toESM(require_react_development(), 1), LogEventSchema = lazySchema(() => exports_external.object({
    method: exports_external.literal("log_event"),
    params: exports_external.object({
      eventName: exports_external.string(),
      eventData: exports_external.object({}).passthrough()
    })
  }));
});
