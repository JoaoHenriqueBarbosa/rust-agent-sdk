// var: require_time
var require_time = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.addHrTimes = exports.isTimeInput = exports.isTimeInputHrTime = exports.hrTimeToMicroseconds = exports.hrTimeToMilliseconds = exports.hrTimeToNanoseconds = exports.hrTimeToTimeStamp = exports.hrTimeDuration = exports.timeInputToHrTime = exports.hrTime = exports.getTimeOrigin = exports.millisToHrTime = void 0;
  var platform_1 = require_platform(), NANOSECOND_DIGITS = 9, NANOSECOND_DIGITS_IN_MILLIS = 6, MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS), SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
  function millisToHrTime(epochMillis) {
    let epochSeconds = epochMillis / 1000, seconds = Math.trunc(epochSeconds), nanos = Math.round(epochMillis % 1000 * MILLISECONDS_TO_NANOSECONDS);
    return [seconds, nanos];
  }
  exports.millisToHrTime = millisToHrTime;
  function getTimeOrigin() {
    return platform_1.otperformance.timeOrigin;
  }
  exports.getTimeOrigin = getTimeOrigin;
  function hrTime(performanceNow) {
    let timeOrigin = millisToHrTime(platform_1.otperformance.timeOrigin), now2 = millisToHrTime(typeof performanceNow === "number" ? performanceNow : platform_1.otperformance.now());
    return addHrTimes(timeOrigin, now2);
  }
  exports.hrTime = hrTime;
  function timeInputToHrTime(time3) {
    if (isTimeInputHrTime(time3))
      return time3;
    else if (typeof time3 === "number")
      if (time3 < platform_1.otperformance.timeOrigin)
        return hrTime(time3);
      else
        return millisToHrTime(time3);
    else if (time3 instanceof Date)
      return millisToHrTime(time3.getTime());
    else
      throw TypeError("Invalid input type");
  }
  exports.timeInputToHrTime = timeInputToHrTime;
  function hrTimeDuration(startTime, endTime) {
    let seconds = endTime[0] - startTime[0], nanos = endTime[1] - startTime[1];
    if (nanos < 0)
      seconds -= 1, nanos += SECOND_TO_NANOSECONDS;
    return [seconds, nanos];
  }
  exports.hrTimeDuration = hrTimeDuration;
  function hrTimeToTimeStamp(time3) {
    let precision = NANOSECOND_DIGITS, tmp = `${"0".repeat(precision)}${time3[1]}Z`, nanoString = tmp.substring(tmp.length - precision - 1);
    return new Date(time3[0] * 1000).toISOString().replace("000Z", nanoString);
  }
  exports.hrTimeToTimeStamp = hrTimeToTimeStamp;
  function hrTimeToNanoseconds(time3) {
    return time3[0] * SECOND_TO_NANOSECONDS + time3[1];
  }
  exports.hrTimeToNanoseconds = hrTimeToNanoseconds;
  function hrTimeToMilliseconds(time3) {
    return time3[0] * 1000 + time3[1] / 1e6;
  }
  exports.hrTimeToMilliseconds = hrTimeToMilliseconds;
  function hrTimeToMicroseconds(time3) {
    return time3[0] * 1e6 + time3[1] / 1000;
  }
  exports.hrTimeToMicroseconds = hrTimeToMicroseconds;
  function isTimeInputHrTime(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
  }
  exports.isTimeInputHrTime = isTimeInputHrTime;
  function isTimeInput(value) {
    return isTimeInputHrTime(value) || typeof value === "number" || value instanceof Date;
  }
  exports.isTimeInput = isTimeInput;
  function addHrTimes(time1, time22) {
    let out = [time1[0] + time22[0], time1[1] + time22[1]];
    if (out[1] >= SECOND_TO_NANOSECONDS)
      out[1] -= SECOND_TO_NANOSECONDS, out[0] += 1;
    return out;
  }
  exports.addHrTimes = addHrTimes;
});
