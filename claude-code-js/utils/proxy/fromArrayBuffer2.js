// var: fromArrayBuffer2
var fromArrayBuffer2 = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer4(input))
    throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  return Buffer9.from(input, offset, length);
}, fromString2 = (input, encoding) => {
  if (typeof input !== "string")
    throw TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  return encoding ? Buffer9.from(input, encoding) : Buffer9.from(input);
};
