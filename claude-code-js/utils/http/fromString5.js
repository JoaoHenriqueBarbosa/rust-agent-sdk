// var: fromString5
var fromString5 = (input, encoding) => {
  if (typeof input !== "string")
    throw TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  return encoding ? Buffer12.from(input, encoding) : Buffer12.from(input);
};
