// function: norm
function norm(weight = 1, mantissa = 3) {
  let cache8 = /* @__PURE__ */ new Map, m4 = Math.pow(10, mantissa);
  return {
    get(value) {
      let numTokens = value.match(SPACE).length;
      if (cache8.has(numTokens))
        return cache8.get(numTokens);
      let norm2 = 1 / Math.pow(numTokens, 0.5 * weight), n6 = parseFloat(Math.round(norm2 * m4) / m4);
      return cache8.set(numTokens, n6), n6;
    },
    clear() {
      cache8.clear();
    }
  };
}
