// var: require_ecdsa_sig_formatter
var require_ecdsa_sig_formatter = __commonJS((exports, module) => {
  var Buffer13 = require_safe_buffer().Buffer, getParamBytesForAlg = require_param_bytes_for_alg(), MAX_OCTET = 128, CLASS_UNIVERSAL = 0, PRIMITIVE_BIT = 32, TAG_SEQ = 16, TAG_INT = 2, ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6, ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
  function base64Url(base644) {
    return base644.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function signatureAsBuffer(signature7) {
    if (Buffer13.isBuffer(signature7))
      return signature7;
    else if (typeof signature7 === "string")
      return Buffer13.from(signature7, "base64");
    throw TypeError("ECDSA signature must be a Base64 string or a Buffer");
  }
  function derToJose(signature7, alg) {
    signature7 = signatureAsBuffer(signature7);
    var paramBytes = getParamBytesForAlg(alg), maxEncodedParamLength = paramBytes + 1, inputLength = signature7.length, offset = 0;
    if (signature7[offset++] !== ENCODED_TAG_SEQ)
      throw Error('Could not find expected "seq"');
    var seqLength = signature7[offset++];
    if (seqLength === (MAX_OCTET | 1))
      seqLength = signature7[offset++];
    if (inputLength - offset < seqLength)
      throw Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
    if (signature7[offset++] !== ENCODED_TAG_INT)
      throw Error('Could not find expected "int" for "r"');
    var rLength = signature7[offset++];
    if (inputLength - offset - 2 < rLength)
      throw Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
    if (maxEncodedParamLength < rLength)
      throw Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    var rOffset = offset;
    if (offset += rLength, signature7[offset++] !== ENCODED_TAG_INT)
      throw Error('Could not find expected "int" for "s"');
    var sLength = signature7[offset++];
    if (inputLength - offset !== sLength)
      throw Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
    if (maxEncodedParamLength < sLength)
      throw Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
    var sOffset = offset;
    if (offset += sLength, offset !== inputLength)
      throw Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
    var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength, dst = Buffer13.allocUnsafe(rPadding + rLength + sPadding + sLength);
    for (offset = 0;offset < rPadding; ++offset)
      dst[offset] = 0;
    signature7.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength), offset = paramBytes;
    for (var o5 = offset;offset < o5 + sPadding; ++offset)
      dst[offset] = 0;
    return signature7.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength), dst = dst.toString("base64"), dst = base64Url(dst), dst;
  }
  function countPadding(buf, start, stop) {
    var padding = 0;
    while (start + padding < stop && buf[start + padding] === 0)
      ++padding;
    var needsSign = buf[start + padding] >= MAX_OCTET;
    if (needsSign)
      --padding;
    return padding;
  }
  function joseToDer(signature7, alg) {
    signature7 = signatureAsBuffer(signature7);
    var paramBytes = getParamBytesForAlg(alg), signatureBytes = signature7.length;
    if (signatureBytes !== paramBytes * 2)
      throw TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
    var rPadding = countPadding(signature7, 0, paramBytes), sPadding = countPadding(signature7, paramBytes, signature7.length), rLength = paramBytes - rPadding, sLength = paramBytes - sPadding, rsBytes = 2 + rLength + 1 + 1 + sLength, shortLength = rsBytes < MAX_OCTET, dst = Buffer13.allocUnsafe((shortLength ? 2 : 3) + rsBytes), offset = 0;
    if (dst[offset++] = ENCODED_TAG_SEQ, shortLength)
      dst[offset++] = rsBytes;
    else
      dst[offset++] = MAX_OCTET | 1, dst[offset++] = rsBytes & 255;
    if (dst[offset++] = ENCODED_TAG_INT, dst[offset++] = rLength, rPadding < 0)
      dst[offset++] = 0, offset += signature7.copy(dst, offset, 0, paramBytes);
    else
      offset += signature7.copy(dst, offset, rPadding, paramBytes);
    if (dst[offset++] = ENCODED_TAG_INT, dst[offset++] = sLength, sPadding < 0)
      dst[offset++] = 0, signature7.copy(dst, offset, paramBytes);
    else
      signature7.copy(dst, offset, paramBytes + sPadding);
    return dst;
  }
  module.exports = {
    derToJose,
    joseToDer
  };
});
