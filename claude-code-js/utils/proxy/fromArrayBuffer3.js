// var: fromArrayBuffer3
var fromArrayBuffer3 = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer5(input))
    throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  return Buffer10.from(input, offset, length);
}, fromString3 = (input, encoding) => {
  if (typeof input !== "string")
    throw TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  return encoding ? Buffer10.from(input, encoding) : Buffer10.from(input);
};
