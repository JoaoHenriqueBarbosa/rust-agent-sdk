// function: groupLogsBySessionId
function groupLogsBySessionId(filteredLogs) {
  let groups = /* @__PURE__ */ new Map;
  for (let log3 of filteredLogs) {
    let sessionId = getSessionIdFromLog(log3);
    if (sessionId) {
      let existing = groups.get(sessionId);
      if (existing)
        existing.push(log3);
      else
        groups.set(sessionId, [log3]);
    }
  }
  return groups.forEach((logs2) => logs2.sort((a2, b) => new Date(b.modified).getTime() - new Date(a2.modified).getTime())), groups;
}
