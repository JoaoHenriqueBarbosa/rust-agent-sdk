// var: require_dist_cjs78
var require_dist_cjs78 = __commonJS((exports) => {
  var TEXT_ENCODER = typeof TextEncoder == "function" ? /* @__PURE__ */ new TextEncoder : null, calculateBodyLength = (body) => {
    if (typeof body === "string") {
      if (TEXT_ENCODER)
        return TEXT_ENCODER.encode(body).byteLength;
      let len = body.length;
      for (let i2 = len - 1;i2 >= 0; i2--) {
        let code = body.charCodeAt(i2);
        if (code > 127 && code <= 2047)
          len++;
        else if (code > 2047 && code <= 65535)
          len += 2;
        if (code >= 56320 && code <= 57343)
          i2--;
      }
      return len;
    } else if (typeof body.byteLength === "number")
      return body.byteLength;
    else if (typeof body.size === "number")
      return body.size;
    throw Error(`Body Length computation failed for ${body}`);
  };
  exports.calculateBodyLength = calculateBodyLength;
});
