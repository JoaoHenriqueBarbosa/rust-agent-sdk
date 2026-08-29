// function: teleportResumeCodeSession
async function teleportResumeCodeSession(sessionId, onProgress) {
  if (!isPolicyAllowed("allow_remote_sessions"))
    throw Error("Remote sessions are disabled by your organization's policy.");
  logForDebugging(`Resuming code session ID: ${sessionId}`);
  try {
    let accessToken = getClaudeAIOAuthTokens()?.accessToken;
    if (!accessToken)
      throw logEvent("tengu_teleport_resume_error", {
        error_type: "no_access_token"
      }), Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
    let orgUUID = await getOrganizationUUID();
    if (!orgUUID)
      throw logEvent("tengu_teleport_resume_error", {
        error_type: "no_org_uuid"
      }), Error("Unable to get organization UUID for constructing session URL");
    onProgress?.("validating");
    let sessionData = await fetchSession(sessionId), repoValidation = await validateSessionRepository(sessionData);
    switch (repoValidation.status) {
      case "match":
      case "no_repo_required":
        break;
      case "not_in_repo": {
        logEvent("tengu_teleport_error_repo_not_in_git_dir_sessions_api", {
          sessionId
        });
        let notInRepoDisplay = repoValidation.sessionHost && repoValidation.sessionHost.toLowerCase() !== "github.com" ? `${repoValidation.sessionHost}/${repoValidation.sessionRepo}` : repoValidation.sessionRepo;
        throw new TeleportOperationError(`You must run claude --teleport ${sessionId} from a checkout of ${notInRepoDisplay}.`, source_default.red(`You must run claude --teleport ${sessionId} from a checkout of ${source_default.bold(notInRepoDisplay)}.
`));
      }
      case "mismatch": {
        logEvent("tengu_teleport_error_repo_mismatch_sessions_api", {
          sessionId
        });
        let hostsDiffer = repoValidation.sessionHost && repoValidation.currentHost && repoValidation.sessionHost.replace(/:\d+$/, "").toLowerCase() !== repoValidation.currentHost.replace(/:\d+$/, "").toLowerCase(), sessionDisplay = hostsDiffer ? `${repoValidation.sessionHost}/${repoValidation.sessionRepo}` : repoValidation.sessionRepo, currentDisplay = hostsDiffer ? `${repoValidation.currentHost}/${repoValidation.currentRepo}` : repoValidation.currentRepo;
        throw new TeleportOperationError(`You must run claude --teleport ${sessionId} from a checkout of ${sessionDisplay}.
This repo is ${currentDisplay}.`, source_default.red(`You must run claude --teleport ${sessionId} from a checkout of ${source_default.bold(sessionDisplay)}.
This repo is ${source_default.bold(currentDisplay)}.
`));
      }
      case "error":
        throw new TeleportOperationError(repoValidation.errorMessage || "Failed to validate session repository", source_default.red(`Error: ${repoValidation.errorMessage || "Failed to validate session repository"}
`));
      default: {
        let _exhaustive = repoValidation.status;
        throw Error(`Unhandled repo validation status: ${_exhaustive}`);
      }
    }
    return await teleportFromSessionsAPI(sessionId, orgUUID, accessToken, onProgress, sessionData);
  } catch (error44) {
    if (error44 instanceof TeleportOperationError)
      throw error44;
    let err2 = toError(error44);
    throw logError2(err2), logEvent("tengu_teleport_resume_error", {
      error_type: "resume_session_id_catch"
    }), new TeleportOperationError(err2.message, source_default.red(`Error: ${err2.message}
`));
  }
}
