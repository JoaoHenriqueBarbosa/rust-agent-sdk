// Original: src/utils/messageQueueManager.ts
function logOperation(operation, content) {
  let sessionId = getSessionId(), queueOp = {
    type: "queue-operation",
    operation,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    sessionId,
    ...content !== void 0 && { content }
  };
  recordQueueOperation(queueOp);
}
function notifySubscribers() {
  snapshot = Object.freeze([...commandQueue]), queueChanged.emit();
}
function getCommandQueueSnapshot() {
  return snapshot;
}
function getCommandQueue() {
  return [...commandQueue];
}
function getCommandQueueLength() {
  return commandQueue.length;
}
function hasCommandsInQueue() {
  return commandQueue.length > 0;
}
function enqueue(command12) {
  commandQueue.push({ ...command12, priority: command12.priority ?? "next" }), notifySubscribers(), logOperation("enqueue", typeof command12.value === "string" ? command12.value : void 0);
}
function enqueuePendingNotification(command12) {
  commandQueue.push({ ...command12, priority: command12.priority ?? "later" }), notifySubscribers(), logOperation("enqueue", typeof command12.value === "string" ? command12.value : void 0);
}
function dequeue(filter2) {
  if (commandQueue.length === 0)
    return;
  let bestIdx = -1, bestPriority = 1 / 0;
  for (let i5 = 0;i5 < commandQueue.length; i5++) {
    let cmd = commandQueue[i5];
    if (filter2 && !filter2(cmd))
      continue;
    let priority = PRIORITY_ORDER[cmd.priority ?? "next"];
    if (priority < bestPriority)
      bestIdx = i5, bestPriority = priority;
  }
  if (bestIdx === -1)
    return;
  let [dequeued] = commandQueue.splice(bestIdx, 1);
  return notifySubscribers(), logOperation("dequeue"), dequeued;
}
function peek(filter2) {
  if (commandQueue.length === 0)
    return;
  let bestIdx = -1, bestPriority = 1 / 0;
  for (let i5 = 0;i5 < commandQueue.length; i5++) {
    let cmd = commandQueue[i5];
    if (filter2 && !filter2(cmd))
      continue;
    let priority = PRIORITY_ORDER[cmd.priority ?? "next"];
    if (priority < bestPriority)
      bestIdx = i5, bestPriority = priority;
  }
  if (bestIdx === -1)
    return;
  return commandQueue[bestIdx];
}
function dequeueAllMatching(predicate) {
  let matched = [], remaining = [];
  for (let cmd of commandQueue)
    if (predicate(cmd))
      matched.push(cmd);
    else
      remaining.push(cmd);
  if (matched.length === 0)
    return [];
  commandQueue.length = 0, commandQueue.push(...remaining), notifySubscribers();
  for (let _cmd of matched)
    logOperation("dequeue");
  return matched;
}
function remove(commandsToRemove) {
  if (commandsToRemove.length === 0)
    return;
  let before = commandQueue.length;
  for (let i5 = commandQueue.length - 1;i5 >= 0; i5--)
    if (commandsToRemove.includes(commandQueue[i5]))
      commandQueue.splice(i5, 1);
  if (commandQueue.length !== before)
    notifySubscribers();
  for (let _cmd of commandsToRemove)
    logOperation("remove");
}
function removeByFilter(predicate) {
  let removed = [];
  for (let i5 = commandQueue.length - 1;i5 >= 0; i5--)
    if (predicate(commandQueue[i5]))
      removed.unshift(commandQueue.splice(i5, 1)[0]);
  if (removed.length > 0) {
    notifySubscribers();
    for (let _cmd of removed)
      logOperation("remove");
  }
  return removed;
}
function clearCommandQueue() {
  if (commandQueue.length === 0)
    return;
  commandQueue.length = 0, notifySubscribers();
}
function isPromptInputModeEditable(mode) {
  return !NON_EDITABLE_MODES.has(mode);
}
function isQueuedCommandEditable(cmd) {
  return isPromptInputModeEditable(cmd.mode) && !cmd.isMeta;
}
function isQueuedCommandVisible(cmd) {
  if (cmd.origin?.kind === "channel")
    return !0;
  return isQueuedCommandEditable(cmd);
}
function extractTextFromValue(value) {
  return typeof value === "string" ? value : extractTextContent(value, `
`);
}
function extractImagesFromValue(value, startId) {
  if (typeof value === "string")
    return [];
  let images = [], imageIndex = 0;
  for (let block2 of value)
    if (block2.type === "image" && block2.source.type === "base64")
      images.push({
        id: startId + imageIndex,
        type: "image",
        content: block2.source.data,
        mediaType: block2.source.media_type,
        filename: `image${imageIndex + 1}`
      }), imageIndex++;
  return images;
}
function popAllEditable(currentInput, currentCursorOffset) {
  if (commandQueue.length === 0)
    return;
  let { editable = [], nonEditable = [] } = objectGroupBy([...commandQueue], (cmd) => isQueuedCommandEditable(cmd) ? "editable" : "nonEditable");
  if (editable.length === 0)
    return;
  let queuedTexts = editable.map((cmd) => extractTextFromValue(cmd.value)), newInput = [...queuedTexts, currentInput].filter(Boolean).join(`
`), cursorOffset = queuedTexts.join(`
`).length + 1 + currentCursorOffset, images = [], nextImageId = Date.now();
  for (let cmd of editable) {
    if (cmd.pastedContents) {
      for (let content of Object.values(cmd.pastedContents))
        if (content.type === "image")
          images.push(content);
    }
    let cmdImages = extractImagesFromValue(cmd.value, nextImageId);
    images.push(...cmdImages), nextImageId += cmdImages.length;
  }
  for (let command12 of editable)
    logOperation("popAll", typeof command12.value === "string" ? command12.value : void 0);
  return commandQueue.length = 0, commandQueue.push(...nonEditable), notifySubscribers(), { text: newInput, cursorOffset, images };
}
function getCommandsByMaxPriority(maxPriority) {
  let threshold = PRIORITY_ORDER[maxPriority];
  return commandQueue.filter((cmd) => PRIORITY_ORDER[cmd.priority ?? "next"] <= threshold);
}
function isSlashCommand(cmd) {
  return typeof cmd.value === "string" && cmd.value.trim().startsWith("/") && !cmd.skipSlashCommands;
}
var commandQueue, snapshot, queueChanged, subscribeToCommandQueue, PRIORITY_ORDER, NON_EDITABLE_MODES;
var init_messageQueueManager = __esm(() => {
  init_state();
  init_messages3();
  init_sessionStorage();
  commandQueue = [], snapshot = Object.freeze([]), queueChanged = createSignal();
  subscribeToCommandQueue = queueChanged.subscribe;
  PRIORITY_ORDER = {
    now: 0,
    next: 1,
    later: 2
  };
  NON_EDITABLE_MODES = /* @__PURE__ */ new Set([
    "task-notification"
  ]);
});
