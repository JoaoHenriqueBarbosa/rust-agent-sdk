// Original: src/hooks/notifs/useIDEStatusIndicator.tsx
function useIDEStatusIndicator(t0) {
  let $3 = import_compiler_runtime355.c(26), {
    ideSelection,
    mcpClients,
    ideInstallationStatus
  } = t0, {
    addNotification,
    removeNotification
  } = useNotifications(), {
    status: ideStatus,
    ideName
  } = useIdeConnectionStatus(mcpClients), hasShownHintRef = import_react293.useRef(!1), t1;
  if ($3[0] !== ideInstallationStatus)
    t1 = ideInstallationStatus ? isJetBrainsIde(ideInstallationStatus?.ideType) : !1, $3[0] = ideInstallationStatus, $3[1] = t1;
  else
    t1 = $3[1];
  let isJetBrains = t1, showIDEInstallErrorOrJetBrainsInfo = ideInstallationStatus?.error || isJetBrains, shouldShowIdeSelection = ideStatus === "connected" && (ideSelection?.filePath || ideSelection?.text && ideSelection.lineCount > 0), shouldShowConnected = ideStatus === "connected" && !shouldShowIdeSelection, showIDEInstallError = showIDEInstallErrorOrJetBrainsInfo && !isJetBrains && !shouldShowConnected && !shouldShowIdeSelection, showJetBrainsInfo = showIDEInstallErrorOrJetBrainsInfo && isJetBrains && !shouldShowConnected && !shouldShowIdeSelection, t2, t3;
  if ($3[2] !== addNotification || $3[3] !== ideStatus || $3[4] !== removeNotification || $3[5] !== showJetBrainsInfo)
    t2 = () => {
      if (getIsRemoteMode())
        return;
      if (isSupportedTerminal() || ideStatus !== null || showJetBrainsInfo) {
        removeNotification("ide-status-hint");
        return;
      }
      if (hasShownHintRef.current || (getGlobalConfig().ideHintShownCount ?? 0) >= MAX_IDE_HINT_SHOW_COUNT)
        return;
      let timeoutId = setTimeout(_temp290, 3000, hasShownHintRef, addNotification);
      return () => clearTimeout(timeoutId);
    }, t3 = [addNotification, removeNotification, ideStatus, showJetBrainsInfo], $3[2] = addNotification, $3[3] = ideStatus, $3[4] = removeNotification, $3[5] = showJetBrainsInfo, $3[6] = t2, $3[7] = t3;
  else
    t2 = $3[6], t3 = $3[7];
  import_react293.useEffect(t2, t3);
  let t4, t5;
  if ($3[8] !== addNotification || $3[9] !== ideName || $3[10] !== ideStatus || $3[11] !== removeNotification || $3[12] !== showIDEInstallError || $3[13] !== showJetBrainsInfo)
    t4 = () => {
      if (getIsRemoteMode())
        return;
      if (showIDEInstallError || showJetBrainsInfo || ideStatus !== "disconnected" || !ideName) {
        removeNotification("ide-status-disconnected");
        return;
      }
      addNotification({
        key: "ide-status-disconnected",
        text: `${ideName} disconnected`,
        color: "error",
        priority: "medium"
      });
    }, t5 = [addNotification, removeNotification, ideStatus, ideName, showIDEInstallError, showJetBrainsInfo], $3[8] = addNotification, $3[9] = ideName, $3[10] = ideStatus, $3[11] = removeNotification, $3[12] = showIDEInstallError, $3[13] = showJetBrainsInfo, $3[14] = t4, $3[15] = t5;
  else
    t4 = $3[14], t5 = $3[15];
  import_react293.useEffect(t4, t5);
  let t6, t7;
  if ($3[16] !== addNotification || $3[17] !== removeNotification || $3[18] !== showJetBrainsInfo)
    t6 = () => {
      if (getIsRemoteMode())
        return;
      if (!showJetBrainsInfo) {
        removeNotification("ide-status-jetbrains-disconnected");
        return;
      }
      addNotification({
        key: "ide-status-jetbrains-disconnected",
        text: "IDE plugin not connected \xB7 /status for info",
        priority: "medium"
      });
    }, t7 = [addNotification, removeNotification, showJetBrainsInfo], $3[16] = addNotification, $3[17] = removeNotification, $3[18] = showJetBrainsInfo, $3[19] = t6, $3[20] = t7;
  else
    t6 = $3[19], t7 = $3[20];
  import_react293.useEffect(t6, t7);
  let t8, t9;
  if ($3[21] !== addNotification || $3[22] !== removeNotification || $3[23] !== showIDEInstallError)
    t8 = () => {
      if (getIsRemoteMode())
        return;
      if (!showIDEInstallError) {
        removeNotification("ide-status-install-error");
        return;
      }
      addNotification({
        key: "ide-status-install-error",
        text: "IDE extension install failed (see /status for info)",
        color: "error",
        priority: "medium"
      });
    }, t9 = [addNotification, removeNotification, showIDEInstallError], $3[21] = addNotification, $3[22] = removeNotification, $3[23] = showIDEInstallError, $3[24] = t8, $3[25] = t9;
  else
    t8 = $3[24], t9 = $3[25];
  import_react293.useEffect(t8, t9);
}
function _temp290(hasShownHintRef_0, addNotification_0) {
  detectIDEs(!0).then((infos) => {
    let ideName_0 = infos[0]?.name;
    if (ideName_0 && !hasShownHintRef_0.current)
      hasShownHintRef_0.current = !0, saveGlobalConfig(_temp292), addNotification_0({
        key: "ide-status-hint",
        jsx: /* @__PURE__ */ jsx_dev_runtime453.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "/ide for ",
            /* @__PURE__ */ jsx_dev_runtime453.jsxDEV(ThemedText, {
              color: "ide",
              children: ideName_0
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        priority: "low"
      });
  });
}
function _temp292(current) {
  return {
    ...current,
    ideHintShownCount: (current.ideHintShownCount ?? 0) + 1
  };
}
var import_compiler_runtime355, import_react293, jsx_dev_runtime453, MAX_IDE_HINT_SHOW_COUNT = 5;
var init_useIDEStatusIndicator = __esm(() => {
  init_notifications();
  init_ink2();
  init_config4();
  init_ide();
  init_state();
  init_useIdeConnectionStatus();
  import_compiler_runtime355 = __toESM(require_react_compiler_runtime_development(), 1), import_react293 = __toESM(require_react_development(), 1), jsx_dev_runtime453 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
