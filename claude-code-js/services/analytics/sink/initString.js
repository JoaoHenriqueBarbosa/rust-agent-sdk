// var: initString
var initString = () => ({ contents: "", textDecoder: /* @__PURE__ */ new TextDecoder }), useTextDecoder = (chunk, { textDecoder: textDecoder2 }) => textDecoder2.decode(chunk, { stream: !0 }), addStringChunk = (convertedChunk, { contents }) => contents + convertedChunk, truncateStringChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize), getFinalStringChunk = ({ textDecoder: textDecoder2 }) => {
  let finalChunk = textDecoder2.decode();
  return finalChunk === "" ? void 0 : finalChunk;
}, stringMethods;
