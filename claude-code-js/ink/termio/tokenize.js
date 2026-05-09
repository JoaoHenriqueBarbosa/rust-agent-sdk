// Original: src/ink/termio/tokenize.ts
function createTokenizer(options) {
  let currentState = "ground", currentBuffer = "", x10Mouse = options?.x10Mouse ?? !1;
  return {
    feed(input) {
      let result = tokenize2(input, currentState, currentBuffer, !1, x10Mouse);
      return currentState = result.state.state, currentBuffer = result.state.buffer, result.tokens;
    },
    flush() {
      let result = tokenize2("", currentState, currentBuffer, !0, x10Mouse);
      return currentState = result.state.state, currentBuffer = result.state.buffer, result.tokens;
    },
    reset() {
      currentState = "ground", currentBuffer = "";
    },
    buffer() {
      return currentBuffer;
    }
  };
}
function tokenize2(input, initialState, initialBuffer, flush, x10Mouse) {
  let tokens = [], result = {
    state: initialState,
    buffer: ""
  }, data = initialBuffer + input, i4 = 0, textStart = 0, seqStart = 0, flushText = () => {
    if (i4 > textStart) {
      let text = data.slice(textStart, i4);
      if (text)
        tokens.push({ type: "text", value: text });
    }
    textStart = i4;
  }, emitSequence = (seq) => {
    if (seq)
      tokens.push({ type: "sequence", value: seq });
    result.state = "ground", textStart = i4;
  };
  while (i4 < data.length) {
    let code = data.charCodeAt(i4);
    switch (result.state) {
      case "ground":
        if (code === C0.ESC)
          flushText(), seqStart = i4, result.state = "escape", i4++;
        else
          i4++;
        break;
      case "escape":
        if (code === ESC_TYPE.CSI)
          result.state = "csi", i4++;
        else if (code === ESC_TYPE.OSC)
          result.state = "osc", i4++;
        else if (code === ESC_TYPE.DCS)
          result.state = "dcs", i4++;
        else if (code === ESC_TYPE.APC)
          result.state = "apc", i4++;
        else if (code === 79)
          result.state = "ss3", i4++;
        else if (isCSIIntermediate(code))
          result.state = "escapeIntermediate", i4++;
        else if (isEscFinal(code))
          i4++, emitSequence(data.slice(seqStart, i4));
        else if (code === C0.ESC)
          emitSequence(data.slice(seqStart, i4)), seqStart = i4, result.state = "escape", i4++;
        else
          result.state = "ground", textStart = seqStart;
        break;
      case "escapeIntermediate":
        if (isCSIIntermediate(code))
          i4++;
        else if (isEscFinal(code))
          i4++, emitSequence(data.slice(seqStart, i4));
        else
          result.state = "ground", textStart = seqStart;
        break;
      case "csi":
        if (x10Mouse && code === 77 && i4 - seqStart === 2 && (i4 + 1 >= data.length || data.charCodeAt(i4 + 1) >= 32) && (i4 + 2 >= data.length || data.charCodeAt(i4 + 2) >= 32) && (i4 + 3 >= data.length || data.charCodeAt(i4 + 3) >= 32)) {
          if (i4 + 4 <= data.length)
            i4 += 4, emitSequence(data.slice(seqStart, i4));
          else
            i4 = data.length;
          break;
        }
        if (isCSIFinal(code))
          i4++, emitSequence(data.slice(seqStart, i4));
        else if (isCSIParam(code) || isCSIIntermediate(code))
          i4++;
        else
          result.state = "ground", textStart = seqStart;
        break;
      case "ss3":
        if (code >= 64 && code <= 126)
          i4++, emitSequence(data.slice(seqStart, i4));
        else
          result.state = "ground", textStart = seqStart;
        break;
      case "osc":
        if (code === C0.BEL)
          i4++, emitSequence(data.slice(seqStart, i4));
        else if (code === C0.ESC && i4 + 1 < data.length && data.charCodeAt(i4 + 1) === ESC_TYPE.ST)
          i4 += 2, emitSequence(data.slice(seqStart, i4));
        else
          i4++;
        break;
      case "dcs":
      case "apc":
        if (code === C0.BEL)
          i4++, emitSequence(data.slice(seqStart, i4));
        else if (code === C0.ESC && i4 + 1 < data.length && data.charCodeAt(i4 + 1) === ESC_TYPE.ST)
          i4 += 2, emitSequence(data.slice(seqStart, i4));
        else
          i4++;
        break;
    }
  }
  if (result.state === "ground")
    flushText();
  else if (flush) {
    let remaining = data.slice(seqStart);
    if (remaining)
      tokens.push({ type: "sequence", value: remaining });
    result.state = "ground";
  } else
    result.buffer = data.slice(seqStart);
  return { tokens, state: result };
}
var init_tokenize = __esm(() => {
  init_ansi();
  init_csi();
});
