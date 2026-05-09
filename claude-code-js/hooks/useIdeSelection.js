// Original: src/hooks/useIdeSelection.ts
function useIdeSelection(mcpClients, onSelect) {
  let handlersRegistered = import_react275.useRef(!1), currentIDERef = import_react275.useRef(null);
  import_react275.useEffect(() => {
    let ideClient = getConnectedIdeClient(mcpClients);
    if (currentIDERef.current !== (ideClient ?? null))
      handlersRegistered.current = !1, currentIDERef.current = ideClient || null, onSelect({
        lineCount: 0,
        lineStart: void 0,
        text: void 0,
        filePath: void 0
      });
    if (handlersRegistered.current || !ideClient)
      return;
    let selectionChangeHandler = (data) => {
      if (data.selection?.start && data.selection?.end) {
        let { start, end } = data.selection, lineCount = end.line - start.line + 1;
        if (end.character === 0)
          lineCount--;
        let selection = {
          lineCount,
          lineStart: start.line,
          text: data.text,
          filePath: data.filePath
        };
        onSelect(selection);
      }
    };
    ideClient.client.setNotificationHandler(SelectionChangedSchema(), (notification) => {
      if (currentIDERef.current !== ideClient)
        return;
      try {
        let selectionData = notification.params;
        if (selectionData.selection && selectionData.selection.start && selectionData.selection.end)
          selectionChangeHandler(selectionData);
        else if (selectionData.text !== void 0)
          selectionChangeHandler({
            selection: null,
            text: selectionData.text,
            filePath: selectionData.filePath
          });
      } catch (error44) {
        logError2(error44);
      }
    }), handlersRegistered.current = !0;
  }, [mcpClients, onSelect]);
}
var import_react275, SelectionChangedSchema;
var init_useIdeSelection = __esm(() => {
  init_log3();
  init_v4();
  init_ide();
  import_react275 = __toESM(require_react_development(), 1), SelectionChangedSchema = lazySchema(() => exports_external.object({
    method: exports_external.literal("selection_changed"),
    params: exports_external.object({
      selection: exports_external.object({
        start: exports_external.object({
          line: exports_external.number(),
          character: exports_external.number()
        }),
        end: exports_external.object({
          line: exports_external.number(),
          character: exports_external.number()
        })
      }).nullable().optional(),
      text: exports_external.string().optional(),
      filePath: exports_external.string().optional()
    })
  }));
});
