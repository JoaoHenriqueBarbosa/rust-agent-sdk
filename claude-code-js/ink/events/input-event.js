// Original: src/ink/events/input-event.ts
function parseKey(keypress) {
  let key = {
    upArrow: keypress.name === "up",
    downArrow: keypress.name === "down",
    leftArrow: keypress.name === "left",
    rightArrow: keypress.name === "right",
    pageDown: keypress.name === "pagedown",
    pageUp: keypress.name === "pageup",
    wheelUp: keypress.name === "wheelup",
    wheelDown: keypress.name === "wheeldown",
    home: keypress.name === "home",
    end: keypress.name === "end",
    return: keypress.name === "return",
    escape: keypress.name === "escape",
    fn: keypress.fn,
    ctrl: keypress.ctrl,
    shift: keypress.shift,
    tab: keypress.name === "tab",
    backspace: keypress.name === "backspace",
    delete: keypress.name === "delete",
    meta: keypress.meta || keypress.name === "escape" || keypress.option,
    super: keypress.super
  }, input = keypress.ctrl ? keypress.name : keypress.sequence;
  if (input === void 0)
    input = "";
  if (keypress.ctrl && input === "space")
    input = " ";
  if (keypress.code && !keypress.name)
    input = "";
  if (!keypress.name && /^\[<\d+;\d+;\d+[Mm]/.test(input))
    input = "";
  if (input.startsWith("\x1B"))
    input = input.slice(1);
  let processedAsSpecialSequence = !1;
  if (/^\[\d/.test(input) && input.endsWith("u")) {
    if (!keypress.name)
      input = "";
    else
      input = keypress.name === "space" ? " " : keypress.name === "escape" ? "" : keypress.name;
    processedAsSpecialSequence = !0;
  }
  if (input.startsWith("[27;") && input.endsWith("~")) {
    if (!keypress.name)
      input = "";
    else
      input = keypress.name === "space" ? " " : keypress.name === "escape" ? "" : keypress.name;
    processedAsSpecialSequence = !0;
  }
  if (input.startsWith("O") && input.length === 2 && keypress.name && keypress.name.length === 1)
    input = keypress.name, processedAsSpecialSequence = !0;
  if (!processedAsSpecialSequence && keypress.name && nonAlphanumericKeys.includes(keypress.name))
    input = "";
  if (input.length === 1 && typeof input[0] === "string" && input[0] >= "A" && input[0] <= "Z")
    key.shift = !0;
  return [key, input];
}
var InputEvent;
var init_input_event = __esm(() => {
  init_parse_keypress();
  InputEvent = class InputEvent extends Event2 {
    keypress;
    key;
    input;
    constructor(keypress) {
      super();
      let [key, input] = parseKey(keypress);
      this.keypress = keypress, this.key = key, this.input = input;
    }
  };
});
