// var: require_is_fullwidth_code_point
var require_is_fullwidth_code_point = __commonJS((exports, module) => {
  var isFullwidthCodePoint2 = (codePoint) => {
    if (Number.isNaN(codePoint))
      return !1;
    if (codePoint >= 4352 && (codePoint <= 4447 || codePoint === 9001 || codePoint === 9002 || 11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || 12880 <= codePoint && codePoint <= 19903 || 19968 <= codePoint && codePoint <= 42182 || 43360 <= codePoint && codePoint <= 43388 || 44032 <= codePoint && codePoint <= 55203 || 63744 <= codePoint && codePoint <= 64255 || 65040 <= codePoint && codePoint <= 65049 || 65072 <= codePoint && codePoint <= 65131 || 65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || 110592 <= codePoint && codePoint <= 110593 || 127488 <= codePoint && codePoint <= 127569 || 131072 <= codePoint && codePoint <= 262141))
      return !0;
    return !1;
  };
  module.exports = isFullwidthCodePoint2;
  module.exports.default = isFullwidthCodePoint2;
});
