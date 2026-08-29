// Original: src/ink/events/keyboard-event.ts
function keyFromParsed(parsed) {
  let seq = parsed.sequence ?? "", name3 = parsed.name ?? "";
  if (parsed.ctrl)
    return name3;
  if (seq.length === 1) {
    let code = seq.charCodeAt(0);
    if (code >= 32 && code !== 127)
      return seq;
  }
  return name3 || seq;
}
var KeyboardEvent;
var init_keyboard_event = __esm(() => {
  init_terminal_event();
  KeyboardEvent = class KeyboardEvent extends TerminalEvent {
    key;
    ctrl;
    shift;
    meta;
    superKey;
    fn;
    constructor(parsedKey) {
      super("keydown", { bubbles: !0, cancelable: !0 });
      this.key = keyFromParsed(parsedKey), this.ctrl = parsedKey.ctrl, this.shift = parsedKey.shift, this.meta = parsedKey.meta || parsedKey.option, this.superKey = parsedKey.super, this.fn = parsedKey.fn;
    }
  };
});
