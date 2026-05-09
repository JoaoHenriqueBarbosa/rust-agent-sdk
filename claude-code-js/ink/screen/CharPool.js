// class: CharPool
class CharPool {
  strings = [" ", ""];
  stringMap = /* @__PURE__ */ new Map([
    [" ", 0],
    ["", 1]
  ]);
  ascii = initCharAscii();
  intern(char) {
    if (char.length === 1) {
      let code = char.charCodeAt(0);
      if (code < 128) {
        let cached2 = this.ascii[code];
        if (cached2 !== -1)
          return cached2;
        let index2 = this.strings.length;
        return this.strings.push(char), this.ascii[code] = index2, index2;
      }
    }
    let existing = this.stringMap.get(char);
    if (existing !== void 0)
      return existing;
    let index = this.strings.length;
    return this.strings.push(char), this.stringMap.set(char, index), index;
  }
  get(index) {
    return this.strings[index] ?? " ";
  }
}
