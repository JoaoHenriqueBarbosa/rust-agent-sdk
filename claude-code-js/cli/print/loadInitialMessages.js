// function: loadInitialMessages
async function loadInitialMessages(setAppState, options2) {
  let persistSession = !isSessionPersistenceDisabled();
  if (options2.continue)
    try {
      logEvent("tengu_continue_print", {});
      let result = await loadConversationForResume(void 0, void 0);
      if (result) {
        if (!options2.forkSession) {
          if (result.sessionId) {
            if (switchSession(asSessionId(result.sessionId), result.fullPath ? dirname65(result.fullPath) : null), persistSession)
              await resetSessionFilePointer();
          }
        }
        return restoreSessionStateFromLog(result, setAppState), restoreSessionMetadata(options2.forkSession ? { ...result, worktreeSession: void 0 } : result), {
          messages: result.messages,
          turnInterruptionState: result.turnInterruptionState,
          agentSetting: result.agentSetting
        };
      }
    } catch (error44) {
      return logError2(error44), gracefulShutdownSync(1), { messages: [] };
    }
  if (options2.teleport)
    try {
      if (!isPolicyAllowed("allow_remote_sessions"))
        throw Error("Remote sessions are disabled by your organization's policy.");
      if (logEvent("tengu_teleport_print", {}), typeof options2.teleport !== "string")
        throw Error("No session ID provided for teleport");
      let {
        checkOutTeleportedSessionBranch: checkOutTeleportedSessionBranch2,
        processMessagesForTeleportResume: processMessagesForTeleportResume2,
        teleportResumeCodeSession: teleportResumeCodeSession2,
        validateGitState: validateGitState2
      } = await Promise.resolve().then(() => (init_teleport(), exports_teleport));
      await validateGitState2();
      let teleportResult = await teleportResumeCodeSession2(options2.teleport), { branchError } = await checkOutTeleportedSessionBranch2(teleportResult.branch);
      return {
        messages: processMessagesForTeleportResume2(teleportResult.log, branchError)
      };
    } catch (error44) {
      return logError2(error44), gracefulShutdownSync(1), { messages: [] };
    }
  if (options2.resume)
    try {
      logEvent("tengu_resume_print", {});
      let parsedSessionId = parseSessionIdentifier(typeof options2.resume === "string" ? options2.resume : "");
      if (!parsedSessionId) {
        let errorMessage4 = "Error: --resume requires a valid session ID when used with --print. Usage: claude -p --resume <session-id>";
        if (typeof options2.resume === "string")
          errorMessage4 += `. Session IDs must be in UUID format (e.g., 550e8400-e29b-41d4-a716-446655440000). Provided value "${options2.resume}" is not a valid UUID`;
        return emitLoadError(errorMessage4, options2.outputFormat), gracefulShutdownSync(1), { messages: [] };
      }
      if (isEnvTruthy(process.env.CLAUDE_CODE_USE_CCR_V2)) {
        let [, metadata] = await Promise.all([
          hydrateFromCCRv2InternalEvents(parsedSessionId.sessionId),
          options2.restoredWorkerState
        ]);
        if (metadata) {
          if (setAppState(externalMetadataToAppState(metadata)), typeof metadata.model === "string")
            setMainLoopModelOverride(metadata.model);
        }
      } else if (parsedSessionId.isUrl && parsedSessionId.ingressUrl && isEnvTruthy(process.env.ENABLE_SESSION_PERSISTENCE))
        await hydrateRemoteSession(parsedSessionId.sessionId, parsedSessionId.ingressUrl);
      let result = await loadConversationForResume(parsedSessionId.sessionId, parsedSessionId.jsonlFile || void 0);
      if (!result || result.messages.length === 0)
        if (parsedSessionId.isUrl || isEnvTruthy(process.env.CLAUDE_CODE_USE_CCR_V2))
          return {
            messages: await (options2.sessionStartHooksPromise ?? processSessionStartHooks("startup"))
          };
        else
          return emitLoadError(`No conversation found with session ID: ${parsedSessionId.sessionId}`, options2.outputFormat), gracefulShutdownSync(1), { messages: [] };
      if (options2.resumeSessionAt) {
        let index2 = result.messages.findIndex((m4) => m4.uuid === options2.resumeSessionAt);
        if (index2 < 0)
          return emitLoadError(`No message found with message.uuid of: ${options2.resumeSessionAt}`, options2.outputFormat), gracefulShutdownSync(1), { messages: [] };
        result.messages = index2 >= 0 ? result.messages.slice(0, index2 + 1) : [];
      }
      if (!options2.forkSession && result.sessionId) {
        if (switchSession(asSessionId(result.sessionId), result.fullPath ? dirname65(result.fullPath) : null), persistSession)
          await resetSessionFilePointer();
      }
      return restoreSessionStateFromLog(result, setAppState), restoreSessionMetadata(options2.forkSession ? { ...result, worktreeSession: void 0 } : result), {
        messages: result.messages,
        turnInterruptionState: result.turnInterruptionState,
        agentSetting: result.agentSetting
      };
    } catch (error44) {
      logError2(error44);
      let errorMessage4 = error44 instanceof Error ? `Failed to resume session: ${error44.message}` : "Failed to resume session with --print mode";
      return emitLoadError(errorMessage4, options2.outputFormat), gracefulShutdownSync(1), { messages: [] };
    }
  return {
    messages: await (options2.sessionStartHooksPromise ?? processSessionStartHooks("startup"))
  };
}
