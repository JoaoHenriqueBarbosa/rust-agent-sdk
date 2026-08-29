// Original: src/hooks/useLogMessages.ts
function useLogMessages(messages, ignore7 = !1) {
  let teamContext = useAppState((s2) => s2.teamContext), lastRecordedLengthRef = import_react198.useRef(0), lastParentUuidRef = import_react198.useRef(void 0), firstMessageUuidRef = import_react198.useRef(void 0), callSeqRef = import_react198.useRef(0);
  import_react198.useEffect(() => {
    if (ignore7)
      return;
    let currentFirstUuid = messages[0]?.uuid, prevLength = lastRecordedLengthRef.current, wasFirstRender = firstMessageUuidRef.current === void 0, isIncremental = currentFirstUuid !== void 0 && !wasFirstRender && currentFirstUuid === firstMessageUuidRef.current && prevLength <= messages.length, isSameHeadShrink = currentFirstUuid !== void 0 && !wasFirstRender && currentFirstUuid === firstMessageUuidRef.current && prevLength > messages.length, startIndex = isIncremental ? prevLength : 0;
    if (startIndex === messages.length)
      return;
    let slice = startIndex === 0 ? messages : messages.slice(startIndex), parentHint = isIncremental ? lastParentUuidRef.current : void 0, seq = ++callSeqRef.current;
    if (recordTranscript(slice, isAgentSwarmsEnabled() ? {
      teamName: teamContext?.teamName,
      agentName: teamContext?.selfAgentName
    } : {}, parentHint, messages).then((lastRecordedUuid) => {
      if (seq !== callSeqRef.current)
        return;
      if (lastRecordedUuid && !isIncremental)
        lastParentUuidRef.current = lastRecordedUuid;
    }), isIncremental || wasFirstRender || isSameHeadShrink) {
      let last2 = cleanMessagesForLogging(slice, messages).findLast(isChainParticipant);
      if (last2)
        lastParentUuidRef.current = last2.uuid;
    }
    lastRecordedLengthRef.current = messages.length, firstMessageUuidRef.current = currentFirstUuid;
  }, [messages, ignore7, teamContext?.teamName, teamContext?.selfAgentName]);
}
var import_react198;
var init_useLogMessages = __esm(() => {
  init_AppState();
  init_agentSwarmsEnabled();
  init_sessionStorage();
  import_react198 = __toESM(require_react_development(), 1);
});
