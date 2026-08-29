// Original: src/hooks/useIdeAtMentioned.ts
function useIdeAtMentioned(mcpClients, onAtMentioned) {
  let ideClientRef = import_react222.useRef(void 0);
  import_react222.useEffect(() => {
    let ideClient = getConnectedIdeClient(mcpClients);
    if (ideClientRef.current !== ideClient)
      ideClientRef.current = ideClient;
    if (ideClient)
      ideClient.client.setNotificationHandler(AtMentionedSchema(), (notification) => {
        if (ideClientRef.current !== ideClient)
          return;
        try {
          let data = notification.params, lineStart = data.lineStart !== void 0 ? data.lineStart + 1 : void 0, lineEnd = data.lineEnd !== void 0 ? data.lineEnd + 1 : void 0;
          onAtMentioned({
            filePath: data.filePath,
            lineStart,
            lineEnd
          });
        } catch (error44) {
          logError2(error44);
        }
      });
  }, [mcpClients, onAtMentioned]);
}
var import_react222, NOTIFICATION_METHOD = "at_mentioned", AtMentionedSchema;
var init_useIdeAtMentioned = __esm(() => {
  init_log3();
  init_v4();
  init_ide();
  import_react222 = __toESM(require_react_development(), 1), AtMentionedSchema = lazySchema(() => exports_external.object({
    method: exports_external.literal(NOTIFICATION_METHOD),
    params: exports_external.object({
      filePath: exports_external.string(),
      lineStart: exports_external.number().optional(),
      lineEnd: exports_external.number().optional()
    })
  }));
});
