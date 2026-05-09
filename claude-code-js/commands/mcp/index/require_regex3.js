// var: require_regex3
var require_regex3 = __commonJS((exports) => {
  var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  kanji = kanji.replace(/u/g, "\\u");
  var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + `)(?:.|[\r
]))+`;
  exports.KANJI = new RegExp(kanji, "g");
  exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
  exports.BYTE = new RegExp(byte, "g");
  exports.NUMERIC = new RegExp("[0-9]+", "g");
  exports.ALPHANUMERIC = new RegExp("[A-Z $%*+\\-./:]+", "g");
  var TEST_KANJI = new RegExp("^" + kanji + "$"), TEST_NUMERIC = new RegExp("^[0-9]+$"), TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  exports.testKanji = function(str2) {
    return TEST_KANJI.test(str2);
  };
  exports.testNumeric = function(str2) {
    return TEST_NUMERIC.test(str2);
  };
  exports.testAlphanumeric = function(str2) {
    return TEST_ALPHANUMERIC.test(str2);
  };
});
