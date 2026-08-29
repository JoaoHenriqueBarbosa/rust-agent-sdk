// function: getAPIMetadata
function getAPIMetadata() {
  let extra = {}, extraStr = process.env.CLAUDE_CODE_EXTRA_METADATA;
  if (extraStr) {
    let parsed = safeParseJSON(extraStr, !1);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
      extra = parsed;
    else
      logForDebugging(`CLAUDE_CODE_EXTRA_METADATA env var must be a JSON object, but was given ${extraStr}`, { level: "error" });
  }
  return {
    user_id: jsonStringify({
      ...extra,
      device_id: getOrCreateUserID(),
      account_uuid: getOauthAccountInfo()?.accountUuid ?? "",
      session_id: getSessionId()
    })
  };
}
