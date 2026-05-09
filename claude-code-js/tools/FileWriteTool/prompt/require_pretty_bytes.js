// var: require_pretty_bytes
var require_pretty_bytes = __commonJS((exports, module) => {
  var BYTE_UNITS = [
    "B",
    "kB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
    "ZB",
    "YB"
  ], BIBYTE_UNITS = [
    "B",
    "kiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB"
  ], BIT_UNITS = [
    "b",
    "kbit",
    "Mbit",
    "Gbit",
    "Tbit",
    "Pbit",
    "Ebit",
    "Zbit",
    "Ybit"
  ], BIBIT_UNITS = [
    "b",
    "kibit",
    "Mibit",
    "Gibit",
    "Tibit",
    "Pibit",
    "Eibit",
    "Zibit",
    "Yibit"
  ], toLocaleString = (number4, locale, options) => {
    let result = number4;
    if (typeof locale === "string" || Array.isArray(locale))
      result = number4.toLocaleString(locale, options);
    else if (locale === !0 || options !== void 0)
      result = number4.toLocaleString(void 0, options);
    return result;
  };
  module.exports = (number4, options) => {
    if (!Number.isFinite(number4))
      throw TypeError(`Expected a finite number, got ${typeof number4}: ${number4}`);
    options = Object.assign({ bits: !1, binary: !1 }, options);
    let UNITS = options.bits ? options.binary ? BIBIT_UNITS : BIT_UNITS : options.binary ? BIBYTE_UNITS : BYTE_UNITS;
    if (options.signed && number4 === 0)
      return ` 0 ${UNITS[0]}`;
    let isNegative = number4 < 0, prefix = isNegative ? "-" : options.signed ? "+" : "";
    if (isNegative)
      number4 = -number4;
    let localeOptions;
    if (options.minimumFractionDigits !== void 0)
      localeOptions = { minimumFractionDigits: options.minimumFractionDigits };
    if (options.maximumFractionDigits !== void 0)
      localeOptions = Object.assign({ maximumFractionDigits: options.maximumFractionDigits }, localeOptions);
    if (number4 < 1) {
      let numberString2 = toLocaleString(number4, options.locale, localeOptions);
      return prefix + numberString2 + " " + UNITS[0];
    }
    let exponent = Math.min(Math.floor(options.binary ? Math.log(number4) / Math.log(1024) : Math.log10(number4) / 3), UNITS.length - 1);
    if (number4 /= Math.pow(options.binary ? 1024 : 1000, exponent), !localeOptions)
      number4 = number4.toPrecision(3);
    let numberString = toLocaleString(Number(number4), options.locale, localeOptions), unit = UNITS[exponent];
    return prefix + numberString + " " + unit;
  };
});
