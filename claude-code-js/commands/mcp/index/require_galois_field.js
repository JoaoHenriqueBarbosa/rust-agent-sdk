// var: require_galois_field
var require_galois_field = __commonJS((exports) => {
  var EXP_TABLE = new Uint8Array(512), LOG_TABLE = new Uint8Array(256);
  (function() {
    let x4 = 1;
    for (let i5 = 0;i5 < 255; i5++)
      if (EXP_TABLE[i5] = x4, LOG_TABLE[x4] = i5, x4 <<= 1, x4 & 256)
        x4 ^= 285;
    for (let i5 = 255;i5 < 512; i5++)
      EXP_TABLE[i5] = EXP_TABLE[i5 - 255];
  })();
  exports.log = function(n5) {
    if (n5 < 1)
      throw Error("log(" + n5 + ")");
    return LOG_TABLE[n5];
  };
  exports.exp = function(n5) {
    return EXP_TABLE[n5];
  };
  exports.mul = function(x4, y2) {
    if (x4 === 0 || y2 === 0)
      return 0;
    return EXP_TABLE[LOG_TABLE[x4] + LOG_TABLE[y2]];
  };
});
