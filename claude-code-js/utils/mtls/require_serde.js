// var: require_serde
var require_serde = __commonJS((exports) => {
  var uuid3 = require_dist_cjs31(), copyDocumentWithTransform = (source, schemaRef, transform2 = (_) => _) => source, parseBoolean = (value) => {
    switch (value) {
      case "true":
        return !0;
      case "false":
        return !1;
      default:
        throw Error(`Unable to parse boolean value "${value}"`);
    }
  }, expectBoolean = (value) => {
    if (value === null || value === void 0)
      return;
    if (typeof value === "number") {
      if (value === 0 || value === 1)
        logger2.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
      if (value === 0)
        return !1;
      if (value === 1)
        return !0;
    }
    if (typeof value === "string") {
      let lower = value.toLowerCase();
      if (lower === "false" || lower === "true")
        logger2.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
      if (lower === "false")
        return !1;
      if (lower === "true")
        return !0;
    }
    if (typeof value === "boolean")
      return value;
    throw TypeError(`Expected boolean, got ${typeof value}: ${value}`);
  }, expectNumber = (value) => {
    if (value === null || value === void 0)
      return;
    if (typeof value === "string") {
      let parsed = parseFloat(value);
      if (!Number.isNaN(parsed)) {
        if (String(parsed) !== String(value))
          logger2.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
        return parsed;
      }
    }
    if (typeof value === "number")
      return value;
    throw TypeError(`Expected number, got ${typeof value}: ${value}`);
  }, MAX_FLOAT = Math.ceil(340282346638528860000000000000000000000), expectFloat32 = (value) => {
    let expected = expectNumber(value);
    if (expected !== void 0 && !Number.isNaN(expected) && expected !== 1 / 0 && expected !== -1 / 0) {
      if (Math.abs(expected) > MAX_FLOAT)
        throw TypeError(`Expected 32-bit float, got ${value}`);
    }
    return expected;
  }, expectLong = (value) => {
    if (value === null || value === void 0)
      return;
    if (Number.isInteger(value) && !Number.isNaN(value))
      return value;
    throw TypeError(`Expected integer, got ${typeof value}: ${value}`);
  }, expectInt = expectLong, expectInt32 = (value) => expectSizedInt(value, 32), expectShort = (value) => expectSizedInt(value, 16), expectByte = (value) => expectSizedInt(value, 8), expectSizedInt = (value, size) => {
    let expected = expectLong(value);
    if (expected !== void 0 && castInt(expected, size) !== expected)
      throw TypeError(`Expected ${size}-bit integer, got ${value}`);
    return expected;
  }, castInt = (value, size) => {
    switch (size) {
      case 32:
        return Int32Array.of(value)[0];
      case 16:
        return Int16Array.of(value)[0];
      case 8:
        return Int8Array.of(value)[0];
    }
  }, expectNonNull = (value, location) => {
    if (value === null || value === void 0) {
      if (location)
        throw TypeError(`Expected a non-null value for ${location}`);
      throw TypeError("Expected a non-null value");
    }
    return value;
  }, expectObject = (value) => {
    if (value === null || value === void 0)
      return;
    if (typeof value === "object" && !Array.isArray(value))
      return value;
    let receivedType = Array.isArray(value) ? "array" : typeof value;
    throw TypeError(`Expected object, got ${receivedType}: ${value}`);
  }, expectString = (value) => {
    if (value === null || value === void 0)
      return;
    if (typeof value === "string")
      return value;
    if (["boolean", "number", "bigint"].includes(typeof value))
      return logger2.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`)), String(value);
    throw TypeError(`Expected string, got ${typeof value}: ${value}`);
  }, expectUnion = (value) => {
    if (value === null || value === void 0)
      return;
    let asObject = expectObject(value), setKeys = Object.entries(asObject).filter(([, v]) => v != null).map(([k]) => k);
    if (setKeys.length === 0)
      throw TypeError("Unions must have exactly one non-null member. None were found.");
    if (setKeys.length > 1)
      throw TypeError(`Unions must have exactly one non-null member. Keys ${setKeys} were not null.`);
    return asObject;
  }, strictParseDouble = (value) => {
    if (typeof value == "string")
      return expectNumber(parseNumber2(value));
    return expectNumber(value);
  }, strictParseFloat = strictParseDouble, strictParseFloat32 = (value) => {
    if (typeof value == "string")
      return expectFloat32(parseNumber2(value));
    return expectFloat32(value);
  }, NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, parseNumber2 = (value) => {
    let matches = value.match(NUMBER_REGEX);
    if (matches === null || matches[0].length !== value.length)
      throw TypeError("Expected real number, got implicit NaN");
    return parseFloat(value);
  }, limitedParseDouble = (value) => {
    if (typeof value == "string")
      return parseFloatString(value);
    return expectNumber(value);
  }, handleFloat = limitedParseDouble, limitedParseFloat = limitedParseDouble, limitedParseFloat32 = (value) => {
    if (typeof value == "string")
      return parseFloatString(value);
    return expectFloat32(value);
  }, parseFloatString = (value) => {
    switch (value) {
      case "NaN":
        return NaN;
      case "Infinity":
        return 1 / 0;
      case "-Infinity":
        return -1 / 0;
      default:
        throw Error(`Unable to parse float value: ${value}`);
    }
  }, strictParseLong = (value) => {
    if (typeof value === "string")
      return expectLong(parseNumber2(value));
    return expectLong(value);
  }, strictParseInt = strictParseLong, strictParseInt32 = (value) => {
    if (typeof value === "string")
      return expectInt32(parseNumber2(value));
    return expectInt32(value);
  }, strictParseShort = (value) => {
    if (typeof value === "string")
      return expectShort(parseNumber2(value));
    return expectShort(value);
  }, strictParseByte = (value) => {
    if (typeof value === "string")
      return expectByte(parseNumber2(value));
    return expectByte(value);
  }, stackTraceWarning = (message) => {
    return String(TypeError(message).stack || message).split(`
`).slice(0, 5).filter((s) => !s.includes("stackTraceWarning")).join(`
`);
  }, logger2 = {
    warn: console.warn
  }, DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function dateToUtcString(date6) {
    let year2 = date6.getUTCFullYear(), month = date6.getUTCMonth(), dayOfWeek = date6.getUTCDay(), dayOfMonthInt = date6.getUTCDate(), hoursInt = date6.getUTCHours(), minutesInt = date6.getUTCMinutes(), secondsInt = date6.getUTCSeconds(), dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`, hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`, minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`, secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
    return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year2} ${hoursString}:${minutesString}:${secondsString} GMT`;
  }
  var RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/), parseRfc3339DateTime = (value) => {
    if (value === null || value === void 0)
      return;
    if (typeof value !== "string")
      throw TypeError("RFC-3339 date-times must be expressed as strings");
    let match = RFC3339.exec(value);
    if (!match)
      throw TypeError("Invalid RFC-3339 date-time value");
    let [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds] = match, year2 = strictParseShort(stripLeadingZeroes(yearStr)), month = parseDateValue(monthStr, "month", 1, 12), day = parseDateValue(dayStr, "day", 1, 31);
    return buildDate(year2, month, day, { hours, minutes, seconds, fractionalMilliseconds });
  }, RFC3339_WITH_OFFSET$1 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/), parseRfc3339DateTimeWithOffset = (value) => {
    if (value === null || value === void 0)
      return;
    if (typeof value !== "string")
      throw TypeError("RFC-3339 date-times must be expressed as strings");
    let match = RFC3339_WITH_OFFSET$1.exec(value);
    if (!match)
      throw TypeError("Invalid RFC-3339 date-time value");
    let [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match, year2 = strictParseShort(stripLeadingZeroes(yearStr)), month = parseDateValue(monthStr, "month", 1, 12), day = parseDateValue(dayStr, "day", 1, 31), date6 = buildDate(year2, month, day, { hours, minutes, seconds, fractionalMilliseconds });
    if (offsetStr.toUpperCase() != "Z")
      date6.setTime(date6.getTime() - parseOffsetToMilliseconds(offsetStr));
    return date6;
  }, IMF_FIXDATE$1 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), RFC_850_DATE$1 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), ASC_TIME$1 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), parseRfc7231DateTime = (value) => {
    if (value === null || value === void 0)
      return;
    if (typeof value !== "string")
      throw TypeError("RFC-7231 date-times must be expressed as strings");
    let match = IMF_FIXDATE$1.exec(value);
    if (match) {
      let [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
      return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
    }
    if (match = RFC_850_DATE$1.exec(value), match) {
      let [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
      return adjustRfc850Year(buildDate(parseTwoDigitYear(yearStr), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
        hours,
        minutes,
        seconds,
        fractionalMilliseconds
      }));
    }
    if (match = ASC_TIME$1.exec(value), match) {
      let [_, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, yearStr] = match;
      return buildDate(strictParseShort(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr.trimLeft(), "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
    }
    throw TypeError("Invalid RFC-7231 date-time value");
  }, parseEpochTimestamp = (value) => {
    if (value === null || value === void 0)
      return;
    let valueAsDouble;
    if (typeof value === "number")
      valueAsDouble = value;
    else if (typeof value === "string")
      valueAsDouble = strictParseDouble(value);
    else if (typeof value === "object" && value.tag === 1)
      valueAsDouble = value.value;
    else
      throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
    if (Number.isNaN(valueAsDouble) || valueAsDouble === 1 / 0 || valueAsDouble === -1 / 0)
      throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
    return new Date(Math.round(valueAsDouble * 1000));
  }, buildDate = (year2, month, day, time4) => {
    let adjustedMonth = month - 1;
    return validateDayOfMonth(year2, adjustedMonth, day), new Date(Date.UTC(year2, adjustedMonth, day, parseDateValue(time4.hours, "hour", 0, 23), parseDateValue(time4.minutes, "minute", 0, 59), parseDateValue(time4.seconds, "seconds", 0, 60), parseMilliseconds2(time4.fractionalMilliseconds)));
  }, parseTwoDigitYear = (value) => {
    let thisYear = (/* @__PURE__ */ new Date()).getUTCFullYear(), valueInThisCentury = Math.floor(thisYear / 100) * 100 + strictParseShort(stripLeadingZeroes(value));
    if (valueInThisCentury < thisYear)
      return valueInThisCentury + 100;
    return valueInThisCentury;
  }, FIFTY_YEARS_IN_MILLIS = 1576800000000, adjustRfc850Year = (input) => {
    if (input.getTime() - (/* @__PURE__ */ new Date()).getTime() > FIFTY_YEARS_IN_MILLIS)
      return new Date(Date.UTC(input.getUTCFullYear() - 100, input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
    return input;
  }, parseMonthByShortName = (value) => {
    let monthIdx = MONTHS.indexOf(value);
    if (monthIdx < 0)
      throw TypeError(`Invalid month: ${value}`);
    return monthIdx + 1;
  }, DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], validateDayOfMonth = (year2, month, day) => {
    let maxDays = DAYS_IN_MONTH[month];
    if (month === 1 && isLeapYear(year2))
      maxDays = 29;
    if (day > maxDays)
      throw TypeError(`Invalid day for ${MONTHS[month]} in ${year2}: ${day}`);
  }, isLeapYear = (year2) => {
    return year2 % 4 === 0 && (year2 % 100 !== 0 || year2 % 400 === 0);
  }, parseDateValue = (value, type, lower, upper) => {
    let dateVal = strictParseByte(stripLeadingZeroes(value));
    if (dateVal < lower || dateVal > upper)
      throw TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
    return dateVal;
  }, parseMilliseconds2 = (value) => {
    if (value === null || value === void 0)
      return 0;
    return strictParseFloat32("0." + value) * 1000;
  }, parseOffsetToMilliseconds = (value) => {
    let directionStr = value[0], direction = 1;
    if (directionStr == "+")
      direction = 1;
    else if (directionStr == "-")
      direction = -1;
    else
      throw TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
    let hour = Number(value.substring(1, 3)), minute = Number(value.substring(4, 6));
    return direction * (hour * 60 + minute) * 60 * 1000;
  }, stripLeadingZeroes = (value) => {
    let idx = 0;
    while (idx < value.length - 1 && value.charAt(idx) === "0")
      idx++;
    if (idx === 0)
      return value;
    return value.slice(idx);
  }, LazyJsonString = function(val) {
    return Object.assign(new String(val), {
      deserializeJSON() {
        return JSON.parse(String(val));
      },
      toString() {
        return String(val);
      },
      toJSON() {
        return String(val);
      }
    });
  };
  LazyJsonString.from = (object2) => {
    if (object2 && typeof object2 === "object" && (object2 instanceof LazyJsonString || ("deserializeJSON" in object2)))
      return object2;
    else if (typeof object2 === "string" || Object.getPrototypeOf(object2) === String.prototype)
      return LazyJsonString(String(object2));
    return LazyJsonString(JSON.stringify(object2));
  };
  LazyJsonString.fromObject = LazyJsonString.from;
  function quoteHeader(part) {
    if (part.includes(",") || part.includes('"'))
      part = `"${part.replace(/"/g, "\\\"")}"`;
    return part;
  }
  var ddd = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?", mmm = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)", time3 = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?", date5 = "(\\d?\\d)", year = "(\\d{4})", RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/), IMF_FIXDATE = new RegExp(`^${ddd}, ${date5} ${mmm} ${year} ${time3} GMT$`), RFC_850_DATE = new RegExp(`^${ddd}, ${date5}-${mmm}-(\\d\\d) ${time3} GMT$`), ASC_TIME = new RegExp(`^${ddd} ${mmm} ( [1-9]|\\d\\d) ${time3} ${year}$`), months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], _parseEpochTimestamp = (value) => {
    if (value == null)
      return;
    let num = NaN;
    if (typeof value === "number")
      num = value;
    else if (typeof value === "string") {
      if (!/^-?\d*\.?\d+$/.test(value))
        throw TypeError("parseEpochTimestamp - numeric string invalid.");
      num = Number.parseFloat(value);
    } else if (typeof value === "object" && value.tag === 1)
      num = value.value;
    if (isNaN(num) || Math.abs(num) === 1 / 0)
      throw TypeError("Epoch timestamps must be valid finite numbers.");
    return new Date(Math.round(num * 1000));
  }, _parseRfc3339DateTimeWithOffset = (value) => {
    if (value == null)
      return;
    if (typeof value !== "string")
      throw TypeError("RFC3339 timestamps must be strings");
    let matches = RFC3339_WITH_OFFSET.exec(value);
    if (!matches)
      throw TypeError(`Invalid RFC3339 timestamp format ${value}`);
    let [, yearStr, monthStr, dayStr, hours, minutes, seconds, , ms, offsetStr] = matches;
    range(monthStr, 1, 12), range(dayStr, 1, 31), range(hours, 0, 23), range(minutes, 0, 59), range(seconds, 0, 60);
    let date6 = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr), Number(hours), Number(minutes), Number(seconds), Number(ms) ? Math.round(parseFloat(`0.${ms}`) * 1000) : 0));
    if (date6.setUTCFullYear(Number(yearStr)), offsetStr.toUpperCase() != "Z") {
      let [, sign, offsetH, offsetM] = /([+-])(\d\d):(\d\d)/.exec(offsetStr) || [void 0, "+", 0, 0], scalar = sign === "-" ? 1 : -1;
      date6.setTime(date6.getTime() + scalar * (Number(offsetH) * 60 * 60 * 1000 + Number(offsetM) * 60 * 1000));
    }
    return date6;
  }, _parseRfc7231DateTime = (value) => {
    if (value == null)
      return;
    if (typeof value !== "string")
      throw TypeError("RFC7231 timestamps must be strings.");
    let day, month, year2, hour, minute, second, fraction, matches;
    if (matches = IMF_FIXDATE.exec(value))
      [, day, month, year2, hour, minute, second, fraction] = matches;
    else if (matches = RFC_850_DATE.exec(value))
      [, day, month, year2, hour, minute, second, fraction] = matches, year2 = (Number(year2) + 1900).toString();
    else if (matches = ASC_TIME.exec(value))
      [, month, day, hour, minute, second, fraction, year2] = matches;
    if (year2 && second) {
      let timestamp = Date.UTC(Number(year2), months.indexOf(month), Number(day), Number(hour), Number(minute), Number(second), fraction ? Math.round(parseFloat(`0.${fraction}`) * 1000) : 0);
      range(day, 1, 31), range(hour, 0, 23), range(minute, 0, 59), range(second, 0, 60);
      let date6 = new Date(timestamp);
      return date6.setUTCFullYear(Number(year2)), date6;
    }
    throw TypeError(`Invalid RFC7231 date-time value ${value}.`);
  };
  function range(v, min, max) {
    let _v = Number(v);
    if (_v < min || _v > max)
      throw Error(`Value ${_v} out of range [${min}, ${max}]`);
  }
  function splitEvery(value, delimiter, numDelimiters) {
    if (numDelimiters <= 0 || !Number.isInteger(numDelimiters))
      throw Error("Invalid number of delimiters (" + numDelimiters + ") for splitEvery.");
    let segments = value.split(delimiter);
    if (numDelimiters === 1)
      return segments;
    let compoundSegments = [], currentSegment = "";
    for (let i2 = 0;i2 < segments.length; i2++) {
      if (currentSegment === "")
        currentSegment = segments[i2];
      else
        currentSegment += delimiter + segments[i2];
      if ((i2 + 1) % numDelimiters === 0)
        compoundSegments.push(currentSegment), currentSegment = "";
    }
    if (currentSegment !== "")
      compoundSegments.push(currentSegment);
    return compoundSegments;
  }
  var splitHeader = (value) => {
    let z = value.length, values = [], withinQuotes = !1, prevChar = void 0, anchor = 0;
    for (let i2 = 0;i2 < z; ++i2) {
      let char = value[i2];
      switch (char) {
        case '"':
          if (prevChar !== "\\")
            withinQuotes = !withinQuotes;
          break;
        case ",":
          if (!withinQuotes)
            values.push(value.slice(anchor, i2)), anchor = i2 + 1;
          break;
      }
      prevChar = char;
    }
    return values.push(value.slice(anchor)), values.map((v) => {
      v = v.trim();
      let z2 = v.length;
      if (z2 < 2)
        return v;
      if (v[0] === '"' && v[z2 - 1] === '"')
        v = v.slice(1, z2 - 1);
      return v.replace(/\\"/g, '"');
    });
  }, format3 = /^-?\d*(\.\d+)?$/;

  class NumericValue {
    string;
    type;
    constructor(string4, type) {
      if (this.string = string4, this.type = type, !format3.test(string4))
        throw Error('@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".');
    }
    toString() {
      return this.string;
    }
    static [Symbol.hasInstance](object2) {
      if (!object2 || typeof object2 !== "object")
        return !1;
      let _nv = object2;
      return NumericValue.prototype.isPrototypeOf(object2) || _nv.type === "bigDecimal" && format3.test(_nv.string);
    }
  }
  function nv(input) {
    return new NumericValue(String(input), "bigDecimal");
  }
  exports.generateIdempotencyToken = uuid3.v4;
  exports.LazyJsonString = LazyJsonString;
  exports.NumericValue = NumericValue;
  exports._parseEpochTimestamp = _parseEpochTimestamp;
  exports._parseRfc3339DateTimeWithOffset = _parseRfc3339DateTimeWithOffset;
  exports._parseRfc7231DateTime = _parseRfc7231DateTime;
  exports.copyDocumentWithTransform = copyDocumentWithTransform;
  exports.dateToUtcString = dateToUtcString;
  exports.expectBoolean = expectBoolean;
  exports.expectByte = expectByte;
  exports.expectFloat32 = expectFloat32;
  exports.expectInt = expectInt;
  exports.expectInt32 = expectInt32;
  exports.expectLong = expectLong;
  exports.expectNonNull = expectNonNull;
  exports.expectNumber = expectNumber;
  exports.expectObject = expectObject;
  exports.expectShort = expectShort;
  exports.expectString = expectString;
  exports.expectUnion = expectUnion;
  exports.handleFloat = handleFloat;
  exports.limitedParseDouble = limitedParseDouble;
  exports.limitedParseFloat = limitedParseFloat;
  exports.limitedParseFloat32 = limitedParseFloat32;
  exports.logger = logger2;
  exports.nv = nv;
  exports.parseBoolean = parseBoolean;
  exports.parseEpochTimestamp = parseEpochTimestamp;
  exports.parseRfc3339DateTime = parseRfc3339DateTime;
  exports.parseRfc3339DateTimeWithOffset = parseRfc3339DateTimeWithOffset;
  exports.parseRfc7231DateTime = parseRfc7231DateTime;
  exports.quoteHeader = quoteHeader;
  exports.splitEvery = splitEvery;
  exports.splitHeader = splitHeader;
  exports.strictParseByte = strictParseByte;
  exports.strictParseDouble = strictParseDouble;
  exports.strictParseFloat = strictParseFloat;
  exports.strictParseFloat32 = strictParseFloat32;
  exports.strictParseInt = strictParseInt;
  exports.strictParseInt32 = strictParseInt32;
  exports.strictParseLong = strictParseLong;
  exports.strictParseShort = strictParseShort;
});
