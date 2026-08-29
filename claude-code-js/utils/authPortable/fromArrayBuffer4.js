// var: fromArrayBuffer4
var fromArrayBuffer4 = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer6(input))
    throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  return Buffer11.from(input, offset, length);
}, fromString4 = (input, encoding) => {
  if (typeof input !== "string")
    throw TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  return encoding ? Buffer11.from(input, encoding) : Buffer11.from(input);
};
