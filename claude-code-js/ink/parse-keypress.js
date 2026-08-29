// Original: src/ink/parse-keypress.ts
import { Buffer as Buffer14 } from "buffer";
function createPasteKey(content) {
  return {
    kind: "key",
    name: "",
    fn: !1,
    ctrl: !1,
    meta: !1,
    shift: !1,
    option: !1,
    super: !1,
    sequence: content,
    raw: content,
    isPasted: !0
  };
}
function parseTerminalResponse(s2) {
  if (s2.startsWith("\x1B[")) {
    let m4;
    if (m4 = DECRPM_RE.exec(s2))
      return {
        type: "decrpm",
        mode: parseInt(m4[1], 10),
        status: parseInt(m4[2], 10)
      };
    if (m4 = DA1_RE.exec(s2))
      return { type: "da1", params: splitNumericParams(m4[1]) };
    if (m4 = DA2_RE.exec(s2))
      return { type: "da2", params: splitNumericParams(m4[1]) };
    if (m4 = KITTY_FLAGS_RE.exec(s2))
      return { type: "kittyKeyboard", flags: parseInt(m4[1], 10) };
    if (m4 = CURSOR_POSITION_RE.exec(s2))
      return {
        type: "cursorPosition",
        row: parseInt(m4[1], 10),
        col: parseInt(m4[2], 10)
      };
    return null;
  }
  if (s2.startsWith("\x1B]")) {
    let m4 = OSC_RESPONSE_RE.exec(s2);
    if (m4)
      return { type: "osc", code: parseInt(m4[1], 10), data: m4[2] };
  }
  if (s2.startsWith("\x1BP")) {
    let m4 = XTVERSION_RE.exec(s2);
    if (m4)
      return { type: "xtversion", name: m4[1] };
  }
  return null;
}
function splitNumericParams(params) {
  if (!params)
    return [];
  return params.split(";").map((p4) => parseInt(p4, 10));
}
function inputToString(input) {
  if (Buffer14.isBuffer(input))
    if (input[0] > 127 && input[1] === void 0)
      return input[0] -= 128, "\x1B" + String(input);
    else
      return String(input);
  else if (input !== void 0 && typeof input !== "string")
    return String(input);
  else if (!input)
    return "";
  else
    return input;
}
function parseMultipleKeypresses(prevState, input = "") {
  let isFlush = input === null, inputString = isFlush ? "" : inputToString(input), tokenizer = prevState._tokenizer ?? createTokenizer({ x10Mouse: !0 }), tokens = isFlush ? tokenizer.flush() : tokenizer.feed(inputString), keys2 = [], inPaste = prevState.mode === "IN_PASTE", pasteBuffer = prevState.pasteBuffer;
  for (let token of tokens)
    if (token.type === "sequence")
      if (token.value === PASTE_START)
        inPaste = !0, pasteBuffer = "";
      else if (token.value === PASTE_END)
        keys2.push(createPasteKey(pasteBuffer)), inPaste = !1, pasteBuffer = "";
      else if (inPaste)
        pasteBuffer += token.value;
      else {
        let response7 = parseTerminalResponse(token.value);
        if (response7)
          keys2.push({ kind: "response", sequence: token.value, response: response7 });
        else {
          let mouse = parseMouseEvent(token.value);
          if (mouse)
            keys2.push(mouse);
          else
            keys2.push(parseKeypress(token.value));
        }
      }
    else if (token.type === "text")
      if (inPaste)
        pasteBuffer += token.value;
      else if (/^\[<\d+;\d+;\d+[Mm]$/.test(token.value) || /^\[M[\x60-\x7f][\x20-\uffff]{2}$/.test(token.value)) {
        let resynthesized = "\x1B" + token.value, mouse = parseMouseEvent(resynthesized);
        keys2.push(mouse ?? parseKeypress(resynthesized));
      } else
        keys2.push(parseKeypress(token.value));
  if (isFlush && inPaste && pasteBuffer)
    keys2.push(createPasteKey(pasteBuffer)), inPaste = !1, pasteBuffer = "";
  let newState = {
    mode: inPaste ? "IN_PASTE" : "NORMAL",
    incomplete: tokenizer.buffer(),
    pasteBuffer,
    _tokenizer: tokenizer
  };
  return [keys2, newState];
}
function decodeModifier(modifier) {
  let m4 = modifier - 1;
  return {
    shift: !!(m4 & 1),
    meta: !!(m4 & 2),
    ctrl: !!(m4 & 4),
    super: !!(m4 & 8)
  };
}
function keycodeToName(keycode) {
  switch (keycode) {
    case 9:
      return "tab";
    case 13:
      return "return";
    case 27:
      return "escape";
    case 32:
      return "space";
    case 127:
      return "backspace";
    case 57399:
      return "0";
    case 57400:
      return "1";
    case 57401:
      return "2";
    case 57402:
      return "3";
    case 57403:
      return "4";
    case 57404:
      return "5";
    case 57405:
      return "6";
    case 57406:
      return "7";
    case 57407:
      return "8";
    case 57408:
      return "9";
    case 57409:
      return ".";
    case 57410:
      return "/";
    case 57411:
      return "*";
    case 57412:
      return "-";
    case 57413:
      return "+";
    case 57414:
      return "return";
    case 57415:
      return "=";
    default:
      if (keycode >= 32 && keycode <= 126)
        return String.fromCharCode(keycode).toLowerCase();
      return;
  }
}
function parseMouseEvent(s2) {
  let match = SGR_MOUSE_RE.exec(s2);
  if (!match)
    return null;
  let button = parseInt(match[1], 10);
  if ((button & 64) !== 0)
    return null;
  return {
    kind: "mouse",
    button,
    action: match[4] === "M" ? "press" : "release",
    col: parseInt(match[2], 10),
    row: parseInt(match[3], 10),
    sequence: s2
  };
}
function parseKeypress(s2 = "") {
  let parts, key = {
    kind: "key",
    name: "",
    fn: !1,
    ctrl: !1,
    meta: !1,
    shift: !1,
    option: !1,
    super: !1,
    sequence: s2,
    raw: s2,
    isPasted: !1
  };
  key.sequence = key.sequence || s2 || key.name;
  let match;
  if (match = CSI_U_RE.exec(s2)) {
    let codepoint = parseInt(match[1], 10), modifier = match[2] ? parseInt(match[2], 10) : 1, mods = decodeModifier(modifier);
    return {
      kind: "key",
      name: keycodeToName(codepoint),
      fn: !1,
      ctrl: mods.ctrl,
      meta: mods.meta,
      shift: mods.shift,
      option: !1,
      super: mods.super,
      sequence: s2,
      raw: s2,
      isPasted: !1
    };
  }
  if (match = MODIFY_OTHER_KEYS_RE.exec(s2)) {
    let mods = decodeModifier(parseInt(match[1], 10));
    return {
      kind: "key",
      name: keycodeToName(parseInt(match[2], 10)),
      fn: !1,
      ctrl: mods.ctrl,
      meta: mods.meta,
      shift: mods.shift,
      option: !1,
      super: mods.super,
      sequence: s2,
      raw: s2,
      isPasted: !1
    };
  }
  if (match = SGR_MOUSE_RE.exec(s2)) {
    let button = parseInt(match[1], 10);
    if ((button & 67) === 64)
      return createNavKey(s2, "wheelup", !1);
    if ((button & 67) === 65)
      return createNavKey(s2, "wheeldown", !1);
    return createNavKey(s2, "mouse", !1);
  }
  if (s2.length === 6 && s2.startsWith("\x1B[M")) {
    let button = s2.charCodeAt(3) - 32;
    if ((button & 67) === 64)
      return createNavKey(s2, "wheelup", !1);
    if ((button & 67) === 65)
      return createNavKey(s2, "wheeldown", !1);
    return createNavKey(s2, "mouse", !1);
  }
  if (s2 === "\r")
    key.raw = void 0, key.name = "return";
  else if (s2 === `
`)
    key.name = "enter";
  else if (s2 === "\t")
    key.name = "tab";
  else if (s2 === "\b" || s2 === "\x1B\b")
    key.name = "backspace", key.meta = s2.charAt(0) === "\x1B";
  else if (s2 === "\x7F" || s2 === "\x1B\x7F")
    key.name = "backspace", key.meta = s2.charAt(0) === "\x1B";
  else if (s2 === "\x1B" || s2 === "\x1B\x1B")
    key.name = "escape", key.meta = s2.length === 2;
  else if (s2 === " " || s2 === "\x1B ")
    key.name = "space", key.meta = s2.length === 2;
  else if (s2 === "\x1F")
    key.name = "_", key.ctrl = !0;
  else if (s2 <= "\x1A" && s2.length === 1)
    key.name = String.fromCharCode(s2.charCodeAt(0) + 97 - 1), key.ctrl = !0;
  else if (s2.length === 1 && s2 >= "0" && s2 <= "9")
    key.name = "number";
  else if (s2.length === 1 && s2 >= "a" && s2 <= "z")
    key.name = s2;
  else if (s2.length === 1 && s2 >= "A" && s2 <= "Z")
    key.name = s2.toLowerCase(), key.shift = !0;
  else if (parts = META_KEY_CODE_RE.exec(s2))
    key.meta = !0, key.shift = /^[A-Z]$/.test(parts[1]);
  else if (parts = FN_KEY_RE.exec(s2)) {
    let segs = [...s2];
    if (segs[0] === "\x1B" && segs[1] === "\x1B")
      key.option = !0;
    let code = [parts[1], parts[2], parts[4], parts[6]].filter(Boolean).join(""), modifier = (parts[3] || parts[5] || 1) - 1;
    key.ctrl = !!(modifier & 4), key.meta = !!(modifier & 2), key.super = !!(modifier & 8), key.shift = !!(modifier & 1), key.code = code, key.name = keyName[code], key.shift = isShiftKey(code) || key.shift, key.ctrl = isCtrlKey(code) || key.ctrl;
  }
  if (key.raw === "\x1Bb")
    key.meta = !0, key.name = "left";
  else if (key.raw === "\x1Bf")
    key.meta = !0, key.name = "right";
  switch (s2) {
    case "\x1B[1~":
      return createNavKey(s2, "home", !1);
    case "\x1B[4~":
      return createNavKey(s2, "end", !1);
    case "\x1B[5~":
      return createNavKey(s2, "pageup", !1);
    case "\x1B[6~":
      return createNavKey(s2, "pagedown", !1);
    case "\x1B[1;5D":
      return createNavKey(s2, "left", !0);
    case "\x1B[1;5C":
      return createNavKey(s2, "right", !0);
  }
  return key;
}
function createNavKey(s2, name3, ctrl) {
  return {
    kind: "key",
    name: name3,
    ctrl,
    meta: !1,
    shift: !1,
    option: !1,
    super: !1,
    fn: !1,
    sequence: s2,
    raw: s2,
    isPasted: !1
  };
}
var META_KEY_CODE_RE, FN_KEY_RE, CSI_U_RE, MODIFY_OTHER_KEYS_RE, DECRPM_RE, DA1_RE, DA2_RE, KITTY_FLAGS_RE, CURSOR_POSITION_RE, OSC_RESPONSE_RE, XTVERSION_RE, SGR_MOUSE_RE, INITIAL_STATE, keyName, nonAlphanumericKeys, isShiftKey = (code) => {
  return [
    "[a",
    "[b",
    "[c",
    "[d",
    "[e",
    "[2$",
    "[3$",
    "[5$",
    "[6$",
    "[7$",
    "[8$",
    "[Z"
  ].includes(code);
}, isCtrlKey = (code) => {
  return [
    "Oa",
    "Ob",
    "Oc",
    "Od",
    "Oe",
    "[2^",
    "[3^",
    "[5^",
    "[6^",
    "[7^",
    "[8^"
  ].includes(code);
};
var init_parse_keypress = __esm(() => {
  init_csi();
  init_tokenize();
  META_KEY_CODE_RE = /^(?:\x1b)([a-zA-Z0-9])$/, FN_KEY_RE = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/, CSI_U_RE = /^\x1b\[(\d+)(?:;(\d+))?u/, MODIFY_OTHER_KEYS_RE = /^\x1b\[27;(\d+);(\d+)~/, DECRPM_RE = /^\x1b\[\?(\d+);(\d+)\$y$/, DA1_RE = /^\x1b\[\?([\d;]*)c$/, DA2_RE = /^\x1b\[>([\d;]*)c$/, KITTY_FLAGS_RE = /^\x1b\[\?(\d+)u$/, CURSOR_POSITION_RE = /^\x1b\[\?(\d+);(\d+)R$/, OSC_RESPONSE_RE = /^\x1b\](\d+);(.*?)(?:\x07|\x1b\\)$/s, XTVERSION_RE = /^\x1bP>\|(.*?)(?:\x07|\x1b\\)$/s, SGR_MOUSE_RE = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])$/;
  INITIAL_STATE = {
    mode: "NORMAL",
    incomplete: "",
    pasteBuffer: ""
  };
  keyName = {
    OP: "f1",
    OQ: "f2",
    OR: "f3",
    OS: "f4",
    Op: "0",
    Oq: "1",
    Or: "2",
    Os: "3",
    Ot: "4",
    Ou: "5",
    Ov: "6",
    Ow: "7",
    Ox: "8",
    Oy: "9",
    Oj: "*",
    Ok: "+",
    Ol: ",",
    Om: "-",
    On: ".",
    Oo: "/",
    OM: "return",
    "[11~": "f1",
    "[12~": "f2",
    "[13~": "f3",
    "[14~": "f4",
    "[[A": "f1",
    "[[B": "f2",
    "[[C": "f3",
    "[[D": "f4",
    "[[E": "f5",
    "[15~": "f5",
    "[17~": "f6",
    "[18~": "f7",
    "[19~": "f8",
    "[20~": "f9",
    "[21~": "f10",
    "[23~": "f11",
    "[24~": "f12",
    "[A": "up",
    "[B": "down",
    "[C": "right",
    "[D": "left",
    "[E": "clear",
    "[F": "end",
    "[H": "home",
    OA: "up",
    OB: "down",
    OC: "right",
    OD: "left",
    OE: "clear",
    OF: "end",
    OH: "home",
    "[1~": "home",
    "[2~": "insert",
    "[3~": "delete",
    "[4~": "end",
    "[5~": "pageup",
    "[6~": "pagedown",
    "[[5~": "pageup",
    "[[6~": "pagedown",
    "[7~": "home",
    "[8~": "end",
    "[a": "up",
    "[b": "down",
    "[c": "right",
    "[d": "left",
    "[e": "clear",
    "[2$": "insert",
    "[3$": "delete",
    "[5$": "pageup",
    "[6$": "pagedown",
    "[7$": "home",
    "[8$": "end",
    Oa: "up",
    Ob: "down",
    Oc: "right",
    Od: "left",
    Oe: "clear",
    "[2^": "insert",
    "[3^": "delete",
    "[5^": "pageup",
    "[6^": "pagedown",
    "[7^": "home",
    "[8^": "end",
    "[Z": "tab"
  }, nonAlphanumericKeys = [
    ...Object.values(keyName).filter((v2) => v2.length > 1),
    "escape",
    "backspace",
    "wheelup",
    "wheeldown",
    "mouse"
  ];
});
