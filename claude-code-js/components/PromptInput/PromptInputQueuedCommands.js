// Original: src/components/PromptInput/PromptInputQueuedCommands.tsx
function isIdleNotification2(value) {
  try {
    return jsonParse(value)?.type === "idle_notification";
  } catch {
    return !1;
  }
}
function createOverflowNotificationMessage(count4) {
  return `<${TASK_NOTIFICATION_TAG}>
<${SUMMARY_TAG}>+${count4} more tasks completed</${SUMMARY_TAG}>
<${STATUS_TAG}>completed</${STATUS_TAG}>
</${TASK_NOTIFICATION_TAG}>`;
}
function processQueuedCommands(queuedCommands) {
  let filteredCommands = queuedCommands.filter((cmd) => typeof cmd.value !== "string" || !isIdleNotification2(cmd.value)), taskNotifications = filteredCommands.filter((cmd) => cmd.mode === "task-notification"), otherCommands = filteredCommands.filter((cmd) => cmd.mode !== "task-notification");
  if (taskNotifications.length <= MAX_VISIBLE_NOTIFICATIONS)
    return [...otherCommands, ...taskNotifications];
  let visibleNotifications = taskNotifications.slice(0, MAX_VISIBLE_NOTIFICATIONS - 1), overflowCount = taskNotifications.length - (MAX_VISIBLE_NOTIFICATIONS - 1), overflowCommand = {
    value: createOverflowNotificationMessage(overflowCount),
    mode: "task-notification"
  };
  return [...otherCommands, ...visibleNotifications, overflowCommand];
}
function PromptInputQueuedCommandsImpl() {
  let queuedCommands = useCommandQueue(), viewingAgent = useAppState((s2) => !!s2.viewingAgentTaskId), useBriefLayout = useAppState((s_0) => s_0.isBriefOnly), messages = import_react253.useMemo(() => {
    if (queuedCommands.length === 0)
      return null;
    let visibleCommands = queuedCommands.filter(isQueuedCommandVisible);
    if (visibleCommands.length === 0)
      return null;
    let processedCommands = processQueuedCommands(visibleCommands);
    return normalizeMessages(processedCommands.map((cmd) => {
      let content = cmd.value;
      if (cmd.mode === "bash" && typeof content === "string")
        content = `<bash-input>${content}</bash-input>`;
      return createUserMessage({
        content
      });
    }));
  }, [queuedCommands]);
  if (viewingAgent || messages === null)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime432.jsxDEV(ThemedBox_default, {
    marginTop: 1,
    flexDirection: "column",
    children: messages.map((message, i5) => /* @__PURE__ */ jsx_dev_runtime432.jsxDEV(QueuedMessageProvider, {
      isFirst: i5 === 0,
      useBriefLayout,
      children: /* @__PURE__ */ jsx_dev_runtime432.jsxDEV(Message4, {
        message,
        lookups: EMPTY_LOOKUPS,
        addMargin: !1,
        tools: [],
        commands: [],
        verbose: !1,
        inProgressToolUseIDs: EMPTY_SET2,
        progressMessagesForMessage: [],
        shouldAnimate: !1,
        shouldShowDot: !1,
        isTranscriptMode: !1,
        isStatic: !0
      }, void 0, !1, void 0, this)
    }, i5, !1, void 0, this))
  }, void 0, !1, void 0, this);
}
var React137, import_react253, jsx_dev_runtime432, EMPTY_SET2, MAX_VISIBLE_NOTIFICATIONS = 3, PromptInputQueuedCommands;
var init_PromptInputQueuedCommands = __esm(() => {
  init_ink2();
  init_AppState();
  init_xml();
  init_QueuedMessageContext();
  init_useCommandQueue();
  init_messageQueueManager();
  init_messages3();
  init_slowOperations();
  init_Message3();
  React137 = __toESM(require_react_development(), 1), import_react253 = __toESM(require_react_development(), 1), jsx_dev_runtime432 = __toESM(require_react_jsx_dev_runtime_development(), 1), EMPTY_SET2 = /* @__PURE__ */ new Set;
  PromptInputQueuedCommands = React137.memo(PromptInputQueuedCommandsImpl);
});
