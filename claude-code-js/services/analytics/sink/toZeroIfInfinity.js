// var: toZeroIfInfinity
var toZeroIfInfinity = (value) => Number.isFinite(value) ? value : 0;

// node_modules/pretty-ms/index.js
function prettyMilliseconds(milliseconds, options) {
  let isBigInt = typeof milliseconds === "bigint";
  if (!isBigInt && !Number.isFinite(milliseconds))
    throw TypeError("Expected a finite number or bigint");
  options = { ...options };
  let sign = milliseconds < 0 ? "-" : "";
  if (milliseconds = milliseconds < 0 ? -milliseconds : milliseconds, options.colonNotation)
    options.compact = !1, options.formatSubMilliseconds = !1, options.separateMilliseconds = !1, options.verbose = !1;
  if (options.compact)
    options.unitCount = 1, options.secondsDecimalDigits = 0, options.millisecondsDecimalDigits = 0;
  let result = [], floorDecimals = (value, decimalDigits) => {
    let flooredInterimValue = Math.floor(value * 10 ** decimalDigits + SECOND_ROUNDING_EPSILON);
    return (Math.round(flooredInterimValue) / 10 ** decimalDigits).toFixed(decimalDigits);
  }, add = (value, long, short, valueString) => {
    if ((result.length === 0 || !options.colonNotation) && isZero(value) && !(options.colonNotation && short === "m"))
      return;
    if (valueString ??= String(value), options.colonNotation) {
      let wholeDigits = valueString.includes(".") ? valueString.split(".")[0].length : valueString.length, minLength = result.length > 0 ? 2 : 1;
      valueString = "0".repeat(Math.max(0, minLength - wholeDigits)) + valueString;
    } else
      valueString += options.verbose ? " " + pluralize(long, value) : short;
    result.push(valueString);
  }, parsed = parseMilliseconds(milliseconds), days = BigInt(parsed.days);
  if (options.hideYearAndDays)
    add(BigInt(days) * 24n + BigInt(parsed.hours), "hour", "h");
  else {
    if (options.hideYear)
      add(days, "day", "d");
    else
      add(days / 365n, "year", "y"), add(days % 365n, "day", "d");
    add(Number(parsed.hours), "hour", "h");
  }
  if (add(Number(parsed.minutes), "minute", "m"), !options.hideSeconds)
    if (options.separateMilliseconds || options.formatSubMilliseconds || !options.colonNotation && milliseconds < 1000 && !options.subSecondsAsDecimals) {
      let seconds = Number(parsed.seconds), milliseconds2 = Number(parsed.milliseconds), microseconds = Number(parsed.microseconds), nanoseconds = Number(parsed.nanoseconds);
      if (add(seconds, "second", "s"), options.formatSubMilliseconds)
        add(milliseconds2, "millisecond", "ms"), add(microseconds, "microsecond", "\xB5s"), add(nanoseconds, "nanosecond", "ns");
      else {
        let millisecondsAndBelow = milliseconds2 + microseconds / 1000 + nanoseconds / 1e6, millisecondsDecimalDigits = typeof options.millisecondsDecimalDigits === "number" ? options.millisecondsDecimalDigits : 0, roundedMilliseconds = millisecondsAndBelow >= 1 ? Math.round(millisecondsAndBelow) : Math.ceil(millisecondsAndBelow), millisecondsString = millisecondsDecimalDigits ? millisecondsAndBelow.toFixed(millisecondsDecimalDigits) : roundedMilliseconds;
        add(Number.parseFloat(millisecondsString), "millisecond", "ms", millisecondsString);
      }
    } else {
      let seconds = (isBigInt ? Number(milliseconds % ONE_DAY_IN_MILLISECONDS) : milliseconds) / 1000 % 60, secondsDecimalDigits = typeof options.secondsDecimalDigits === "number" ? options.secondsDecimalDigits : 1, secondsFixed = floorDecimals(seconds, secondsDecimalDigits), secondsString = options.keepDecimalsOnWholeSeconds ? secondsFixed : secondsFixed.replace(/\.0+$/, "");
      add(Number.parseFloat(secondsString), "second", "s", secondsString);
    }
  if (result.length === 0)
    return sign + "0" + (options.verbose ? " milliseconds" : "ms");
  let separator = options.colonNotation ? ":" : " ";
  if (typeof options.unitCount === "number")
    result = result.slice(0, Math.max(options.unitCount, 1));
  return sign + result.join(separator);
}
