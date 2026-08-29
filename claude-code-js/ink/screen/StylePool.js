// class: StylePool
class StylePool {
  ids = /* @__PURE__ */ new Map;
  styles = [];
  transitionCache = /* @__PURE__ */ new Map;
  none;
  constructor() {
    this.none = this.intern([]);
  }
  intern(styles5) {
    let key = styles5.length === 0 ? "" : styles5.map((s2) => s2.code).join("\x00"), id = this.ids.get(key);
    if (id === void 0) {
      let rawId = this.styles.length;
      this.styles.push(styles5.length === 0 ? [] : styles5), id = rawId << 1 | (styles5.length > 0 && hasVisibleSpaceEffect(styles5) ? 1 : 0), this.ids.set(key, id);
    }
    return id;
  }
  get(id) {
    return this.styles[id >>> 1] ?? [];
  }
  transition(fromId, toId) {
    if (fromId === toId)
      return "";
    let key = fromId * 1048576 + toId, str = this.transitionCache.get(key);
    if (str === void 0)
      str = ansiCodesToString(diffAnsiCodes(this.get(fromId), this.get(toId))), this.transitionCache.set(key, str);
    return str;
  }
  inverseCache = /* @__PURE__ */ new Map;
  withInverse(baseId) {
    let id = this.inverseCache.get(baseId);
    if (id === void 0) {
      let baseCodes = this.get(baseId);
      id = baseCodes.some((c3) => c3.endCode === "\x1B[27m") ? baseId : this.intern([...baseCodes, INVERSE_CODE]), this.inverseCache.set(baseId, id);
    }
    return id;
  }
  currentMatchCache = /* @__PURE__ */ new Map;
  withCurrentMatch(baseId) {
    let id = this.currentMatchCache.get(baseId);
    if (id === void 0) {
      let baseCodes = this.get(baseId), codes = baseCodes.filter((c3) => c3.endCode !== "\x1B[39m" && c3.endCode !== "\x1B[49m");
      if (codes.push(YELLOW_FG_CODE), !baseCodes.some((c3) => c3.endCode === "\x1B[27m"))
        codes.push(INVERSE_CODE);
      if (!baseCodes.some((c3) => c3.endCode === "\x1B[22m"))
        codes.push(BOLD_CODE);
      if (!baseCodes.some((c3) => c3.endCode === "\x1B[24m"))
        codes.push(UNDERLINE_CODE);
      id = this.intern(codes), this.currentMatchCache.set(baseId, id);
    }
    return id;
  }
  selectionBgCode = null;
  selectionBgCache = /* @__PURE__ */ new Map;
  setSelectionBg(bg) {
    if (this.selectionBgCode?.code === bg?.code)
      return;
    this.selectionBgCode = bg, this.selectionBgCache.clear();
  }
  withSelectionBg(baseId) {
    let bg = this.selectionBgCode;
    if (bg === null)
      return this.withInverse(baseId);
    let id = this.selectionBgCache.get(baseId);
    if (id === void 0) {
      let kept = this.get(baseId).filter((c3) => c3.endCode !== "\x1B[49m" && c3.endCode !== "\x1B[27m");
      kept.push(bg), id = this.intern(kept), this.selectionBgCache.set(baseId, id);
    }
    return id;
  }
}
