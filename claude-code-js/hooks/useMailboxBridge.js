// Original: src/hooks/useMailboxBridge.ts
function useMailboxBridge({ isLoading, onSubmitMessage }) {
  let mailbox = useMailbox(), subscribe3 = import_react270.useMemo(() => mailbox.subscribe.bind(mailbox), [mailbox]), getSnapshot = import_react270.useCallback(() => mailbox.revision, [mailbox]), revision = import_react270.useSyncExternalStore(subscribe3, getSnapshot);
  import_react270.useEffect(() => {
    if (isLoading)
      return;
    let msg = mailbox.poll();
    if (msg)
      onSubmitMessage(msg.content);
  }, [isLoading, revision, mailbox, onSubmitMessage]);
}
var import_react270;
var init_useMailboxBridge = __esm(() => {
  init_mailbox2();
  import_react270 = __toESM(require_react_development(), 1);
});
