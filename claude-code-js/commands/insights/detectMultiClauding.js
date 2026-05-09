// function: detectMultiClauding
function detectMultiClauding(sessions) {
  let allSessionMessages = [];
  for (let session2 of sessions)
    for (let timestamp of session2.user_message_timestamps)
      try {
        let ts = new Date(timestamp).getTime();
        allSessionMessages.push({ ts, sessionId: session2.session_id });
      } catch {}
  allSessionMessages.sort((a2, b) => a2.ts - b.ts);
  let multiClaudeSessionPairs = /* @__PURE__ */ new Set, messagesDuringMulticlaude = /* @__PURE__ */ new Set, windowStart = 0, sessionLastIndex = /* @__PURE__ */ new Map;
  for (let i5 = 0;i5 < allSessionMessages.length; i5++) {
    let msg = allSessionMessages[i5];
    while (windowStart < i5 && msg.ts - allSessionMessages[windowStart].ts > 1800000) {
      let expiring = allSessionMessages[windowStart];
      if (sessionLastIndex.get(expiring.sessionId) === windowStart)
        sessionLastIndex.delete(expiring.sessionId);
      windowStart++;
    }
    let prevIndex = sessionLastIndex.get(msg.sessionId);
    if (prevIndex !== void 0)
      for (let j4 = prevIndex + 1;j4 < i5; j4++) {
        let between = allSessionMessages[j4];
        if (between.sessionId !== msg.sessionId) {
          let pair = [msg.sessionId, between.sessionId].sort().join(":");
          multiClaudeSessionPairs.add(pair), messagesDuringMulticlaude.add(`${allSessionMessages[prevIndex].ts}:${msg.sessionId}`), messagesDuringMulticlaude.add(`${between.ts}:${between.sessionId}`), messagesDuringMulticlaude.add(`${msg.ts}:${msg.sessionId}`);
          break;
        }
      }
    sessionLastIndex.set(msg.sessionId, i5);
  }
  let sessionsWithOverlaps = /* @__PURE__ */ new Set;
  for (let pair of multiClaudeSessionPairs) {
    let [s1, s2] = pair.split(":");
    if (s1)
      sessionsWithOverlaps.add(s1);
    if (s2)
      sessionsWithOverlaps.add(s2);
  }
  return {
    overlap_events: multiClaudeSessionPairs.size,
    sessions_involved: sessionsWithOverlaps.size,
    user_messages_during: messagesDuringMulticlaude.size
  };
}
