// Original: src/ink/termio/parser.ts
function isEmoji(codePoint) {
  return codePoint >= 9728 && codePoint <= 9983 || codePoint >= 9984 && codePoint <= 10175 || codePoint >= 127744 && codePoint <= 129535 || codePoint >= 129536 && codePoint <= 129791 || codePoint >= 127456 && codePoint <= 127487;
}
function isEastAsianWide(codePoint) {
  return codePoint >= 4352 && codePoint <= 4447 || codePoint >= 11904 && codePoint <= 40959 || codePoint >= 44032 && codePoint <= 55203 || codePoint >= 63744 && codePoint <= 64255 || codePoint >= 65040 && codePoint <= 65055 || codePoint >= 65072 && codePoint <= 65135 || codePoint >= 65280 && codePoint <= 65376 || codePoint >= 65504 && codePoint <= 65510 || codePoint >= 131072 && codePoint <= 196605 || codePoint >= 196608 && codePoint <= 262141;
}
function hasMultipleCodepoints(str) {
  let count3 = 0;
  for (let _ of str)
    if (count3++, count3 > 1)
      return !0;
  return !1;
}
function graphemeWidth(grapheme) {
  if (hasMultipleCodepoints(grapheme))
    return 2;
  let codePoint = grapheme.codePointAt(0);
  if (codePoint === void 0)
    return 1;
  if (isEmoji(codePoint) || isEastAsianWide(codePoint))
    return 2;
  return 1;
}
function* segmentGraphemes(str) {
  for (let { segment } of getGraphemeSegmenter().segment(str))
    yield { value: segment, width: graphemeWidth(segment) };
}
function parseCSIParams(paramStr) {
  if (paramStr === "")
    return [];
  return paramStr.split(/[;:]/).map((s2) => s2 === "" ? 0 : parseInt(s2, 10));
}
function parseCSI(rawSequence) {
  let inner = rawSequence.slice(2);
  if (inner.length === 0)
    return null;
  let finalByte = inner.charCodeAt(inner.length - 1), beforeFinal = inner.slice(0, -1), privateMode = "", paramStr = beforeFinal, intermediate = "";
  if (beforeFinal.length > 0 && "?>=".includes(beforeFinal[0]))
    privateMode = beforeFinal[0], paramStr = beforeFinal.slice(1);
  let intermediateMatch = paramStr.match(/([^0-9;:]+)$/);
  if (intermediateMatch)
    intermediate = intermediateMatch[1], paramStr = paramStr.slice(0, -intermediate.length);
  let params = parseCSIParams(paramStr), p0 = params[0] ?? 1, p1 = params[1] ?? 1;
  if (finalByte === CSI.SGR && privateMode === "")
    return { type: "sgr", params: paramStr };
  if (finalByte === CSI.CUU)
    return {
      type: "cursor",
      action: { type: "move", direction: "up", count: p0 }
    };
  if (finalByte === CSI.CUD)
    return {
      type: "cursor",
      action: { type: "move", direction: "down", count: p0 }
    };
  if (finalByte === CSI.CUF)
    return {
      type: "cursor",
      action: { type: "move", direction: "forward", count: p0 }
    };
  if (finalByte === CSI.CUB)
    return {
      type: "cursor",
      action: { type: "move", direction: "back", count: p0 }
    };
  if (finalByte === CSI.CNL)
    return { type: "cursor", action: { type: "nextLine", count: p0 } };
  if (finalByte === CSI.CPL)
    return { type: "cursor", action: { type: "prevLine", count: p0 } };
  if (finalByte === CSI.CHA)
    return { type: "cursor", action: { type: "column", col: p0 } };
  if (finalByte === CSI.CUP || finalByte === CSI.HVP)
    return { type: "cursor", action: { type: "position", row: p0, col: p1 } };
  if (finalByte === CSI.VPA)
    return { type: "cursor", action: { type: "row", row: p0 } };
  if (finalByte === CSI.ED)
    return { type: "erase", action: { type: "display", region: ERASE_DISPLAY[params[0] ?? 0] ?? "toEnd" } };
  if (finalByte === CSI.EL)
    return { type: "erase", action: { type: "line", region: ERASE_LINE_REGION[params[0] ?? 0] ?? "toEnd" } };
  if (finalByte === CSI.ECH)
    return { type: "erase", action: { type: "chars", count: p0 } };
  if (finalByte === CSI.SU)
    return { type: "scroll", action: { type: "up", count: p0 } };
  if (finalByte === CSI.SD)
    return { type: "scroll", action: { type: "down", count: p0 } };
  if (finalByte === CSI.DECSTBM)
    return {
      type: "scroll",
      action: { type: "setRegion", top: p0, bottom: p1 }
    };
  if (finalByte === CSI.SCOSC)
    return { type: "cursor", action: { type: "save" } };
  if (finalByte === CSI.SCORC)
    return { type: "cursor", action: { type: "restore" } };
  if (finalByte === CSI.DECSCUSR && intermediate === " ")
    return { type: "cursor", action: { type: "style", ...CURSOR_STYLES[p0] ?? CURSOR_STYLES[0] } };
  if (privateMode === "?" && (finalByte === CSI.SM || finalByte === CSI.RM)) {
    let enabled2 = finalByte === CSI.SM;
    if (p0 === DEC.CURSOR_VISIBLE)
      return {
        type: "cursor",
        action: enabled2 ? { type: "show" } : { type: "hide" }
      };
    if (p0 === DEC.ALT_SCREEN_CLEAR || p0 === DEC.ALT_SCREEN)
      return { type: "mode", action: { type: "alternateScreen", enabled: enabled2 } };
    if (p0 === DEC.BRACKETED_PASTE)
      return { type: "mode", action: { type: "bracketedPaste", enabled: enabled2 } };
    if (p0 === DEC.MOUSE_NORMAL)
      return {
        type: "mode",
        action: { type: "mouseTracking", mode: enabled2 ? "normal" : "off" }
      };
    if (p0 === DEC.MOUSE_BUTTON)
      return {
        type: "mode",
        action: { type: "mouseTracking", mode: enabled2 ? "button" : "off" }
      };
    if (p0 === DEC.MOUSE_ANY)
      return {
        type: "mode",
        action: { type: "mouseTracking", mode: enabled2 ? "any" : "off" }
      };
    if (p0 === DEC.FOCUS_EVENTS)
      return { type: "mode", action: { type: "focusEvents", enabled: enabled2 } };
  }
  return { type: "unknown", sequence: rawSequence };
}
function identifySequence(seq) {
  if (seq.length < 2)
    return "unknown";
  if (seq.charCodeAt(0) !== C0.ESC)
    return "unknown";
  let second = seq.charCodeAt(1);
  if (second === 91)
    return "csi";
  if (second === 93)
    return "osc";
  if (second === 79)
    return "ss3";
  return "esc";
}

