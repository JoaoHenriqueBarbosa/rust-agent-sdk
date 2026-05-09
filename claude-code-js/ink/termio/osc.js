// Original: src/ink/termio/osc.ts
import { Buffer as Buffer15 } from "buffer";
function osc(...parts) {
  let terminator = env3.terminal === "kitty" ? ST : BEL;
  return `${OSC_PREFIX}${parts.join(SEP)}${terminator}`;
}
function wrapForMultiplexer(sequence) {
  if (process.env.TMUX)
    return `\x1BPtmux;${sequence.replaceAll("\x1B", "\x1B\x1B")}\x1B\\`;
  if (process.env.STY)
    return `\x1BP${sequence}\x1B\\`;
  return sequence;
}
function getClipboardPath() {
  if (process.platform === "darwin" && !process.env.SSH_CONNECTION)
    return "native";
  if (process.env.TMUX)
    return "tmux-buffer";
  return "osc52";
}
function tmuxPassthrough(payload) {
  return `${ESC}Ptmux;${payload.replaceAll(ESC, ESC + ESC)}${ST}`;
}
async function tmuxLoadBuffer(text) {
  if (!process.env.TMUX)
    return !1;
  let args = process.env.LC_TERMINAL === "iTerm2" ? ["load-buffer", "-"] : ["load-buffer", "-w", "-"], { code } = await execFileNoThrow("tmux", args, {
    input: text,
    useCwd: !1,
    timeout: 2000
  });
  return code === 0;
}
async function setClipboard(text) {
  let b64 = Buffer15.from(text, "utf8").toString("base64"), raw = osc(OSC.CLIPBOARD, "c", b64);
  if (!process.env.SSH_CONNECTION)
    copyNative(text);
  if (await tmuxLoadBuffer(text))
    return tmuxPassthrough(`${ESC}]52;c;${b64}${BEL}`);
  return raw;
}
function copyNative(text) {
  let opts = { input: text, useCwd: !1, timeout: 2000 };
  switch (process.platform) {
    case "darwin":
      execFileNoThrow("pbcopy", [], opts);
      return;
    case "linux": {
      if (linuxCopy === null)
        return;
      if (linuxCopy === "wl-copy") {
        execFileNoThrow("wl-copy", [], opts);
        return;
      }
      if (linuxCopy === "xclip") {
        execFileNoThrow("xclip", ["-selection", "clipboard"], opts);
        return;
      }
      if (linuxCopy === "xsel") {
        execFileNoThrow("xsel", ["--clipboard", "--input"], opts);
        return;
      }
      execFileNoThrow("wl-copy", [], opts).then((r4) => {
        if (r4.code === 0) {
          linuxCopy = "wl-copy";
          return;
        }
        execFileNoThrow("xclip", ["-selection", "clipboard"], opts).then((r22) => {
          if (r22.code === 0) {
            linuxCopy = "xclip";
            return;
          }
          execFileNoThrow("xsel", ["--clipboard", "--input"], opts).then((r32) => {
            linuxCopy = r32.code === 0 ? "xsel" : null;
          });
        });
      });
      return;
    }
    case "win32":
      execFileNoThrow("clip", [], opts);
      return;
  }
}
function parseOSC(content) {
  let semicolonIdx = content.indexOf(";"), command12 = semicolonIdx >= 0 ? content.slice(0, semicolonIdx) : content, data = semicolonIdx >= 0 ? content.slice(semicolonIdx + 1) : "", commandNum = parseInt(command12, 10);
  if (commandNum === OSC.SET_TITLE_AND_ICON)
    return { type: "title", action: { type: "both", title: data } };
  if (commandNum === OSC.SET_ICON)
    return { type: "title", action: { type: "iconName", name: data } };
  if (commandNum === OSC.SET_TITLE)
    return { type: "title", action: { type: "windowTitle", title: data } };
  if (commandNum === OSC.HYPERLINK) {
    let parts = data.split(";"), paramsStr = parts[0] ?? "", url3 = parts.slice(1).join(";");
    if (url3 === "")
      return { type: "link", action: { type: "end" } };
    let params = {};
    if (paramsStr)
      for (let pair of paramsStr.split(":")) {
        let eqIdx = pair.indexOf("=");
        if (eqIdx >= 0)
          params[pair.slice(0, eqIdx)] = pair.slice(eqIdx + 1);
      }
    return {
      type: "link",
      action: {
        type: "start",
        url: url3,
        params: Object.keys(params).length > 0 ? params : void 0
      }
    };
  }
  if (commandNum === OSC.TAB_STATUS)
    return { type: "tabStatus", action: parseTabStatus(data) };
  return { type: "unknown", sequence: `\x1B]${content}` };
}
function parseOscColor(spec) {
  let hex = spec.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (hex)
    return {
      type: "rgb",
      r: parseInt(hex[1], 16),
      g: parseInt(hex[2], 16),
      b: parseInt(hex[3], 16)
    };
  let rgb = spec.match(/^rgb:([0-9a-f]{1,4})\/([0-9a-f]{1,4})\/([0-9a-f]{1,4})$/i);
  if (rgb) {
    let scale = (s2) => Math.round(parseInt(s2, 16) / (16 ** s2.length - 1) * 255);
    return {
      type: "rgb",
      r: scale(rgb[1]),
      g: scale(rgb[2]),
      b: scale(rgb[3])
    };
  }
  return null;
}
function parseTabStatus(data) {
  let action = {};
  for (let [key, value] of splitTabStatusPairs(data))
    switch (key) {
      case "indicator":
        action.indicator = value === "" ? null : parseOscColor(value);
        break;
      case "status":
        action.status = value === "" ? null : value;
        break;
      case "status-color":
        action.statusColor = value === "" ? null : parseOscColor(value);
        break;
    }
  return action;
}
function* splitTabStatusPairs(data) {
  let key = "", val = "", inVal = !1, esc2 = !1;
  for (let c3 of data)
    if (esc2) {
      if (inVal)
        val += c3;
      else
        key += c3;
      esc2 = !1;
    } else if (c3 === "\\")
      esc2 = !0;
    else if (c3 === ";")
      yield [key, val], key = "", val = "", inVal = !1;
    else if (c3 === "=" && !inVal)
      inVal = !0;
    else if (inVal)
      val += c3;
    else
      key += c3;
  if (key || inVal)
    yield [key, val];
}
function link(url3, params) {
  if (!url3)
    return LINK_END;
  let p4 = { id: osc8Id(url3), ...params }, paramStr = Object.entries(p4).map(([k3, v2]) => `${k3}=${v2}`).join(":");
  return osc(OSC.HYPERLINK, paramStr, url3);
}
function osc8Id(url3) {
  let h4 = 0;
  for (let i4 = 0;i4 < url3.length; i4++)
    h4 = (h4 << 5) - h4 + url3.charCodeAt(i4) | 0;
  return (h4 >>> 0).toString(36);
}
function supportsTabStatus() {
  return !1;
}
function tabStatus(fields) {
  let parts = [], rgb = (c3) => c3.type === "rgb" ? `#${[c3.r, c3.g, c3.b].map((n5) => n5.toString(16).padStart(2, "0")).join("")}` : "";
  if ("indicator" in fields)
    parts.push(`indicator=${fields.indicator ? rgb(fields.indicator) : ""}`);
  if ("status" in fields)
    parts.push(`status=${fields.status?.replaceAll("\\", "\\\\").replaceAll(";", "\\;") ?? ""}`);
  if ("statusColor" in fields)
    parts.push(`status-color=${fields.statusColor ? rgb(fields.statusColor) : ""}`);
  return osc(OSC.TAB_STATUS, parts.join(";"));
}
var OSC_PREFIX, ST, linuxCopy, OSC, LINK_END, ITERM2, PROGRESS, CLEAR_ITERM2_PROGRESS, CLEAR_TERMINAL_TITLE, CLEAR_TAB_STATUS;
var init_osc = __esm(() => {
  init_env();
  init_execFileNoThrow();
  init_ansi();
  OSC_PREFIX = ESC + String.fromCharCode(ESC_TYPE.OSC), ST = ESC + "\\";
  OSC = {
    SET_TITLE_AND_ICON: 0,
    SET_ICON: 1,
    SET_TITLE: 2,
    SET_COLOR: 4,
    SET_CWD: 7,
    HYPERLINK: 8,
    ITERM2: 9,
    SET_FG_COLOR: 10,
    SET_BG_COLOR: 11,
    SET_CURSOR_COLOR: 12,
    CLIPBOARD: 52,
    KITTY: 99,
    RESET_COLOR: 104,
    RESET_FG_COLOR: 110,
    RESET_BG_COLOR: 111,
    RESET_CURSOR_COLOR: 112,
    SEMANTIC_PROMPT: 133,
    GHOSTTY: 777,
    TAB_STATUS: 21337
  };
  LINK_END = osc(OSC.HYPERLINK, "", ""), ITERM2 = {
    NOTIFY: 0,
    BADGE: 2,
    PROGRESS: 4
  }, PROGRESS = {
    CLEAR: 0,
    SET: 1,
    ERROR: 2,
    INDETERMINATE: 3
  }, CLEAR_ITERM2_PROGRESS = `${OSC_PREFIX}${OSC.ITERM2};${ITERM2.PROGRESS};${PROGRESS.CLEAR};${BEL}`, CLEAR_TERMINAL_TITLE = `${OSC_PREFIX}${OSC.SET_TITLE_AND_ICON};${BEL}`, CLEAR_TAB_STATUS = osc(OSC.TAB_STATUS, "indicator=;status=;status-color=");
});
