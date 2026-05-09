// function: timeSource
function timeSource(args) {
  return typeof args.precision === "number" ? args.precision === -1 ? "(?:[01]\\d|2[0-3]):[0-5]\\d" : args.precision === 0 ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d" : `(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{${args.precision}}` : "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?";
}
