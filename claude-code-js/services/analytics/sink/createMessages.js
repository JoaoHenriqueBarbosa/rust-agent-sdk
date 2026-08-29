// var: createMessages
var createMessages = ({
  stdio,
  all,
  ipcOutput,
  originalError,
  signal,
  signalDescription,
  exitCode,
  escapedCommand,
  timedOut,
  isCanceled,
  isGracefullyCanceled,
  isMaxBuffer,
  isForcefullyTerminated,
  forceKillAfterDelay,
  killSignal,
  maxBuffer,
  timeout,
  cwd: cwd2
}) => {
  let errorCode = originalError?.code, prefix = getErrorPrefix({
    originalError,
    timedOut,
    timeout,
    isMaxBuffer,
    maxBuffer,
    errorCode,
    signal,
    signalDescription,
    exitCode,
    isCanceled,
    isGracefullyCanceled,
    isForcefullyTerminated,
    forceKillAfterDelay,
    killSignal
  }), originalMessage = getOriginalMessage(originalError, cwd2), suffix = originalMessage === void 0 ? "" : `
${originalMessage}`, shortMessage = `${prefix}: ${escapedCommand}${suffix}`, messageStdio = all === void 0 ? [stdio[2], stdio[1]] : [all], message = [
    shortMessage,
    ...messageStdio,
    ...stdio.slice(3),
    ipcOutput.map((ipcMessage) => serializeIpcMessage(ipcMessage)).join(`
`)
  ].map((messagePart) => escapeLines(stripFinalNewline(serializeMessagePart(messagePart)))).filter(Boolean).join(`

`);
  return { originalMessage, shortMessage, message };
}, getErrorPrefix = ({
  originalError,
  timedOut,
  timeout,
  isMaxBuffer,
  maxBuffer,
  errorCode,
  signal,
  signalDescription,
  exitCode,
  isCanceled,
  isGracefullyCanceled,
  isForcefullyTerminated,
  forceKillAfterDelay,
  killSignal
}) => {
  let forcefulSuffix = getForcefulSuffix(isForcefullyTerminated, forceKillAfterDelay);
  if (timedOut)
    return `Command timed out after ${timeout} milliseconds${forcefulSuffix}`;
  if (isGracefullyCanceled) {
    if (signal === void 0)
      return `Command was gracefully canceled with exit code ${exitCode}`;
    return isForcefullyTerminated ? `Command was gracefully canceled${forcefulSuffix}` : `Command was gracefully canceled with ${signal} (${signalDescription})`;
  }
  if (isCanceled)
    return `Command was canceled${forcefulSuffix}`;
  if (isMaxBuffer)
    return `${getMaxBufferMessage(originalError, maxBuffer)}${forcefulSuffix}`;
  if (errorCode !== void 0)
    return `Command failed with ${errorCode}${forcefulSuffix}`;
  if (isForcefullyTerminated)
    return `Command was killed with ${killSignal} (${getSignalDescription(killSignal)})${forcefulSuffix}`;
  if (signal !== void 0)
    return `Command was killed with ${signal} (${signalDescription})`;
  if (exitCode !== void 0)
    return `Command failed with exit code ${exitCode}`;
  return "Command failed";
}, getForcefulSuffix = (isForcefullyTerminated, forceKillAfterDelay) => isForcefullyTerminated ? ` and was forcefully terminated after ${forceKillAfterDelay} milliseconds` : "", getOriginalMessage = (originalError, cwd2) => {
  if (originalError instanceof DiscardedError)
    return;
  let originalMessage = isExecaError(originalError) ? originalError.originalMessage : String(originalError?.message ?? originalError), escapedOriginalMessage = escapeLines(fixCwdError(originalMessage, cwd2));
  return escapedOriginalMessage === "" ? void 0 : escapedOriginalMessage;
}, serializeIpcMessage = (ipcMessage) => typeof ipcMessage === "string" ? ipcMessage : inspect2(ipcMessage), serializeMessagePart = (messagePart) => Array.isArray(messagePart) ? messagePart.map((messageItem) => stripFinalNewline(serializeMessageItem(messageItem))).filter(Boolean).join(`
