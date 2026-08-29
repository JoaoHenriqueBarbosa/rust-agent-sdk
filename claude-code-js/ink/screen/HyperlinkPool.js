// class: HyperlinkPool
class HyperlinkPool {
  strings = [""];
  stringMap = /* @__PURE__ */ new Map;
  intern(hyperlink) {
    if (!hyperlink)
      return 0;
    let id = this.stringMap.get(hyperlink);
    if (id === void 0)
      id = this.strings.length, this.strings.push(hyperlink), this.stringMap.set(hyperlink, id);
    return id;
  }
  get(id) {
    return id === 0 ? void 0 : this.strings[id];
  }
}
