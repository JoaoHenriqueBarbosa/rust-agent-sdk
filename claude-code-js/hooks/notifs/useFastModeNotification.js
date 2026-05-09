// Original: src/hooks/notifs/useFastModeNotification.tsx
function useFastModeNotification() {
  let $3 = import_compiler_runtime356.c(13), {
    addNotification
  } = useNotifications(), isFastMode = useAppState(_temp297), setAppState = useSetAppState(), t0, t1;
  if ($3[0] !== addNotification || $3[1] !== isFastMode || $3[2] !== setAppState)
    t0 = () => {
      if (getIsRemoteMode())
        return;
      if (!isFastModeEnabled())
        return;
      return onOrgFastModeChanged((orgEnabled) => {
        if (orgEnabled)
          addNotification({
            key: ORG_CHANGED_KEY,
            color: "fastMode",
            priority: "immediate",
            text: "Fast mode is now available \xB7 /fast to turn on"
          });
        else if (isFastMode)
          setAppState(_temp296), addNotification({
            key: ORG_CHANGED_KEY,
            color: "warning",
            priority: "immediate",
            text: "Fast mode has been disabled by your organization"
          });
      });
    }, t1 = [addNotification, isFastMode, setAppState], $3[0] = addNotification, $3[1] = isFastMode, $3[2] = setAppState, $3[3] = t0, $3[4] = t1;
  else
    t0 = $3[3], t1 = $3[4];
  import_react295.useEffect(t0, t1);
  let t2, t3;
  if ($3[5] !== addNotification || $3[6] !== setAppState)
    t2 = () => {
      if (getIsRemoteMode())
        return;
      if (!isFastModeEnabled())
        return;
      return onFastModeOverageRejection((message) => {
        setAppState(_temp356), addNotification({
          key: OVERAGE_REJECTED_KEY,
          color: "warning",
          priority: "immediate",
          text: message
        });
      });
    }, t3 = [addNotification, setAppState], $3[5] = addNotification, $3[6] = setAppState, $3[7] = t2, $3[8] = t3;
  else
    t2 = $3[7], t3 = $3[8];
  import_react295.useEffect(t2, t3);
  let t4, t5;
  if ($3[9] !== addNotification || $3[10] !== isFastMode)
    t4 = () => {
      if (getIsRemoteMode())
        return;
      if (!isFastMode)
        return;
      let unsubTriggered = onCooldownTriggered((resetAt, reason) => {
        let resetIn = formatDuration(resetAt - Date.now(), {
          hideTrailingZeros: !0
        }), message_0 = getCooldownMessage(reason, resetIn);
        addNotification({
          key: COOLDOWN_STARTED_KEY,
          invalidates: [COOLDOWN_EXPIRED_KEY],
          text: message_0,
          color: "warning",
          priority: "immediate"
        });
      }), unsubExpired = onCooldownExpired(() => {
        addNotification({
          key: COOLDOWN_EXPIRED_KEY,
          invalidates: [COOLDOWN_STARTED_KEY],
          color: "fastMode",
          text: "Fast limit reset \xB7 now using fast mode",
          priority: "immediate"
        });
      });
      return () => {
        unsubTriggered(), unsubExpired();
      };
    }, t5 = [addNotification, isFastMode], $3[9] = addNotification, $3[10] = isFastMode, $3[11] = t4, $3[12] = t5;
  else
    t4 = $3[11], t5 = $3[12];
  import_react295.useEffect(t4, t5);
}
function _temp356(prev_0) {
  return {
    ...prev_0,
    fastMode: !1
  };
}
function _temp296(prev) {
  return {
    ...prev,
    fastMode: !1
  };
}
function _temp297(s2) {
  return s2.fastMode;
}
function getCooldownMessage(reason, resetIn) {
  switch (reason) {
    case "overloaded":
      return `Fast mode overloaded and is temporarily unavailable \xB7 resets in ${resetIn}`;
    case "rate_limit":
      return `Fast limit reached and temporarily disabled \xB7 resets in ${resetIn}`;
  }
}
var import_compiler_runtime356, import_react295, COOLDOWN_STARTED_KEY = "fast-mode-cooldown-started", COOLDOWN_EXPIRED_KEY = "fast-mode-cooldown-expired", ORG_CHANGED_KEY = "fast-mode-org-changed", OVERAGE_REJECTED_KEY = "fast-mode-overage-rejected";
var init_useFastModeNotification = __esm(() => {
  init_notifications();
  init_AppState();
  init_fastMode();
  init_format();
  init_state();
  import_compiler_runtime356 = __toESM(require_react_compiler_runtime_development(), 1), import_react295 = __toESM(require_react_development(), 1);
});
