// Original: src/commands/session/index.ts
var session, session_default;
var init_session2 = __esm(() => {
  init_state();
  session = {
    type: "local-jsx",
    name: "session",
    aliases: ["remote"],
    description: "Show remote session URL and QR code",
    isEnabled: () => getIsRemoteMode(),
    get isHidden() {
      return !getIsRemoteMode();
    },
    load: () => Promise.resolve().then(() => (init_session(), exports_session))
  }, session_default = session;
});
