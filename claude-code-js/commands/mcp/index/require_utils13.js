// var: require_utils13
var require_utils13 = __commonJS((exports) => {
  var toSJISFunction, CODEWORDS_COUNT = [
    0,
    26,
    44,
    70,
    100,
    134,
    172,
    196,
    242,
    292,
    346,
    404,
    466,
    532,
    581,
    655,
    733,
    815,
    901,
    991,
    1085,
    1156,
    1258,
    1364,
    1474,
    1588,
    1706,
    1828,
    1921,
    2051,
    2185,
    2323,
    2465,
    2611,
    2761,
    2876,
    3034,
    3196,
    3362,
    3532,
    3706
  ];
  exports.getSymbolSize = function(version5) {
    if (!version5)
      throw Error('"version" cannot be null or undefined');
    if (version5 < 1 || version5 > 40)
      throw Error('"version" should be in range from 1 to 40');
    return version5 * 4 + 17;
  };
  exports.getSymbolTotalCodewords = function(version5) {
    return CODEWORDS_COUNT[version5];
  };
  exports.getBCHDigit = function(data) {
    let digit = 0;
    while (data !== 0)
      digit++, data >>>= 1;
    return digit;
  };
  exports.setToSJISFunction = function(f) {
    if (typeof f !== "function")
      throw Error('"toSJISFunc" is not a valid function.');
    toSJISFunction = f;
  };
  exports.isKanjiModeEnabled = function() {
    return typeof toSJISFunction < "u";
  };
  exports.toSJIS = function(kanji) {
    return toSJISFunction(kanji);
  };
});
