// Original: src/keybindings/reservedShortcuts.ts
function getReservedShortcuts() {
  let platform3 = getPlatform(), reserved = [...NON_REBINDABLE, ...TERMINAL_RESERVED];
  if (platform3 === "macos")
    reserved.push(...MACOS_RESERVED);
  return reserved;
}
function normalizeKeyForComparison(key2) {
  return key2.trim().split(/\s+/).map(normalizeStep).join(" ");
}
function normalizeStep(step) {
  let parts = step.split("+"), modifiers = [], mainKey = "";
  for (let part of parts) {
    let lower = part.trim().toLowerCase();
    if ([
      "ctrl",
      "control",
      "alt",
      "opt",
      "option",
      "meta",
      "cmd",
      "command",
      "shift"
    ].includes(lower))
      if (lower === "control")
        modifiers.push("ctrl");
      else if (lower === "option" || lower === "opt")
        modifiers.push("alt");
      else if (lower === "command" || lower === "cmd")
        modifiers.push("cmd");
      else
        modifiers.push(lower);
    else
      mainKey = lower;
  }
  return modifiers.sort(), [...modifiers, mainKey].join("+");
}
var NON_REBINDABLE, TERMINAL_RESERVED, MACOS_RESERVED;
var init_reservedShortcuts = __esm(() => {
  init_platform();
  NON_REBINDABLE = [
    {
      key: "ctrl+c",
      reason: "Cannot be rebound - used for interrupt/exit (hardcoded)",
      severity: "error"
    },
    {
      key: "ctrl+d",
      reason: "Cannot be rebound - used for exit (hardcoded)",
      severity: "error"
    },
    {
      key: "ctrl+m",
      reason: "Cannot be rebound - identical to Enter in terminals (both send CR)",
      severity: "error"
    }
  ], TERMINAL_RESERVED = [
    {
      key: "ctrl+z",
      reason: "Unix process suspend (SIGTSTP)",
      severity: "warning"
    },
    {
      key: "ctrl+\\",
      reason: "Terminal quit signal (SIGQUIT)",
      severity: "error"
    }
  ], MACOS_RESERVED = [
    { key: "cmd+c", reason: "macOS system copy", severity: "error" },
    { key: "cmd+v", reason: "macOS system paste", severity: "error" },
    { key: "cmd+x", reason: "macOS system cut", severity: "error" },
    { key: "cmd+q", reason: "macOS quit application", severity: "error" },
    { key: "cmd+w", reason: "macOS close window/tab", severity: "error" },
    { key: "cmd+tab", reason: "macOS app switcher", severity: "error" },
    { key: "cmd+space", reason: "macOS Spotlight", severity: "error" }
  ];
});
