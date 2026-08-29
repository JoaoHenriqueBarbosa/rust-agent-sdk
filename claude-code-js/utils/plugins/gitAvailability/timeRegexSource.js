// function: timeRegexSource
function timeRegexSource(args) {
  let secondsRegexSource = "[0-5]\\d";
  if (args.precision)
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  else if (args.precision == null)
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  let secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
