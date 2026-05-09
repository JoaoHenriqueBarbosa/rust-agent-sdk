// function: waitForNextPromptOrShutdown
async function waitForNextPromptOrShutdown(identity17, abortController, taskId, getAppState, setAppState, taskListId) {
  logForDebugging(`[inProcessRunner] ${identity17.agentName} starting poll loop (abort=${abortController.signal.aborted})`);
  let pollCount = 0;
  while (!abortController.signal.aborted) {
    let task = getAppState().tasks[taskId];
    if (task && task.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
      let message = task.pendingUserMessages[0];
      return setAppState((prev) => {
        let prevTask = prev.tasks[taskId];
        if (!prevTask || prevTask.type !== "in_process_teammate")
          return prev;
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [taskId]: {
              ...prevTask,
              pendingUserMessages: prevTask.pendingUserMessages.slice(1)
            }
          }
        };
      }), logForDebugging(`[inProcessRunner] ${identity17.agentName} found pending user message (poll #${pollCount})`), {
        type: "new_message",
        message,
        from: "user"
      };
    }
    if (pollCount > 0)
      await sleep3(500);
    if (pollCount++, abortController.signal.aborted)
      return logForDebugging(`[inProcessRunner] ${identity17.agentName} aborted while waiting (poll #${pollCount})`), { type: "aborted" };
    logForDebugging(`[inProcessRunner] ${identity17.agentName} poll #${pollCount}: checking mailbox`);
    try {
      let allMessages = await readMailbox(identity17.agentName, identity17.teamName), shutdownIndex = -1, shutdownParsed = null;
      for (let i5 = 0;i5 < allMessages.length; i5++) {
        let m4 = allMessages[i5];
        if (m4 && !m4.read) {
          let parsed = isShutdownRequest(m4.text);
          if (parsed) {
            shutdownIndex = i5, shutdownParsed = parsed;
            break;
          }
        }
      }
      if (shutdownIndex !== -1) {
        let msg = allMessages[shutdownIndex], skippedUnread = count2(allMessages.slice(0, shutdownIndex), (m4) => !m4.read);
        return logForDebugging(`[inProcessRunner] ${identity17.agentName} received shutdown request from ${shutdownParsed?.from} (prioritized over ${skippedUnread} unread messages)`), await markMessageAsReadByIndex(identity17.agentName, identity17.teamName, shutdownIndex), {
          type: "shutdown_request",
          request: shutdownParsed,
          originalMessage: msg.text
        };
      }
      let selectedIndex = -1;
      for (let i5 = 0;i5 < allMessages.length; i5++) {
        let m4 = allMessages[i5];
        if (m4 && !m4.read && m4.from === TEAM_LEAD_NAME) {
          selectedIndex = i5;
          break;
        }
      }
      if (selectedIndex === -1)
        selectedIndex = allMessages.findIndex((m4) => !m4.read);
      if (selectedIndex !== -1) {
        let msg = allMessages[selectedIndex];
        if (msg)
          return logForDebugging(`[inProcessRunner] ${identity17.agentName} received new message from ${msg.from} (index ${selectedIndex})`), await markMessageAsReadByIndex(identity17.agentName, identity17.teamName, selectedIndex), {
            type: "new_message",
            message: msg.text,
            from: msg.from,
            color: msg.color,
            summary: msg.summary
          };
      }
    } catch (err2) {
      logForDebugging(`[inProcessRunner] ${identity17.agentName} poll error: ${err2}`);
    }
    let taskPrompt = await tryClaimNextTask(taskListId, identity17.agentName);
    if (taskPrompt)
      return {
        type: "new_message",
        message: taskPrompt,
        from: "task-list"
      };
  }
  return logForDebugging(`[inProcessRunner] ${identity17.agentName} exiting poll loop (abort=${abortController.signal.aborted}, polls=${pollCount})`), { type: "aborted" };
}
