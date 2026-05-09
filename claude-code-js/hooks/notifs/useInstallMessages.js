// Original: src/hooks/notifs/useInstallMessages.tsx
function useInstallMessages() {
  useStartupNotification(_temp284);
}
async function _temp284() {
  return (await checkInstall()).map(_temp204);
}
function _temp204(message, index2) {
  let priority = "low";
  if (message.type === "error" || message.userActionRequired)
    priority = "high";
  else if (message.type === "path" || message.type === "alias")
    priority = "medium";
  return {
    key: `install-message-${index2}-${message.type}`,
    text: message.message,
    priority,
    color: message.type === "error" ? "error" : "warning"
  };
}
var init_useInstallMessages = __esm(() => {
  init_nativeInstaller();
  init_useStartupNotification();
});
