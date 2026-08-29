// Original: src/hooks/useDeferredHookMessages.ts
function useDeferredHookMessages(pendingHookMessages, setMessages) {
  let pendingRef = import_react262.useRef(pendingHookMessages ?? null), resolvedRef = import_react262.useRef(!pendingHookMessages);
  return import_react262.useEffect(() => {
    let promise3 = pendingRef.current;
    if (!promise3)
      return;
    let cancelled = !1;
    return promise3.then((msgs) => {
      if (cancelled)
        return;
      if (resolvedRef.current = !0, pendingRef.current = null, msgs.length > 0)
        setMessages((prev) => [...msgs, ...prev]);
    }), () => {
      cancelled = !0;
    };
  }, [setMessages]), import_react262.useCallback(async () => {
    if (resolvedRef.current || !pendingRef.current)
      return;
    let msgs = await pendingRef.current;
    if (resolvedRef.current)
      return;
    if (resolvedRef.current = !0, pendingRef.current = null, msgs.length > 0)
      setMessages((prev) => [...msgs, ...prev]);
  }, [setMessages]);
}
var import_react262;
var init_useDeferredHookMessages = __esm(() => {
  import_react262 = __toESM(require_react_development(), 1);
});
