// Original: src/services/mcp/vscodeSdkMcp.ts
function readAutoModeEnabledState() {
  let v2 = {}.enabled;
  return v2 === "enabled" || v2 === "disabled" || v2 === "opt-in" ? v2 : void 0;
}
function notifyVscodeFileUpdated(filePath, oldContent, newContent) {
  return;
}
function setupVscodeSdkMcp(sdkClients) {
  let client15 = sdkClients.find((client16) => client16.name === "claude-vscode");
  if (client15 && client15.type === "connected") {
    vscodeMcpClient = client15, client15.client.setNotificationHandler(LogEventNotificationSchema(), async (notification) => {
      let { eventName, eventData } = notification.params;
      logEvent(`tengu_vscode_${eventName}`, eventData);
    });
    let gates = {
      tengu_vscode_review_upsell: !1,
      tengu_vscode_onboarding: !1,
      tengu_quiet_fern: !1,
      tengu_vscode_cc_auth: !1
    }, autoModeState = readAutoModeEnabledState();
    if (autoModeState !== void 0)
      gates.tengu_auto_mode_state = autoModeState;
    client15.client.notification({
      method: "experiment_gates",
      params: { gates }
    });
  }
}
var LogEventNotificationSchema, vscodeMcpClient = null;
var init_vscodeSdkMcp = __esm(() => {
  init_debug();
  init_v4();
  LogEventNotificationSchema = lazySchema(() => exports_external.object({
    method: exports_external.literal("log_event"),
    params: exports_external.object({
      eventName: exports_external.string(),
      eventData: exports_external.object({}).passthrough()
    })
  }));
});
