// Original: src/utils/telemetryAttributes.ts
function shouldIncludeAttribute(envVar) {
  let defaultValue = METRICS_CARDINALITY_DEFAULTS[envVar], envValue = process.env[envVar];
  if (envValue === void 0)
    return defaultValue;
  return isEnvTruthy(envValue);
}
function getTelemetryAttributes() {
  let userId = getOrCreateUserID(), sessionId = getSessionId(), attributes = {
    "user.id": userId
  };
  if (shouldIncludeAttribute("OTEL_METRICS_INCLUDE_SESSION_ID"))
    attributes["session.id"] = sessionId;
  if (shouldIncludeAttribute("OTEL_METRICS_INCLUDE_VERSION"))
    attributes["app.version"] = "2.1.90";
  let oauthAccount = getOauthAccountInfo();
  if (oauthAccount) {
    let { organizationUuid: orgId, emailAddress: email3, accountUuid } = oauthAccount;
    if (orgId)
      attributes["organization.id"] = orgId;
    if (email3)
      attributes["user.email"] = email3;
    if (accountUuid && shouldIncludeAttribute("OTEL_METRICS_INCLUDE_ACCOUNT_UUID"))
      attributes["user.account_uuid"] = accountUuid, attributes["user.account_id"] = process.env.CLAUDE_CODE_ACCOUNT_TAGGED_ID || toTaggedId("user", accountUuid);
  }
  if (envDynamic.terminal)
    attributes["terminal.type"] = envDynamic.terminal;
  return attributes;
}
var METRICS_CARDINALITY_DEFAULTS;
var init_telemetryAttributes = __esm(() => {
  init_state();
  init_auth14();
  init_config4();
  init_envDynamic();
  init_envUtils();
  METRICS_CARDINALITY_DEFAULTS = {
    OTEL_METRICS_INCLUDE_SESSION_ID: !0,
    OTEL_METRICS_INCLUDE_VERSION: !1,
    OTEL_METRICS_INCLUDE_ACCOUNT_UUID: !0
  };
});
