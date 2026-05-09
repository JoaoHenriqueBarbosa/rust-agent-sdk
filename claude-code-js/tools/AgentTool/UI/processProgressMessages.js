// function: processProgressMessages
function processProgressMessages(messages, tools, isAgentRunning) {
  return messages.filter((m4) => hasProgressMessage(m4.data) && m4.data.message.type !== "user").map((m4) => ({
    type: "original",
    message: m4
  }));
  function flushGroup(isActive) {
    if (currentGroup && (currentGroup.searchCount > 0 || currentGroup.readCount > 0 || currentGroup.replCount > 0))
      result.push({
        type: "summary",
        searchCount: currentGroup.searchCount,
        readCount: currentGroup.readCount,
        replCount: currentGroup.replCount,
        uuid: `summary-${currentGroup.startUuid}`,
        isActive
      });
    currentGroup = null;
  }
}
