// Original: src/hooks/useTeleportResume.tsx
function useTeleportResume(source) {
  let $3 = import_compiler_runtime374.c(8), [isResuming, setIsResuming] = import_react311.useState(!1), [error44, setError] = import_react311.useState(null), [selectedSession, setSelectedSession] = import_react311.useState(null), t0;
  if ($3[0] !== source)
    t0 = async (session2) => {
      setIsResuming(!0), setError(null), setSelectedSession(session2), logEvent("tengu_teleport_resume_session", {
        source,
        session_id: session2.id
      });
      try {
        let result = await teleportResumeCodeSession(session2.id);
        return setTeleportedSessionInfo({
          sessionId: session2.id
        }), setIsResuming(!1), result;
      } catch (t12) {
        let err2 = t12, teleportError = {
          message: err2 instanceof TeleportOperationError ? err2.message : errorMessage(err2),
          formattedMessage: err2 instanceof TeleportOperationError ? err2.formattedMessage : void 0,
          isOperationError: err2 instanceof TeleportOperationError
        };
        return setError(teleportError), setIsResuming(!1), null;
      }
    }, $3[0] = source, $3[1] = t0;
  else
    t0 = $3[1];
  let resumeSession = t0, t1;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => {
      setError(null);
    }, $3[2] = t1;
  else
    t1 = $3[2];
  let clearError = t1, t2;
  if ($3[3] !== error44 || $3[4] !== isResuming || $3[5] !== resumeSession || $3[6] !== selectedSession)
    t2 = {
      resumeSession,
      isResuming,
      error: error44,
      selectedSession,
      clearError
    }, $3[3] = error44, $3[4] = isResuming, $3[5] = resumeSession, $3[6] = selectedSession, $3[7] = t2;
  else
    t2 = $3[7];
  return t2;
}
var import_compiler_runtime374, import_react311;
var init_useTeleportResume = __esm(() => {
  init_state();
  init_errors();
  init_teleport();
  import_compiler_runtime374 = __toESM(require_react_compiler_runtime_development(), 1), import_react311 = __toESM(require_react_development(), 1);
});
