// var: validateEncoding
var validateEncoding = ({ encoding }) => {
  if (ENCODINGS.has(encoding))
    return;
  let correctEncoding = getCorrectEncoding(encoding);
  if (correctEncoding !== void 0)
    throw TypeError(`Invalid option \`encoding: ${serializeEncoding(encoding)}\`.
Please rename it to ${serializeEncoding(correctEncoding)}.`);
  let correctEncodings = [...ENCODINGS].map((correctEncoding2) => serializeEncoding(correctEncoding2)).join(", ");
  throw TypeError(`Invalid option \`encoding: ${serializeEncoding(encoding)}\`.
Please rename it to one of: ${correctEncodings}.`);
}, TEXT_ENCODINGS, BINARY_ENCODINGS, ENCODINGS, getCorrectEncoding = (encoding) => {
  if (encoding === null)
    return "buffer";
  if (typeof encoding !== "string")
    return;
  let lowerEncoding = encoding.toLowerCase();
  if (lowerEncoding in ENCODING_ALIASES)
    return ENCODING_ALIASES[lowerEncoding];
  if (ENCODINGS.has(lowerEncoding))
    return lowerEncoding;
}, ENCODING_ALIASES, serializeEncoding = (encoding) => typeof encoding === "string" ? `"${encoding}"` : String(encoding);