class Parser {
  tokenizer = createTokenizer();
  style = defaultStyle2();
  inLink = !1;
  linkUrl;
  reset() {
    this.tokenizer.reset(), this.style = defaultStyle2(), this.inLink = !1, this.linkUrl = void 0;
  }
  feed(input) {
    let tokens = this.tokenizer.feed(input), actions = [];
    for (let token of tokens) {
      let tokenActions = this.processToken(token);
      actions.push(...tokenActions);
    }
    return actions;
  }
  processToken(token) {
    switch (token.type) {
      case "text":
        return this.processText(token.value);
      case "sequence":
        return this.processSequence(token.value);
    }
  }
  processText(text) {
    let actions = [], current = "";
    for (let char of text)
      if (char.charCodeAt(0) === C0.BEL) {
        if (current) {
          let graphemes = [...segmentGraphemes(current)];
          if (graphemes.length > 0)
            actions.push({ type: "text", graphemes, style: { ...this.style } });
          current = "";
        }
        actions.push({ type: "bell" });
      } else
        current += char;
    if (current) {
      let graphemes = [...segmentGraphemes(current)];
      if (graphemes.length > 0)
        actions.push({ type: "text", graphemes, style: { ...this.style } });
    }
    return actions;
  }
  processSequence(seq) {
    switch (identifySequence(seq)) {
      case "csi": {
        let action = parseCSI(seq);
        if (!action)
          return [];
        if (action.type === "sgr")
          return this.style = applySGR(action.params, this.style), [];
        return [action];
      }
      case "osc": {
        let content = seq.slice(2);
        if (content.endsWith("\x07"))
          content = content.slice(0, -1);
        else if (content.endsWith("\x1B\\"))
          content = content.slice(0, -2);
        let action = parseOSC(content);
        if (action) {
          if (action.type === "link")
            if (action.action.type === "start")
              this.inLink = !0, this.linkUrl = action.action.url;
            else
              this.inLink = !1, this.linkUrl = void 0;
          return [action];
        }
        return [];
      }
      case "esc": {
        let escContent = seq.slice(1), action = parseEsc(escContent);
        return action ? [action] : [];
      }
      case "ss3":
        return [{ type: "unknown", sequence: seq }];
      default:
        return [{ type: "unknown", sequence: seq }];
    }
  }
}
var init_parser3 = __esm(() => {
  init_intl();
  init_ansi();
  init_csi();
  init_dec();
  init_osc();
  init_sgr();
  init_tokenize();
});
