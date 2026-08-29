// Original: src/hooks/notifs/useLspInitializationNotification.tsx
function useLspInitializationNotification() {
  let $3 = import_compiler_runtime346.c(10), {
    addNotification
  } = useNotifications(), setAppState = useSetAppState(), [shouldPoll, setShouldPoll] = React141.useState(_temp224), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ new Set, $3[0] = t0;
  else
    t0 = $3[0];
  let notifiedErrorsRef = React141.useRef(t0), t1;
  if ($3[1] !== addNotification || $3[2] !== setAppState)
    t1 = (source, errorMessage4) => {
      let errorKey2 = `${source}:${errorMessage4}`;
      if (notifiedErrorsRef.current.has(errorKey2))
        return;
      notifiedErrorsRef.current.add(errorKey2), logForDebugging(`LSP error: ${source} - ${errorMessage4}`), setAppState((prev) => {
        let existingKeys = new Set(prev.plugins.errors.map(_temp286)), stateErrorKey = `generic-error:${source}:${errorMessage4}`;
        if (existingKeys.has(stateErrorKey))
          return prev;
        return {
          ...prev,
          plugins: {
            ...prev.plugins,
            errors: [...prev.plugins.errors, {
              type: "generic-error",
              source,
              error: errorMessage4
            }]
          }
        };
      });
      let displayName = source.startsWith("plugin:") ? source.split(":")[1] ?? source : source;
      addNotification({
        key: `lsp-error-${source}`,
        jsx: /* @__PURE__ */ jsx_dev_runtime445.jsxDEV(jsx_dev_runtime445.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime445.jsxDEV(ThemedText, {
              color: "error",
              children: [
                "LSP for ",
                displayName,
                " failed"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime445.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " \xB7 /plugin for details"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        priority: "medium",
        timeoutMs: 8000
      });
    }, $3[1] = addNotification, $3[2] = setAppState, $3[3] = t1;
  else
    t1 = $3[3];
  let addError = t1, t2;
  if ($3[4] !== addError)
    t2 = () => {
      if (getIsRemoteMode())
        return;
      if (getIsScrollDraining())
        return;
      let status2 = getInitializationStatus();
      if (status2.status === "failed") {
        addError("lsp-manager", status2.error.message), setShouldPoll(!1);
        return;
      }
      if (status2.status === "pending" || status2.status === "not-started")
        return;
      let manager7 = getLspServerManager();
      if (manager7) {
        let servers = manager7.getAllServers();
        for (let [serverName, server] of servers)
          if (server.state === "error" && server.lastError)
            addError(serverName, server.lastError.message);
      }
    }, $3[4] = addError, $3[5] = t2;
  else
    t2 = $3[5];
  let poll = t2;
  useInterval(poll, shouldPoll ? LSP_POLL_INTERVAL_MS : null);
  let t3, t4;
  if ($3[6] !== poll || $3[7] !== shouldPoll)
    t3 = () => {
      if (getIsRemoteMode() || !shouldPoll)
        return;
      poll();
    }, t4 = [poll, shouldPoll], $3[6] = poll, $3[7] = shouldPoll, $3[8] = t3, $3[9] = t4;
  else
    t3 = $3[8], t4 = $3[9];
  React141.useEffect(t3, t4);
}
function _temp286(e) {
  if (e.type === "generic-error")
    return `generic-error:${e.source}:${e.error}`;
  return `${e.type}:${e.source}`;
}
function _temp224() {
  return isEnvTruthy("true");
}
var import_compiler_runtime346, React141, jsx_dev_runtime445, LSP_POLL_INTERVAL_MS = 5000;
var init_useLspInitializationNotification = __esm(() => {
  init_dist4();
  init_state();
  init_notifications();
  init_ink2();
  init_manager7();
  init_AppState();
  init_debug();
  init_envUtils();
  import_compiler_runtime346 = __toESM(require_react_compiler_runtime_development(), 1), React141 = __toESM(require_react_development(), 1), jsx_dev_runtime445 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
