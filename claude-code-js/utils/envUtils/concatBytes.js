// function: concatBytes
function concatBytes(buffers) {
  let length = 0;
  for (let buffer of buffers)
    length += buffer.length;
  let output = new Uint8Array(length), index = 0;
  for (let buffer of buffers)
    output.set(buffer, index), index += buffer.length;
  return output;
}
