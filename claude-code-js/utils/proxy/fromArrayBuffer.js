// var: fromArrayBuffer
var fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer3(input))
    throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  return Buffer8.from(input, offset, length);
}, fromString = (input, encoding) => {
  if (typeof input !== "string")
    throw TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  return encoding ? Buffer8.from(input, encoding) : Buffer8.from(input);
};
