// Original: src/services/notifier.ts
async function sendNotification(notif, terminal) {
  let channel = getGlobalConfig().preferredNotifChannel;
  await executeNotificationHooks(notif);
  let methodUsed = await sendToChannel(channel, notif, terminal);
  logEvent("tengu_notification_method_used", {
    configured_channel: channel,
    method_used: methodUsed,
    term: env3.terminal
  });
}
async function sendToChannel(channel, opts, terminal) {
  let title = opts.title || DEFAULT_TITLE;
  try {
    switch (channel) {
      case "auto":
        return sendAuto(opts, terminal);
      case "iterm2":
        return terminal.notifyITerm2(opts), "iterm2";
      case "iterm2_with_bell":
        return terminal.notifyITerm2(opts), terminal.notifyBell(), "iterm2_with_bell";
      case "kitty":
        return terminal.notifyKitty({ ...opts, title, id: generateKittyId() }), "kitty";
      case "ghostty":
        return terminal.notifyGhostty({ ...opts, title }), "ghostty";
      case "terminal_bell":
        return terminal.notifyBell(), "terminal_bell";
      case "notifications_disabled":
        return "disabled";
      default:
        return "none";
    }
  } catch {
    return "error";
  }
}
async function sendAuto(opts, terminal) {
  let title = opts.title || DEFAULT_TITLE;
  switch (env3.terminal) {
    case "Apple_Terminal": {
      if (await isAppleTerminalBellDisabled())
        return terminal.notifyBell(), "terminal_bell";
      return "no_method_available";
    }
    case "iTerm.app":
      return terminal.notifyITerm2(opts), "iterm2";
    case "kitty":
      return terminal.notifyKitty({ ...opts, title, id: generateKittyId() }), "kitty";
    case "ghostty":
      return terminal.notifyGhostty({ ...opts, title }), "ghostty";
    default:
      return "no_method_available";
  }
}
function generateKittyId() {
  return Math.floor(Math.random() * 1e4);
}
async function isAppleTerminalBellDisabled() {
  try {
    if (env3.terminal !== "Apple_Terminal")
      return !1;
    let currentProfile = (await execFileNoThrow("osascript", [
      "-e",
      'tell application "Terminal" to name of current settings of front window'
    ])).stdout.trim();
    if (!currentProfile)
      return !1;
    let defaultsOutput = await execFileNoThrow("defaults", [
      "export",
      "com.apple.Terminal",
      "-"
    ]);
    if (defaultsOutput.code !== 0)
      return !1;
    let profileSettings = (await import("plist")).parse(defaultsOutput.stdout)?.["Window Settings"]?.[currentProfile];
    if (!profileSettings)
      return !1;
    return profileSettings.Bell === !1;
  } catch (error44) {
    return logError2(error44), !1;
  }
}
var DEFAULT_TITLE = "Claude Code";
var init_notifier = __esm(() => {
  init_config4();
  init_env();
  init_execFileNoThrow();
  init_hooks5();
  init_log3();
});
