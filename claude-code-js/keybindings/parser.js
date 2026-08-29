// Original: src/keybindings/parser.ts
function parseKeystroke(input) {
  let parts = input.split("+"), keystroke = {
    key: "",
    ctrl: !1,
    alt: !1,
    shift: !1,
    meta: !1,
    super: !1
  };
  for (let part of parts) {
    let lower = part.toLowerCase();
    switch (lower) {
      case "ctrl":
      case "control":
        keystroke.ctrl = !0;
        break;
      case "alt":
      case "opt":
      case "option":
        keystroke.alt = !0;
        break;
      case "shift":
        keystroke.shift = !0;
        break;
      case "meta":
        keystroke.meta = !0;
        break;
      case "cmd":
      case "command":
      case "super":
      case "win":
        keystroke.super = !0;
        break;
      case "esc":
        keystroke.key = "escape";
        break;
      case "return":
        keystroke.key = "enter";
        break;
      case "space":
        keystroke.key = " ";
        break;
      case "\u2191":
        keystroke.key = "up";
        break;
      case "\u2193":
        keystroke.key = "down";
        break;
      case "\u2190":
        keystroke.key = "left";
        break;
      case "\u2192":
        keystroke.key = "right";
        break;
      default:
        keystroke.key = lower;
        break;
    }
  }
  return keystroke;
}
function parseChord(input) {
  if (input === " ")
    return [parseKeystroke("space")];
  return input.trim().split(/\s+/).map(parseKeystroke);
}
function keystrokeToString(ks) {
  let parts = [];
  if (ks.ctrl)
    parts.push("ctrl");
  if (ks.alt)
    parts.push("alt");
  if (ks.shift)
    parts.push("shift");
  if (ks.meta)
    parts.push("meta");
  if (ks.super)
    parts.push("cmd");
  let displayKey = keyToDisplayName(ks.key);
  return parts.push(displayKey), parts.join("+");
}
function keyToDisplayName(key2) {
  switch (key2) {
    case "escape":
      return "Esc";
    case " ":
      return "Space";
    case "tab":
      return "tab";
    case "enter":
      return "Enter";
    case "backspace":
      return "Backspace";
    case "delete":
      return "Delete";
    case "up":
      return "\u2191";
    case "down":
      return "\u2193";
    case "left":
      return "\u2190";
    case "right":
      return "\u2192";
    case "pageup":
      return "PageUp";
    case "pagedown":
      return "PageDown";
    case "home":
      return "Home";
    case "end":
      return "End";
    default:
      return key2;
  }
}
function chordToString(chord) {
  return chord.map(keystrokeToString).join(" ");
}
function parseBindings(blocks) {
  let bindings = [];
  for (let block2 of blocks)
    for (let [key2, action] of Object.entries(block2.bindings))
      bindings.push({
        chord: parseChord(key2),
        action,
        context: block2.context
      });
  return bindings;
}
