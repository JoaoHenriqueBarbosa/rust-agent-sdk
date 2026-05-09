// var: getStreamDirection
var getStreamDirection = (stdioItems, fdNumber, optionName) => {
  let directions = stdioItems.map((stdioItem) => getStdioItemDirection(stdioItem, fdNumber));
  if (directions.includes("input") && directions.includes("output"))
    throw TypeError(`The \`${optionName}\` option must not be an array of both readable and writable values.`);
  return directions.find(Boolean) ?? DEFAULT_DIRECTION;
}, getStdioItemDirection = ({ type, value }, fdNumber) => KNOWN_DIRECTIONS[fdNumber] ?? guessStreamDirection[type](value), KNOWN_DIRECTIONS, anyDirection = () => {
  return;
}, alwaysInput = () => "input", guessStreamDirection, getStandardStreamDirection = (value) => {
  if ([0, process9.stdin].includes(value))
    return "input";
  if ([1, 2, process9.stdout, process9.stderr].includes(value))
    return "output";
}, DEFAULT_DIRECTION = "output";
