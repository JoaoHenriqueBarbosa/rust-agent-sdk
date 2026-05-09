// Original: src/utils/queueProcessor.ts
function isSlashCommand2(cmd) {
  if (typeof cmd.value === "string")
    return cmd.value.trim().startsWith("/");
  for (let block2 of cmd.value)
    if (block2.type === "text")
      return block2.text.trim().startsWith("/");
  return !1;
}
function processQueueIfReady({
  executeInput
}) {
  let isMainThread = (cmd) => cmd.agentId === void 0, next2 = peek(isMainThread);
  if (!next2)
    return { processed: !1 };
  if (isSlashCommand2(next2) || next2.mode === "bash") {
    let cmd = dequeue(isMainThread);
    return executeInput([cmd]), { processed: !0 };
  }
  let targetMode = next2.mode, commands7 = dequeueAllMatching((cmd) => isMainThread(cmd) && !isSlashCommand2(cmd) && cmd.mode === targetMode);
  if (commands7.length === 0)
    return { processed: !1 };
  return executeInput(commands7), { processed: !0 };
}
var init_queueProcessor = __esm(() => {
  init_messageQueueManager();
});
